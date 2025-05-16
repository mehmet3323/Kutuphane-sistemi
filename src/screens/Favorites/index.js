import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import BottomNavigation from '../../components/BottomNavigation';
import LinearGradient from 'react-native-linear-gradient';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import styles from './styles';
import Icons from '../../assets/icons';

const BookAI = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('search'); // 'search' veya 'recommend'
  const [searchQuery, setSearchQuery] = useState('');
  const [moodQuery, setMoodQuery] = useState('');
  const [bookInfo, setBookInfo] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchOpenLibrary = async (query) => {
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1`
      );
      const data = await response.json();

      if (data.docs && data.docs.length > 0) {
        const book = data.docs[0];
        const workResponse = await fetch(
          `https://openlibrary.org${book.key}.json`
        );
        const workData = await workResponse.json();

        return {
          title: book.title,
          authors: book.author_name ? book.author_name.join(', ') : 'Bilinmiyor',
          description: workData.description?.value || workData.description || 'Bu kitap için özet bulunamadı.',
          imageUrl: book.cover_i 
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : 'https://via.placeholder.com/128x192?text=No+Image',
          publishedDate: book.first_publish_year || 'Bilinmiyor',
          pageCount: book.number_of_pages_median || 'Bilinmiyor',
          publisher: book.publisher ? book.publisher[0] : 'Bilinmiyor',
          categories: book.subject ? book.subject.slice(0, 3) : ['Bilinmiyor'],
          source: 'Open Library'
        };
      }
      return null;
    } catch (error) {
      console.error('Open Library arama hatası:', error);
      return null;
    }
  };

  const searchGoogleBooks = async (query) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const book = data.items[0].volumeInfo;
        return {
          title: book.title,
          authors: book.authors ? book.authors.join(', ') : 'Bilinmiyor',
          description: book.description || 'Bu kitap için özet bulunamadı.',
          imageUrl: book.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Image',
          publishedDate: book.publishedDate || 'Bilinmiyor',
          pageCount: book.pageCount || 'Bilinmiyor',
          publisher: book.publisher || 'Bilinmiyor',
          categories: book.categories || ['Bilinmiyor'],
          source: 'Google Books'
        };
      }
      return null;
    } catch (error) {
      console.error('Google Books arama hatası:', error);
      return null;
    }
  };

  const searchBook = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Uyarı', 'Lütfen bir kitap adı girin.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setBookInfo(null);

    try {
      let bookData = await searchGoogleBooks(searchQuery);
      if (!bookData) {
        bookData = await searchOpenLibrary(searchQuery);
      }

      if (bookData) {
        setBookInfo(bookData);
      } else {
        setError('Kitap bulunamadı. Lütfen farklı bir arama yapın.');
      }
    } catch (error) {
      console.error('Kitap arama hatası:', error);
      setError('Kitap bilgileri alınırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const getBookRecommendations = async () => {
    if (!moodQuery.trim()) {
      Alert.alert('Uyarı', 'Lütfen ruh halinizi veya istediğiniz kitap türünü yazın.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendedBooks([]);

    try {
      // Örnek ruh hali ve tür eşleştirmeleri
      const moodKeywords = {
        'mutlu': ['romantic comedy', 'feel-good', 'inspirational'],
        'üzgün': ['motivational', 'self-help', 'inspirational'],
        'heyecanlı': ['thriller', 'adventure', 'mystery'],
        'sakin': ['philosophy', 'poetry', 'nature'],
        'romantik': ['romance', 'love story', 'contemporary romance'],
        'macera': ['adventure', 'action', 'fantasy'],
        'bilim': ['science', 'technology', 'popular science'],
        'tarih': ['history', 'historical fiction', 'biography']
      };

      // Kullanıcının girdiği metni analiz et
      const query = moodQuery.toLowerCase();
      let searchTerms = [];

      // Ruh hali veya tür eşleştirmesi yap
      for (const [mood, keywords] of Object.entries(moodKeywords)) {
        if (query.includes(mood)) {
          searchTerms = keywords;
          break;
        }
      }

      // Eğer eşleşme bulunamazsa, direkt kullanıcının girdiği metni kullan
      if (searchTerms.length === 0) {
        searchTerms = [query];
      }

      // Her bir arama terimi için kitap ara
      const books = [];
      for (const term of searchTerms) {
        const bookData = await searchGoogleBooks(term);
        if (bookData) {
          books.push(bookData);
        }
      }

      if (books.length > 0) {
        setRecommendedBooks(books);
      } else {
        setError('Size uygun kitap önerisi bulunamadı. Lütfen farklı bir arama yapın.');
      }
    } catch (error) {
      console.error('Kitap önerisi hatası:', error);
      setError('Kitap önerileri alınırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error("Çıkış yapılırken hata:", error);
      Alert.alert("Hata", "Çıkış yapılırken bir sorun oluştu.");
    }
  };

  const renderBookCard = (book) => (
    <View style={styles.bookInfoContainer} key={book.title}>
      <Image
        source={{ uri: book.imageUrl }}
        style={styles.bookImage}
        resizeMode="cover"
      />
      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookAuthor}>Yazar: {book.authors}</Text>
        <Text style={styles.bookPublisher}>Yayınevi: {book.publisher}</Text>
        <Text style={styles.bookYear}>Yayın Yılı: {book.publishedDate}</Text>
        <Text style={styles.bookPages}>Sayfa Sayısı: {book.pageCount}</Text>
        <Text style={styles.bookCategories}>
          Kategoriler: {book.categories.join(', ')}
        </Text>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Kitap Özeti:</Text>
          <Text style={styles.summaryText}>{book.description}</Text>
        </View>
        <Text style={styles.sourceText}>Kaynak: {book.source}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <Image 
            source={{uri: 'https://img.icons8.com/ios-filled/50/ffffff/artificial-intelligence.png'}} 
            style={styles.headerIcon} 
          />
          <Text style={styles.headerTitle}>Yapay Zeka</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Image source={Icons.logout} style={styles.headerIcon} />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'search' && styles.activeTab]} 
          onPress={() => setActiveTab('search')}
        >
          <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
            Kitap Ara
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'recommend' && styles.activeTab]} 
          onPress={() => setActiveTab('recommend')}
        >
          <Text style={[styles.tabText, activeTab === 'recommend' && styles.activeTabText]}>
            Kitap Öner
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'search' ? (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Kitap adı girin..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={searchBook}
            />
            <TouchableOpacity style={styles.searchButton} onPress={searchBook}>
              <Image 
                source={{uri: 'https://img.icons8.com/ios-filled/50/ffffff/search--v1.png'}} 
                style={styles.searchIcon} 
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4c669f" />
                <Text style={styles.loadingText}>Kitap bilgileri aranıyor...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : bookInfo ? (
              renderBookCard(bookInfo)
            ) : (
              <View style={styles.emptyContainer}>
                <Image
                  source={{uri: 'https://img.icons8.com/ios-filled/100/4c669f/book.png'}}
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyText}>Kitap Özeti Arama</Text>
                <Text style={styles.emptySubText}>
                  Aradığınız kitabın adını yazın ve yapay zeka destekli özet bilgilerini görüntüleyin.
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      ) : (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Ruh halinizi veya istediğiniz kitap türünü yazın..."
              value={moodQuery}
              onChangeText={setMoodQuery}
              onSubmitEditing={getBookRecommendations}
              multiline
            />
            <TouchableOpacity style={styles.searchButton} onPress={getBookRecommendations}>
              <Image 
                source={{uri: 'https://img.icons8.com/ios-filled/50/ffffff/magic-wand.png'}} 
                style={styles.searchIcon} 
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentContainer}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4c669f" />
                <Text style={styles.loadingText}>Kitap önerileri hazırlanıyor...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : recommendedBooks.length > 0 ? (
              recommendedBooks.map(book => renderBookCard(book))
            ) : (
              <View style={styles.emptyContainer}>
                <Image
                  source={{uri: 'https://img.icons8.com/ios-filled/100/4c669f/magic-wand.png'}}
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyText}>Kitap Önerisi</Text>
                <Text style={styles.emptySubText}>
                  Ruh halinizi veya istediğiniz kitap türünü yazın, size özel kitap önerileri sunalım.
                </Text>
                <Text style={styles.moodExamples}>
                  Örnek: "mutlu", "üzgün", "heyecanlı", "romantik", "macera", "bilim", "tarih"
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      )}

      <BottomNavigation navigation={navigation} activeTab="BookAI" />
    </KeyboardAvoidingView>
  );
};

export default BookAI;
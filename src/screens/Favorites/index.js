import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import BottomNavigation from '../../components/BottomNavigation';
import LinearGradient from 'react-native-linear-gradient';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, firestore } from '../../config/firebase';
import { libraryBooks } from '../Home';
import styles from './styles';
import Icons from '../../assets/icons';

const Favorites = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tümü");

  useEffect(() => {
    const loadFavoriteBooks = async () => {
      if (!auth.currentUser) {
        navigation.navigate('Login');
        return;
      }

      setIsLoading(true);
      try {
        // Kullanıcının beğendiği kitapların ID'lerini al
        const likesQuery = query(
          collection(firestore, "bookLikes"),
          where("userId", "==", auth.currentUser.uid),
          where("liked", "==", true)
        );
        const likesSnapshot = await getDocs(likesQuery);
        const favoriteBookIds = likesSnapshot.docs.map(doc => doc.data().bookId);

        // Eğer beğenilen bir kitap yoksa, boş liste göster
        if (favoriteBookIds.length === 0) {
          setBooks([]);
          setIsLoading(false);
          return;
        }

        // Beğenilen kitapları filtrele
        const favoriteBooks = libraryBooks.filter(book => 
          favoriteBookIds.includes(book.id)
        );

        // Beğeni sayılarını Firebase'den çekerek güncelle
        for (const book of favoriteBooks) {
          const likesQuery = query(
            collection(firestore, "bookLikes"),
            where("bookId", "==", book.id),
            where("liked", "==", true)
          );
          const likesSnapshot = await getDocs(likesQuery);
          book.likes = likesSnapshot.size;
        }

        setBooks(favoriteBooks);
      } catch (error) {
        console.error("Favori kitaplar yüklenirken hata:", error);
        Alert.alert("Hata", "Favori kitaplar yüklenirken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };

    loadFavoriteBooks();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error("Çıkış yapılırken hata:", error);
      Alert.alert("Hata", "Çıkış yapılırken bir sorun oluştu.");
    }
  };

  const handleCommentClick = (book) => {
    navigation.navigate('Home', { selectedBook: book });
  };

  // Kategorileri al
  const categories = ["Tümü", ...new Set(books.map(book => book.category))].sort();

  // Kitapları kategoriye göre filtrele
  const filteredBooks = books
    .filter(book => activeCategory === "Tümü" || book.category === activeCategory);

  const renderBookItem = ({ item }) => (
    <View style={styles.bookCard}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.bookImage}
        resizeMode="cover"
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <Text style={styles.bookCategory}>{item.category}</Text>
        <Text style={styles.bookDescription} numberOfLines={3}>
          {item.description}
        </Text>
        <View style={styles.bookDetails}>
          <Text>Yayın Yılı: {item.year}</Text>
          <Text>{item.pages} Sayfa</Text>
        </View>
        <View style={styles.bookActions}>
          <View style={styles.likeButton}>
            <Image source={Icons.heartFilled} style={styles.actionIcon} />
            <Text style={styles.actionText}>{item.likes || 0}</Text>
          </View>
          <TouchableOpacity
            style={styles.commentButton}
            onPress={() => handleCommentClick(item)}
          >
            <Image source={Icons.comment} style={styles.actionIcon} />
            <Text style={styles.actionText}>Yorumlar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <Image source={Icons.book} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Favorilerim</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Image source={Icons.logout} style={styles.headerIcon} />
        </TouchableOpacity>
      </LinearGradient>

      {/* Kategori Filtreleme */}
      <View style={styles.categoryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                activeCategory === category && styles.activeCategoryButton,
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category && styles.activeCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4c669f" />
          <Text style={styles.loadingText}>Favori kitaplarınız yükleniyor...</Text>
        </View>
      ) : books.length > 0 ? (
        <FlatList
          data={filteredBooks}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.booksContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Image
            source={{uri: 'https://img.icons8.com/ios-filled/100/e91e63/like.png'}}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyText}>Henüz favori kitabınız yok</Text>
          <Text style={styles.emptySubText}>
            Kütüphanedeki kitapları keşfedin ve beğendiklerinizi favorilere ekleyin.
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.browseButtonText}>Kitaplara Göz At</Text>
          </TouchableOpacity>
        </View>
      )}

      <BottomNavigation navigation={navigation} activeTab="Favorites" />
    </View>
  );
};

export default Favorites;
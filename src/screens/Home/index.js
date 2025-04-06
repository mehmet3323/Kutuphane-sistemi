import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import BottomNavigation from '../../components/BottomNavigation';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import styles from './styles';

const worldwideBooks = [
  {
    id: '1',
    title: 'Don Quixote',
    author: 'Miguel de Cervantes',
    likes: 1250,
    comments: [],
    imageUrl: 'https://example.com/don-quixote.jpg',
  },
  {
    id: '2',
    title: 'A Tale of Two Cities',
    author: 'Charles Dickens',
    likes: 980,
    comments: [],
    imageUrl: 'https://example.com/tale-two-cities.jpg',
  },
  // Diğer dünya klasikleri buraya eklenecek
];

const turkishBooks = [
  {
    id: '101',
    title: 'İnce Memed',
    author: 'Yaşar Kemal',
    likes: 850,
    comments: [],
    imageUrl: 'https://example.com/ince-memed.jpg',
  },
  {
    id: '102',
    title: 'Tutunamayanlar',
    author: 'Oğuz Atay',
    likes: 760,
    comments: [],
    imageUrl: 'https://example.com/tutunamayanlar.jpg',
  },
  // Diğer Türk klasikleri buraya eklenecek
];

const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('worldwide');
  const [likedBooks, setLikedBooks] = useState([]);

  const handleLike = async (bookId) => {
    try {
      const bookRef = firestore().collection('books').doc(bookId);
      if (likedBooks.includes(bookId)) {
        await bookRef.update({
          likes: firestore.FieldValue.arrayRemove(bookId)
        });
        setLikedBooks(prev => prev.filter(id => id !== bookId));
      } else {
        await bookRef.update({
          likes: firestore.FieldValue.arrayUnion(bookId)
        });
        setLikedBooks(prev => [...prev, bookId]);
      }
    } catch (error) {
      console.error('Beğeni işlemi sırasında hata:', error);
    }
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <View style={styles.interactionContainer}>
          <TouchableOpacity 
            style={styles.likeButton} 
            onPress={() => handleLike(item.id)}
          >
            <Image 
              source={likedBooks.includes(item.id) ? 
                require('../../assets/icons/heart.png') : 
                require('../../assets/icons/heart-outline.png')} 
              style={styles.likeIcon} 
            />
            <Text style={styles.likeCount}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentButton}>
            <Image 
              source={require('../../assets/icons/send.png')} 
              style={styles.commentIcon} 
            />
            <Text style={styles.commentCount}>{item.comments.length}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#1E2F97', '#081158']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kitap Dünyası</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Login')}>
          <Image 
            source={require('../../assets/icons/back.png')} 
            style={styles.logoutIcon} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'worldwide' && styles.activeTab]}
          onPress={() => setActiveTab('worldwide')}
        >
          <Text style={[styles.tabText, activeTab === 'worldwide' && styles.activeTabText]}>
            Dünyada En Çok Okunanlar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'turkish' && styles.activeTab]}
          onPress={() => setActiveTab('turkish')}
        >
          <Text style={[styles.tabText, activeTab === 'turkish' && styles.activeTabText]}>
            Türkiye'de En Çok Okunanlar
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'worldwide' ? worldwideBooks : turkishBooks}
        renderItem={renderBookItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.bookList}
        showsVerticalScrollIndicator={false}
      />
      <BottomNavigation navigation={navigation} activeTab="Home" />
      </LinearGradient>
  );
};

export default HomeScreen;
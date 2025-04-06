import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import BottomNavigation from '../../components/BottomNavigation';
import icons from '../../assets/icons';

const windowWidth = Dimensions.get('window').width;

const CATEGORIES = [
  {id: 'all', label: 'Tümü'},
  {id: 'novel', label: 'Roman'},
  {id: 'science', label: 'Bilim'},
  {id: 'history', label: 'Tarih'},
  {id: 'philosophy', label: 'Felsefe'},
];

const DUMMY_BOOKS = [
  {
    id: '1',
    title: 'Suç ve Ceza',
    author: 'Fyodor Dostoyevski',
    cover: 'https://example.com/cover1.jpg',
    status: 'İstenilen',
    requestCount: 5,
    category: 'novel',
  },
  {
    id: '2',
    title: 'Evren',
    author: 'Carl Sagan',
    cover: 'https://example.com/cover2.jpg',
    status: 'Talep Edilen',
    requestCount: 3,
    category: 'science',
  },
];

const Search = ({navigation}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('istenilen');

  const filteredBooks = DUMMY_BOOKS.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const matchesTab =
      (activeTab === 'istenilen' && book.status === 'İstenilen') ||
      (activeTab === 'talep' && book.status === 'Talep Edilen');
    return matchesSearch && matchesCategory && matchesTab;
  });

  const renderBookCard = ({item}) => (
    <TouchableOpacity style={styles.bookCard}>
      <Image
        source={{uri: item.cover}}
        style={styles.bookCover}
        defaultSource={icons.book}
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.author}
        </Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{item.status}</Text>
          <Text style={styles.requestCount}>{item.requestCount} Kişi</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Kitap Ara</Text>
      </View>

      <View style={styles.searchContainer}>
        <Image source={icons.search} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Kitap veya yazar ara"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'istenilen' && styles.activeTab]}
          onPress={() => setActiveTab('istenilen')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'istenilen' && styles.activeTabText,
            ]}>
            İstenilen Kitaplar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'talep' && styles.activeTab]}
          onPress={() => setActiveTab('talep')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'talep' && styles.activeTabText,
            ]}>
            Talep Edilen Kitaplar
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}>
        {CATEGORIES.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category.id)}>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id &&
                  styles.selectedCategoryText,
              ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredBooks}
        renderItem={renderBookCard}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.bookList}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Yeni Kitap Talebi</Text>
      </TouchableOpacity>

      <BottomNavigation navigation={navigation} activeTab="Search" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#666',
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E5E5',
  },
  activeTab: {
    borderBottomColor: '#1E2F97',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#1E2F97',
    fontWeight: 'bold',
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 5,
  },
  selectedCategory: {
    backgroundColor: '#1E2F97',
  },
  categoryText: {
    color: '#666',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  bookList: {
    padding: 10,
  },
  bookCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    maxWidth: (windowWidth - 36) / 2,
  },
  bookCover: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  bookInfo: {
    padding: 12,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#1E2F97',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  requestCount: {
    fontSize: 12,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#1E2F97',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Search;
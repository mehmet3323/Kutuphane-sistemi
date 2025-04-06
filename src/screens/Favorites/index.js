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
  Pressable,
} from 'react-native';
import BottomNavigation from '../../components/BottomNavigation';
import icons from '../../assets/icons';

const windowWidth = Dimensions.get('window').width;

const SORT_OPTIONS = [
  {id: 'date', label: 'Eklenme Tarihi'},
  {id: 'name', label: 'İsim'},
  {id: 'status', label: 'Okuma Durumu'},
];

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
    status: 'Okundu',
    category: 'novel',
  },
  {
    id: '2',
    title: 'Evren',
    author: 'Carl Sagan',
    cover: 'https://example.com/cover2.jpg',
    status: 'Okunuyor',
    category: 'science',
  },
  // Daha fazla kitap eklenebilir
];

const Favorites = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('date');
  const [showSortOptions, setShowSortOptions] = useState(false);

  const filteredBooks = DUMMY_BOOKS.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (selectedSort) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0; // date sorting would use actual dates
    }
  });

  const renderBookCard = ({item}) => (
    <Pressable
      style={styles.bookCard}
      onLongPress={() => {
        // Uzun basma menüsü işlemleri
      }}>
      <Image
        source={{uri: item.cover}}
        style={styles.bookCover}
        defaultSource={icons.book} // Varsayılan kitap ikonu
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
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorilerim</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortOptions(!showSortOptions)}>
          <Image source={icons.sort} style={styles.sortIcon} />
        </TouchableOpacity>
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

      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.id && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(item.id)}>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.id && styles.selectedCategoryText,
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {showSortOptions && (
        <View style={styles.sortOptionsContainer}>
          {SORT_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.sortOption,
                selectedSort === option.id && styles.selectedSortOption,
              ]}
              onPress={() => {
                setSelectedSort(option.id);
                setShowSortOptions(false);
              }}>
              <Text
                style={[
                  styles.sortOptionText,
                  selectedSort === option.id && styles.selectedSortOptionText,
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FlatList
        data={sortedBooks}
        renderItem={renderBookCard}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.bookList}
        showsVerticalScrollIndicator={false}
      />
      <BottomNavigation navigation={navigation} activeTab="Favorites" />
    </View>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  sortButton: {
    padding: 8,
  },
  sortIcon: {
    width: 24,
    height: 24,
    tintColor: '#000',
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
  categoriesContainer: {
    marginBottom: 15,
  },
  categoriesList: {
    paddingHorizontal: 15,
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
  sortOptionsContainer: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    elevation: 5,
    zIndex: 1000,
  },
  sortOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  selectedSortOption: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  sortOptionText: {
    color: '#666',
    fontSize: 14,
  },
  selectedSortOptionText: {
    color: '#1E2F97',
    fontWeight: 'bold',
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
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    color: '#1E2F97',
  },
});
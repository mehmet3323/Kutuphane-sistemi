import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import SearchComponent from '../../components/SearchComponent';
import CardComponent from '../../components/CardComponent';
// BottomNavigation bileşeni kaldırıldı
import { Icons } from '../../assets';

import styles from './styles';

// Örnek kitap verileri
const bookData = [
  {
    id: '1',
    title: 'Suç ve Ceza',
    location: 'Dünya Klasikleri',
    rating: '4.8',
    image: { uri: 'https://example.com/suc-ve-ceza.jpg' },
  },
  {
    id: '2',
    title: 'Sefiller',
    location: 'Dünya Klasikleri',
    rating: '4.7',
    image: { uri: 'https://example.com/sefiller.jpg' },
  },
  {
    id: '3',
    title: 'Tutunamayanlar',
    location: 'Türk Edebiyatı',
    rating: '4.6',
    image: { uri: 'https://example.com/tutunamayanlar.jpg' },
  },
  {
    id: '4',
    title: 'Kürk Mantolu Madonna',
    location: 'Türk Edebiyatı',
    rating: '4.5',
    image: { uri: 'https://example.com/kurk-mantolu-madonna.jpg' },
  },
];

// Kategori verileri
const categories = [
  { id: '1', name: 'Tümü' },
  { id: '2', name: 'Dünya Klasikleri' },
  { id: '3', name: 'Türk Edebiyatı' },
  { id: '4', name: 'Bilim Kurgu' },
  { id: '5', name: 'Fantastik' },
];

const Search = () => {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [filteredBooks, setFilteredBooks] = useState(bookData);

  // Kategori seçildiğinde kitapları filtrele
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    
    if (categoryId === '1') {
      // Tümü seçildiğinde tüm kitapları göster
      setFilteredBooks(bookData);
    } else {
      // Seçilen kategoriye göre filtrele
      const category = categories.find(cat => cat.id === categoryId);
      const filtered = bookData.filter(book => book.location === category.name);
      setFilteredBooks(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kitap Ara</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <SearchComponent />
      </View>
      
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.selectedCategory,
              ]}
              onPress={() => handleCategorySelect(category.id)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardComponent
            title={item.title}
            location={item.location}
            rating={item.rating}
            image={item.image}
          />
        )}
        contentContainerStyle={styles.bookList}
        showsVerticalScrollIndicator={false}
      />
      {/* BottomNavigation bileşeni kaldırıldı */}
    </View>
  );
};

export default Search;
import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
} from 'react-native';
import styles from './styles';
import {Icons} from '../../assets';

const SearchComponent = () => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search places"
        placeholderTextColor="#888888"
      />
      <Text style={{fontSize: 26, width: 10, height: 40, color: '#D2D2D2'}}>
        |
      </Text>
      <TouchableOpacity style={styles.filterButton}>
        <Image source={Icons.settings} style={{width: 24, height: 24,tintColor:'#888888'}} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchComponent;

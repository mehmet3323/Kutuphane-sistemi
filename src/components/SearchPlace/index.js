import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Icons from '../../assets/icons';

const Search = () => {
  return (
    <View style={styles.container}>
      <TextInput style={styles.place} placeholder="Search places"></TextInput>
      <View style={styles.line}></View>
      <TouchableOpacity>
        <Image source={Icons.setting} style={styles.setting} />
      </TouchableOpacity>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  place: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    borderColor: 'grey',
    width: 370,
  },
  line: {
    width: 2,
    height: 35,
    backgroundColor: 'grey',
    marginLeft: -80,
  },
  setting: {
    width: 25,
    height: 25,
    marginLeft: 20,
  },
});

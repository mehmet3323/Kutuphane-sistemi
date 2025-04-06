import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Icons from '../../assets/icons';

const David = () => {
  return (
    <View style={styles.container}>
      <View>
        <View>
          <Text style={styles.david}>Hi David 👋</Text>
        </View>
        <View>
          <Text style={styles.explore}>Explore the world</Text>
        </View>
      </View>
      <View>
        <Image source={Icons.david} style={styles.davidImage} />
      </View>
    </View>
  );
};

export default David;

const styles = StyleSheet.create({
  david: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  explore: {
    fontSize: 25,
    color: 'grey',
  },
  container: {
    flexDirection: 'row',
    padding: 25,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  davidImage: {
    width: 55,
    height: 55,
    borderRadius: 40,
  },
});

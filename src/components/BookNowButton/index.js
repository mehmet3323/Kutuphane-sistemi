import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import icons from '../../assets/icons';

const BookNowButton = () => {
  return (
    <View style={styles.conntainer}>
      <TouchableOpacity>
        <View style={styles.button}>
          <View>
            <Text style={{color: 'white', fontSize: 20}}>Book Now</Text>
          </View>
          <View>
            <Image source={icons.send} style={styles.send} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default BookNowButton;

const styles = StyleSheet.create({
  conntainer: {
    paddingHorizontal: 30,
    marginTop: 10,
  },
  button: {
    height: 60,
    width: 350,
    backgroundColor: 'black',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  send: {
    width: 27,
    height: 27,
    marginLeft: 10,
  },
});

import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';

const Filter = () => {
  const [click, setClick] = useState('Most');
  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <View>
          <Text style={styles.placesText}>Popular Places</Text>
        </View>
        <View>
          <Text>View All</Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity onPress={() => setClick('Most')}>
          <View
            style={[
              click == 'Most' ? styles.pressButton : styles.unpressButton,
            ]}>
            <Text
              style={[click == 'Most' ? styles.pressText : styles.unpressText]}>
              Most Viewed
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setClick('Nearby')}>
          <View
            style={[
              click == 'Nearby' ? styles.pressButton : styles.unpressButton,
            ]}>
            <Text
              style={[
                click == 'Nearby' ? styles.pressText : styles.unpressText,
              ]}>
              Nearby
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setClick('Latest')}>
          <View
            style={[
              click == 'Latest' ? styles.pressButton : styles.unpressButton,
            ]}>
            <Text
              style={[
                click == 'Latest' ? styles.pressText : styles.unpressText,
              ]}>
              Latest
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Filter;

const styles = StyleSheet.create({
  container: {
    padding: 25,
    marginTop: 20,
    backgroundColor: 'white',
  },
  placesText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pressButton: {
    width: 120,
    height: 50,
    backgroundColor: '#2F2F2F',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  pressText: {
    color: 'white',
  },
  unpressButton: {
    width: 100,
    height: 50,
    backgroundColor: '#FBFBFB',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  unpressText: {
    color: 'grey',
  },
});

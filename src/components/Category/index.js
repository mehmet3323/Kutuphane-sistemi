import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Images from '../../assets/images';
import Icons from '../../assets/icons';
import icons from '../../assets/icons';
import {RoutesNames} from '../../config';

const Category = ({navigation}) => {
  const [starr, setStarr] = useState(false);
  const [heart, setHeart] = useState(false);
  return (
    <View style={{flexDirection: 'row'}}>
      <View
        style={{
          backgroundColor: 'white',
          marginLeft: 20,
        }}>
        <TouchableOpacity onPress={navigation}>
          <Image source={Images.fuji} style={styles.box} />
          <View
            style={{
              position: 'absolute',
              width: 250,
              height: 60,
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity onPress={() => setHeart(!heart)}>
              <View
                style={{
                  padding: 10,
                  backgroundColor: 'grey',
                  borderRadius: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 15,
                  marginRight: 15,
                }}>
                <Image
                  source={Icons.heart}
                  style={[heart == false ? styles.heart : styles.pressHeart]}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                alignItems: 'center',
                width: 250,
              }}>
              <View style={styles.description}>
                <View>
                  <Text style={styles.mount}>
                    Mount Fuji,<Text style={styles.tokyo}> Tokyo</Text>
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View>
                    <Image source={icons.location} style={styles.location} />
                  </View>
                  <View>
                    <Text style={styles.tokyo}>Tokyo, Japan</Text>
                  </View>
                  <TouchableOpacity onPress={() => setStarr(!starr)}>
                    <View style={{marginLeft: 20}}>
                      <Image
                        source={icons.star}
                        style={[
                          starr == false ? styles.star : styles.pressStar,
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                  <View>
                    <Text style={styles.tokyo}>4.8</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({
  box: {
    width: 250,
    height: 350,
    borderRadius: 30,
    backgroundColor: 'red',
  },
  heart: {
    width: 25,
    height: 25,
    tintColor: 'white',
  },
  pressHeart: {
    width: 25,
    height: 25,
    tintColor: 'red',
  },
  description: {
    width: 210,
    height: 80,
    backgroundColor: '#1f4c78',
    marginTop: 180,
    borderRadius: 20,
    padding: 10,
  },
  mount: {
    color: 'white',
    fontSize: 18,
  },
  tokyo: {
    color: '#CAC8C8',
    fontSize: 15,
  },
  location: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  star: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
  pressStar: {
    width: 18,
    height: 18,
    marginRight: 5,
    tintColor: 'yellow',
  },
});

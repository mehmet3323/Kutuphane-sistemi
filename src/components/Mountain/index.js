import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import images from '../../assets/images';
import icons from '../../assets/icons';
import {RoutesNames} from '../../config';

const Mountain = ({navigation, productName}) => {
  return (
    <View style={{alignItems: 'center'}}>
      <View style={{alignItems: 'center'}}>
        <ImageBackground
          borderRadius={20}
          source={images.fuji}
          style={styles.box}>
          <View
            style={{
              width: 310,
              height: 50,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(RoutesNames.TAB_SCREEN);
              }}>
              <View
                style={{
                  backgroundColor: 'grey',
                  borderRadius: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                }}>
                <Image source={icons.back} style={styles.icons} />
              </View>
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: 'grey',
                borderRadius: 30,
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
              }}>
              <Image source={icons.save} style={styles.icons} />
            </View>
          </View>
          <View style={styles.description}>
            <View>
              <View>
                <Text style={styles.andesText}>{productName}</Text>
              </View>
              <View style={{marginTop: 10, flexDirection: 'row'}}>
                <View>
                  <Image source={icons.location} style={styles.icons} />
                </View>
                <View style={{marginLeft: 10}}>
                  <Text style={{color: 'white', fontSize: 15}}>
                    South, America
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                marginLeft: 50,
                alignItems: 'flex-end',
              }}>
              <View>
                <Text style={{color: 'white'}}>Price</Text>
              </View>
              <View style={{marginTop: 10}}>
                <Text style={{color: 'white', fontSize: 25}}>230</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default Mountain;

const styles = StyleSheet.create({
  box: {
    width: 350,
    height: 450,
    marginTop: 20,
    borderRadius: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  icons: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  description: {
    width: 310,
    height: 100,
    backgroundColor: '#686868',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
  },
  andesText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },
});

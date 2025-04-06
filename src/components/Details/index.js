import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import icons from '../../assets/icons';

const Detail = () => {
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
        <View style={{marginRight: 25}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Overview</Text>
        </View>
        <View>
          <Text style={{fontSize: 15}}>Details</Text>
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
          <View>
            <Image source={icons.clock2} style={styles.icons} />
          </View>
          <View>
            <Text>8 hours</Text>
          </View>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
          <View>
            <Image source={icons.cloud} style={styles.icons} />
          </View>
          <View>
            <Text>16 C</Text>
          </View>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
          <View>
            <Image source={icons.star2} style={styles.icons} />
          </View>
          <View>
            <Text>4.5</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Detail;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 30,
    paddingRight: 30,
    marginTop: 30,
  },
  icons: {
    width: 35,
    height: 35,
    marginRight: 5,
  },
});

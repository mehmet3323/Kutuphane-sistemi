import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import icons from '../../assets/icons';
import style from '../../screens/Start/style';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const windowWidth = Dimensions.get('window').width;

const Menu = ({onPress}) => {
  const [icon, setIcon] = useState('Home');
  return (
    <View style={styles.menu}>
      <TouchableOpacity onPress={() => setIcon('Home')}>
        <View>
          <Image
            source={icons.home}
            style={[icon == 'Home' ? styles.icon : styles.unpressIcon]}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPress}>
        <View>
          <Image
            source={icons.clock}
            style={[icon == 'Clock' ? styles.icon : styles.unpressIcon]}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIcon('Heart')}>
        <View>
          <Image
            source={icons.heart}
            style={[icon == 'Heart' ? styles.icon : styles.unpressIcon]}
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIcon('Profile')}>
        <View>
          <Image
            source={icons.profile}
            style={[icon == 'Profile' ? styles.icon : styles.unpressIcon]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  menu: {
    width: windowWidth,
    height: 90,
    backgroundColor: 'white',
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  icon: {
    width: 27,
    height: 27,
    tintColor: 'black',
  },
  unpressIcon: {
    width: 27,
    height: 27,
    tintColor: '#848282',
  },
});

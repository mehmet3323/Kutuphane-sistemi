import {Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import icons from '../../assets/icons';
import { RoutesNames } from '../../config';
import styles from './styles';

const BottomNavigation = ({state, descriptors, navigation}) => {
  return (
    <View style={styles.menu}>
      <TouchableOpacity onPress={() => navigation.navigate(RoutesNames.HOME)}>
        <View style={styles.tabItem}>
          <Image 
            source={{uri: 'https://img.icons8.com/ios-filled/50/000000/home.png'}} 
            style={state?.index === 0 ? styles.icon : styles.unpressIcon} 
          />
          <Text style={state?.index === 0 ? styles.activeText : styles.inactiveText}>Ana Sayfa</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate(RoutesNames.SEARCH)}>
        <View style={styles.tabItem}>
          <Image 
            source={{uri: 'https://img.icons8.com/ios-filled/50/000000/search.png'}} 
            style={state?.index === 1 ? styles.icon : styles.unpressIcon} 
          />
          <Text style={state?.index === 1 ? styles.activeText : styles.inactiveText}>Arama</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate(RoutesNames.FAVORITES)}>
        <View style={styles.tabItem}>
          <Image 
            source={{uri: 'https://img.icons8.com/ios-filled/50/000000/favorite-cart.png'}} 
            style={state?.index === 2 ? styles.icon : styles.unpressIcon} 
          />
          <Text style={state?.index === 2 ? styles.activeText : styles.inactiveText}>Favoriler</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate(RoutesNames.PROFILE)}>
        <View style={styles.tabItem}>
          <Image 
            source={{uri: 'https://img.icons8.com/ios-filled/50/000000/user.png'}} 
            style={state?.index === 3 ? styles.icon : styles.unpressIcon} 
          />
          <Text style={state?.index === 3 ? styles.activeText : styles.inactiveText}>Profil</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;

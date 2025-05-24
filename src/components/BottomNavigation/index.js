import {Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import icons from '../../assets/icons';
import RoutesNames from '../../config/RoutesNames';
import styles from './styles';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { auth, firestore } from '../../config/firebase';

const BottomNavigation = ({navigation, activeTab}) => {
  return (
    <View style={styles.menu}>
      <TouchableOpacity onPress={() => navigation.navigate(RoutesNames.HOME)}>
        <View style={styles.tabItem}>
          <Image 
            source={{uri: 'https://img.icons8.com/ios-filled/50/4c669f/home.png'}} 
            style={activeTab === 'Home' ? styles.icon : styles.unpressIcon} 
          />
          <Text style={activeTab === 'Home' ? styles.activeText : styles.inactiveText}>Ana Sayfa</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate(RoutesNames.FAVORITES)}>
        <View style={styles.tabItem}>
          <Image 
            source={{uri: 'https://img.icons8.com/ios-filled/50/4c669f/brain.png'}} 
            style={activeTab === 'Favorites' ? styles.icon : styles.unpressIcon} 
          />
          <Text style={activeTab === 'Favorites' ? styles.activeText : styles.inactiveText}>Yapay Zeka</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate(RoutesNames.STATISTICS)}>
        <View style={styles.tabItem}>
          <Image 
            source={{uri: 'https://img.icons8.com/ios-filled/50/4c669f/statistics.png'}} 
            style={activeTab === 'Statistics' ? styles.icon : styles.unpressIcon} 
          />
          <Text style={activeTab === 'Statistics' ? styles.activeText : styles.inactiveText}>İstatistikler</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate(RoutesNames.SOCIAL)}>
        <View style={styles.tabItem}>
          <Image 
            source={{uri: 'https://img.icons8.com/ios-filled/50/4c669f/groups.png'}} 
            style={activeTab === 'Social' ? styles.icon : styles.unpressIcon} 
          />
          <Text style={activeTab === 'Social' ? styles.activeText : styles.inactiveText}>Sosyal</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate(RoutesNames.PROFILE)}>
        <View style={styles.tabItem}>
          <Image 
            source={{uri: 'https://img.icons8.com/ios-filled/50/4c669f/user.png'}} 
            style={activeTab === 'Profile' ? styles.icon : styles.unpressIcon} 
          />
          <Text style={activeTab === 'Profile' ? styles.activeText : styles.inactiveText}>Profil</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavigation;

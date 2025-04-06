import {StyleSheet, Text, View, Dimensions, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import icons from '../../assets/icons';

const MENU_ITEMS = [
  { route: 'Home', icon: icons.home, label: 'Ana Sayfa' },
  { route: 'Search', icon: icons.search, label: 'Arama' },
  { route: 'Favorites', icon: icons.heart, label: 'Favoriler' },
  { route: 'Profile', icon: icons.profile, label: 'Profil' }
];

const windowWidth = Dimensions.get('window').width;

const BottomNavigation = ({state, descriptors, navigation}) => {
  const currentRoute = state?.routes[state.index]?.name;

  return (
    <View style={styles.menu}>
      {MENU_ITEMS.map((item, index) => (
        <TouchableOpacity
          key={item.route}
          onPress={() => navigation.navigate(item.route)}
          style={styles.menuItem}>
          <Image
            source={item.icon}
            style={[styles.icon, currentRoute !== item.route && styles.unpressIcon]}
          />
          <Text style={[styles.menuText, currentRoute === item.route && styles.activeMenuText]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  menu: {
    width: windowWidth,
    height: 90,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingBottom: 20,
  },
  menuItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#1E2F97',
    marginBottom: 4,
  },
  unpressIcon: {
    tintColor: '#848282',
  },
  menuText: {
    fontSize: 12,
    color: '#848282',
  },
  activeMenuText: {
    color: '#1E2F97',
    fontWeight: '600',
  },
});

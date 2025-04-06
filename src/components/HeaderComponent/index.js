import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import styles from './styles';

const HeaderComponent = ({userName, profileImage}) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Hi, {userName} 👋</Text>
        <Text style={styles.subtitle}>Explore the world</Text>
      </View>
      <View>
        <Image source={profileImage} style={styles.profileImage} />
      </View>
    </View>
  );
};

export default HeaderComponent;

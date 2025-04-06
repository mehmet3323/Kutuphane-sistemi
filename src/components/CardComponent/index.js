import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import styles from './styles';
import {Icons} from '../../assets';

const CardComponent = ({title, location, rating, image}) => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <ImageBackground source={image} style={styles.cardImage}>
          <TouchableOpacity style={styles.favoriteIcon}>
            <Image source={Icons.heartOutline} style={styles.icon} />
          </TouchableOpacity>
          <View style={styles.overlay}>
            <Text style={styles.cardTitle}>{title}</Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <Image
                    source={Icons.locationOutline}
                    style={styles.iconSmall}
                  />
                </View>
                <Text style={styles.cardSubtitle}>{location}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <Image source={Icons.star} style={styles.iconSmall} />
                </View>
                <Text style={styles.cardSubtitle}>{rating}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

export default CardComponent;

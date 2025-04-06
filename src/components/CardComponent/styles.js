import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 15,
    width: 230,
    elevation: 5,
    height: 350,
  },
  imageContainer: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#968F99',
    borderRadius: 45,
    padding: 8,
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    left: 15,
    borderRadius: 15,
    width: '200',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#DDDDDD',
    marginBottom: 5,
  },
  cardRating: {
    fontSize: 14,
    color: '#FFD700',
  },
  iconSmall: {
    tintColor: 'white',
    width: 16,
    height: 16,
    marginRight: 5,
  },
});

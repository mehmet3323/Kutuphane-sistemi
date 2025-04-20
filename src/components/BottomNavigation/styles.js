import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  menu: {
    width: windowWidth,
    height: 70,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingBottom: 10,
    position: 'absolute',
    bottom: 0,
    zIndex: 999,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#1E2F97',
  },
  unpressIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#848282',
  },
  activeText: {
    fontSize: 12,
    color: '#1E2F97',
    marginTop: 4,
    fontWeight: '600',
  },
  inactiveText: {
    fontSize: 12,
    color: '#848282',
    marginTop: 4,
    fontWeight: '400',
  },
});

export default styles;
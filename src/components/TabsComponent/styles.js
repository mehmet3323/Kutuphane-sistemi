import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F2F2F',
  },
  viewAll: {
    fontSize: 16,
    color: '#888888',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 15,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 15,
    backgroundColor: '#FBFBFB',
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#333333',
  },
  tabText: {
    fontSize: 14,
    color: '#C5C5C5',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

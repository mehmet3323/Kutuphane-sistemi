import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    marginTop: 30,
    backgroundColor: 'rgba(245, 245, 245, 0)',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 15,
    borderColor:'#D2D2D2'
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 10,
    color: '#333333',
    padding:'15'
  },
  filterButton: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2F97',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoutButton: {
    position: 'absolute',
    right: 20,
    top: 50,
  },
  logoutIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
    transform: [{rotate: '180deg'}],
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#1E2F97',
  },
  bookList: {
    padding: 15,
  },
  bookCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    flexDirection: 'row',
  },
  bookImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  bookInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 15,
  },
  interactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  likeIcon: {
    width: 24,
    height: 24,
    tintColor: '#FF4B4B',
  },
  likeCount: {
    marginLeft: 5,
    color: '#FFFFFF',
    fontSize: 14,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  commentCount: {
    marginLeft: 5,
    color: '#FFFFFF',
    fontSize: 14,
  },
});
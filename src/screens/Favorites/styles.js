import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 28,
    height: 28,
    tintColor: '#fff',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#4c669f',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    height: 45,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    width: 45,
    height: 45,
    backgroundColor: '#4c669f',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginVertical: 10,
  },
  errorText: {
    color: '#c62828',
    fontSize: 16,
    textAlign: 'center',
  },
  bookInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookImage: {
    width: width * 0.4,
    height: width * 0.6,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 15,
  },
  bookDetails: {
    marginTop: 10,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  bookAuthor: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  bookPublisher: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  bookYear: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  bookPages: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  bookCategories: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  summaryContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  sourceText: {
    fontSize: 12,
    color: '#888',
    marginTop: 15,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 15,
  },
  moodExamples: {
    fontSize: 14,
    color: '#4c669f',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 30,
  },
});
import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
    padding: 25,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 45,
    paddingBottom: 25,
    elevation: 8,
    shadowColor: '#192f6a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  profileIcon: {
    width: 70,
    height: 70,
    marginBottom: 12,
    tintColor: '#fff',
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 18,
    elevation: 3,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 3,
  },
  goalContainer: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 18,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  editGoalButton: {
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginHorizontal: 15,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    marginHorizontal: 4,
  },
  activeTab: {
    borderBottomColor: '#4c669f',
    backgroundColor: 'rgba(76, 102, 159, 0.05)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
  },
  tabIcon: {
    width: 22,
    height: 22,
    tintColor: '#777',
    marginBottom: 5,
  },
  activeTabIcon: {
    tintColor: '#4c669f',
  },
  tabText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#4c669f',
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  loadingText: {
    marginTop: 12,
    color: '#4c669f',
    fontSize: 16,
    fontWeight: '500',
  },
  booksContainer: {
    padding: 15,
    paddingBottom: 80,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  bookCover: {
    width: 85,
    height: 125,
    borderRadius: 10,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 15,
    color: '#666',
    marginBottom: 5,
  },
  borrowDetails: {
    marginVertical: 8,
  },
  remainingDays: {
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  remainingDaysText: {
    fontSize: 13,
    color: '#1565c0',
    fontWeight: '600',
  },
  borrowDate: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  dueDate: {
    fontSize: 13,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  statusText: {
    fontSize: 13,
    color: '#4c669f',
    fontWeight: '600',
  },
  statusIcon: {
    width: 24,
    height: 24,
  },
  emptyBooksContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  emptyText: {
    fontSize: 17,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  browseButton: {
    backgroundColor: '#4c669f',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#4c669f',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  browseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  logoutButtonAbsolute: {
    position: 'absolute',
    right: 20,
    top: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 5,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(2px)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: width * 0.85,
    borderRadius: 24,
    padding: 22,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 22,
    color: '#999',
    padding: 5,
  },
  modalText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 22,
    textAlign: 'center',
    lineHeight: 22,
  },
  hedefInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  hedefInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: 90,
    textAlign: 'center',
    fontSize: 16,
  },
  hedefLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#666',
  },
  fullWidthButton: {
    backgroundColor: '#4c669f',
    borderColor: '#4c669f',
    borderWidth: 1,
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: '#4c669f',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fullWidthButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
}); 
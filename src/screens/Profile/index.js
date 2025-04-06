import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BottomNavigation from '../../components/BottomNavigation';

const {width} = Dimensions.get('window');

const Profile = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('okunan');

  const userStats = {
    okunanKitap: 24,
    alinanKitap: 35,
    begenilenKitap: 42,
    hedef: 50,
  };

  const mockBooks = [
    {
      id: '1',
      title: 'Suç ve Ceza',
      author: 'Fyodor Dostoyevski',
      coverImage: require('../../assets/images/profile.png'),
      status: 'Tamamlandı',
      progress: '100%',
    },
    {
      id: '2',
      title: '1984',
      author: 'George Orwell',
      coverImage: require('../../assets/images/profile.png'),
      status: 'Devam Ediyor',
      progress: '65%',
    },
  ];

  const renderBookItem = book => (
    <TouchableOpacity key={book.id} style={styles.bookCard}>
      <Image source={book.coverImage} style={styles.bookCover} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookAuthor}>{book.author}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{book.status}</Text>
          <Text style={styles.progressText}>{book.progress}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1}}>
      <ScrollView style={styles.container}>
        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.headerContainer}>
          <Image
            source={require('../../assets/images/profile.png')}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>Kullanıcı Adı</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.okunanKitap}</Text>
              <Text style={styles.statLabel}>Okunan</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.alinanKitap}</Text>
              <Text style={styles.statLabel}>Alınan</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.begenilenKitap}</Text>
              <Text style={styles.statLabel}>Beğenilen</Text>
            </View>
          </View>
          <View style={styles.goalContainer}>
            <Text style={styles.goalText}>
              Yıllık Hedef: {userStats.hedef} Kitap
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[styles.progress, {width: `${(userStats.okunanKitap / userStats.hedef) * 100}%`}]}
              />
            </View>
          </View>
        </LinearGradient>
    
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'okunan' && styles.activeTab]}
            onPress={() => setActiveTab('okunan')}>
            <Text style={[styles.tabText, activeTab === 'okunan' && styles.activeTabText]}>
              Okunan Kitaplar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'alinan' && styles.activeTab]}
            onPress={() => setActiveTab('alinan')}>
            <Text style={[styles.tabText, activeTab === 'alinan' && styles.activeTabText]}>
              Alınan Kitaplar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'begenilen' && styles.activeTab]}
            onPress={() => setActiveTab('begenilen')}>
            <Text style={[styles.tabText, activeTab === 'begenilen' && styles.activeTabText]}>
              Beğenilen Kitaplar
            </Text>
          </TouchableOpacity>
        </View>
    
        <View style={styles.booksContainer}>
          {mockBooks.map(book => renderBookItem(book))}
        </View>
      </ScrollView>
      <BottomNavigation navigation={navigation} activeTab="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  goalContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  goalText: {
    color: '#fff',
    marginBottom: 5,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4c669f',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#4c669f',
    fontWeight: 'bold',
  },
  booksContainer: {
    padding: 15,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 5,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#4c669f',
  },
  progressText: {
    fontSize: 12,
    color: '#4CAF50',
  },
});

export default Profile;
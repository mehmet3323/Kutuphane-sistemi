import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import BottomNavigation from '../../components/BottomNavigation';
import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, orderBy } from 'firebase/firestore';
import { auth, firestore } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { libraryBooks } from '../Home';
import Icons from '../../assets/icons';
import styles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const {width} = Dimensions.get('window');

const Profile = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('okunan');
  const [books, setBooks] = useState([]);
  const [borrowDetails, setBorrowDetails] = useState({});
  const [userStats, setUserStats] = useState({
    okunanKitap: 0,
    alinanKitap: 0,
    begenilenKitap: 0,
    hedef: 50
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showHedefModal, setShowHedefModal] = useState(false);
  const [hedefValue, setHedefValue] = useState(50);
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Kalan günleri hesaplama fonksiyonu
  const calculateRemainingDays = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Kullanıcı verilerini yükle
  const loadUserData = async () => {
    if (!auth.currentUser) return null;
    
    try {
      // Kullanıcı belgesine referans
      const userRef = doc(firestore, "users", auth.currentUser.uid);
      
      // Belgeyi getir
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        // Kullanıcı belgesi yoksa oluştur
        const userData = {
          fullName: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
          email: auth.currentUser.email,
          kitapHedefi: 50,
          createdAt: new Date()
        };
        
        await setDoc(userRef, userData);
        return userData;
      }
    } catch (error) {
      console.error("Kullanıcı verisi yüklenirken hata:", error);
      return null;
    }
  };

  // Kitap hedefini güncelle
  const updateKitapHedefi = async () => {
    if (!auth.currentUser) return;
    
    try {
      const userRef = doc(firestore, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        kitapHedefi: hedefValue
      });
      
      // Kullanıcı verilerini yeniden yükle
      const updatedUserData = await loadUserData();
      setUserData(updatedUserData);
      
      // State'i güncelle
      setUserStats(prev => ({
        ...prev,
        hedef: hedefValue
      }));
      
      setShowHedefModal(false);
      Alert.alert("Başarılı", "Kitap hedefi başarıyla güncellendi!");
    } catch (error) {
      console.error("Kitap hedefi güncellenirken hata:", error);
      Alert.alert("Hata", "Kitap hedefi güncellenirken bir hata oluştu.");
    }
  };

  // Bildirimleri çek
  const loadNotifications = async () => {
    if (!auth.currentUser) return;
    try {
      // Normal bildirimler
      const q1 = query(
        collection(firestore, "notifications"),
        where("userId", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot1 = await getDocs(q1);
      const notifs1 = snapshot1.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
      }));

      // Admin bildirimleri
      const q2 = query(
        collection(firestore, "admin_notifications"),
        where("userId", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot2 = await getDocs(q2);
      const notifs2 = snapshot2.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
      }));

      // Bildirimleri birleştir ve tarihe göre sırala
      const allNotifs = [...notifs1, ...notifs2].sort((a, b) => b.createdAt - a.createdAt);

      setNotifications(allNotifs);
      setUnreadCount(allNotifs.filter(n => !n.read).length);
    } catch (e) {
      // Hata yönetimi
    }
  };

  // Bildirimleri okundu olarak işaretle
  const markNotificationsAsRead = async () => {
    if (!auth.currentUser) return;
    const unread = notifications.filter(n => !n.read);
    for (const notif of unread) {
      const notifRef = doc(firestore, "notifications", notif.id);
      await updateDoc(notifRef, { read: true });
    }
    setUnreadCount(0);
    // Bildirimleri tekrar yükle
    loadNotifications();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        navigation.navigate('Login');
        return;
      }

      setIsLoading(true);
      try {
        console.log("Profil bilgileri yükleniyor...");

        // Kullanıcı verisini yükle
        const userDataResult = await loadUserData();
        setUserData(userDataResult);
        
        // Hedef değerini ayarla
        if (userDataResult?.kitapHedefi) {
          setHedefValue(userDataResult.kitapHedefi);
        }

        // BEĞENILEN KITAPLAR
        const likesQuery = query(
          collection(firestore, "bookLikes"),
          where("userId", "==", auth.currentUser.uid),
          where("liked", "==", true)
        );
        const likesSnapshot = await getDocs(likesQuery);
        const likedBooksCount = likesSnapshot.size;
        const likedBookIds = likesSnapshot.docs.map(doc => doc.data().bookId);
        console.log("Beğenilen kitap sayısı:", likedBooksCount);
        console.log("Beğenilen kitap ID'leri:", likedBookIds);
        
        // ÖDÜNÇ ALINAN KITAPLAR
        const borrowsQuery = query(
          collection(firestore, "bookBorrows"),
          where("userId", "==", auth.currentUser.uid),
          where("borrowed", "==", true)
        );
        const borrowsSnapshot = await getDocs(borrowsQuery);
        const borrowedBooksCount = borrowsSnapshot.size;
        const borrowedBookIds = borrowsSnapshot.docs.map(doc => doc.data().bookId);
        console.log("Ödünç alınan kitap sayısı:", borrowedBooksCount);
        console.log("Ödünç alınan kitap ID'leri:", borrowedBookIds);
        
        // Ödünç alınan kitapların detaylarını al
        const borrowedDetails = {};
        borrowsSnapshot.forEach(doc => {
          const data = doc.data();
          borrowedDetails[data.bookId] = {
            borrowedDate: data.borrowedDate || new Date().toISOString(),
            dueDate: data.dueDate || new Date(Date.now() + 7*24*60*60*1000).toISOString(),
            borrowDuration: data.borrowDuration || 1
          };
        });
        setBorrowDetails(borrowedDetails);
        
        // OKUNAN KITAPLAR
        const readsQuery = query(
          collection(firestore, "bookReads"),
          where("userId", "==", auth.currentUser.uid),
          where("read", "==", true)
        );
        const readsSnapshot = await getDocs(readsQuery);
        const readBooksCount = readsSnapshot.size;
        const readBookIds = readsSnapshot.docs.map(doc => doc.data().bookId);
        console.log("Okunan kitap sayısı:", readBooksCount);
        console.log("Okunan kitap ID'leri:", readBookIds);

        // Profil istatistiklerini güncelle
        setUserStats({
          okunanKitap: readBooksCount,
          alinanKitap: borrowedBooksCount,
          begenilenKitap: likedBooksCount,
          hedef: userDataResult?.kitapHedefi || 50
        });

        // Gösterilecek kitapları belirle
        let filteredBooks = [];
        if (activeTab === "begenilen") {
          // Beğenilen kitapları filtrele
          filteredBooks = libraryBooks.filter(book => {
            return likedBookIds.some(id => id === book.id || id.includes(book.id) || book.id.includes(id));
          });
        } 
        else if (activeTab === "okunan") {
          // Okunan kitapları filtrele - kullanıcının kendi okuduğu kitaplar
          filteredBooks = libraryBooks.filter(book => {
            return readBookIds.some(id => id === book.id || id.includes(book.id) || book.id.includes(id));
          });
          
          console.log("Okunan kitaplar filtrelendi:", filteredBooks.length);
          // Kitap ID'lerini kontrol et
          console.log("Okunan kitap ID'leri eşleşmesi:", 
            filteredBooks.map(book => ({
              bookId: book.id, 
              matches: readBookIds.filter(id => id === book.id || id.includes(book.id) || book.id.includes(id))
            }))
          );
        } 
        else if (activeTab === "alinan") {
          // Ödünç alınan kitapları filtrele
          filteredBooks = libraryBooks.filter(book => {
            return borrowedBookIds.some(id => id === book.id || id.includes(book.id) || book.id.includes(id));
          });
        }

        console.log(`${activeTab} kitaplar bulundu: ${filteredBooks.length}`);
        setBooks(filteredBooks);
        setIsLoading(false);
      } catch (error) {
        console.error("Profil bilgileri yüklenirken hata:", error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigation, activeTab]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error("Çıkış yapılırken hata:", error);
      Alert.alert("Hata", "Çıkış yapılırken bir hata oluştu.");
    }
  };

  const renderBookItem = (book) => (
    <TouchableOpacity key={book.id} style={styles.bookCard}>
      <Image source={{ uri: book.imageUrl }} style={styles.bookCover} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <Text style={styles.bookAuthor}>{book.author}</Text>
        
        {activeTab === 'alinan' && borrowDetails[book.id] && (
          <View style={styles.borrowDetails}>
            <View style={styles.remainingDays}>
              <Text style={styles.remainingDaysText}>
                {calculateRemainingDays(borrowDetails[book.id].dueDate)} gün kaldı
              </Text>
            </View>
            <Text style={styles.borrowDate}>
              Alış: {new Date(borrowDetails[book.id].borrowedDate).toLocaleDateString('tr-TR')}
            </Text>
            <Text style={styles.dueDate}>
              İade: {new Date(borrowDetails[book.id].dueDate).toLocaleDateString('tr-TR')}
            </Text>
          </View>
        )}
        
        <View style={styles.statusContainer}>
          <Text style={[
            styles.statusText, 
            activeTab === 'okunan' ? {color: '#4CAF50'} : 
            activeTab === 'alinan' ? {color: '#4c669f'} : 
            {color: '#e57373'}
          ]}>
            {activeTab === 'okunan' ? 'Tamamlandı' : 
             activeTab === 'alinan' ? 'Ödünç Alındı' : 'Beğenildi'}
          </Text>
          <Image 
            source={
              activeTab === 'okunan' 
                ? {uri: 'https://img.icons8.com/ios-filled/50/4CAF50/checkmark.png'} 
                : activeTab === 'alinan' 
                  ? {uri: 'https://img.icons8.com/ios-filled/50/4c669f/books.png'} 
                  : {uri: 'https://img.icons8.com/ios-filled/50/e57373/like.png'}
            } 
            style={styles.statusIcon} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.headerContainer}
      >
        <Image source={{uri: 'https://img.icons8.com/ios-filled/100/ffffff/book-stack.png'}} style={styles.profileIcon} />
        <Text style={styles.userName}>{userData?.fullName || auth.currentUser?.email?.split('@')[0] || "Kullanıcı"}</Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', width: '100%', marginTop: 8 }}>
          <TouchableOpacity onPress={() => { setShowNotifications(true); markNotificationsAsRead(); }} style={{ marginLeft: 16 }}>
            <Icon name="bell" size={28} color="#fff" />
            {unreadCount > 0 && (
              <View style={{
                position: 'absolute', left: 18, top: -2, backgroundColor: 'red', borderRadius: 8, minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center'
              }}>
                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
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
          <View style={styles.goalHeader}>
            <Text style={styles.goalText}>
              Yıllık Hedef: {userStats.hedef} Kitap
            </Text>
            <TouchableOpacity style={styles.editGoalButton} onPress={() => setShowHedefModal(true)}>
              <Image source={{uri: 'https://img.icons8.com/ios-filled/50/ffffff/edit.png'}} style={styles.editIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progress, {width: `${Math.min((userStats.okunanKitap / userStats.hedef) * 100, 100)}%`}]}
            />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'okunan' && styles.activeTab]}
          onPress={() => setActiveTab('okunan')}>
          <View style={styles.tabContent}>
            <Image 
              source={{uri: 'https://img.icons8.com/ios-filled/50/4c669f/reading.png'}} 
              style={[styles.tabIcon, activeTab === 'okunan' && styles.activeTabIcon]} 
            />
            <Text style={[styles.tabText, activeTab === 'okunan' && styles.activeTabText]}>
              Okunan Kitaplar
            </Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.tabDivider} />
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'alinan' && styles.activeTab]}
          onPress={() => setActiveTab('alinan')}>
          <View style={styles.tabContent}>
            <Image 
              source={{uri: 'https://img.icons8.com/ios-filled/50/4c669f/books.png'}} 
              style={[styles.tabIcon, activeTab === 'alinan' && styles.activeTabIcon]} 
            />
            <Text style={[styles.tabText, activeTab === 'alinan' && styles.activeTabText]}>
              Alınan Kitaplar
            </Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.tabDivider} />
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'begenilen' && styles.activeTab]}
          onPress={() => setActiveTab('begenilen')}>
          <View style={styles.tabContent}>
            <Image 
              source={{uri: 'https://img.icons8.com/ios-filled/50/4c669f/like.png'}} 
              style={[styles.tabIcon, activeTab === 'begenilen' && styles.activeTabIcon]} 
            />
            <Text style={[styles.tabText, activeTab === 'begenilen' && styles.activeTabText]}>
              Beğenilen Kitaplar
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4c669f" />
          <Text style={styles.loadingText}>Kitaplarınız yükleniyor...</Text>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.booksContainer}
          showsVerticalScrollIndicator={false}
        >
          {books.length > 0 ? (
            books.map(book => renderBookItem(book))
          ) : (
            <View style={styles.emptyBooksContainer}>
              <Text style={styles.emptyText}>
                {activeTab === 'okunan' ? 'Henüz okuduğunuz kitap bulunmamaktadır.' : 
                 activeTab === 'alinan' ? 'Henüz aldığınız kitap bulunmamaktadır.' :
                 'Henüz beğendiğiniz kitap bulunmamaktadır.'}
              </Text>
              <TouchableOpacity 
                style={styles.browseButton} 
                onPress={() => navigation.navigate('Home')}
              >
                <Text style={styles.browseButtonText}>Kitaplara Göz At</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      {/* Kitap Hedefi Ayarlama Modalı */}
      <Modal
        visible={showHedefModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowHedefModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kitap Okuma Hedefiniz</Text>
              <TouchableOpacity onPress={() => setShowHedefModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalText}>Bu yıl kaç kitap okumayı hedefliyorsunuz?</Text>
            
            <View style={styles.hedefInputContainer}>
              <TextInput
                style={styles.hedefInput}
                keyboardType="numeric"
                value={String(hedefValue)}
                onChangeText={(text) => setHedefValue(parseInt(text) || 1)}
              />
              <Text style={styles.hedefLabel}>kitap</Text>
            </View>
            
            <TouchableOpacity
              style={styles.fullWidthButton}
              onPress={updateKitapHedefi}
            >
              <Text style={styles.fullWidthButtonText}>Kaydet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.logoutButtonAbsolute} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
      </TouchableOpacity>
      
      <BottomNavigation navigation={navigation} activeTab="Profile" />

      <Modal visible={showNotifications} transparent animationType="fade">
        <View style={{
          flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: 'white', borderRadius: 10, padding: 20, width: '90%', maxHeight: '70%'
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1E2F97' }}>Bildirimler</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <Icon name="close" size={22} color="#f44336" />
              </TouchableOpacity>
            </View>
            {notifications.length === 0 ? (
              <Text>Hiç bildiriminiz yok.</Text>
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={{
                    padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee',
                    backgroundColor: item.read ? '#fff' : '#e3e9ff'
                  }}>
                    <Text style={{ color: '#1E2F97', fontWeight: item.read ? 'normal' : 'bold' }}>{item.message}</Text>
                    <Text style={{ color: '#888', fontSize: 12 }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleString('tr-TR') : ''}
                    </Text>
                  </View>
                )}
                style={{ maxHeight: 300 }}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { collection, getDocs, doc, updateDoc, addDoc, query, where, orderBy } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const AdminPanel = () => {
  const [borrowRequests, setBorrowRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [bookRequests, setBookRequests] = useState([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    console.log('AdminPanel mounted');
    const initialize = async () => {
      try {
        console.log('Checking admin status...');
        const isAdmin = await AsyncStorage.getItem('isAdmin');
        if (isAdmin !== 'true') {
          console.log('Not admin, redirecting to login...');
          navigation.replace('Login');
          return;
        }
        
        console.log('Admin status confirmed, fetching data...');
        setLoading(true);
        await Promise.all([
          fetchAllRequests(),
          fetchUsers(),
          fetchBookRequests()
        ]);
      } catch (error) {
        console.error('Initialization error:', error);
        Alert.alert('Hata', 'Veriler yüklenirken bir hata oluştu.');
        navigation.replace('Login');
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const isAdmin = await AsyncStorage.getItem('isAdmin');
      if (isAdmin !== 'true') {
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('Admin durumu kontrol edilirken hata:', error);
      navigation.replace('Login');
    }
  };

  const fetchAllRequests = async () => {
    try {
      const borrowsSnapshot = await getDocs(collection(firestore, 'bookBorrows'));
      const borrows = borrowsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBorrowRequests(borrows);
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
      Alert.alert('Hata', 'Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersQuery = query(collection(firestore, "users"));
      const snapshot = await getDocs(usersQuery);
      const usersList = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      console.error("Kullanıcılar yüklenirken hata:", error);
    }
  };

  const fetchBookRequests = async () => {
    try {
      const snapshot = await getDocs(collection(firestore, "bookRequests"));
      const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookRequests(requests);
    } catch (error) {
      console.error("Kitap istekleri yüklenirken hata:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !messageText.trim()) return;
    try {
      const notificationData = {
        userId: selectedUser.uid,
        userEmail: selectedUser.email,
        message: messageText.trim(),
        createdAt: new Date().toISOString(),
        read: false,
        type: "admin_message",
        sender: "Admin",
        title: "Yeni Mesaj",
        adminId: 'admin',
      };
      await addDoc(collection(firestore, "admin_notifications"), notificationData);
      setMessageText("");
      setShowMessageModal(false);
      setSelectedUser(null);
      Alert.alert("Başarılı", "Mesaj başarıyla gönderildi!");
    } catch (error) {
      console.error("Mesaj gönderilirken hata:", error);
      Alert.alert("Hata", "Mesaj gönderilirken bir hata oluştu.");
    }
  };

  const handleBorrowAction = async (request, approved) => {
    try {
      const requestRef = doc(firestore, 'bookBorrows', request.id);
      await updateDoc(requestRef, {
        status: approved ? 'approved' : 'rejected',
        adminApproved: approved,
        adminRejected: !approved,
        updatedAt: new Date()
      });

      await addDoc(collection(firestore, 'notifications'), {
        userId: request.userId,
        message: `Kitap ödünç alma talebiniz ${approved ? 'onaylandı' : 'reddedildi'}: ${request.bookTitle}`,
        createdAt: new Date(),
        read: false
      });

      await fetchAllRequests();
      Alert.alert('Başarılı', `Ödünç alma talebi ${approved ? 'onaylandı' : 'reddedildi'}.`);
    } catch (error) {
      console.error('İşlem sırasında hata:', error);
      Alert.alert('Hata', 'İşlem sırasında bir hata oluştu.');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('isAdmin');
      await AsyncStorage.removeItem('adminUser');
      navigation.replace('Login');
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    // 1. Önce admin kontrolü
    if (email === 'admin' && password === 'admin') {
      setLoading(true);
      try {
        await AsyncStorage.setItem('isAdmin', 'true');
        await AsyncStorage.setItem('adminUser', JSON.stringify({
          uid: 'admin',
          email: 'admin@admin.com',
          isAdmin: true
        }));
        navigation.replace('AdminPanel');
      } catch (error) {
        Alert.alert('Hata', 'Admin girişi sırasında bir hata oluştu.');
      } finally {
        setLoading(false);
      }
      return; // Burada fonksiyonu bitiriyoruz!
    }

    // 2. Sadece admin değilse e-posta formatı ve Firebase login kontrolü
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        navigation.replace('MainApp');
      }
    } catch (error) {
      let errorMessage = 'Giriş yapılırken bir hata oluştu.';
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'E-posta veya şifre hatalı.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Geçersiz e-posta formatı.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Çok fazla başarısız giriş denemesi. Lütfen sonra tekrar deneyin.';
          break;
      }
      Alert.alert('Hata', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E2F97" />
        <Text>Veriler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="book" size={24} color="#1E2F97" />
          <Text style={styles.headerTitle}>Admin Paneli</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="sign-out" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      {/* Kullanıcılar Bölümü */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kullanıcılar</Text>
        {users.map(user => (
          <View key={user.uid} style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userRole}>{user.role || 'Kullanıcı'}</Text>
            </View>
            <TouchableOpacity
              style={styles.messageButton}
              onPress={() => {
                setSelectedUser(user);
                setShowMessageModal(true);
              }}
            >
              <Icon name="envelope" size={16} color="#fff" />
              <Text style={styles.messageButtonText}>Mesaj Gönder</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Kitap Ödünç Alma Talepleri */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kitap Ödünç Alma Talepleri</Text>
        {borrowRequests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <Text style={styles.bookTitle}>{request.bookTitle}</Text>
            <Text style={styles.userEmail}>Kullanıcı: {request.userEmail}</Text>
            <Text style={[styles.status, { color: request.status === 'pending' ? '#FFA500' : 
                                          request.status === 'approved' ? '#4CAF50' : '#f44336' }]}>
              Durum: {request.status === 'pending' ? 'Bekliyor' : 
                      request.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
            </Text>
            {request.status === 'pending' && (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.approveButton]}
                  onPress={() => handleBorrowAction(request, true)}
                >
                  <Icon name="check" size={16} color="#fff" />
                  <Text style={styles.buttonText}>Onayla</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => handleBorrowAction(request, false)}
                >
                  <Icon name="times" size={16} color="#fff" />
                  <Text style={styles.buttonText}>Reddet</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Kitap İstekleri */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kitap İstekleri</Text>
        {bookRequests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <Text style={styles.bookTitle}>{request.title}</Text>
            <Text style={styles.userEmail}>Kullanıcı: {request.userEmail}</Text>
            <Text style={styles.status}>Durum: {request.status}</Text>
          </View>
        ))}
      </View>

      {/* Mesaj Gönderme Modalı */}
      <Modal
        visible={showMessageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMessageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Kullanıcıya Mesaj Gönder</Text>
            <Text style={styles.modalSubtitle}>Alıcı: {selectedUser?.email}</Text>
            
            <TextInput
              style={styles.messageInput}
              placeholder="Mesajınızı yazın..."
              value={messageText}
              onChangeText={setMessageText}
              multiline
              numberOfLines={4}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowMessageModal(false);
                  setMessageText("");
                  setSelectedUser(null);
                }}
              >
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.sendButton]}
                onPress={handleSendMessage}
              >
                <Text style={styles.modalButtonText}>Gönder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#1E2F97',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1E2F97',
  },
  userCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  userRole: {
    color: '#666',
    fontSize: 14,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2F97',
    padding: 8,
    borderRadius: 5,
  },
  messageButtonText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 12,
  },
  requestCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  status: {
    marginTop: 5,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1E2F97',
  },
  modalSubtitle: {
    color: '#666',
    marginBottom: 15,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  sendButton: {
    backgroundColor: '#1E2F97',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AdminPanel; 
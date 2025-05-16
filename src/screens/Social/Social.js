import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, ActivityIndicator, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { collection, addDoc, query, orderBy, getDocs, serverTimestamp, doc, getDoc, updateDoc, where, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, firestore } from '../../config/firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

const Social = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [userLikes, setUserLikes] = useState({});

  useEffect(() => {
    if (!auth.currentUser) {
      navigation.replace('Login');
      return;
    }
    loadPosts();
    loadUserLikes();
  }, []);

  const loadUserLikes = async () => {
    try {
      const likesQuery = query(
        collection(firestore, 'postLikes'),
        where('userId', '==', auth.currentUser.uid)
      );
      const likesSnapshot = await getDocs(likesQuery);
      const likesData = {};
      likesSnapshot.docs.forEach(doc => {
        likesData[doc.data().postId] = true;
      });
      setUserLikes(likesData);
    } catch (error) {
      console.error('Beğeniler yüklenirken hata:', error);
    }
  };

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const postsQuery = query(
        collection(firestore, 'socialPosts'),
        orderBy('createdAt', 'desc')
      );
      const postsSnapshot = await getDocs(postsQuery);
      const postsData = postsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setPosts(postsData);
    } catch (error) {
      Alert.alert('Hata', 'Paylaşımlar yüklenirken hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Hata', 'Çıkış yapılırken hata oluştu.');
    }
  };

  const handleAddPost = async () => {
    if (!newPost.trim()) return;
    try {
      await addDoc(collection(firestore, 'socialPosts'), {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        content: newPost.trim(),
        createdAt: serverTimestamp(),
        likes: 0
      });
      setNewPost('');
      loadPosts();
    } catch (error) {
      Alert.alert('Hata', 'Paylaşım eklenirken hata oluştu.');
    }
  };

  const handleLike = async (postId) => {
    try {
      const postRef = doc(firestore, 'socialPosts', postId);
      const postDoc = await getDoc(postRef);
      
      if (!postDoc.exists()) return;

      const likeQuery = query(
        collection(firestore, 'postLikes'),
        where('userId', '==', auth.currentUser.uid),
        where('postId', '==', postId)
      );
      const likeSnapshot = await getDocs(likeQuery);

      if (likeSnapshot.empty) {
        // Beğeni ekle
        await addDoc(collection(firestore, 'postLikes'), {
          userId: auth.currentUser.uid,
          postId: postId,
          createdAt: serverTimestamp()
        });
        await updateDoc(postRef, { likes: (postDoc.data().likes || 0) + 1 });
        setUserLikes(prev => ({ ...prev, [postId]: true }));
      } else {
        // Beğeniyi kaldır
        const likeDoc = likeSnapshot.docs[0];
        await deleteDoc(doc(firestore, 'postLikes', likeDoc.id));
        await updateDoc(postRef, { likes: (postDoc.data().likes || 0) - 1 });
        setUserLikes(prev => ({ ...prev, [postId]: false }));
      }

      loadPosts();
    } catch (error) {
      Alert.alert('Hata', 'Beğeni işlemi sırasında hata oluştu.');
    }
  };

  const loadComments = async (postId) => {
    setCommentsLoading(true);
    try {
      const commentsQuery = query(
        collection(firestore, 'postComments'),
        where('postId', '==', postId),
        orderBy('createdAt', 'asc')
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      const commentsData = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setComments(prev => ({ ...prev, [postId]: commentsData }));
    } catch (error) {
      Alert.alert('Hata', 'Yorumlar yüklenirken hata oluştu.');
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleComment = async (postId) => {
    if (!comment.trim()) return;
    try {
      await addDoc(collection(firestore, 'postComments'), {
        postId: postId,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        comment: comment.trim(),
        createdAt: serverTimestamp()
      });
      setComment('');
      loadComments(postId);
    } catch (error) {
      Alert.alert('Hata', 'Yorum eklenirken hata oluştu.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon name="users" size={24} color="#1E2F97" />
          <Text style={styles.headerTitle}>Sosyal Medya</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Icon name="sign-out" size={22} color="#f44336" />
          </TouchableOpacity>
        </View>
        <View style={styles.postForm}>
          <TextInput
            style={styles.textInput}
            placeholder="Bir şeyler paylaşın..."
            value={newPost}
            onChangeText={setNewPost}
            multiline
          />
          <TouchableOpacity style={styles.shareButton} onPress={handleAddPost}>
            <Text style={styles.shareButtonText}>Paylaş</Text>
          </TouchableOpacity>
        </View>
        {isLoading ? (
          <ActivityIndicator size="large" color="#1E2F97" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.postCard}>
                <View style={styles.postHeader}>
                  <Icon name="user" size={16} color="#1E2F97" />
                  <Text style={styles.postAuthor}>{item.userEmail}</Text>
                  <Text style={styles.postDate}>{item.createdAt?.toLocaleString('tr-TR')}</Text>
                </View>
                <Text style={styles.postContent}>{item.content}</Text>
                <View style={styles.postActions}>
                  <TouchableOpacity 
                    style={[styles.likeButton, userLikes[item.id] && styles.likedButton]} 
                    onPress={() => handleLike(item.id)}
                  >
                    <Icon 
                      name={userLikes[item.id] ? "heart" : "heart-o"} 
                      size={16} 
                      color="#f44336" 
                    />
                    <Text style={styles.likeCount}>{item.likes || 0}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.commentButton} onPress={() => {
                    setSelectedPost(item);
                    loadComments(item.id);
                    setShowCommentModal(true);
                  }}>
                    <Icon name="comment" size={16} color="#1E2F97" />
                    <Text style={styles.commentText}>Yorumlar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
        <Modal visible={showCommentModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Yorumlar</Text>
              {commentsLoading ? (
                <ActivityIndicator size="small" color="#1E2F97" />
              ) : (
                <FlatList
                  data={comments[selectedPost?.id] || []}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.commentItem}>
                      <Text style={styles.commentAuthor}>{item.userEmail}</Text>
                      <Text style={styles.commentDate}>{item.createdAt?.toLocaleString('tr-TR')}</Text>
                      <Text style={styles.commentText}>{item.comment}</Text>
                    </View>
                  )}
                  ListEmptyComponent={<Text>Henüz yorum yok.</Text>}
                />
              )}
              <TextInput
                style={styles.commentInput}
                placeholder="Yorumunuzu yazın..."
                value={comment}
                onChangeText={setComment}
                multiline
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => {
                  setShowCommentModal(false);
                  setComment('');
                  setSelectedPost(null);
                }}>
                  <Text style={styles.buttonText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sendButton} onPress={() => handleComment(selectedPost.id)}>
                  <Text style={styles.buttonText}>Yorum Ekle</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E2F97' },
  postForm: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  textInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8, marginRight: 8, backgroundColor: '#fafafa' },
  shareButton: { backgroundColor: '#1E2F97', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  shareButtonText: { color: '#fff', fontWeight: 'bold' },
  postCard: { backgroundColor: '#fff', margin: 10, borderRadius: 10, padding: 12, elevation: 2 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  postAuthor: { marginLeft: 6, fontWeight: 'bold', color: '#1E2F97', flex: 1 },
  postDate: { color: '#888', fontSize: 12 },
  postContent: { fontSize: 16, marginVertical: 8 },
  postActions: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  likeButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f44336'
  },
  likedButton: {
    backgroundColor: '#ffebee'
  },
  likeCount: { marginLeft: 4, color: '#f44336' },
  commentButton: { 
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1E2F97'
  },
  commentText: { marginLeft: 4, color: '#1E2F97' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, padding: 16, width: '90%', maxHeight: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#1E2F97' },
  commentItem: { marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 6 },
  commentAuthor: { fontWeight: 'bold', color: '#1E2F97' },
  commentDate: { fontSize: 12, color: '#888', marginBottom: 4 },
  commentInput: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 8, 
    marginTop: 10,
    backgroundColor: '#fafafa',
    minHeight: 60
  },
  modalButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10 
  },
  cancelButton: { 
    backgroundColor: '#f44336', 
    padding: 10, 
    borderRadius: 8, 
    flex: 1, 
    marginRight: 5 
  },
  sendButton: { 
    backgroundColor: '#1E2F97', 
    padding: 10, 
    borderRadius: 8, 
    flex: 1, 
    marginLeft: 5 
  },
  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold' 
  }
});

export default Social;
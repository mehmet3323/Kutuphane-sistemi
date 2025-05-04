import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';
import BottomNavigation from '../../components/BottomNavigation';
import LinearGradient from 'react-native-linear-gradient';
import { collection, addDoc, serverTimestamp, doc, setDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { auth } from '../../config/firebase';
import { firestore } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { toggleBookLike, loadUserLikedBooks } from '../../utils/likeUtils';
import styles from './styles';
import Icons from '../../assets/icons';

// Kitap verileri - doğrudan bu listeden alınacak
export const libraryBooks = [
  {
    id: "book-0",
    title: "Suç ve Ceza",
    author: "Fyodor Dostoyevski",
    description: "Rus edebiyatının en önemli eserlerinden biri olan bu roman, yoksul bir öğrencinin işlediği cinayetin psikolojik ve felsefi sonuçlarını ele alır.",
    category: "Roman",
    year: 1866,
    pages: 705,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book0/200/300",
  },
  {
    id: "book-1",
    title: "İnce Memed",
    author: "Yaşar Kemal",
    description: "Çukurovanın toplumsal gerçeklerini anlatan, eşkıyalık ve adalet temalı başyapıt.",
    category: "Roman",
    year: 1955,
    pages: 450,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book1/200/300",
  },
  {
    id: "book-2",
    title: "Kuyucaklı Yusuf",
    author: "Sabahattin Ali",
    description: "Anadoluda geçen, toplumsal adaletsizlik ve yozlaşmayı anlatan etkileyici bir roman.",
    category: "Roman",
    year: 1937,
    pages: 220,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book2/200/300",
  },
  {
    id: "book-3",
    title: "Beyaz Diş",
    author: "Jack London",
    description: "Alaskanın vahşi doğasında geçen, bir kurt köpeğinin hayatta kalma mücadelesi.",
    category: "Macera",
    year: 1906,
    pages: 298,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book3/200/300",
  },
  {
    id: "book-4",
    title: "Dönüşüm",
    author: "Franz Kafka",
    description: "Modern toplumda yabancılaşmayı anlatan, absürt ve alegorik bir başyapıt.",
    category: "Roman",
    year: 1915,
    pages: 74,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book4/200/300",
  },
  {
    id: "book-5",
    title: "Serenad",
    author: "Zülfü Livaneli",
    description: "İkinci Dünya Savaşı döneminde geçen, aşk ve tarih temalı etkileyici bir roman.",
    category: "Roman",
    year: 2011,
    pages: 481,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book5/200/300",
  },
  {
    id: "book-6",
    title: "Şeker Portakalı",
    author: "José Mauro de Vasconcelos",
    description: "Yoksul bir çocuğun gözünden hayatı anlatan, dokunaklı bir büyüme romanı.",
    category: "Roman",
    year: 1968,
    pages: 182,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book6/200/300",
  },
  {
    id: "book-7",
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    description: "Kitapların yakıldığı distopik bir gelecekte geçen, düşünce özgürlüğünü savunan roman.",
    category: "Bilim-Kurgu",
    year: 1953,
    pages: 256,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book7/200/300",
  },
  {
    id: "book-8",
    title: "Bin Muhteşem Güneş",
    author: "Khaled Hosseini",
    description: "Afganistanda iki kadının hayatını anlatan, dostluk ve umut temalı roman.",
    category: "Roman",
    year: 2007,
    pages: 384,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book8/200/300",
  },
  {
    id: "book-9",
    title: "Uçurtma Avcısı",
    author: "Khaled Hosseini",
    description: "Afganistanda geçen, dostluk ve ihanet temalı etkileyici bir roman.",
    category: "Roman",
    year: 2003,
    pages: 371,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book9/200/300",
  },
  {
    id: "book-10",
    title: "Simyacı",
    author: "Paulo Coelho",
    description: "Bir çobanın kişisel efsanesini gerçekleştirmek için çıktığı yolculuğu anlatan felsefi roman.",
    category: "Roman",
    year: 1988,
    pages: 208,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book10/200/300",
  },
  {
    id: "book-11",
    title: "Yüzüklerin Efendisi",
    author: "J.R.R. Tolkien",
    description: "Orta Dünyada geçen, iyilik ve kötülük arasındaki mücadeleyi anlatan epik fantastik roman serisi.",
    category: "Fantastik",
    year: 1954,
    pages: 1178,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book11/200/300",
  },
  {
    id: "book-12",
    title: "Harry Potter ve Felsefe Taşı",
    author: "J.K. Rowling",
    description: "Genç bir büyücünün Hogwartstaki ilk yılını anlatan fantastik roman.",
    category: "Fantastik",
    year: 1997,
    pages: 332,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book12/200/300",
  },
  {
    id: "book-13",
    title: "Küçük Prens",
    author: "Antoine de Saint-Exupéry",
    description: "Bir pilotun çölde karşılaştığı küçük prensin hikayesini anlatan felsefi masal.",
    category: "Çocuk",
    year: 1943,
    pages: 96,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book13/200/300",
  },
  {
    id: "book-14",
    title: "Hayvan Çiftliği",
    author: "George Orwell",
    description: "Bir çiftlikte hayvanların devrim yapmasını konu alan, totaliter rejimleri eleştiren alegorik roman.",
    category: "Roman",
    year: 1945,
    pages: 112,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book14/200/300",
  },
  {
    id: "book-15",
    title: "1984",
    author: "George Orwell",
    description: "Gözetim toplumunu ve düşünce kontrolünü konu alan distopik roman.",
    category: "Distopya",
    year: 1949,
    pages: 328,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book15/200/300",
  },
  {
    id: "book-16",
    title: "Cesur Yeni Dünya",
    author: "Aldous Huxley",
    description: "Teknolojik ilerlemenin insanlığı getirdiği noktayı anlatan distopik roman.",
    category: "Distopya",
    year: 1932,
    pages: 288,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book16/200/300",
  },
  {
    id: "book-17",
    title: "Savaş ve Barış",
    author: "Lev Tolstoy",
    description: "Napolyonun Rusya seferini ve Rus toplumunu anlatan epik roman.",
    category: "Roman",
    year: 1869,
    pages: 1225,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book17/200/300",
  },
  {
    id: "book-18",
    title: "Anna Karenina",
    author: "Lev Tolstoy",
    description: "Yasak aşk ve toplumsal normlar arasında sıkışan bir kadının hikayesi.",
    category: "Roman",
    year: 1877,
    pages: 864,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book18/200/300",
  },
  {
    id: "book-19",
    title: "Bülbülü Öldürmek",
    author: "Harper Lee",
    description: "Amerikan Güneyinde ırkçılık ve adaletsizliği bir çocuğun gözünden anlatan roman.",
    category: "Roman",
    year: 1960,
    pages: 281,
    likes: 0,
    imageUrl: "https://picsum.photos/seed/book19/200/300",
  }
];

const requestBook = async (title, author) => {
  try {
    if (!auth.currentUser) {
      alert('Kitap talebi oluşturmak için lütfen giriş yapın.');
      return;
    }

    const bookRequestData = {
      title,
      author,
      status: 'pending',
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
      requestDate: serverTimestamp(),
    };

    await addDoc(collection(firestore, 'bookRequests'), bookRequestData);
    alert('Kitap talebi başarıyla oluşturuldu!');
  } catch (error) {
    console.error('Kitap talebi oluşturulurken hata:', error);
    if (error.code === 'permission-denied') {
      alert('Kitap talebi oluşturma izniniz bulunmuyor. Lütfen giriş yapın veya yönetici ile iletişime geçin.');
    } else if (error.code === 'unavailable') {
      alert('Sunucu bağlantısı kurulamadı. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.');
    } else {
      alert(`Kitap talebi oluşturulurken bir hata oluştu: ${error.message || 'Bilinmeyen hata'}`);
    }
  }
};

const HomeScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [likedBooks, setLikedBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [readBooks, setReadBooks] = useState([]);
  const [comment, setComment] = useState("");
  const [bookComments, setBookComments] = useState({});
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [borrowDuration, setBorrowDuration] = useState(1); // Hafta cinsinden ödünç alma süresi
  const [requestTitle, setRequestTitle] = useState("");
  const [requestAuthor, setRequestAuthor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tümü");

  useEffect(() => {
    const fetchLikesAndSetBooks = async () => {
      setIsLoading(true);
      try {
        // Doğrudan libraryBooks dizisini kullanacağız, ancak beğeni sayılarını güncellemeliyiz
        const booksWithLikes = [...libraryBooks];

        // Eğer kullanıcı giriş yapmışsa, kullanıcının beğendiği kitapları yükle
        await loadUserLikedBooks();
        
        // Kullanıcının ödünç aldığı kitapları yükle
        await loadUserBorrowedBooks();
        
        // Kullanıcının okuduğu kitapları yükle
        await loadUserReadBooks();

        // Her kitap için beğeni sayısını Firebase'den yükle
        for (const book of booksWithLikes) {
          try {
            // Kitap beğeni sayısını hesapla
            const likesQuery = query(
              collection(firestore, 'bookLikes'),
              where('bookId', '==', book.id),
              where('liked', '==', true)
            );
            const likesSnapshot = await getDocs(likesQuery);
            const totalLikes = likesSnapshot.size;
            
            // Kitabın beğeni sayısını güncelle
            book.likes = totalLikes;
          } catch (err) {
            console.error(`Kitap ${book.id} beğeni sayısı yüklenirken hata:`, err);
          }
        }

        // Güncellenmiş kitaplarla state'i güncelle
        setBooks(booksWithLikes);
        setIsLoading(false);
      } catch (error) {
        console.error("Beğeni sayıları yüklenirken hata:", error);
        // Hata olsa bile kitapları yükle, beğeni sayıları olmadan
        setBooks(libraryBooks);
        setIsLoading(false);
      }
    };

    fetchLikesAndSetBooks();

    // Auth durumu değiştiğinde (giriş/çıkış) beğeni bilgilerini yeniden yükle
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadUserLikedBooks();
        loadUserBorrowedBooks();
        loadUserReadBooks();
      } else {
        setLikedBooks([]);
        setBorrowedBooks([]);
        setReadBooks([]);
      }
    });
    
    // Component unmount olduğunda listener'ı temizle
    return () => unsubscribe();
  }, []);

  const loadUserLikedBooks = async () => {
    if (!auth.currentUser) {
      setLikedBooks([]);
      return [];
    }

    try {
      const likesQuery = query(
        collection(firestore, "bookLikes"),
        where("userId", "==", auth.currentUser.uid),
        where("liked", "==", true)
      );
      const likesSnapshot = await getDocs(likesQuery);
      const userLikedBooks = likesSnapshot.docs.map((doc) => doc.data().bookId);
      setLikedBooks(userLikedBooks);
      return userLikedBooks;
    } catch (error) {
      console.error("Beğenilen kitaplar yüklenirken hata:", error);
      return [];
    }
  };
  
  const loadUserBorrowedBooks = async () => {
    if (!auth.currentUser) {
      setBorrowedBooks([]);
      return [];
    }

    try {
      const borrowedQuery = query(
        collection(firestore, "bookBorrows"),
        where("userId", "==", auth.currentUser.uid),
        where("borrowed", "==", true)
      );
      const borrowedSnapshot = await getDocs(borrowedQuery);
      const userBorrowedBooks = borrowedSnapshot.docs.map((doc) => doc.data().bookId);
      setBorrowedBooks(userBorrowedBooks);
      return userBorrowedBooks;
    } catch (error) {
      console.error("Ödünç alınan kitaplar yüklenirken hata:", error);
      return [];
    }
  };
  
  const loadUserReadBooks = async () => {
    if (!auth.currentUser) {
      setReadBooks([]);
      return [];
    }

    try {
      const readQuery = query(
        collection(firestore, "bookReads"),
        where("userId", "==", auth.currentUser.uid),
        where("read", "==", true)
      );
      const readSnapshot = await getDocs(readQuery);
      const userReadBooks = readSnapshot.docs.map((doc) => doc.data().bookId);
      setReadBooks(userReadBooks);
      return userReadBooks;
    } catch (error) {
      console.error("Okunan kitaplar yüklenirken hata:", error);
      return [];
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
      Alert.alert("Hata", "Çıkış yapılırken bir sorun oluştu. Lütfen tekrar deneyin.");
    }
  };

  const handleLike = async (bookId) => {
    try {
      if (!auth.currentUser) {
        Alert.alert("Uyarı", "Beğeni yapabilmek için giriş yapmalısınız.");
        return;
      }
      
      // Beğeni durumunu kontrol et (beğeni ekleme veya kaldırma işleminden önce)
      const isCurrentlyLiked = likedBooks.includes(bookId);
      
      // Beğeni referansını oluştur
      const likeRef = doc(firestore, 'bookLikes', `${bookId}_${auth.currentUser.uid}`);
      
      // Beğeni durumunu güncelle
      await setDoc(likeRef, {
        userId: auth.currentUser.uid,
        bookId: bookId,
        liked: !isCurrentlyLiked, // Mevcut durumun tersini ayarla
        updatedAt: serverTimestamp()
      });
      
      // Kullanıcının beğeni listesini güncelle
      if (isCurrentlyLiked) {
        // Beğeniyi kaldır
        setLikedBooks(prev => prev.filter(id => id !== bookId));
      } else {
        // Beğeni ekle
        setLikedBooks(prev => [...prev, bookId]);
      }
      
      // Firebase'den güncel beğeni sayısını al
      const likesQuery = query(
        collection(firestore, 'bookLikes'),
        where('bookId', '==', bookId),
        where('liked', '==', true)
      );
      const likesSnapshot = await getDocs(likesQuery);
      const totalLikes = likesSnapshot.size;
      
      // Kitap listesini güncelle
      const updatedBooks = [...books];
      const bookIndex = updatedBooks.findIndex(book => book.id === bookId);
      
      if (bookIndex !== -1) {
        // Kitabın beğeni sayısını güncelle
        updatedBooks[bookIndex] = {
          ...updatedBooks[bookIndex],
          likes: totalLikes
        };
        
        // State'i güncelle
        setBooks(updatedBooks);
      }
    } catch (error) {
      console.error("Beğeni işlemi sırasında hata:", error);
      Alert.alert("Hata", "Beğeni işlemi sırasında bir hata oluştu.");
    }
  };

  const loadBookComments = async (bookId) => {
    try {
      const commentsQuery = query(
        collection(firestore, "bookComments"),
        where("bookId", "==", bookId),
        orderBy("createdAt", "asc")
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      const comments = commentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setBookComments(prev => ({ ...prev, [bookId]: comments }));
    } catch (error) {
      console.error("Yorumlar yüklenirken hata:", error);
      
      if (error.code === 'failed-precondition' || error.message?.includes('requires an index')) {
        Alert.alert(
          "Hata",
          'Yorumları yüklerken bir indeks hatası oluştu. Bu hata, Firebase Firestore\'da gerekli indekslerin oluşturulmadığını gösteriyor. Lütfen Firebase konsoluna gidin ve gerekli indeksi oluşturun.'
        );
      } else {
        Alert.alert("Hata", "Yorumlar yüklenirken bir hata oluştu.");
      }
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim() || !selectedBook) {
      return;
    }

    try {
      if (!auth.currentUser) {
        Alert.alert("Uyarı", "Yorum yapabilmek için giriş yapmalısınız.");
        return;
      }

      await addDoc(collection(firestore, "bookComments"), {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        bookId: selectedBook.id,
        comment: comment.trim(),
        createdAt: serverTimestamp()
      });
      
      setComment("");
      await loadBookComments(selectedBook.id);
      Alert.alert("Başarılı", "Yorumunuz eklendi!");
    } catch (error) {
      console.error("Yorum eklerken hata:", error);
      Alert.alert("Hata", "Yorum eklerken bir hata oluştu.");
    }
  };

  const handleBorrow = async (bookId) => {
    if (!auth.currentUser) {
      Alert.alert("Uyarı", "Kitap ödünç almak için lütfen giriş yapın.");
      return;
    }

    // Eğer kitap zaten ödünç alınmışsa, iade işlemi yapılacak
    if (borrowedBooks.includes(bookId)) {
      try {
        // Ödünç alma referansını oluştur
        const borrowRef = doc(firestore, 'bookBorrows', `${bookId}_${auth.currentUser.uid}`);
        
        // Ödünç alma durumunu güncelle (iade et)
        await setDoc(borrowRef, {
          userId: auth.currentUser.uid,
          userEmail: auth.currentUser.email,
          bookId: bookId,
          borrowed: false,
          updatedAt: serverTimestamp()
        });
        
        // Kullanıcının ödünç alma listesini güncelle
        setBorrowedBooks(prev => prev.filter(id => id !== bookId));
        Alert.alert("Başarılı", "Kitap başarıyla iade edildi.");
      } catch (error) {
        console.error("Kitap iade edilirken hata:", error);
        Alert.alert("Hata", "Kitap iade edilirken bir hata oluştu.");
      }
    } else {
      // Yeni ödünç alma işlemi için modal göster
      setSelectedBook(books.find(book => book.id === bookId));
      setShowBorrowModal(true);
    }
  };
  
  const confirmBorrow = async () => {
    if (!selectedBook || !auth.currentUser) return;
    
    try {
      console.log("Ödünç alma işlemi başlatılıyor...");
      console.log("Kitap ID:", selectedBook.id);
      console.log("Kullanıcı ID:", auth.currentUser.uid);
      
      // Şu anki tarihi al
      const currentDate = new Date();
      
      // Bitiş tarihini hesapla (seçilen hafta sayısı kadar ileri)
      const dueDate = new Date(currentDate);
      dueDate.setDate(dueDate.getDate() + (borrowDuration * 7));
      
      // Belgenin ID'si
      const documentId = `${selectedBook.id}_${auth.currentUser.uid}`;
      console.log("Döküman ID:", documentId);
      
      // Ödünç alma verisi
      const borrowData = {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        bookId: selectedBook.id,
        borrowed: true,
        borrowDuration: borrowDuration,
        borrowedDate: currentDate.toISOString(),
        dueDate: dueDate.toISOString()
      };
      
      console.log("Ödünç alma verisi:", borrowData);
      
      // Ödünç alma referansını oluştur ve kaydet
      const borrowRef = doc(firestore, "bookBorrows", documentId);
      await setDoc(borrowRef, borrowData);
      
      console.log("Ödünç alma verisi başarıyla kaydedildi");
      
      // Kullanıcının ödünç alma listesini güncelle
      setBorrowedBooks(prev => [...prev, selectedBook.id]);
      
      // Modal'ı kapat ve bildirimi göster
      setShowBorrowModal(false);
      Alert.alert("Başarılı", `"${selectedBook.title}" kitabı ${borrowDuration} haftalığına başarıyla ödünç alındı!`);
      
    } catch (error) {
      console.error("Kitap ödünç alınırken hata:", error);
      Alert.alert("Hata", "Kitap ödünç alınırken bir hata oluştu. Detay: " + error.message);
    }
  };

  const handleRead = async (bookId) => {
    try {
      if (!auth.currentUser) {
        Alert.alert("Uyarı", "Kitabı okudum olarak işaretlemek için lütfen giriş yapın.");
        return;
      }
      
      // Okuma durumunu kontrol et
      const isCurrentlyRead = readBooks.includes(bookId);
      
      // Okuma referansını oluştur
      const readRef = doc(firestore, 'bookReads', `${bookId}_${auth.currentUser.uid}`);
      
      // Okuma durumunu güncelle
      await setDoc(readRef, {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        bookId: bookId,
        read: !isCurrentlyRead, // Mevcut durumun tersini ayarla
        updatedAt: serverTimestamp()
      });
      
      // Kullanıcının okuma listesini güncelle
      if (isCurrentlyRead) {
        // Okuma durumunu kaldır
        setReadBooks(prev => prev.filter(id => id !== bookId));
        Alert.alert("Bilgi", `Kitap okunmadı olarak işaretlendi.`);
      } else {
        // Okuma ekle
        setReadBooks(prev => [...prev, bookId]);
        Alert.alert("Başarılı", `Kitap okundu olarak işaretlendi!`);
      }
    } catch (error) {
      console.error("Okuma işlemi sırasında hata:", error);
      Alert.alert("Hata", "Kitap işaretlenirken bir hata oluştu.");
    }
  };

  // Kategorileri çıkarın
  const categories = ["Tümü", ...new Set(books.map(book => book.category))].sort();

  // Kitapları kategoriye göre filtreleyin
  const filteredBooks = activeCategory === "Tümü" 
    ? books 
    : books.filter(book => book.category === activeCategory);

  const renderBookItem = ({ item }) => (
    <View style={styles.bookCard}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.bookImage}
        resizeMode="cover"
      />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <Text style={styles.bookCategory}>{item.category}</Text>
        <Text style={styles.bookDescription} numberOfLines={3}>
          {item.description}
        </Text>
        <View style={styles.bookDetails}>
          <Text>Yayın Yılı: {item.year}</Text>
          <Text>{item.pages} Sayfa</Text>
        </View>
        <View style={styles.bookActions}>
          <TouchableOpacity
            style={[
              styles.likeButton,
              likedBooks.includes(item.id) && styles.likedButton,
            ]}
            onPress={() => handleLike(item.id)}
          >
            <Image
              source={
                likedBooks.includes(item.id)
                  ? Icons.heartFilled
                  : Icons.heartOutline
              }
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>{item.likes || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.commentButton}
            onPress={async () => {
              setSelectedBook(item);
              await loadBookComments(item.id);
              setShowCommentModal(true);
            }}
          >
            <Image source={Icons.comment} style={styles.actionIcon} />
            <Text style={styles.actionText}>Yorumlar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bookActions}>
          <TouchableOpacity
            style={[
              styles.borrowButton,
              borrowedBooks.includes(item.id) && styles.borrowedButton,
            ]}
            onPress={() => handleBorrow(item.id)}
          >
            <Image source={Icons.borrow} style={styles.actionIcon} />
            <Text style={styles.actionText}>
              {borrowedBooks.includes(item.id) ? 'İade Et' : 'Ödünç Al'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.readButton,
              readBooks.includes(item.id) && styles.readButton,
            ]}
            onPress={() => handleRead(item.id)}
          >
            <Image source={Icons.read} style={styles.actionIcon} />
            <Text style={styles.actionText}>
              {readBooks.includes(item.id) ? 'Okundu' : 'Okudum'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <Image source={Icons.book} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Kütüphanem</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowRequestModal(true)}
          >
            <Image source={Icons.plus} style={styles.headerIcon} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={handleLogout}
          >
            <Image source={Icons.logout} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Kategori Filtreleme */}
      <View style={styles.categoryWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                activeCategory === category && styles.activeCategoryButton,
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category && styles.activeCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4c669f" />
          <Text style={styles.loadingText}>Kitaplar yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.booksContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Kitap Yorum Modalı */}
      <Modal
        visible={showCommentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowCommentModal(false);
          setComment("");
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedBook?.title} - Yorumlar
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  setShowCommentModal(false);
                  setComment("");
                }}
              >
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.commentsContainer}>
              {bookComments[selectedBook?.id] &&
              bookComments[selectedBook?.id].length > 0 ? (
                bookComments[selectedBook?.id].map((comment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>
                        {comment.userEmail}
                      </Text>
                      <Text style={styles.commentDate}>
                        {comment.createdAt && comment.createdAt.toDate
                          ? new Date(comment.createdAt.toDate()).toLocaleString('tr-TR')
                          : 'Yeni eklendi'}
                      </Text>
                    </View>
                    <Text style={styles.commentText}>{comment.comment}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.noComments}>
                  <Text style={styles.noCommentsText}>
                    Henüz yorum yapılmamış. İlk yorumu siz yapın!
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.commentForm}>
              <TextInput
                style={styles.commentInput}
                placeholder="Yorumunuzu yazın..."
                value={comment}
                onChangeText={setComment}
                multiline
              />

              <TouchableOpacity
                style={styles.addCommentButton}
                onPress={handleAddComment}
              >
                <Text style={styles.addCommentText}>Yorum Ekle</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Kitap Talebi Modalı */}
      <Modal
        visible={showRequestModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRequestModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kitap Talebi Oluştur</Text>
              <TouchableOpacity onPress={() => setShowRequestModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Kitap Başlığı"
              value={requestTitle}
              onChangeText={setRequestTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Yazar"
              value={requestAuthor}
              onChangeText={setRequestAuthor}
            />
            
            <TouchableOpacity
              style={styles.fullWidthButton}
              onPress={() => {
                if (requestTitle && requestAuthor) {
                  requestBook(requestTitle, requestAuthor);
                  setRequestTitle("");
                  setRequestAuthor("");
                } else {
                  Alert.alert("Uyarı", "Lütfen kitap başlığı ve yazar bilgisini girin.");
                }
              }}
            >
              <Text style={styles.fullWidthButtonText}>Talep Oluştur</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Ödünç Alma Modalı */}
      <Modal
        visible={showBorrowModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBorrowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ödünç Alma Süresi</Text>
              <TouchableOpacity onPress={() => setShowBorrowModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.bookTitleInModal}>
              "{selectedBook?.title}"
            </Text>
            <Text style={styles.modalText}>
              Bu kitabı ne kadar süreyle ödünç almak istiyorsunuz?
            </Text>

            <View style={styles.borrowOptions}>
              <TouchableOpacity
                style={[
                  styles.borrowOption,
                  borrowDuration === 1 && styles.selectedBorrowOption,
                ]}
                onPress={() => setBorrowDuration(1)}
              >
                <Text style={styles.borrowDuration}>1 Hafta</Text>
                <Text style={[
                  styles.borrowInfo,
                  borrowDuration === 1 && styles.selectedBorrowInfo
                ]}>Kısa süre</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.borrowOption,
                  borrowDuration === 2 && styles.selectedBorrowOption,
                ]}
                onPress={() => setBorrowDuration(2)}
              >
                <Text style={styles.borrowDuration}>2 Hafta</Text>
                <Text style={[
                  styles.borrowInfo,
                  borrowDuration === 2 && styles.selectedBorrowInfo
                ]}>Standart</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.borrowOption,
                  borrowDuration === 3 && styles.selectedBorrowOption,
                ]}
                onPress={() => setBorrowDuration(3)}
              >
                <Text style={styles.borrowDuration}>3 Hafta</Text>
                <Text style={[
                  styles.borrowInfo,
                  borrowDuration === 3 && styles.selectedBorrowInfo
                ]}>Uzun süre</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.borrowOption,
                  borrowDuration === 4 && styles.selectedBorrowOption,
                ]}
                onPress={() => setBorrowDuration(4)}
              >
                <Text style={styles.borrowDuration}>4 Hafta</Text>
                <Text style={[
                  styles.borrowInfo,
                  borrowDuration === 4 && styles.selectedBorrowInfo
                ]}>Maksimum</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.fullWidthButton}
              onPress={confirmBorrow}
            >
              <Text style={styles.fullWidthButtonText}>Onayla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNavigation navigation={navigation} activeTab="Home" />
    </View>
  );
};

export default HomeScreen;
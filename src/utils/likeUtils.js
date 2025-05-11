import { doc, setDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { firestore, auth } from '../config/firebase';

/**
 * Bir kitabı beğenme veya beğeniyi kaldırma işlemini gerçekleştirir
 * @param {string} bookId - Beğenilecek kitabın ID'si
 * @param {Array} likedBooks - Kullanıcının beğendiği kitapların ID listesi
 * @param {Function} setLikedBooks - Beğenilen kitaplar listesini güncelleyen fonksiyon
 * @returns {Promise<void>}
 */
export const toggleBookLike = async (bookId, likedBooks, setLikedBooks) => {
  try {
    if (!auth.currentUser) {
      throw new Error('Beğeni yapabilmek için giriş yapmalısınız.');
    }

    const likeRef = doc(firestore, 'bookLikes', `${bookId}_${auth.currentUser.uid}`);
    const bookRef = doc(firestore, 'books', bookId);

    if (likedBooks.includes(bookId)) {
      // Beğeniyi kaldır
      await setDoc(likeRef, {
        userId: auth.currentUser.uid,
        bookId: bookId,
        liked: false,
        updatedAt: serverTimestamp()
      });
      setLikedBooks(prev => prev.filter(id => id !== bookId));
    } else {
      // Beğeni ekle
      await setDoc(likeRef, {
        userId: auth.currentUser.uid,
        bookId: bookId,
        liked: true,
        updatedAt: serverTimestamp()
      });
      setLikedBooks(prev => [...prev, bookId]);
    }

    // Kitabın toplam beğeni sayısını güncelle
    await updateBookLikeCount(bookId);
    
    return true;
  } catch (error) {
    // Hata mesajını sessizce ele al, konsola yazdırma
    return false; // Hata durumunda false döndür
  }
};

/**
 * Bir kitabın toplam beğeni sayısını hesaplar ve günceller
 * @param {string} bookId - Beğeni sayısı güncellenecek kitabın ID'si
 * @returns {Promise<number>} - Kitabın güncel beğeni sayısı
 */
export const updateBookLikeCount = async (bookId) => {
  try {
    // Kitabı beğenen tüm kullanıcıları say
    const likesQuery = query(
      collection(firestore, 'bookLikes'),
      where('bookId', '==', bookId),
      where('liked', '==', true)
    );
    const likesSnapshot = await getDocs(likesQuery);
    const totalLikes = likesSnapshot.size;

    // Kitabın beğeni sayısını veritabanında güncelle
    const bookRef = doc(firestore, 'books', bookId);
    await setDoc(bookRef, { likes: totalLikes }, { merge: true });
    
    // Konsol mesajını kaldırdık
    return totalLikes;
  } catch (error) {
    // Hata mesajını sessizce ele al, konsola yazdırma
    return 0; // Hata durumunda 0 döndür
  }
};

/**
 * Kullanıcının beğendiği kitapları yükler
 * @param {string} userId - Kullanıcı ID'si
 * @returns {Promise<Array>} - Kullanıcının beğendiği kitapların ID listesi
 */
export const loadUserLikedBooks = async (userId) => {
  try {
    if (!userId) return [];
    
    const likesQuery = query(
      collection(firestore, 'bookLikes'),
      where('userId', '==', userId),
      where('liked', '==', true)
    );
    
    const likesSnapshot = await getDocs(likesQuery);
    return likesSnapshot.docs.map(doc => doc.data().bookId);
  } catch (error) {
    // Hata mesajını sessizce ele al, konsola yazdırma
    return [];
  }
};
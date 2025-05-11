import { doc, setDoc, collection, query, where, getDocs, serverTimestamp, getDoc, addDoc } from 'firebase/firestore';
import { firestore, auth } from '../config/firebase';

/**
 * Kitapların beğeni verilerini yönetmek için servis fonksiyonları
 */

/**
 * Bir kitabı beğenme veya beğeniyi kaldırma işlemini gerçekleştirir
 * @param {string} bookId - Beğenilecek kitabın ID'si
 * @returns {Promise<boolean>} - İşlem başarılı olursa true, değilse false döner
 */
export const toggleLike = async (bookId) => {
  try {
    if (!auth.currentUser) {
      throw new Error('Beğeni yapabilmek için giriş yapmalısınız.');
    }

    const userId = auth.currentUser.uid;
    const likeId = `${bookId}_${userId}`;
    
    // Kullanıcının bu kitabı daha önce beğenip beğenmediğini kontrol et
    const likeRef = doc(firestore, 'bookLikes', likeId);
    const likeDoc = await getDoc(likeRef);
    
    // Beğeni durumunu tersine çevir
    const isLiked = likeDoc.exists() ? likeDoc.data().liked : false;
    
    // Beğeni verisini güncelle veya oluştur
    await setDoc(likeRef, {
      userId: userId,
      bookId: bookId,
      liked: !isLiked,
      updatedAt: serverTimestamp()
    });
    
    // Kitabın toplam beğeni sayısını güncelle
    await updateBookLikeCount(bookId);
    
    return !isLiked; // Yeni beğeni durumunu döndür
  } catch (error) {
    console.error('Beğeni işlemi sırasında hata:', error);
    return false;
  }
};

/**
 * Bir kitabın toplam beğeni sayısını hesaplar ve günceller
 * @param {string} bookId - Beğeni sayısı güncellenecek kitabın ID'si
 * @returns {Promise<number>} - Kitabın güncel beğeni sayısı
 */
export const updateBookLikeCount = async (bookId) => {
  try {
    // Kitabı beğenen kullanıcıları say
    const likesQuery = query(
      collection(firestore, 'bookLikes'),
      where('bookId', '==', bookId),
      where('liked', '==', true)
    );
    
    const likesSnapshot = await getDocs(likesQuery);
    const totalLikes = likesSnapshot.size;
    
    // Kitap verisini güncelle
    const bookRef = doc(firestore, 'books', bookId);
    await setDoc(bookRef, { likes: totalLikes }, { merge: true });
    
    return totalLikes;
  } catch (error) {
    console.error('Beğeni sayısı güncellenirken hata:', error);
    return 0;
  }
};

/**
 * Kullanıcının beğendiği kitapları getirir
 * @returns {Promise<Array<string>>} - Kullanıcının beğendiği kitapların ID'lerini içeren dizi
 */
export const getUserLikedBooks = async () => {
  try {
    if (!auth.currentUser) return [];
    
    const userId = auth.currentUser.uid;
    
    const likesQuery = query(
      collection(firestore, 'bookLikes'),
      where('userId', '==', userId),
      where('liked', '==', true)
    );
    
    const likesSnapshot = await getDocs(likesQuery);
    return likesSnapshot.docs.map(doc => doc.data().bookId);
  } catch (error) {
    console.error('Beğenilen kitaplar getirilirken hata:', error);
    return [];
  }
};

/**
 * Bir kitabın beğeni durumunu kontrol eder
 * @param {string} bookId - Kontrol edilecek kitabın ID'si
 * @returns {Promise<boolean>} - Kullanıcı kitabı beğendiyse true, değilse false döner
 */
export const isBookLiked = async (bookId) => {
  try {
    if (!auth.currentUser) return false;
    
    const userId = auth.currentUser.uid;
    const likeId = `${bookId}_${userId}`;
    
    const likeRef = doc(firestore, 'bookLikes', likeId);
    const likeDoc = await getDoc(likeRef);
    
    return likeDoc.exists() && likeDoc.data().liked;
  } catch (error) {
    console.error('Beğeni durumu kontrol edilirken hata:', error);
    return false;
  }
};

/**
 * Kitapların beğeni sayılarını sıfırlar ve Firebase'e kaydeder
 * @returns {Promise<boolean>} - İşlem başarılı olursa true, değilse false döner
 */
export const resetAllBookLikes = async () => {
  try {
    // Tüm kitapları al
    const booksSnapshot = await getDocs(collection(firestore, 'books'));
    
    // Her kitabın beğeni sayısını sıfırla
    const batch = firestore.batch();
    
    booksSnapshot.docs.forEach(bookDoc => {
      const bookRef = doc(firestore, 'books', bookDoc.id);
      batch.update(bookRef, { likes: 0 });
    });
    
    // Tüm beğeni kayıtlarını sil
    const likesSnapshot = await getDocs(collection(firestore, 'bookLikes'));
    
    likesSnapshot.docs.forEach(likeDoc => {
      const likeRef = doc(firestore, 'bookLikes', likeDoc.id);
      batch.delete(likeRef);
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Beğeni sayıları sıfırlanırken hata:', error);
    return false;
  }
};
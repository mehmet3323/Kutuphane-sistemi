import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, ActivityIndicator, Dimensions } from 'react-native';
import { styles } from './styles';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { firestore, auth } from '../../config/firebase';
import { libraryBooks } from '../Home';

const Statistics = () => {
  const screenWidth = Dimensions.get('window').width;
  const [loading, setLoading] = useState(true);
  const [mostLikedBooks, setMostLikedBooks] = useState([]);
  const [mostReadBooks, setMostReadBooks] = useState([]);
  const [topReaders, setTopReaders] = useState([]);
  const [mostLikedPosts, setMostLikedPosts] = useState([]);
  const [mostCommentedPosts, setMostCommentedPosts] = useState([]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // 1. Kitaplar: En çok beğenilen ve okunanlar
      const books = [...libraryBooks];
      // Beğeni sayıları
      for (const book of books) {
        const likesQuery = query(
          collection(firestore, 'bookLikes'),
          where('bookId', '==', book.id),
          where('liked', '==', true)
        );
        const likesSnapshot = await getDocs(likesQuery);
        book.likes = likesSnapshot.size;
      }
      // Okunma sayıları
      for (const book of books) {
        const readsQuery = query(
          collection(firestore, 'bookReads'),
          where('bookId', '==', book.id),
          where('read', '==', true)
        );
        const readsSnapshot = await getDocs(readsQuery);
        book.reads = readsSnapshot.size;
      }
      // En çok beğenilen kitaplar
      const sortedByLikes = [...books].sort((a, b) => b.likes - a.likes).slice(0, 5);
      setMostLikedBooks(sortedByLikes);
      // En çok okunan kitaplar
      const sortedByReads = [...books].sort((a, b) => b.reads - a.reads).slice(0, 5);
      setMostReadBooks(sortedByReads);

      // 2. En çok kitap okuyan kullanıcılar
      const readsQuery = query(collection(firestore, 'bookReads'), where('read', '==', true));
      const readsSnapshot = await getDocs(readsQuery);
      const userReadCounts = {};
      readsSnapshot.docs.forEach(doc => {
        const { userEmail } = doc.data();
        if (userEmail) {
          userReadCounts[userEmail] = (userReadCounts[userEmail] || 0) + 1;
        }
      });
      const sortedReaders = Object.entries(userReadCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([email, count]) => ({ email, count }));
      setTopReaders(sortedReaders);

      // 3. Sosyal medya: En çok beğenilen ve yorumlanan gönderiler
      const postsQuery = query(collection(firestore, 'socialPosts'), orderBy('likes', 'desc'));
      const postsSnapshot = await getDocs(postsQuery);
      const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMostLikedPosts(posts.slice(0, 5));

      // Yorum sayısı için ayrı sorgu
      const commentsQuery = query(collection(firestore, 'postComments'));
      const commentsSnapshot = await getDocs(commentsQuery);
      const postCommentCounts = {};
      commentsSnapshot.docs.forEach(doc => {
        const { postId } = doc.data();
        if (postId) {
          postCommentCounts[postId] = (postCommentCounts[postId] || 0) + 1;
        }
      });
      const postsWithComments = posts.map(post => ({
        ...post,
        commentCount: postCommentCounts[post.id] || 0
      }));
      const sortedByComments = [...postsWithComments].sort((a, b) => b.commentCount - a.commentCount).slice(0, 5);
      setMostCommentedPosts(sortedByComments);
    } catch (err) {
      // Hata yönetimi
    }
    setLoading(false);
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(76, 102, 159, ${opacity})`, // Mavi ton
    labelColor: (opacity = 1) => `rgba(44, 44, 44, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    propsForBackgroundLines: { stroke: '#eee' },
    propsForLabels: { fontWeight: 'bold' },
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4c669f" style={{ marginTop: 40 }} />;
  }

  // Dinamik genişlik: Her etiket için 120px (minimum 5 etiket için ekran genişliği)
  const getChartWidth = (dataLength) => Math.max(screenWidth - 40, dataLength * 120);

  // Etiketleri iki satırda ve kısa göstermek için yardımcı fonksiyon
  const formatLabel = (label) => {
    if (label.length <= 8) return label;
    if (label.length <= 16) return label.slice(0, 8) + '\n' + label.slice(8);
    return label.slice(0, 8) + '\n' + label.slice(8, 16) + '...';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>İstatistikler</Text>

      {/* En Çok Beğenilen Kitaplar */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>En Çok Beğenilen Kitaplar</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={{
              labels: mostLikedBooks.map(b => formatLabel(b.title)),
              datasets: [{ data: mostLikedBooks.map(b => b.likes) }],
            }}
            width={getChartWidth(mostLikedBooks.length)}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
            showValuesOnTopOfBars
          />
        </ScrollView>
      </View>

      {/* En Çok Okunan Kitaplar */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>En Çok Okunan Kitaplar</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <LineChart
            data={{
              labels: mostReadBooks.map(b => formatLabel(b.title)),
              datasets: [{ data: mostReadBooks.map(b => b.reads) }],
            }}
            width={getChartWidth(mostReadBooks.length)}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
          />
        </ScrollView>
      </View>

      {/* En Çok Kitap Okuyan Kullanıcılar */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>En Çok Kitap Okuyan Kullanıcılar</Text>
        <PieChart
          data={topReaders.map((u, i) => ({
            value: u.count,
            name: u.email.split('@')[0],
            color: ['#4c669f', '#6a1b9a', '#ff9800', '#43a047', '#e53935'][i % 5],
            legendFontColor: '#333',
            legendFontSize: 13
          }))}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </View>

      {/* En Çok Beğenilen Sosyal Medya Gönderileri */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>En Çok Beğenilen Gönderiler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={{
              labels: mostLikedPosts.map(p => p.content.slice(0, 10) + '...'),
              datasets: [{ data: mostLikedPosts.map(p => p.likes || 0) }],
            }}
            width={getChartWidth(mostLikedPosts.length)}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
            showValuesOnTopOfBars
          />
        </ScrollView>
      </View>

      {/* En Çok Yorum Alan Gönderiler */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>En Çok Yorum Alan Gönderiler</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={{
              labels: mostCommentedPosts.map(p => p.content.slice(0, 10) + '...'),
              datasets: [{ data: mostCommentedPosts.map(p => p.commentCount || 0) }],
            }}
            width={getChartWidth(mostCommentedPosts.length)}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero
            showValuesOnTopOfBars
          />
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default Statistics; 
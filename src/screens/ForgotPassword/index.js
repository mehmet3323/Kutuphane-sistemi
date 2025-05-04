import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { auth } from '../../config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Uyarı', 'Lütfen email adresinizi giriniz.');
      return;
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Uyarı', 'Lütfen geçerli bir email adresi giriniz.');
      return;
    }

    try {
      setLoading(true);
      // Firebase'in şifre sıfırlama fonksiyonunu kullan
      await sendPasswordResetEmail(auth, email);
      
      // Başarılı mesajı göster
      Alert.alert(
        'Başarılı',
        'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      
      // Hata koduna göre özel mesajlar
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Hata', 'Bu e-posta adresi ile kayıtlı bir kullanıcı bulunamadı.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Hata', 'Geçersiz e-posta formatı. Lütfen geçerli bir e-posta adresi girin.');
      } else if (error.code === 'auth/network-request-failed') {
        Alert.alert('Bağlantı Hatası', 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.');
      } else {
        Alert.alert('Hata', `Şifre sıfırlama işlemi sırasında bir hata oluştu: ${error.message || error}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1E2F97', '#081158']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/2702/2702154.png'
              }}
              style={styles.logo}
            />
            <Text style={styles.title}>Şifremi Unuttum</Text>
            <Text style={styles.subtitle}>Şifrenizi sıfırlamak için e-posta adresinizi girin</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="E-posta"
              placeholderTextColor="#A0A0A0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity 
              style={[styles.resetButton, (!email || loading) && styles.resetButtonDisabled]} 
              onPress={handleResetPassword}
              disabled={!email || loading}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.resetButtonText}>Şifre Sıfırlama Bağlantısı Gönder</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Giriş sayfasına dön</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ForgotPasswordScreen;
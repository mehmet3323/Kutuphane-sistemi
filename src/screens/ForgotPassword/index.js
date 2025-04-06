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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const handleResetPassword = () => {
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

    // Kod gönderildi simülasyonu
    const resetCode = Math.floor(100000 + Math.random() * 900000);
    Alert.alert(
      'Başarılı',
      `Şifre sıfırlama kodu: ${resetCode}\n\nBu kod email adresinize gönderilmiştir.`,
      [
        {
          text: 'Tamam',
          onPress: () => {
            setCodeSent(true);
            navigation.navigate('Login');
          }
        }
      ]
    );
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
              style={[styles.resetButton, !email && styles.resetButtonDisabled]} 
              onPress={handleResetPassword}
              disabled={!email}>
              <Text style={styles.resetButtonText}>Şifre Sıfırlama Kodu Gönder</Text>
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
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
  KeyboardAvoidingView, Platform, ScrollView, Alert
} from 'react-native';
import { auth, firestore } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !fullName) {
      Alert.alert('Uyarı', 'Lütfen tüm alanları doldurunuz.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Uyarı', 'Şifreler eşleşmiyor.');
      return;
    }

    try {
      setLoading(true);
      console.log('Kayıt başlatılıyor:', email);
      
      // Auth işlemi
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (!user) {
        throw new Error('Kullanıcı oluşturulamadı');
      }
      
      console.log('Auth başarılı, user:', user.uid);

      // Firestore işlemi
      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, {
        fullName,
        email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('Firestore kaydı başarılı');

      Alert.alert('Başarılı', 'Kayıt işlemi tamamlandı.', [
        { text: 'Tamam', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      console.error('Hata detayı:', error);
      Alert.alert('Hata', 'Kayıt işlemi sırasında bir hata oluştu.');
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
            <Text style={styles.title}>Yeni Hesap Oluştur</Text>
            <Text style={styles.subtitle}>Kütüphane Dünyasına Hoş Geldiniz</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ad Soyad"
              placeholderTextColor="#A0A0A0"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              placeholder="E-posta"
              placeholderTextColor="#A0A0A0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              placeholderTextColor="#A0A0A0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Şifre Tekrar"
              placeholderTextColor="#A0A0A0"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Kayıt Ol</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default RegisterScreen;
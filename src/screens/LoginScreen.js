import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import LoadingOverlay from '../components/LoadingOverlay';
import COLORS from '../theme/colors';

const getFirebaseErrorMessage = (error) => {
  switch (error?.code) {
    case 'auth/user-not-found':
      return 'No existe una cuenta con este correo';
    case 'auth/wrong-password':
      return 'Contraseña incorrecta';
    case 'auth/invalid-email':
      return 'El formato del correo no es válido';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Intenta más tarde';
    case 'auth/invalid-credential':
      return 'Credenciales inválidas. Verifica tu correo y contraseña';
    case 'auth/configuration-not-found':
    case 'auth/operation-not-allowed':
      return 'Debes habilitar "Correo electrónico y contraseña" en la consola de Firebase (Authentication > Sign-in method).';
    case 'auth/network-request-failed':
      return 'Error de conexión. Verifica tu conexión a internet';
    default:
      return error?.message || 'Error al iniciar sesión. Intenta de nuevo';
  }
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Ingresa un correo válido';
    }
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      setErrors({ general: getFirebaseErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} message="Iniciando sesión..." />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerSection}>
            <Text style={styles.title}>Bienvenido</Text>
            <Text style={styles.subtitle}>
              Inicia sesión para acceder a tu cuenta
            </Text>
          </View>

          {errors.general && (
            <View style={styles.errorBanner}>
              <Ionicons name="warning" size={18} color={COLORS.error} />
              <Text style={styles.errorBannerText}>{errors.general}</Text>
            </View>
          )}

          <View style={styles.formSection}>
            <CustomInput
              label="Correo Electrónico"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              placeholder="ejemplo@correo.com"
              keyboardType="email-address"
              icon="mail-outline"
              error={errors.email}
              autoCapitalize="none"
            />

            <CustomInput
              label="Contraseña"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              placeholder="Tu contraseña"
              secureTextEntry
              icon="lock-closed-outline"
              error={errors.password}
            />
          </View>

          <View style={styles.buttonSection}>
            <CustomButton
              title="Iniciar Sesión"
              onPress={handleLogin}
              variant="primary"
              loading={loading}
              icon="log-in-outline"
            />

            <CustomButton
              title="Regístrate"
              onPress={() => navigation.navigate('Register')}
              variant="outline"
              style={{ marginTop: 12 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
  },
  errorBannerText: {
    color: COLORS.error,
    fontSize: 13,
    marginLeft: 10,
    flex: 1,
  },
  formSection: {
    marginBottom: 8,
  },
  buttonSection: {
    marginTop: 8,
  },
});

export default LoginScreen;

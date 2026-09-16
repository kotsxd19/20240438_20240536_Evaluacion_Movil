import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import LoadingOverlay from '../components/LoadingOverlay';
import COLORS from '../theme/colors';

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const getFirebaseErrorMessage = (error) => {
  switch (error?.code) {
    case 'auth/email-already-in-use':
      return 'Este correo ya está registrado';
    case 'auth/invalid-email':
      return 'El formato del correo no es válido';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres';
    case 'auth/configuration-not-found':
    case 'auth/operation-not-allowed':
      return 'Debes habilitar el método "Correo electrónico y contraseña" en la consola de Firebase (Authentication > Sign-in method).';
    case 'permission-denied':
      return 'Permiso denegado en Cloud Firestore. Revisa las reglas de seguridad en Firebase Console.';
    case 'auth/network-request-failed':
      return 'Error de conexión. Verifica tu conexión a internet.';
    default:
      return error?.message || 'Error al crear la cuenta. Intenta de nuevo';
  }
};

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombreCompleto: '',
    fechaNacimiento: '',
    carnetInstitucional: '',
    urlImagen: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(2000, 0, 1));

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      updateField('fechaNacimiento', formatDate(date));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Formato de correo inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.nombreCompleto.trim()) {
      newErrors.nombreCompleto = 'El nombre es obligatorio';
    }

    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    }

    if (!formData.carnetInstitucional.trim()) {
      newErrors.carnetInstitucional = 'El carnet es obligatorio';
    }

    if (!formData.urlImagen.trim()) {
      newErrors.urlImagen = 'La URL de imagen es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );

      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'users', uid), {
        nombreCompleto: formData.nombreCompleto.trim(),
        fechaNacimiento: formData.fechaNacimiento,
        carnetInstitucional: formData.carnetInstitucional.trim(),
        urlImagen: formData.urlImagen.trim(),
        email: formData.email.trim(),
        creadoEn: serverTimestamp(),
      });
    } catch (error) {
      Alert.alert('Error al registrar', getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={loading} message="Creando cuenta..." />
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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.accent} />
            </TouchableOpacity>

            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Crear Cuenta</Text>
              <Text style={styles.subtitle}>
                Completa tus datos para registrarte
              </Text>
            </View>
          </View>

          <View style={styles.formSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="key-outline" size={18} color={COLORS.accent} />
              <Text style={styles.sectionTitle}>Credenciales</Text>
            </View>

            <CustomInput
              label="Correo Electrónico"
              value={formData.email}
              onChangeText={(text) => updateField('email', text)}
              placeholder="ejemplo@correo.com"
              keyboardType="email-address"
              icon="mail-outline"
              error={errors.email}
              autoCapitalize="none"
            />

            <CustomInput
              label="Contraseña"
              value={formData.password}
              onChangeText={(text) => updateField('password', text)}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              icon="lock-closed-outline"
              error={errors.password}
            />

            <CustomInput
              label="Confirmar Contraseña"
              value={formData.confirmPassword}
              onChangeText={(text) => updateField('confirmPassword', text)}
              placeholder="Repite tu contraseña"
              secureTextEntry
              icon="lock-closed-outline"
              error={errors.confirmPassword}
            />

            <View style={[styles.sectionHeader, { marginTop: 12 }]}>
              <Ionicons name="person-outline" size={18} color={COLORS.accent} />
              <Text style={styles.sectionTitle}>Información Personal</Text>
            </View>

            <CustomInput
              label="Nombre Completo"
              value={formData.nombreCompleto}
              onChangeText={(text) => updateField('nombreCompleto', text)}
              placeholder="Tu nombre completo"
              icon="person-outline"
              error={errors.nombreCompleto}
              autoCapitalize="words"
            />

            <View style={styles.dateFieldContainer}>
              <Text style={[styles.dateLabel, errors.fechaNacimiento && { color: COLORS.error }]}>
                FECHA DE NACIMIENTO
              </Text>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  errors.fechaNacimiento && styles.dateButtonError,
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={COLORS.textMuted}
                  style={{ marginRight: 12 }}
                />
                <Text
                  style={[
                    styles.dateText,
                    !formData.fechaNacimiento && styles.datePlaceholder,
                  ]}
                >
                  {formData.fechaNacimiento || 'Selecciona una fecha'}
                </Text>
                <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
              {errors.fechaNacimiento && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={14} color={COLORS.error} />
                  <Text style={styles.errorText}>{errors.fechaNacimiento}</Text>
                </View>
              )}
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1950, 0, 1)}
              />
            )}

            <CustomInput
              label="Carnet Institucional"
              value={formData.carnetInstitucional}
              onChangeText={(text) => updateField('carnetInstitucional', text)}
              placeholder="Ej: 20240536"
              keyboardType="numeric"
              icon="card-outline"
              error={errors.carnetInstitucional}
            />

            <CustomInput
              label="URL de Imagen"
              value={formData.urlImagen}
              onChangeText={(text) => updateField('urlImagen', text)}
              placeholder="https://ejemplo.com/foto.jpg"
              keyboardType="url"
              icon="image-outline"
              error={errors.urlImagen}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.buttonSection}>
            <CustomButton
              title="Crear Cuenta"
              onPress={handleRegister}
              variant="primary"
              loading={loading}
              icon="person-add-outline"
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  formSection: {
    marginBottom: 8,
  },
  dateFieldContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 50,
  },
  dateButtonError: {
    borderColor: COLORS.error,
  },
  dateText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
  },
  datePlaceholder: {
    color: COLORS.textMuted,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginLeft: 4,
  },
  buttonSection: {
    marginTop: 16,
    paddingBottom: 20,
  },
});

export default RegisterScreen;

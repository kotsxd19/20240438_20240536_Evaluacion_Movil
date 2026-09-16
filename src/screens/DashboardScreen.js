import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import ProfileCard from '../components/ProfileCard';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import LoadingOverlay from '../components/LoadingOverlay';
import COLORS from '../theme/colors';

const PROFILE_FIELDS = [
  { key: 'nombreCompleto', label: 'Nombre Completo', icon: 'person' },
  { key: 'email', label: 'Correo Electrónico', icon: 'mail' },
  { key: 'fechaNacimiento', label: 'Fecha de Nacimiento', icon: 'calendar' },
  { key: 'carnetInstitucional', label: 'Carnet Institucional', icon: 'card' },
  { key: 'urlImagen', label: 'URL de Imagen', icon: 'image' },
];

const EDIT_FIELDS = [
  {
    key: 'nombreCompleto',
    label: 'Nombre Completo',
    placeholder: 'Tu nombre completo',
    icon: 'person-outline',
    autoCapitalize: 'words',
    requiredError: 'El nombre es obligatorio',
  },
  {
    key: 'fechaNacimiento',
    label: 'Fecha de Nacimiento',
    placeholder: 'DD/MM/AAAA',
    icon: 'calendar-outline',
    requiredError: 'La fecha es obligatoria',
  },
  {
    key: 'carnetInstitucional',
    label: 'Carnet Institucional',
    placeholder: 'Tu carnet',
    icon: 'card-outline',
    keyboardType: 'numeric',
    requiredError: 'El carnet es obligatorio',
  },
  {
    key: 'urlImagen',
    label: 'URL de Imagen',
    placeholder: 'https://ejemplo.com/foto.jpg',
    icon: 'image-outline',
    requiredError: 'La URL es obligatoria',
  },
];

const buildEditData = (source) =>
  Object.fromEntries(EDIT_FIELDS.map((f) => [f.key, source?.[f.key] || '']));

const DashboardScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editData, setEditData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { ...docSnap.data(), email: user.email };
          setUserData(data);
          setEditData(buildEditData(data));
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los datos del perfil');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserData();
  };

  const toggleEditing = () => {
    if (isEditing) {
      setEditData(buildEditData(userData));
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const validateEdit = () => {
    const newErrors = {};
    EDIT_FIELDS.forEach((field) => {
      if (!editData[field.key].trim()) {
        newErrors[field.key] = field.requiredError;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateEdit()) return;

    setSaving(true);
    try {
      const user = auth.currentUser;
      const docRef = doc(db, 'users', user.uid);
      const trimmedData = Object.fromEntries(
        EDIT_FIELDS.map((field) => [field.key, editData[field.key].trim()])
      );
      await updateDoc(docRef, trimmedData);

      setUserData({ ...userData, ...trimmedData });
      setIsEditing(false);
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar la sesión');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingOverlay visible={true} message="Cargando perfil..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LoadingOverlay visible={saving} message="Guardando cambios..." />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
      >
        <View style={styles.headerSection}>
          <View style={styles.topBar}>
            <Text style={styles.greeting}>Mi Perfil</Text>
            <TouchableOpacity style={styles.editToggle} onPress={toggleEditing}>
              <Ionicons
                name={isEditing ? 'close' : 'create-outline'}
                size={22}
                color={isEditing ? COLORS.error : COLORS.accent}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentSection}>
          {isEditing ? (
            <View style={styles.editSection}>
              <View style={styles.editHeader}>
                <Ionicons name="create" size={20} color={COLORS.accent} />
                <Text style={styles.editTitle}>Editar Información</Text>
              </View>

              {EDIT_FIELDS.map((field) => (
                <CustomInput
                  key={field.key}
                  label={field.label}
                  value={editData[field.key]}
                  onChangeText={(text) =>
                    setEditData({ ...editData, [field.key]: text })
                  }
                  placeholder={field.placeholder}
                  icon={field.icon}
                  error={errors[field.key]}
                  keyboardType={field.keyboardType}
                  autoCapitalize={field.autoCapitalize}
                />
              ))}

              <View style={styles.editButtons}>
                <CustomButton
                  title="Guardar Cambios"
                  onPress={handleSave}
                  variant="primary"
                  loading={saving}
                  icon="checkmark-circle-outline"
                  style={{ flex: 1, marginRight: 8 }}
                />
                <CustomButton
                  title="Cancelar"
                  onPress={toggleEditing}
                  variant="outline"
                  style={{ flex: 0.6 }}
                />
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.sectionLabel}>Información Personal</Text>
              {PROFILE_FIELDS.map((field) => (
                <ProfileCard
                  key={field.key}
                  label={field.label}
                  value={userData?.[field.key]}
                  icon={field.icon}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.logoutSection}>
          <CustomButton
            title="Cerrar Sesión"
            onPress={handleLogout}
            variant="danger"
            icon="log-out-outline"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  headerSection: {
    paddingTop: 60,
    paddingHorizontal: 28,
    paddingBottom: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  editToggle: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentSection: {
    paddingHorizontal: 28,
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  editSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  editTitle: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  editButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  logoutSection: {
    paddingHorizontal: 28,
    marginTop: 32,
    paddingBottom: 20,
  },
});

export default DashboardScreen;

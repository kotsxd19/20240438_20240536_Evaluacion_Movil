# 20240536_20240438_Evaluación_Moviles

## Evaluación Práctica - Desarrollo de Aplicaciones Móviles

Aplicación móvil desarrollada con React Native y Expo que permite la autenticación de usuarios mediante Firebase Auth, y gestión de datos de perfil en Cloud Firestore.

---

## Integrantes

| Nombre | Carnet |
|--------|--------|
| Iván Alejandro Barrera Escalante | 20240536 |
| Kenneth Enrique Orellana Tobar | 20240438 |

---

## Descripción del Proyecto

La aplicación cuenta con tres pantallas principales interconectadas:

1. **Login (Inicio de Sesión):** Autenticación mediante correo electrónico y contraseña usando Firebase Auth.
2. **Registro de Usuarios:** Creación de cuentas nuevas con almacenamiento de datos en Firebase Auth y Cloud Firestore (nombre completo, fecha de nacimiento, carnet institucional, URL de imagen).
3. **Dashboard (Perfil):** Visualización y edición de la información del usuario autenticado, con opción de cerrar sesión.

### Características Principales
- Autenticación persistente con AsyncStorage
- Componentes reutilizables (CustomInput, CustomButton, ProfileCard, LoadingOverlay, Avatar)
- Navegación automática basada en estado de autenticación
- Validación de formularios con mensajes en español
- Variables de entorno para credenciales de Firebase (.env)

---

## Dependencias Utilizadas

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `expo` | ~57.x | Framework de desarrollo móvil |
| `firebase` | ^11.x | SDK de Firebase (Auth + Firestore) |
| `@react-navigation/native` | ^7.x | Core de navegación |
| `@react-navigation/stack` | ^7.x | Stack Navigator |
| `react-native-screens` | ~4.x | Optimización de pantallas |
| `react-native-safe-area-context` | ~5.x | Manejo de áreas seguras |
| `@react-native-async-storage/async-storage` | ~2.x | Persistencia local |
| `react-native-gesture-handler` | ~2.x | Gestos de navegación |
| `@react-native-community/datetimepicker` | ^8.x | Selector de fecha |
| `@expo/vector-icons` | ^15.x | Iconografía (Ionicons) |

---

## Paleta de Colores

| Rol | Hex |
|-----|-----|
| Fondo principal | `##FFFFFF` |
| Superficie (cards, inputs) | `##F5F1E3` |
| Bordes | `##1B9AAA` |
| Texto | `##050505` |
| Acento | `##DDDBCB` |

---

## Instalación y Ejecución

1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd app-movil
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   - Crear un archivo `.env` en la raíz basándose en `.env.example`
   - Completar con las credenciales de Firebase

4. Ejecutar la aplicación:
   ```bash
   npx expo start
   ```

---

## Estructura del Proyecto

```
app-movil/
├── App.js                          # Entry point
├── app.json                        # Configuración Expo
├── .env                            # Variables de entorno (no en Git)
├── .env.example                    # Referencia de configuración
├── assets/                         # Recursos gráficos
│   ├── icon.png
│   ├── splash-icon.png
│   └── adaptive-icon.png
└── src/
    ├── config/
    │   └── firebase.js             # Inicialización Firebase
    ├── components/
    │   ├── CustomInput.js          # Input reutilizable
    │   ├── CustomButton.js         # Botón con variantes
    │   ├── ProfileCard.js          # Card de información
    │   ├── LoadingOverlay.js       # Overlay de carga
    │   └── Avatar.js               # Avatar con fallback
    ├── screens/
    │   ├── LoginScreen.js          # Inicio de sesión
    │   ├── RegisterScreen.js       # Registro de usuarios
    │   └── DashboardScreen.js      # Perfil/Dashboard
    ├── navigation/
    │   └── AppNavigator.js         # Navegación Stack
    └── theme/
        └── colors.js               # Paleta de colores
```

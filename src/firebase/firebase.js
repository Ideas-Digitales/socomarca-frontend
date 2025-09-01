import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { getFirestore } from "firebase/firestore";

// Configuración para Firebase Web App (cliente)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};
  

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Initialize Firebase Cloud Messaging and get a reference to the service.
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

// Función para solicitar permisos de notificación
export const requestNotificationPermission = async () => {
  if (typeof window === 'undefined' || !messaging) {
    console.log('Messaging not available');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      // Get registration token
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY' // Necesitarás generar esto en Firebase Console
      });
      
      if (token) {
        console.log('Registration token:', token);
        return token;
      } else {
        console.log('No registration token available.');
        return null;
      }
    } else {
      console.log('Unable to get permission to notify.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token: ', error);
    return null;
  }
};

// Función para manejar mensajes en primer plano
export const onMessageListener = () => {
  if (!messaging) {
    return Promise.reject('Messaging not available');
  }

  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message received in foreground: ', payload);
      resolve(payload);
    });
  });
};

export default app;

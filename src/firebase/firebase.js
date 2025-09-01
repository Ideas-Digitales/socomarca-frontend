import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { getFirestore } from "firebase/firestore";

// Configuración para Firebase Web App (cliente)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
  

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Initialize Firebase Cloud Messaging and get a reference to the service.
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

// Función para solicitar permisos de notificación
export const requestNotificationPermission = async () => {
  if (typeof window === 'undefined' || !messaging) {
    console.log('Messaging not available - running on server or messaging not initialized');
    return null;
  }

  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.error('This browser does not support notifications');
      return null;
    }

    // Check current permission status
    let permission = Notification.permission;
    
    // If permission is default (not yet asked), request it
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }
    
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      
      // Check if VAPID key is configured
      if (!process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY) {
        console.error('VAPID key not configured. Please add NEXT_PUBLIC_FIREBASE_VAPID_KEY to your environment variables.');
        return null;
      }
      
      // Get registration token
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY // Web Push certificate key from Firebase Console
      });
      
      if (token) {
        console.log('Registration token obtained successfully');
        return token;
      } else {
        console.log('No registration token available. Make sure the app is configured correctly.');
        return null;
      }
    } else if (permission === 'denied') {
      console.log('Notification permission denied by user. You can enable notifications in your browser settings.');
      return null;
    } else {
      console.log('Unable to get permission to notify. Permission status:', permission);
      return null;
    }
  } catch (error) {
    console.error('An error occurred while requesting notification permission: ', error);
    
    // Provide more specific error messages
    if (error.code === 'messaging/permission-blocked') {
      console.error('Notifications are blocked. Please enable them in your browser settings.');
    } else if (error.code === 'messaging/vapid-key-required') {
      console.error('VAPID key is required but not provided.');
    } else if (error.code === 'messaging/invalid-vapid-key') {
      console.error('Invalid VAPID key provided.');
    }
    
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

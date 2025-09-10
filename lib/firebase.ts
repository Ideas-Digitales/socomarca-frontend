/**
 * Configuración Firebase con TypeScript
 * Inicializa: Auth, Cloud Messaging (FCM), Analytics
 */

import { initializeApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

// Configuración de Firebase (obtener desde Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCKEdhFG_TjULinmzNq4drvlaGMZd5VO_I",
  authDomain: "notify-lab-85d06.firebaseapp.com",
  projectId: "notify-lab-85d06",
  storageBucket: "notify-lab-85d06.firebasestorage.app",
  messagingSenderId: "877450078649",
  appId: "1:877450078649:web:b85e81e2366b73d28bee68",
  measurementId: "G-GBRX731R7L"
};

const vapid = "BLyxLf_VOh-cusugHMC4o-7kY7jXh2yb5EH-zmG0XvGqx7U7gRqQb6e7awNCefcC0FjJ7yrY6UjBKKBYtP22qro"; // socomarca-development token

// Instancia principal de Firebase
const app = initializeApp(firebaseConfig);

// Cloud Messaging para notificaciones push (solo en cliente)
let messaging: Messaging | null = null;
if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

export { app, messaging, vapid };

/**
 * Configuración Firebase con TypeScript
 * Inicializa: Auth, Cloud Messaging (FCM), Analytics
 */

import { initializeApp } from "firebase/app";
import type { Messaging } from "firebase/messaging";

// Configuración de Firebase (obtener desde Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyCT9ZDrKncGgl3QYFUpoOBioYGKkVPTbQ8",
  authDomain: "socomarca-development.firebaseapp.com",
  projectId: "socomarca-development",
  storageBucket: "socomarca-development.firebasestorage.app",
  messagingSenderId: "760830446922",
  appId: "1:760830446922:web:ab3e0cd42f74df936bc5b3",
  measurementId: "G-H24GZTBBCV"
};

const vapid = "BC4MbdgGYKgeDvUwVIZ9WAiHlIYGqvZ0R_AHf2LLYUVSHnlF1siyKe5spPzFZxxQde31Dna-aul8Hgml19B4vFg"; // socomarca-development token

// Instancia principal de Firebase
const app = initializeApp(firebaseConfig);

// Cloud Messaging para notificaciones push (solo en cliente, NO en iOS Capacitor)
// NO inicializar aquí - se inicializa dinámicamente en NotificationContext cuando se necesita
let messaging: Messaging | null = null;

export { app, messaging, vapid };

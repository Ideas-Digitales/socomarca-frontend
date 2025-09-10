// Importa y configura el SDK de Firebase
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

// Aquí debes colocar la configuración de tu proyecto de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCKEdhFG_TjULinmzNq4drvlaGMZd5VO_I",
  authDomain: "notify-lab-85d06.firebaseapp.com",
  projectId: "notify-lab-85d06",
  storageBucket: "notify-lab-85d06.firebasestorage.app",
  messagingSenderId: "877450078649",
  appId: "1:877450078649:web:b85e81e2366b73d28bee68",
  measurementId: "G-GBRX731R7L"
};

// Inicializa Firebase
const app = firebase.initializeApp(firebaseConfig);

// Inicializa Firebase Cloud Messaging y gestiona mensajes
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // // Puedes mostrar una notificación o realizar alguna acción aquí
  // const notificationTitle = payload.notification.title;
  // const notificationOptions = {
  //   body: payload.notification.body,
  // };

  // self.registration.showNotification(notificationTitle, notificationOptions);
});

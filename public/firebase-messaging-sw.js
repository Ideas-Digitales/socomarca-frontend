// Importa y configura el SDK de Firebase
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

// Aquí debes colocar la configuración de tu proyecto de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCT9ZDrKncGgl3QYFUpoOBioYGKkVPTbQ8",
  authDomain: "socomarca-development.firebaseapp.com",
  projectId: "socomarca-development",
  storageBucket: "socomarca-development.firebasestorage.app",
  messagingSenderId: "760830446922",
  appId: "1:760830446922:web:ab3e0cd42f74df936bc5b3",
  measurementId: "G-H24GZTBBCV"
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

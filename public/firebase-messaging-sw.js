// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
// TEMPORARY: Using minimal config to avoid errors while you set up your real credentials
const firebaseConfig = {
  apiKey: "AIzaSyCT9ZDrKncGgl3QYFUpoOBioYGKkVPTbQ8", 
  authDomain: "socomarca-development.firebaseapp.com",
  projectId: "socomarca-development",
  storageBucket: "socomarca-development.firebasestorage.app",
  messagingSenderId: "760830446922",
  appId: "1:760830446922:web:ab3e0cd42f74df936bc5b3"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/logo_plant-192.png',
    badge: '/icons/logo_plant-96.png',
    data: payload.data,
    actions: [
      {
        action: 'open_app',
        title: 'Abrir aplicación'
      },
      {
        action: 'dismiss',
        title: 'Cerrar'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  console.log('Notification click received.');

  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url == '/' && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow('/');
    }
  }));
});


import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cl.appsocomarca.app',
  appName: 'appsocomarca',
  webDir: 'public',
  server: {
    url: 'https://www.appsocomarca.cl',
    cleartext: true,
    allowNavigation: [
      '*.transbank.cl',
      'webpay3gint.transbank.cl',
      'webpay3g.transbank.cl',
    ],
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: 'LIGHT',
      backgroundColor: '#6CB409',
    },
  },
};

export default config;

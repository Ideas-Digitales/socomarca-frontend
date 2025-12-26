import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cl.appsocomarca.app',
  appName: 'appsocomarca',
  webDir: 'public',
  server: {
    url: 'https://www.appsocomarca.cl',
    cleartext: true
  }
};

export default config;

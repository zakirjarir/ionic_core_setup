import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.znslab.biveec',
  appName: 'BIVEEC',
  webDir: 'dist',

  server: {
    androidScheme: 'http',
    cleartext: true,
  },
};

export default config;

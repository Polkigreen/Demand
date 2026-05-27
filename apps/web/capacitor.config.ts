import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.demand.app",
  appName: "Demand",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    Geolocation: {
      permissions: true,
    },
  },
};

export default config;

require("dotenv").config();
const googleMapsApiKey = process.env.EXPO_PUBLIC_MAP_API_KEY;

console.log("Google Maps API Key found:", googleMapsApiKey ? "YES" : "NO");


module.exports = {
  expo: {
    name: "GOGO",
    slug: "gogo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logo/logo.png",
    scheme: "gogo",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/logo/logo.png",
      resizeMode: "contain",
      backgroundColor: "#2D3748"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.gogo.driver",
      googleServicesFile: "./GoogleService-Info.plist",
      config: {
        googleMapsApiKey: googleMapsApiKey
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/logo/logo.png",
        backgroundColor: "#2D3748"
      },
      package: "com.gogo.driver",
      googleServicesFile: "./google-services.json",
      config: {
        googleMaps: {
          apiKey: googleMapsApiKey
        }
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/logo/logo.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/logo/logo.png",
          "imageWidth": 200,
          "backgroundColor": "#2D3748"
        }
      ],
      [
        "react-native-maps",
        {
          "googleMapsApiKey": googleMapsApiKey
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    }
  }
};

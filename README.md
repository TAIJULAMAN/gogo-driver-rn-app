# GOGO Driver App

A modern React Native driver/rider application built with Expo and TypeScript for the GOGO ride-sharing platform.

## Features

- 🚗 **Driver Dashboard** - Real-time status toggle (Online/Offline)
- 📱 **Ride Management** - View and manage pending, active, and completed rides
- 💰 **Earnings Tracking** - Monitor daily, weekly, and monthly earnings
- 👤 **Profile Management** - Manage driver profile and vehicle information
- 🗺️ **Map Integration** - GPS navigation and location tracking (ready for integration)
- 🎨 **Modern UI** - Clean, professional design with smooth animations

## Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: React Navigation (Stack & Bottom Tabs)
- **Design**: Custom design system with #BEFFB6 primary color

## Project Structure

```
gogo-driver/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Input.tsx
│   ├── constants/        # App constants and theme
│   │   └── colors.ts
│   ├── screens/          # App screens
│   │   ├── SplashScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── SignInScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── RidesScreen.tsx
│   │   ├── EarningsScreen.tsx
│   │   └── AccountScreen.tsx
│   └── types/            # TypeScript type definitions
│       └── index.ts
├── App.tsx               # Main app component with navigation
└── tsconfig.json         # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on specific platform
npm run android  # Android
npm run ios      # iOS
npm run web      # Web
```

## Navigation Flow

1. **Splash Screen** → Auto-navigates to Onboarding
2. **Onboarding** → 3 slides introducing driver features
3. **Sign In** → Authentication screen
4. **Main App** → Bottom tab navigation with 4 tabs:
   - Home (Dashboard with online/offline toggle)
   - Rides (Pending, Active, Completed)
   - Earnings (Balance and transaction history)
   - Account (Profile and settings)

## Key Features

### Home Screen
- Online/Offline status toggle
- Map view placeholder (ready for react-native-maps integration)
- Quick stats for today's rides and earnings

### Rides Screen
- Tabbed interface for ride status
- Accept/Decline ride requests
- View ride details (pickup, dropoff, fare, distance)

### Earnings Screen
- Total balance display
- Earnings breakdown (today, week, month)
- Cash out functionality
- Transaction history

### Account Screen
- Driver profile information
- Vehicle information
- Documents management
- Ratings and reviews
- Settings and support

## Design System

### Colors
- Primary: `#BEFFB6`
- Secondary: `#2D3748`
- Background: `#FFFFFF`
- Text: `#1A202C`
- Success: `#48BB78`
- Warning: `#ED8936`
- Error: `#F56565`

### Components
- **Button**: Multiple variants (primary, secondary, outline)
- **Input**: Form input with label and error handling

## Next Steps

- [ ] Integrate real map functionality (react-native-maps)
- [ ] Connect to backend API
- [ ] Implement real-time ride requests
- [ ] Add push notifications
- [ ] Implement actual authentication
- [ ] Add ride navigation and tracking
- [ ] Integrate payment processing

## License

MIT

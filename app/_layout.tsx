import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const loaded = true;

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <AuthProvider>
            <Stack>
                <Stack.Screen name="splash" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding1" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding2" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding3" options={{ headerShown: false }} />
                <Stack.Screen name="(driver)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
            </Stack>
        </AuthProvider>
    );
}

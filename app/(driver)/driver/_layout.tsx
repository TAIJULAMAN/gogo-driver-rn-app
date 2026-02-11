import { Stack } from 'expo-router';

export default function DriverStackLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="ride-details" options={{ title: 'Ride Details' }} />
            <Stack.Screen name="navigation" options={{ headerShown: false }} />
            <Stack.Screen name="edit-profile" options={{ title: 'Edit Profile' }} />
            <Stack.Screen name="vehicle-info" options={{ title: 'Vehicle Information' }} />
            <Stack.Screen name="documents" options={{ title: 'Documents' }} />
            <Stack.Screen name="transaction-history" options={{ title: 'Transaction History' }} />
        </Stack>
    );
}

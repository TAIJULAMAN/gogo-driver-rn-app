import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';

export default function SplashScreen() {
    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/onboarding1');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>GOGO</Text>
            <Text style={styles.subtitle}>Driver</Text>
            <ActivityIndicator
                size="large"
                color={Colors.primary}
                style={styles.loader}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        fontSize: 64,
        fontWeight: 'bold',
        color: Colors.primary,
        letterSpacing: 4,
    },
    subtitle: {
        fontSize: 24,
        color: Colors.white,
        marginTop: 8,
        fontWeight: '300',
    },
    loader: {
        marginTop: 40,
    },
});

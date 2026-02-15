import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '../../../constants/Colors';

export default function PrivacyPolicyScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />

            <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={{ width: 24 }} />
            </Animated.View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.lastUpdated}>Last Updated: October 2023</Text>

                <Text style={styles.paragraph}>
                    Your privacy is important to us. It is GOGO's policy to respect your privacy regarding any information we may collect from you across our website and app.
                </Text>

                <Text style={styles.heading}>1. Information We Collect</Text>
                <Text style={styles.paragraph}>
                    We collect information directly from you when you register as a driver, including your name, contact details, vehicle information, and location data while using the app.
                </Text>

                <Text style={styles.heading}>2. How We Use Information</Text>
                <Text style={styles.paragraph}>
                    We use the information we collect to operate and improve our services, facilitate rides, process payments, and communicate with you.
                </Text>

                <Text style={styles.heading}>3. Information Sharing</Text>
                <Text style={styles.paragraph}>
                    We share your information with passengers to facilitate rides. We may also share information with third-party service providers who assist us in operating our business.
                </Text>

                <Text style={styles.heading}>4. Security</Text>
                <Text style={styles.paragraph}>
                    We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
                </Text>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    lastUpdated: {
        fontSize: 14,
        color: Colors.textLight,
        marginBottom: 24,
    },
    heading: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginTop: 16,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 15,
        color: '#444',
        lineHeight: 24,
        marginBottom: 16,
    },
});

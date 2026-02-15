import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '../../../constants/Colors';

export default function TermsServiceScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />

            <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Terms of Service</Text>
                <View style={{ width: 24 }} />
            </Animated.View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.lastUpdated}>Last Updated: October 2023</Text>

                <Text style={styles.paragraph}>
                    Welcome to GOGO Driver. By using our app, you agree to these Terms of Service. Please read them carefully.
                </Text>

                <Text style={styles.heading}>1. Acceptance of Terms</Text>
                <Text style={styles.paragraph}>
                    By accessing or using the GOGO Driver platform, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not use our services.
                </Text>

                <Text style={styles.heading}>2. Driver Eligibility</Text>
                <Text style={styles.paragraph}>
                    To become a driver on the GOGO platform, you must meet certain eligibility criteria, including holding a valid driving license, passing background checks, and maintaining vehicle standards.
                </Text>

                <Text style={styles.heading}>3. Service Modifications</Text>
                <Text style={styles.paragraph}>
                    GOGO reserves the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice.
                </Text>

                <Text style={styles.heading}>4. User Conduct</Text>
                <Text style={styles.paragraph}>
                    You agree to use the Service only for lawful purposes and in accordance with these Terms. You are responsible for all activity that occurs under your account.
                </Text>

                <Text style={styles.heading}>5. Payments and Fees</Text>
                <Text style={styles.paragraph}>
                    GOGO charges a service fee for each ride booked through the platform. This fee is automatically deducted from the payment made by the user. You will receive your earnings on a weekly basis.
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

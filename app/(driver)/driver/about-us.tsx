import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '../../../constants/Colors';

export default function AboutUsScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />

            <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About Us</Text>
                <View style={{ width: 24 }} />
            </Animated.View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>GOGO</Text>
                    <Text style={styles.versionText}>Driver App v1.0.0</Text>
                </View>

                <Text style={styles.paragraph}>
                    GOGO is a leading ride-hailing platform committed to providing safe, reliable, and convenient transportation solutions.
                </Text>

                <Text style={styles.paragraph}>
                    Our mission is to empower drivers with flexible earning opportunities and to connect passengers with seamless travel experiences.
                </Text>

                <Text style={styles.heading}>Our Values</Text>
                <View style={styles.valueItem}>
                    <Ionicons name="shield-checkmark-outline" size={24} color={Colors.primary} />
                    <View style={styles.valueTextContainer}>
                        <Text style={styles.valueTitle}>Safety First</Text>
                        <Text style={styles.valueDescription}>We prioritize the safety of our drivers and passengers above all else.</Text>
                    </View>
                </View>

                <View style={styles.valueItem}>
                    <Ionicons name="people-outline" size={24} color={Colors.primary} />
                    <View style={styles.valueTextContainer}>
                        <Text style={styles.valueTitle}>Community Focused</Text>
                        <Text style={styles.valueDescription}>We build strong communities through mutual respect and support.</Text>
                    </View>
                </View>

                <View style={styles.valueItem}>
                    <Ionicons name="rocket-outline" size={24} color={Colors.primary} />
                    <View style={styles.valueTextContainer}>
                        <Text style={styles.valueTitle}>Innovation</Text>
                        <Text style={styles.valueDescription}>We continuously improve our technology to deliver the best experience.</Text>
                    </View>
                </View>

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
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 16,
    },
    logoText: {
        fontSize: 40,
        fontWeight: '900',
        color: Colors.primary,
        letterSpacing: 2,
    },
    versionText: {
        marginTop: 8,
        color: Colors.textLight,
        fontSize: 14,
    },
    paragraph: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    heading: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
        marginTop: 24,
        marginBottom: 16,
    },
    valueItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
        backgroundColor: '#F9F9F9',
        padding: 16,
        borderRadius: 12,
    },
    valueTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    valueTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
    },
    valueDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});

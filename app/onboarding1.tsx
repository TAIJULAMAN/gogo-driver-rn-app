import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../constants/Colors';
import { Button } from '../components/Button';

const { width } = Dimensions.get('window');

export default function Onboarding1() {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.skipButton} onPress={() => router.replace('/(auth)/sign-in')}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.emoji}>🚗</Text>
                <Text style={styles.title}>Earn on Your Schedule</Text>
                <Text style={styles.description}>
                    Drive when you want, where you want. You're in control of your earnings.
                </Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    <View style={[styles.dot, styles.activeDot]} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                </View>

                <Button
                    title="Next"
                    onPress={() => router.push('/onboarding2')}
                    style={styles.button}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    skipButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        padding: 10,
    },
    skipText: {
        fontSize: 16,
        color: Colors.textLight,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emoji: {
        fontSize: 120,
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: Colors.textLight,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.gray[300],
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: Colors.primary,
        width: 24,
    },
    button: {
        marginTop: 10,
    },
});

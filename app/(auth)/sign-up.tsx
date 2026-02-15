import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { CustomInput } from '../../components/CustomInput';
import { Button } from '../../components/Button';

import { FileUpload } from '../../components/FileUpload';

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [emiratesId, setEmiratesId] = useState('');
    const [drivingLicense, setDrivingLicense] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            router.replace('/(auth)/sign-in');
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.logo}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started!</Text>
                </View>

                <View style={styles.form}>
                    <CustomInput
                        label="Full Name"
                        placeholder="John Doe"
                        value={name}
                        onChangeText={setName}
                    />

                    <CustomInput
                        label="Phone Number"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />

                    <CustomInput
                        label="Email"
                        placeholder="john@example.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />

                    <CustomInput
                        label="Address"
                        placeholder="Your residential address"
                        value={address}
                        onChangeText={setAddress}
                    />

                    <FileUpload
                        label="Upload Emirates ID"
                        imageUri={emiratesId}
                        onImageSelected={setEmiratesId}
                    />

                    <FileUpload
                        label="Upload Driving License"
                        imageUri={drivingLicense}
                        onImageSelected={setDrivingLicense}
                    />

                    <Button
                        title="Sign Up"
                        onPress={handleSignUp}
                        loading={loading}
                        style={styles.signUpButton}
                    />

                    <View style={styles.signInContainer}>
                        <Text style={styles.signInText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.signInLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    header: {
        marginBottom: 32,
    },
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    form: {
        width: '100%',
    },
    signUpButton: {
        marginTop: 8,
        marginBottom: 24,
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signInText: {
        color: Colors.textLight,
        fontSize: 14,
    },
    signInLink: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { CustomInput } from '../../components/CustomInput';
import { Button } from '../../components/Button';

export default function SignUpScreen() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
                    <Text style={styles.logo}>GOGO</Text>
                    <Text style={styles.subtitle}>Driver Sign Up</Text>
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
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <CustomInput
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
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
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        fontSize: 48,
        fontWeight: 'bold',
        color: Colors.primary,
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 18,
        color: Colors.textLight,
        marginTop: 8,
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

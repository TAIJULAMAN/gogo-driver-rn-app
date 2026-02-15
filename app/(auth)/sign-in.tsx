import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { CustomInput } from '../../components/CustomInput';
import { Button } from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

export default function SignInScreen() {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth(); // Potentially update auth context logic

    const handleSignIn = async () => {
        setLoading(true);
        // Simulate OTP send
        setTimeout(() => {
            setLoading(false);
            router.push({
                pathname: '/(auth)/verify-otp',
                params: { phone }
            });
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
                    <Text style={styles.subtitle}>Driver Sign In</Text>
                </View>

                <View style={styles.form}>
                    <CustomInput
                        label="Phone Number"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />

                    <Button
                        title="Get OTP"
                        onPress={handleSignIn}
                        loading={loading}
                        style={styles.signInButton}
                    />

                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
                            <Text style={styles.signUpLink}>Sign Up</Text>
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
    },
    header: {
        alignItems: 'center',
        marginBottom: 48,
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
    signInButton: {
        marginBottom: 24,
        marginTop: 24,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signUpText: {
        color: Colors.textLight,
        fontSize: 14,
    },
    signUpLink: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
});

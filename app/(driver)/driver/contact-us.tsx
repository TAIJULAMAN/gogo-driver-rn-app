import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '../../../constants/Colors';

export default function ContactUsScreen() {
    const router = useRouter();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (!subject || !message) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        Alert.alert('Success', 'Your message has been sent. We will get back to you shortly.', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />

            <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Contact Us</Text>
                <View style={{ width: 24 }} />
            </Animated.View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Get in touch</Text>
                    <Text style={styles.infoText}>
                        Have a question or need assistance? Fill out the form below or contact us directly.
                    </Text>

                    <View style={styles.contactRow}>
                        <Ionicons name="call" size={20} color={Colors.primary} />
                        <Text style={styles.contactDetail}>+971 50 123 4567</Text>
                    </View>
                    <View style={styles.contactRow}>
                        <Ionicons name="mail" size={20} color={Colors.primary} />
                        <Text style={styles.contactDetail}>support@gogo.com</Text>
                    </View>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Subject</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="What is this about?"
                        value={subject}
                        onChangeText={setSubject}
                    />

                    <Text style={styles.label}>Message</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Describe your issue detailedly..."
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                        value={message}
                        onChangeText={setMessage}
                    />

                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Send Message</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
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
        padding: 20,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: Colors.textLight,
        marginBottom: 16,
        lineHeight: 20,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 12,
    },
    contactDetail: {
        fontSize: 15,
        color: Colors.text,
        fontWeight: '500',
    },
    form: {
        marginTop: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        borderWidth: 1,
        borderColor: '#EEE',
        marginBottom: 20,
        color: Colors.text,
    },
    textArea: {
        minHeight: 120,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
    },
});

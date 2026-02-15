import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Colors } from '../../../constants/Colors';
import { useAuth } from '../../../context/AuthContext';

export default function EditProfileScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [name, setName] = useState(user?.name || 'Driver Name');
    const [email, setEmail] = useState(user?.email || 'driver@example.com');
    const [phone, setPhone] = useState(user?.phone || '+1 (555) 000-0000');
    const [address, setAddress] = useState('123 Main St, City, Country');

    const handleSave = () => {
        if (!name || !email || !phone) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        Alert.alert(
            'Success',
            'Your profile has been updated successfully',
            [
                {
                    text: 'OK',
                    onPress: () => router.back()
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <Animated.View
                entering={FadeInUp.delay(100).duration(600)}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 24 }} />
            </Animated.View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarContainer}>
                            <Ionicons name="person" size={50} color="#fff" />
                        </View>
                        <TouchableOpacity style={styles.changePhotoButton}>
                            <Ionicons name="camera" size={16} color={Colors.primary} />
                            <Text style={styles.changePhotoText}>Change Photo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name *</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#999" />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your name"
                                placeholderTextColor="#999"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address *</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#999" />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number *</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="call-outline" size={20} color="#999" />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your phone"
                                placeholderTextColor="#999"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Address</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="location-outline" size={20} color="#999" />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your address"
                                placeholderTextColor="#999"
                                value={address}
                                onChangeText={setAddress}
                            />
                        </View>
                    </View>
                    <View style={{ height: 100 }} />
                </Animated.View>
            </ScrollView>

            {/* Save Button */}
            <Animated.View
                entering={FadeInUp.delay(400).duration(600)}
                style={styles.buttonContainer}
            >
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    activeOpacity={0.8}
                >
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
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
        borderBottomColor: '#F0F0F0',
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
        paddingHorizontal: 20,
    },
    avatarSection: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    changePhotoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    changePhotoText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        paddingHorizontal: 16,
        height: 52,
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        color: Colors.text,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    saveButton: {
        backgroundColor: Colors.primary,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
    },
});

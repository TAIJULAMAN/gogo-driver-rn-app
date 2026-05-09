import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { useGetDriverProfileQuery, useUpdateDriverProfileMutation } from '../../Redux/api/driverApi';

export default function AccountScreen() {
    const { signOut } = useAuth();
    const router = useRouter();
    const { data: profileData, isLoading } = useGetDriverProfileQuery({});
    const [updateProfile, { isLoading: isUpdating }] = useUpdateDriverProfileMutation();
    
    const user = profileData?.data;
    const userName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.name || user?.email?.split('@')[0] || 'Driver';
    const userEmail = user?.email || '';
    const avatarInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            const formData = new FormData();
            const uri = result.assets[0].uri;
            const filename = uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename || '');
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('profileImage', {
                uri,
                name: filename,
                type,
            } as any);

            try {
                await updateProfile(formData).unwrap();
                Alert.alert("Success", "Profile image updated successfully!");
            } catch (error) {
                console.error("Image upload error:", error);
                Alert.alert("Error", "Failed to upload image. Please try again.");
            }
        }
    };

    const handleSignOut = async () => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Sign Out",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                        router.replace('/(auth)/sign-in');
                    }
                }
            ]
        );
    };

    const MenuItem = ({ icon, title, onPress, color = Colors.text }: { icon: any, title: string, onPress?: () => void, color?: string }) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.menuIconContainer}>
                <Ionicons name={icon} size={22} color={Colors.text} />
            </View>
            <Text style={[styles.menuText, { color }]}>{title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Background watermark icon */}
            <View style={styles.watermarkContainer}>
                <Ionicons
                    name="person-circle-outline"
                    size={240}
                    color={Colors.primary}
                    style={{ opacity: 0.15, transform: [{ rotate: "-15deg" }] }}
                />
            </View>

            {/* Top Header Section */}
            <View style={styles.header}>
                <Text style={styles.title}>Account</Text>
            </View>

            <Animated.View
                entering={FadeInUp.delay(200).duration(800)}
                style={styles.profileHeaderSection}
            >
                {/* Avatar Section */}
                <View style={styles.avatarContainer}>
                    <TouchableOpacity
                        style={styles.avatarCircle}
                        onPress={handlePickImage}
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <ActivityIndicator size="small" color="#000" />
                        ) : user?.profileImage ? (
                            <Image source={{ uri: user.profileImage }} style={styles.avatarImage} />
                        ) : (
                            <Text style={styles.avatarInitials}>{avatarInitials}</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editIconOverlay} onPress={handlePickImage}>
                        <Ionicons name="camera" size={14} color="#000" />
                    </TouchableOpacity>
                    <View style={[
                        styles.onlineIndicator, 
                        { backgroundColor: user?.isOnline ? '#4CAF50' : '#767577' }
                    ]} />
                </View>

                <Text style={styles.profileNameCentered}>{userName}</Text>
                <View style={styles.emailRow}>
                    <Text style={styles.profileEmailCentered}>{userEmail}</Text>
                </View>
            </Animated.View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Share & Earn</Text>
                <View style={styles.card}>
                    <MenuItem
                        icon="gift-outline"
                        title="Referral"
                        onPress={() => router.push('/(driver)/driver/referral')}
                        color={Colors.primary}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Vehicle & Documents</Text>
                <View style={styles.card}>
                    <MenuItem
                        icon="car-outline"
                        title="Vehicle Information"
                        onPress={() => router.push('/(driver)/driver/vehicle-info')}
                    />
                    {/* <View style={styles.divider} />
                    <MenuItem
                        icon="document-text-outline"
                        title="Documents"
                        onPress={() => router.push('/(driver)/driver/documents')}
                    /> */}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Settings</Text>
                <View style={styles.card}>
                    <MenuItem
                        icon="notifications-outline"
                        title="Notifications"
                        onPress={() => router.push('/(driver)/driver/notifications')}
                    />
                    <View style={styles.divider} />
                    <MenuItem
                        icon="document-text-outline"
                        title="Terms of Service"
                        onPress={() => router.push('/(driver)/driver/terms-of-service')}
                    />
                    <View style={styles.divider} />
                    <MenuItem
                        icon="shield-checkmark-outline"
                        title="Privacy Policy"
                        onPress={() => router.push('/(driver)/driver/privacy-policy')}
                    />
                    <View style={styles.divider} />
                    <MenuItem
                        icon="information-circle-outline"
                        title="About Us"
                        onPress={() => router.push('/(driver)/driver/about-us')}
                    />
                    <View style={styles.divider} />
                    <MenuItem
                        icon="key-outline"
                        title="Change Password"
                        onPress={() => router.push('/(driver)/driver/change-password')}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Support</Text>
                <View style={styles.card}>
                    <MenuItem
                        icon="help-circle-outline"
                        title="Help Center"
                        onPress={() => router.push('/(driver)/driver/help-center')}
                    />
                    <View style={styles.divider} />
                    <MenuItem
                        icon="chatbubble-ellipses-outline"
                        title="Contact Us"
                        onPress={() => router.push('/(driver)/driver/contact-us')}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <TouchableOpacity style={[styles.card, styles.logoutButton]} onPress={handleSignOut}>
                    <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.versionContainer}>
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
            <View style={{ height: 80 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingTop: 60,
    },
    watermarkContainer: {
        position: 'absolute',
        top: -40,
        right: -40,
        zIndex: -1,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        marginBottom: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.text,
    },
    profileHeaderSection: {
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        marginBottom: 16,
        position: 'relative',
    },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarInitials: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#000',
    },
    editIconOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 5,
        left: 5,
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 3,
        borderColor: '#fff',
    },
    profileNameCentered: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
        textAlign: 'center',
    },
    emailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileEmailCentered: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    section: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 12,
        marginLeft: 4,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: Colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: '#F5F5F5',
        marginLeft: 68,
    },
    logoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF3B30',
    },
    versionContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    versionText: {
        fontSize: 12,
        color: '#CCC',
    },
});

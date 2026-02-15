import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function AccountScreen() {
    const { user, signOut } = useAuth();
    const router = useRouter();

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

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <Text style={styles.title}>Account</Text>
            </View>

            <Animated.View
                entering={FadeInUp.delay(200).duration(800)}
                style={styles.profileSection}
            >
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons name="person" size={40} color="#fff" />
                        </View>
                        <View style={styles.onlineIndicator} />
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user?.name || 'Driver Name'}</Text>
                        <Text style={styles.profileEmail}>{user?.email || 'driver@example.com'}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => router.push('/(driver)/driver/edit-profile')}
                >
                    <Ionicons name="pencil" size={20} color={Colors.text} />
                </TouchableOpacity>
            </Animated.View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Vehicle & Documents</Text>
                <View style={styles.card}>
                    <MenuItem
                        icon="car-outline"
                        title="Vehicle Information"
                        onPress={() => router.push('/(driver)/driver/vehicle-info')}
                    />
                    <View style={styles.divider} />
                    <MenuItem
                        icon="document-text-outline"
                        title="Documents"
                        onPress={() => router.push('/(driver)/driver/documents')}
                    />
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
    header: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.text,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
        position: 'relative',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#4CAF50',
        borderWidth: 3,
        borderColor: '#f8f9fa',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: '#666',
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
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

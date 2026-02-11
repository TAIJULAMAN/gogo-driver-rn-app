import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

export default function AccountScreen() {
    const { user, signOut } = useAuth();

    const handleLogout = () => {
        signOut();
        router.replace('/(auth)/sign-in');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Account</Text>
            </View>

            <View style={styles.profileCard}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={40} color={Colors.white} />
                </View>
                <Text style={styles.name}>{user?.name || 'Driver Name'}</Text>
                <Text style={styles.phone}>{user?.phone || '+1 (555) 000-0000'}</Text>
            </View>

            <View style={styles.menuSection}>
                <MenuItem icon="person-outline" label="Edit Profile" onPress={() => { }} />
                <MenuItem icon="car-outline" label="Vehicle Information" onPress={() => { }} />
                <MenuItem icon="document-text-outline" label="Documents" onPress={() => { }} />
                <MenuItem icon="settings-outline" label="Settings" onPress={() => { }} />
                <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => { }} />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color={Colors.error} />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
}

function MenuItem({ icon, label, onPress }: MenuItemProps) {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.menuItemLeft}>
                <Ionicons name={icon} size={24} color={Colors.text} />
                <Text style={styles.menuItemText}>{label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={Colors.textLight} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        padding: 20,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    profileCard: {
        backgroundColor: Colors.white,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    phone: {
        fontSize: 14,
        color: Colors.textLight,
    },
    menuSection: {
        backgroundColor: Colors.white,
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    menuItemText: {
        fontSize: 16,
        color: Colors.text,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 40,
        backgroundColor: Colors.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.error,
        gap: 12,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.error,
    },
});

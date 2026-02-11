import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../../constants/Colors';

export default function DriverHomeScreen() {
    const [isOnline, setIsOnline] = useState(false);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Driver Dashboard</Text>
                <View style={styles.statusContainer}>
                    <Text style={styles.statusLabel}>{isOnline ? 'Online' : 'Offline'}</Text>
                    <Switch
                        value={isOnline}
                        onValueChange={setIsOnline}
                        trackColor={{ false: Colors.gray[300], true: Colors.primary }}
                        thumbColor={Colors.white}
                    />
                </View>
            </View>

            <View style={styles.mapPlaceholder}>
                <Text style={styles.mapText}>Map View</Text>
                <Text style={styles.mapSubtext}>Real-time location tracking</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>0</Text>
                    <Text style={styles.statLabel}>Today's Rides</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>$0</Text>
                    <Text style={styles.statLabel}>Today's Earnings</Text>
                </View>
            </View>
        </ScrollView>
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
        marginBottom: 16,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statusLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
    },
    mapPlaceholder: {
        height: 300,
        backgroundColor: Colors.gray[100],
        margin: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapText: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.textLight,
    },
    mapSubtext: {
        fontSize: 14,
        color: Colors.textLight,
        marginTop: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    statLabel: {
        fontSize: 14,
        color: Colors.textLight,
        marginTop: 8,
    },
});

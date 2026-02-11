import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function EarningsScreen() {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Earnings</Text>
            </View>

            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <Text style={styles.balanceAmount}>$0.00</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>Today</Text>
                    <Text style={styles.statValue}>$0.00</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>This Week</Text>
                    <Text style={styles.statValue}>$0.00</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statLabel}>This Month</Text>
                    <Text style={styles.statValue}>$0.00</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Transaction History</Text>
                <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No transactions yet</Text>
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
    },
    balanceCard: {
        margin: 20,
        padding: 24,
        backgroundColor: Colors.primary,
        borderRadius: 16,
        alignItems: 'center',
    },
    balanceLabel: {
        fontSize: 14,
        color: Colors.secondary,
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 40,
        fontWeight: 'bold',
        color: Colors.secondary,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textLight,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
    },
    section: {
        margin: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 16,
    },
    emptyState: {
        padding: 40,
        backgroundColor: Colors.white,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textLight,
    },
});

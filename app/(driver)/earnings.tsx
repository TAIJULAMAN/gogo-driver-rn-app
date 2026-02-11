import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { TransactionItem } from '../../components/TransactionItem';
import {
    mockEarnings,
    mockTransactions,
    mockDailyEarnings,
    mockDriverStats,
    formatCurrency
} from '../../utils/mockData';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 40;
const CHART_HEIGHT = 180;

export default function EarningsScreen() {
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
    const earnings = mockEarnings;
    const transactions = mockTransactions;
    const dailyEarnings = mockDailyEarnings;
    const stats = mockDriverStats;

    const maxEarning = Math.max(...dailyEarnings.map(d => d.amount));
    const barWidth = (CHART_WIDTH / dailyEarnings.length) - 8;

    const handleCashOut = () => {
        Alert.alert(
            'Cash Out',
            `Cash out ${formatCurrency(earnings.total)}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: () => Alert.alert('Success', 'Cash out request submitted!')
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Earnings</Text>
            </View>

            {/* Balance Card */}
            <View style={styles.balanceCard}>
                <View style={styles.balanceHeader}>
                    <View>
                        <Text style={styles.balanceLabel}>Available Balance</Text>
                        <Text style={styles.balanceAmount}>{formatCurrency(earnings.total)}</Text>
                    </View>
                    <TouchableOpacity style={styles.cashOutButton} onPress={handleCashOut}>
                        <Ionicons name="wallet" size={20} color={Colors.white} />
                        <Text style={styles.cashOutText}>Cash Out</Text>
                    </TouchableOpacity>
                </View>
                {earnings.pending > 0 && (
                    <View style={styles.pendingContainer}>
                        <Ionicons name="time" size={16} color={Colors.warning} />
                        <Text style={styles.pendingText}>
                            {formatCurrency(earnings.pending)} pending
                        </Text>
                    </View>
                )}
            </View>

            {/* Period Selector */}
            <View style={styles.periodSelector}>
                <TouchableOpacity
                    style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
                    onPress={() => setSelectedPeriod('week')}
                >
                    <Text style={[styles.periodText, selectedPeriod === 'week' && styles.periodTextActive]}>
                        This Week
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
                    onPress={() => setSelectedPeriod('month')}
                >
                    <Text style={[styles.periodText, selectedPeriod === 'month' && styles.periodTextActive]}>
                        This Month
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Earnings Chart */}
            <View style={styles.chartSection}>
                <Text style={styles.sectionTitle}>Earnings Trend</Text>
                <View style={styles.chart}>
                    <View style={styles.chartBars}>
                        {dailyEarnings.map((day, index) => {
                            const barHeight = (day.amount / maxEarning) * (CHART_HEIGHT - 40);
                            return (
                                <View key={index} style={styles.barContainer}>
                                    <View style={styles.barWrapper}>
                                        <Text style={styles.barAmount}>${day.amount.toFixed(0)}</Text>
                                        <View
                                            style={[
                                                styles.bar,
                                                {
                                                    height: barHeight,
                                                    width: barWidth,
                                                    backgroundColor: index === dailyEarnings.length - 1 ? Colors.primary : Colors.gray[300]
                                                }
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.barLabel}>
                                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Breakdown</Text>
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Today</Text>
                        <Text style={styles.statValue}>{formatCurrency(earnings.today)}</Text>
                        <Text style={styles.statSubtext}>{stats.todayRides} rides</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>This Week</Text>
                        <Text style={styles.statValue}>{formatCurrency(earnings.week)}</Text>
                        <Text style={styles.statSubtext}>
                            Avg: {formatCurrency(earnings.week / 7)}/day
                        </Text>
                    </View>
                </View>
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>This Month</Text>
                        <Text style={styles.statValue}>{formatCurrency(earnings.month)}</Text>
                        <Text style={styles.statSubtext}>
                            Avg: {formatCurrency(earnings.month / 30)}/day
                        </Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Avg/Ride</Text>
                        <Text style={styles.statValue}>
                            {formatCurrency(earnings.month / stats.totalRides)}
                        </Text>
                        <Text style={styles.statSubtext}>{stats.totalRides} total rides</Text>
                    </View>
                </View>
            </View>

            {/* Transaction History */}
            <View style={styles.transactionSection}>
                <View style={styles.transactionHeader}>
                    <Text style={styles.sectionTitle}>Transaction History</Text>
                    <TouchableOpacity onPress={() => Alert.alert('Filter', 'Filter options coming soon')}>
                        <Ionicons name="filter" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                </View>
                <View style={styles.transactionList}>
                    {transactions.map(transaction => (
                        <TransactionItem
                            key={transaction.id}
                            transaction={transaction}
                            onPress={() => Alert.alert('Transaction Details', `View details for ${transaction.id}`)}
                        />
                    ))}
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
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    balanceLabel: {
        fontSize: 14,
        color: Colors.secondary,
        marginBottom: 8,
        opacity: 0.8,
    },
    balanceAmount: {
        fontSize: 40,
        fontWeight: 'bold',
        color: Colors.secondary,
    },
    cashOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.secondary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        gap: 6,
    },
    cashOutText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    pendingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.secondary,
        opacity: 0.8,
    },
    pendingText: {
        fontSize: 14,
        color: Colors.secondary,
    },
    periodSelector: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 20,
    },
    periodButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
    },
    periodButtonActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    periodText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textLight,
    },
    periodTextActive: {
        color: Colors.secondary,
    },
    chartSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 16,
    },
    chart: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    chartBars: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: CHART_HEIGHT,
    },
    barContainer: {
        alignItems: 'center',
        flex: 1,
    },
    barWrapper: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
    },
    bar: {
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    barAmount: {
        fontSize: 10,
        color: Colors.textLight,
        marginBottom: 4,
    },
    barLabel: {
        fontSize: 10,
        color: Colors.textLight,
        marginTop: 8,
    },
    statsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 12,
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
        marginBottom: 4,
    },
    statSubtext: {
        fontSize: 10,
        color: Colors.textLight,
    },
    transactionSection: {
        marginBottom: 20,
    },
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    transactionList: {
        backgroundColor: Colors.white,
    },
});

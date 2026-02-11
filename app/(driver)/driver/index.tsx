import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../../constants/Colors';
import { StatCard } from '../../../components/StatCard';
import { RideCard } from '../../../components/RideCard';
import { DriverMapView } from '../../../components/DriverMapView';
import { RideCompletionModal } from '../../../components/RideCompletionModal';
import { mockActiveRide, mockDriverStats, formatCurrency } from '../../../utils/mockData';

export default function DriverHomeScreen() {
    const [isOnline, setIsOnline] = useState(false);
    const [hasActiveRide, setHasActiveRide] = useState(true);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const stats = mockDriverStats;

    // Mock driver location (in real app, use GPS)
    const driverLocation = {
        address: 'Current Location',
        latitude: 40.7580,
        longitude: -73.9855,
    };

    const handleToggleOnline = (value: boolean) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsOnline(value);
        Alert.alert(
            value ? 'You are now Online' : 'You are now Offline',
            value ? 'You can now receive ride requests' : 'You will not receive ride requests'
        );
    };

    const handleCompleteRide = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowCompletionModal(true);
        setHasActiveRide(false);
    };

    const handleNavigate = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert('Navigate', 'Opening navigation to destination...');
    };

    const handleContact = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert('Contact Passenger', `Call ${mockActiveRide.passenger.phone}?`);
    };

    const handleRatePassenger = () => {
        setShowCompletionModal(false);
        Alert.alert('Rate Passenger', 'Rating screen would open here');
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header with Avatar */}
            <Animated.View
                entering={FadeInUp.duration(600)}
                style={styles.header}
            >
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons name="person" size={24} color={Colors.white} />
                        </View>
                        {isOnline && <View style={styles.onlineIndicator} />}
                    </View>
                    <View>
                        <Text style={styles.greeting}>Welcome back!</Text>
                        <Text style={styles.title}>Driver Dashboard</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.push('/(driver)/account');
                        }}
                    >
                        <Ionicons name="notifications-outline" size={24} color={Colors.text} />
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Online/Offline Toggle */}
            <Animated.View
                entering={FadeInDown.delay(200).duration(600)}
                style={styles.statusCard}
            >
                <View style={styles.statusContainer}>
                    <View>
                        <Text style={styles.statusLabel}>Status</Text>
                        <Text style={[styles.statusValue, { color: isOnline ? Colors.success : Colors.textLight }]}>
                            {isOnline ? 'Online' : 'Offline'}
                        </Text>
                    </View>
                    <Switch
                        value={isOnline}
                        onValueChange={handleToggleOnline}
                        trackColor={{ false: Colors.gray[300], true: Colors.primary }}
                        thumbColor={Colors.white}
                    />
                </View>
            </Animated.View>

            {/* Map View */}
            <Animated.View
                entering={FadeInDown.delay(300).duration(600)}
                style={styles.mapContainer}
            >
                <DriverMapView
                    driverLocation={driverLocation}
                    pickup={hasActiveRide && isOnline ? mockActiveRide.pickup : undefined}
                    dropoff={hasActiveRide && isOnline ? mockActiveRide.dropoff : undefined}
                    showRoute={hasActiveRide && isOnline}
                />
            </Animated.View>

            {/* Active Ride Card */}
            {isOnline && hasActiveRide && (
                <Animated.View
                    entering={FadeInDown.delay(400).duration(600)}
                    style={styles.section}
                >
                    <Text style={styles.sectionTitle}>Active Ride</Text>
                    <RideCard ride={mockActiveRide} />
                    <View style={styles.rideActions}>
                        <TouchableOpacity style={styles.actionBtn} onPress={handleNavigate}>
                            <Ionicons name="navigate" size={20} color={Colors.white} />
                            <Text style={styles.actionBtnText}>Navigate</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn} onPress={handleContact}>
                            <Ionicons name="call" size={20} color={Colors.white} />
                            <Text style={styles.actionBtnText}>Contact</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.completeBtn]}
                            onPress={handleCompleteRide}
                        >
                            <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
                            <Text style={styles.actionBtnText}>Complete</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}

            {/* Stats Section */}
            <Animated.View
                entering={FadeInDown.delay(500).duration(600)}
                style={styles.section}
            >
                <Text style={styles.sectionTitle}>Today's Performance</Text>
                <View style={styles.statsGrid}>
                    <StatCard
                        icon="car"
                        label="Rides"
                        value={stats.todayRides}
                        iconColor={Colors.primary}
                    />
                    <StatCard
                        icon="cash"
                        label="Earnings"
                        value={formatCurrency(stats.todayEarnings)}
                        iconColor={Colors.success}
                    />
                </View>
                <View style={styles.statsGrid}>
                    <StatCard
                        icon="time"
                        label="Hours Online"
                        value={`${stats.hoursOnline}h`}
                        iconColor={Colors.warning}
                    />
                    <StatCard
                        icon="star"
                        label="Rating"
                        value={stats.averageRating.toFixed(1)}
                        iconColor={Colors.warning}
                    />
                </View>
            </Animated.View>

            {/* Quick Actions */}
            <Animated.View
                entering={FadeInDown.delay(600).duration(600)}
                style={styles.section}
            >
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.quickActions}>
                    <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.push('/(driver)/earnings');
                        }}
                    >
                        <View style={[styles.quickActionIcon, { backgroundColor: `${Colors.success}20` }]}>
                            <Ionicons name="wallet" size={24} color={Colors.success} />
                        </View>
                        <Text style={styles.quickActionText}>View Earnings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.push('/(driver)/rides');
                        }}
                    >
                        <View style={[styles.quickActionIcon, { backgroundColor: `${Colors.primary}20` }]}>
                            <Ionicons name="list" size={24} color={Colors.primary} />
                        </View>
                        <Text style={styles.quickActionText}>Ride History</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            Alert.alert('Help', 'Contact support at support@gogo.com');
                        }}
                    >
                        <View style={[styles.quickActionIcon, { backgroundColor: `${Colors.warning}20` }]}>
                            <Ionicons name="help-circle" size={24} color={Colors.warning} />
                        </View>
                        <Text style={styles.quickActionText}>Help</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.quickAction}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.push('/(driver)/account');
                        }}
                    >
                        <View style={[styles.quickActionIcon, { backgroundColor: `${Colors.secondary}20` }]}>
                            <Ionicons name="settings" size={24} color={Colors.secondary} />
                        </View>
                        <Text style={styles.quickActionText}>Settings</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>

            {/* Overall Stats */}
            <Animated.View
                entering={FadeInDown.delay(700).duration(600)}
                style={styles.section}
            >
                <Text style={styles.sectionTitle}>Overall Statistics</Text>
                <View style={styles.overallStats}>
                    <View style={styles.statRow}>
                        <Text style={styles.statRowLabel}>Total Rides</Text>
                        <Text style={styles.statRowValue}>{stats.totalRides}</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statRowLabel}>Acceptance Rate</Text>
                        <Text style={styles.statRowValue}>{stats.acceptanceRate}%</Text>
                    </View>
                    <View style={styles.statRow}>
                        <Text style={styles.statRowLabel}>Average Rating</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={16} color={Colors.warning} />
                            <Text style={styles.statRowValue}>{stats.averageRating.toFixed(1)}</Text>
                        </View>
                    </View>
                </View>
            </Animated.View>

            {/* Ride Completion Modal */}
            <RideCompletionModal
                visible={showCompletionModal}
                onClose={() => setShowCompletionModal(false)}
                onRate={handleRatePassenger}
                fare={mockActiveRide.fare}
                tip={5.00}
            />
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
        paddingTop: 60,
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: Colors.success,
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    greeting: {
        fontSize: 14,
        color: Colors.secondary,
        marginBottom: 4,
        opacity: 0.8,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: Colors.secondary,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.error,
    },
    statusCard: {
        margin: 20,
        marginTop: -30,
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusLabel: {
        fontSize: 14,
        color: Colors.textLight,
        marginBottom: 4,
    },
    statusValue: {
        fontSize: 18,
        fontWeight: '700',
    },
    mapContainer: {
        height: 300,
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    section: {
        padding: 20,
        paddingTop: 0,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 16,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    rideActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    actionBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 6,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    completeBtn: {
        backgroundColor: Colors.success,
        shadowColor: Colors.success,
    },
    actionBtnText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '700',
    },
    quickActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    quickAction: {
        width: '48%',
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    quickActionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    quickActionText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.text,
        textAlign: 'center',
    },
    overallStats: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    statRowLabel: {
        fontSize: 14,
        color: Colors.textLight,
    },
    statRowValue: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
});

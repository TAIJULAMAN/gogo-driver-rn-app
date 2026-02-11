import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/Colors';
import { RideCard } from '../../components/RideCard';
import { mockPendingRides, mockActiveRide, mockCompletedRides } from '../../utils/mockData';
import { Ride } from '../../types';

type TabType = 'pending' | 'active' | 'completed';

export default function RidesScreen() {
    const [activeTab, setActiveTab] = useState<TabType>('pending');
    const [pendingRides, setPendingRides] = useState<Ride[]>(mockPendingRides);
    const [activeRides, setActiveRides] = useState<Ride[]>([mockActiveRide]);
    const [completedRides, setCompletedRides] = useState<Ride[]>(mockCompletedRides);
    const [refreshing, setRefreshing] = useState(false);

    const handleTabChange = (tab: TabType) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setActiveTab(tab);
    };

    const handleAccept = (rideId: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const ride = pendingRides.find(r => r.id === rideId);
        if (ride) {
            setPendingRides(prev => prev.filter(r => r.id !== rideId));
            setActiveRides(prev => [...prev, { ...ride, status: 'active' }]);
            Alert.alert('Success', 'Ride accepted!');
        }
    };

    const handleReject = (rideId: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
            'Reject Ride',
            'Are you sure you want to reject this ride?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reject',
                    style: 'destructive',
                    onPress: () => {
                        setPendingRides(prev => prev.filter(r => r.id !== rideId));
                    }
                }
            ]
        );
    };

    const handleComplete = (rideId: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
            'Complete Ride',
            'Mark this ride as completed?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Complete',
                    onPress: () => {
                        const ride = activeRides.find(r => r.id === rideId);
                        if (ride) {
                            setActiveRides(prev => prev.filter(r => r.id !== rideId));
                            setCompletedRides(prev => [{ ...ride, status: 'completed' }, ...prev]);
                            Alert.alert('Success', 'Ride completed!');
                        }
                    }
                }
            ]
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            Alert.alert('Refreshed', 'Ride list updated');
        }, 1000);
    };

    const getRideCount = (tab: TabType) => {
        switch (tab) {
            case 'pending': return pendingRides.length;
            case 'active': return activeRides.length;
            case 'completed': return completedRides.length;
        }
    };

    const renderRides = () => {
        let rides: Ride[] = [];
        switch (activeTab) {
            case 'pending': rides = pendingRides; break;
            case 'active': rides = activeRides; break;
            case 'completed': rides = completedRides; break;
        }

        if (rides.length === 0) {
            return (
                <Animated.View
                    entering={FadeInDown.duration(400)}
                    style={styles.emptyState}
                >
                    <Ionicons
                        name={activeTab === 'pending' ? 'time-outline' : activeTab === 'active' ? 'car-outline' : 'checkmark-circle-outline'}
                        size={64}
                        color={Colors.gray[300]}
                    />
                    <Text style={styles.emptyTitle}>
                        {activeTab === 'pending' && 'No Pending Rides'}
                        {activeTab === 'active' && 'No Active Rides'}
                        {activeTab === 'completed' && 'No Completed Rides'}
                    </Text>
                    <Text style={styles.emptyText}>
                        {activeTab === 'pending' && 'New ride requests will appear here'}
                        {activeTab === 'active' && 'Accept a ride to see it here'}
                        {activeTab === 'completed' && 'Your completed rides will show here'}
                    </Text>
                </Animated.View>
            );
        }

        return rides.map((ride, index) => (
            <Animated.View
                key={ride.id}
                entering={FadeInDown.delay(index * 100).duration(500)}
            >
                <RideCard
                    ride={ride}
                    onAccept={activeTab === 'pending' ? () => handleAccept(ride.id) : undefined}
                    onReject={activeTab === 'pending' ? () => handleReject(ride.id) : undefined}
                    onComplete={activeTab === 'active' ? () => handleComplete(ride.id) : undefined}
                    onPress={() => Alert.alert('Ride Details', `View details for ride ${ride.id}`)}
                />
            </Animated.View>
        ));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <Animated.View
                entering={FadeInDown.duration(400)}
                style={styles.header}
            >
                <Text style={styles.title}>My Rides</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{getRideCount(activeTab)}</Text>
                </View>
            </Animated.View>

            {/* Tabs */}
            <Animated.View
                entering={FadeInDown.delay(100).duration(400)}
                style={styles.tabs}
            >
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
                    onPress={() => handleTabChange('pending')}
                >
                    <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
                        Pending
                    </Text>
                    {pendingRides.length > 0 && (
                        <View style={styles.tabBadge}>
                            <Text style={styles.tabBadgeText}>{pendingRides.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'active' && styles.activeTab]}
                    onPress={() => handleTabChange('active')}
                >
                    <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
                        Active
                    </Text>
                    {activeRides.length > 0 && (
                        <View style={styles.tabBadge}>
                            <Text style={styles.tabBadgeText}>{activeRides.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
                    onPress={() => handleTabChange('completed')}
                >
                    <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
                        Completed
                    </Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Rides List */}
            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.primary}
                    />
                }
            >
                {renderRides()}
            </ScrollView>
        </View>
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
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    badge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.secondary,
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: Colors.gray[50],
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    activeTab: {
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textLight,
    },
    activeTabText: {
        color: Colors.secondary,
        fontWeight: '700',
    },
    tabBadge: {
        backgroundColor: Colors.error,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        minWidth: 20,
        alignItems: 'center',
    },
    tabBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.white,
    },
    content: {
        flex: 1,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.textLight,
        textAlign: 'center',
    },
});

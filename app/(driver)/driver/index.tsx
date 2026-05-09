import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import { Colors } from "../../../constants/Colors";
import { StatCard } from "../../../components/StatCard";
import { RideCard } from "../../../components/RideCard";
import { RideCompletionModal } from "../../../components/RideCompletionModal";
import { formatCurrency } from "../../../utils/mockData";
import {
  useGetDriverProfileQuery,
  useUpdateDriverProfileMutation,
  useGetActiveRidesQuery,
  useCompleteRideMutation,
  useUpdateLocationMutation,
  useGetDailyStatsQuery,
  useGetNotificationsQuery,
} from "../../../Redux/api/driverApi";

export default function DriverHomeScreen() {
  const {
    data: profileData,
    isLoading: isProfileLoading,
    refetch: refetchProfile,
  } = useGetDriverProfileQuery({});
  const {
    data: ridesData,
    isLoading: isRidesLoading,
    refetch: refetchRides,
  } = useGetActiveRidesQuery({});
  const { data: statsData, refetch: refetchStats } = useGetDailyStatsQuery({});
  const { data: notificationsData, refetch: refetchNotifications } = useGetNotificationsQuery({});
  const [updateStatus] = useUpdateDriverProfileMutation();
  const [updateLocation] = useUpdateLocationMutation();
  const [completeRide] = useCompleteRideMutation();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchProfile(), refetchRides(), refetchStats(), refetchNotifications()]);
    setRefreshing(false);
  }, [refetchProfile, refetchRides, refetchStats, refetchNotifications]);

  const user = profileData?.data;
  const activeRide = ridesData?.data?.[0]; // Get the first active ride
  const stats = statsData?.data || {
    todayRides: 0,
    todayEarnings: 0,
    hoursOnline: 0,
    averageRating: 0,
    totalRides: 0,
    acceptanceRate: 100,
  };

  const notifications = notificationsData?.data || [];
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [isOnline, setIsOnline] = useState(
    user?.status === "Approved" || user?.isOnline,
  );
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Sync local online state with profile data
  useEffect(() => {
    if (user) {
      setIsOnline(user.isOnline);
    }
  }, [user]);

  // Handle Location Updates
  useEffect(() => {
    let locationInterval: NodeJS.Timeout;

    const startTracking = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use the map.",
        );
        return;
      }

      // 1. Get initial location immediately
      try {
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setCurrentLocation(initialLocation);
        
        // Push to backend only if online
        if (isOnline) {
           await updateLocation({
            latitude: initialLocation.coords.latitude,
            longitude: initialLocation.coords.longitude,
          }).unwrap();
        }
      } catch (error) {
        console.error("Initial location fetch failed:", error);
      }

      // 2. Set up periodic updates
      locationInterval = setInterval(async () => {
        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });
          setCurrentLocation(location);

          // Push to backend only if online
          if (isOnline) {
            await updateLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }).unwrap();
          }
        } catch (error) {
          console.error("Periodic location update failed:", error);
        }
      }, 10000); // Update every 10 seconds
    };

    startTracking();

    return () => {
      if (locationInterval) clearInterval(locationInterval);
    };
  }, [isOnline]); // Re-run when online status changes to trigger immediate sync

  const handleToggleOnline = async () => {
    const newStatus = !isOnline;
    
    // 1. Optimistic Update: Change UI immediately
    setIsOnline(newStatus);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // 2. Perform API call in background
      await updateStatus({ isOnline: newStatus }).unwrap();
    } catch (error) {
      // 3. Rollback: If API fails, revert the switch
      setIsOnline(!newStatus);
      Alert.alert(
        "Error",
        "Failed to update your status. Please check your connection."
      );
      console.error("Status update failed:", error);
    }
  };

  const handleCompleteRide = async () => {
    if (!activeRide?._id) return;

    try {
      await completeRide(activeRide._id).unwrap();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowCompletionModal(true);
    } catch (error) {
      Alert.alert("Error", "Failed to complete ride");
    }
  };

  const handleNavigate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Navigate", "Opening navigation to destination...");
  };

  const handleContact = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (activeRide?.user?.phoneNumber) {
      Alert.alert("Contact Passenger", `Call ${activeRide.user.phoneNumber}?`);
    }
  };

  const handleRatePassenger = () => {
    setShowCompletionModal(false);
    Alert.alert("Rate Passenger", "Rating screen would open here");
  };

  if (isProfileLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Colors.primary]}
        />
      }
    >
      {/* Header with Avatar */}
      <Animated.View entering={FadeInUp.duration(600)} style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            {user?.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={styles.avatarPlaceholder}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={24} color={Colors.white} />
              </View>
            )}
            {isOnline && <View style={styles.onlineIndicator} />}
          </View>
          <View>
            <Text style={styles.greeting}>
              Welcome back, {user?.firstName}!
            </Text>
            <View style={styles.statusRow}>
              <Text style={styles.title}>
                {isOnline ? "Online" : "Offline"}
              </Text>
              <Switch
                value={isOnline}
                onValueChange={handleToggleOnline}
                trackColor={{ false: "#767577", true: Colors.success }}
                thumbColor={Colors.white}
              />
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(driver)/notifications");
            }}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={Colors.text}
            />
            {unreadCount > 0 && <View style={styles.notificationBadge} />}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Map View */}
      <Animated.View
        entering={FadeInDown.delay(300).duration(600)}
        style={styles.mapContainer}
      >
        {currentLocation ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFill}
            customMapStyle={lightMapStyle}
            initialRegion={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            region={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              }}
              title="You are here"
            >
               <Ionicons name="car" size={32} color={Colors.primary} />
            </Marker>
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.mapPlaceholderText}>Locating...</Text>
          </View>
        )}
      </Animated.View>

      {/* Active Ride Card */}
      {isOnline && activeRide && (
        <Animated.View
          entering={FadeInDown.delay(400).duration(600)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Active Ride</Text>
          <RideCard ride={activeRide} />
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
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={Colors.white}
              />
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
              router.push("/(driver)/earnings");
            }}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: `${Colors.success}20` },
              ]}
            >
              <Ionicons name="wallet" size={24} color={Colors.success} />
            </View>
            <Text style={styles.quickActionText}>View Earnings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(driver)/rides");
            }}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: `${Colors.primary}20` },
              ]}
            >
              <Ionicons name="list" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Ride History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert("Help", "Contact support at support@gogo.com");
            }}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: `${Colors.warning}20` },
              ]}
            >
              <Ionicons name="help-circle" size={24} color={Colors.warning} />
            </View>
            <Text style={styles.quickActionText}>Help</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/(driver)/account");
            }}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: `${Colors.secondary}20` },
              ]}
            >
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
              <Text style={styles.statRowValue}>
                {stats.averageRating.toFixed(1)}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>

      <RideCompletionModal
        visible={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        onRate={handleRatePassenger}
        fare={activeRide?.price || 0}
        tip={0}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },
  onlineIndicator: {
    position: "absolute",
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
    fontWeight: "800",
    color: Colors.secondary,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  mapContainer: {
    height: 300,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: Colors.gray[100],
    alignItems: "center",
    justifyContent: "center",
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textLight,
    marginTop: 12,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  rideActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "700",
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickAction: {
    width: "48%",
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },
  overallStats: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontWeight: "700",
    color: Colors.text,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});

const lightMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#bdbdbd" }]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{ "color": "#eeeeee" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#e5e5e5" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#ffffff" }]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#dadada" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [{ "color": "#e5e5e5" }]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [{ "color": "#eeeeee" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#c9c9c9" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  }
];

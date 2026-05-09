import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { RideCard } from "../../components/RideCard";
import { Colors } from "../../constants/Colors";
import {
  useAcceptRideMutation,
  useCompleteRideMutation,
  useGetRiderRidesQuery,
} from "../../Redux/api/driverApi";
import { useAppSelector } from "../../Redux/hooks";
import { Ride } from "../../types";

type TabType = "pending" | "active" | "completed";
type BackendRide = Ride & {
  backendStatus?:
    | "Pending"
    | "Accepted"
    | "ArrivedPickup"
    | "InProgress"
    | "Completed"
    | "Cancelled";
};

const getOrders = (payload: any) => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

const formatErrorMessage = (error: any): string => {
  if (typeof error === "string") return error;
  const message =
    error?.data?.message || error?.message || "An unexpected error occurred";
  if (Array.isArray(message)) {
    return message
      .map((m) => (typeof m === "string" ? m : m.message))
      .join(", ");
  }
  return String(message);
};

const getUserName = (user: any) => {
  const fullName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  return fullName || user?.name || "Customer";
};

const getAddress = (point: any) => {
  return point?.label || point?.addressLine || "Unknown location";
};

const mapOrderToRide = (order: any): BackendRide => {
  const status =
    order.status === "Pending"
      ? "pending"
      : order.status === "Completed"
        ? "completed"
        : "active";

  return {
    id: String(order._id || order.id),
    passenger: {
      id: String(order.user?._id || order.user || ""),
      name: getUserName(order.user),
      phone: order.user?.phoneNumber || "",
      rating: order.review?.rating || 5,
    },
    pickup: {
      address: getAddress(order.pickup),
      latitude: order.pickup?.latitude || 0,
      longitude: order.pickup?.longitude || 0,
    },
    dropoff: {
      address: getAddress(order.dropoff),
      latitude: order.dropoff?.latitude || 0,
      longitude: order.dropoff?.longitude || 0,
    },
    status,
    fare: Number(order.price || 0),
    distance: Number(order.distanceKm || 0),
    duration: 0,
    requestedAt: order.createdAt ? new Date(order.createdAt) : new Date(),
    startedAt: order.tripStartedAt ? new Date(order.tripStartedAt) : undefined,
    completedAt: order.completedAt ? new Date(order.completedAt) : undefined,
    rating: order.review?.rating,
    backendStatus: order.status,
  };
};

export default function RidesScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  console.log("RidesScreen - current user:", user);

  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [rejectedRideIds, setRejectedRideIds] = useState<string[]>([]);
  const [acceptingRideId, setAcceptingRideId] = useState<string | null>(null);

  const pendingQuery = useGetRiderRidesQuery({ scope: "available" });
  const acceptedQuery = useGetRiderRidesQuery({ status: "Accepted" });
  const arrivedQuery = useGetRiderRidesQuery({ status: "ArrivedPickup" });
  const inProgressQuery = useGetRiderRidesQuery({ status: "InProgress" });
  const completedQuery = useGetRiderRidesQuery({ status: "Completed" });
  const [acceptRide] = useAcceptRideMutation();
  const [completeRide, { isLoading: isCompleting }] = useCompleteRideMutation();

  const pendingRides = useMemo(
    () =>
      getOrders(pendingQuery.data)
        .map(mapOrderToRide)
        .filter((ride: BackendRide) => !rejectedRideIds.includes(ride.id)),
    [pendingQuery.data, rejectedRideIds],
  );
  const activeRides = useMemo(
    () =>
      [
        ...getOrders(acceptedQuery.data),
        ...getOrders(arrivedQuery.data),
        ...getOrders(inProgressQuery.data),
      ].map(mapOrderToRide),
    [acceptedQuery.data, arrivedQuery.data, inProgressQuery.data],
  );
  const completedRides = useMemo(
    () => getOrders(completedQuery.data).map(mapOrderToRide),
    [completedQuery.data],
  );

  const isLoading =
    pendingQuery.isLoading ||
    acceptedQuery.isLoading ||
    arrivedQuery.isLoading ||
    inProgressQuery.isLoading ||
    completedQuery.isLoading;
  const isRefreshing =
    pendingQuery.isFetching ||
    acceptedQuery.isFetching ||
    arrivedQuery.isFetching ||
    inProgressQuery.isFetching ||
    completedQuery.isFetching;

  const handleTabChange = (tab: TabType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveTab(tab);
  };

  const handleAccept = async (rideId: string) => {
    setAcceptingRideId(rideId);
    
    try {
      await acceptRide(rideId).unwrap();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setRejectedRideIds((prev) => prev.filter((id) => id !== rideId));
      setActiveTab("active");
      Alert.alert("Success", "Ride accepted!");
    } catch (error: any) {
      console.error("Error accepting ride:", error.data?.message);

      Alert.alert("Error", formatErrorMessage(error));
    } finally {
      setAcceptingRideId(null);
    }
  };

  const handleReject = (rideId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("Reject Ride", "Hide this ride from your pending list?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: () => {
          setRejectedRideIds((prev) => [...new Set([...prev, rideId])]);
        },
      },
    ]);
  };

  const handleComplete = (ride: BackendRide) => {
    if (ride.backendStatus !== "InProgress") {
      Alert.alert(
        "Ride Not Started",
        "Only rides that are in progress can be completed.",
      );
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Complete Ride", "Mark this ride as completed?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Complete",
        onPress: async () => {
          try {
            await completeRide(ride.id).unwrap();
            Alert.alert("Success", "Ride completed!");
          } catch (error: any) {
            Alert.alert("Error", formatErrorMessage(error));
          }
        },
      },
    ]);
  };

  const onRefresh = async () => {
    await Promise.all([
      pendingQuery.refetch(),
      acceptedQuery.refetch(),
      arrivedQuery.refetch(),
      inProgressQuery.refetch(),
      completedQuery.refetch(),
    ]);
  };

  const getRideCount = (tab: TabType) => {
    switch (tab) {
      case "pending":
        return pendingRides.length;
      case "active":
        return activeRides.length;
      case "completed":
        return completedRides.length;
    }
  };

  const renderRides = () => {
    let rides: BackendRide[] = [];
    switch (activeTab) {
      case "pending":
        rides = pendingRides;
        break;
      case "active":
        rides = activeRides;
        break;
      case "completed":
        rides = completedRides;
        break;
    }

    if (isLoading) {
      return (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    if (rides.length === 0) {
      return (
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.emptyState}
        >
          <Ionicons
            name={
              activeTab === "pending"
                ? "time-outline"
                : activeTab === "active"
                  ? "car-outline"
                  : "checkmark-circle-outline"
            }
            size={64}
            color={Colors.gray[300]}
          />
          <Text style={styles.emptyTitle}>
            {activeTab === "pending" && "No Pending Rides"}
            {activeTab === "active" && "No Active Rides"}
            {activeTab === "completed" && "No Completed Rides"}
          </Text>
          <Text style={styles.emptyText}>
            {activeTab === "pending" && "New ride requests will appear here"}
            {activeTab === "active" && "Accept a ride to see it here"}
            {activeTab === "completed" && "Your completed rides will show here"}
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
          onAccept={
            activeTab === "pending" && !acceptingRideId
              ? () => handleAccept(ride.id)
              : undefined
          }
          isAccepting={acceptingRideId === ride.id}
          onReject={
            activeTab === "pending" ? () => handleReject(ride.id) : undefined
          }
          onComplete={
            activeTab === "active" &&
            ride.backendStatus === "InProgress" &&
            !isCompleting
              ? () => handleComplete(ride)
              : undefined
          }
          onPress={() =>
            router.push({ pathname: "/(screens)/driver/ride-details", params: { id: ride.id } })
          }
        />
      </Animated.View>
    ));
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Text style={styles.title}>My Rides</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{getRideCount(activeTab)}</Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        style={styles.tabs}
      >
        <TouchableOpacity
          style={[styles.tab, activeTab === "pending" && styles.activeTab]}
          onPress={() => handleTabChange("pending")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "pending" && styles.activeTabText,
            ]}
          >
            Pending
          </Text>
          {pendingRides.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{pendingRides.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "active" && styles.activeTab]}
          onPress={() => handleTabChange("active")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "active" && styles.activeTabText,
            ]}
          >
            Active
          </Text>
          {activeRides.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{activeRides.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "completed" && styles.activeTab]}
          onPress={() => handleTabChange("completed")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "completed" && styles.activeTabText,
            ]}
          >
            Completed
          </Text>
          {completedRides.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{completedRides.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
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
    fontWeight: "700",
    color: Colors.secondary,
  },
  tabs: {
    flexDirection: "row",
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
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
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
    fontWeight: "600",
    color: Colors.textLight,
  },
  activeTabText: {
    color: Colors.secondary,
    fontWeight: "700",
  },
  tabBadge: {
    backgroundColor: Colors.error,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    alignItems: "center",
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  loadingState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: "center",
  },
});

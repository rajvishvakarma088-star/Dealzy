import React, { useState, useCallback } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { syncOfflineVisits } from "../src/utils/syncVisits";

import {
  Card,
  Text,
  FAB,
  Avatar,
  ActivityIndicator,
  Appbar,
  Chip,
  useTheme,
  Button
} from "react-native-paper";

import { Swipeable } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";

import { useRouter, useFocusEffect } from "expo-router";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc
} from "firebase/firestore";

import { db } from "../src/services/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Visit = {
  id: string;
  customerName?: string;
  visitDate?: string;
  aiSummary?: string;
  syncStatus?: string;
};

export default function VisitList() {

  const router = useRouter();
  const { colors, dark } = useTheme();

  const textColor = dark ? "#FFFFFF" : "#111827";
  const secondaryText = dark ? "#9CA3AF" : "#6B7280";
  const cardColor = dark ? "#1E1E1E" : "#FFFFFF";
  const avatarColor = dark ? "#5B8DBF" : "#1C3A7A";

  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");

  useFocusEffect(
    useCallback(() => {
      fetchVisits();
    }, [])
  );

  /* FETCH VISITS */

  const fetchVisits = async () => {

    try {

      await syncOfflineVisits();

      const querySnapshot = await getDocs(collection(db, "visits"));

      const firebaseVisits: Visit[] = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Visit, "id">)
      }));

      const offlineData = await AsyncStorage.getItem("offlineVisits");
      const offlineVisits: Visit[] = offlineData ? JSON.parse(offlineData) : [];

      setVisits([...firebaseVisits, ...offlineVisits]);

    } catch (error) {

      console.log("Error loading visits:", error);

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchVisits();
  };

  /* DELETE VISIT */

  const deleteVisit = async (id: string) => {

    try {

      await deleteDoc(doc(db, "visits", id));

      setVisits((prev) => prev.filter(v => v.id !== id));

    } catch (error) {

      console.log("Delete error:", error);

    }

  };

  /* RETRY SYNC */

  const retrySync = async (visit: Visit) => {

    try {

      await addDoc(collection(db, "visits"), {
        ...visit,
        syncStatus: "synced"
      });

      setVisits((prev) =>
        prev.map(v =>
          v.id === visit.id ? { ...v, syncStatus: "synced" } : v
        )
      );

    } catch (error) {

      console.log("Retry sync failed:", error);

    }

  };

  /* FILTER */

  const filteredVisits =
    filter === "all"
      ? visits
      : filter === "synced"
      ? visits.filter(v => v.syncStatus === "synced")
      : visits.filter(v => v.syncStatus !== "synced");

  /* RENDER ITEM */

  const renderItem = ({ item }: { item: Visit }) => {

    const statusColor =
      item.syncStatus === "synced"
        ? "#22C55E"
        : item.syncStatus === "syncing"
        ? "#F59E0B"
        : "#EF4444";

    const renderRightActions = () => (
      <View style={styles.deleteBox}>
        <MaterialIcons name="delete" size={26} color="white" />
      </View>
    );

    return (

      <Swipeable
        renderRightActions={renderRightActions}
        onSwipeableOpen={() => deleteVisit(item.id)}
      >

        <Card
          style={[styles.card, { backgroundColor: cardColor }]}
          onPress={() => router.push(`/visitdetail?id=${item.id}`)}
        >

          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />

          <Card.Content style={styles.cardContent}>

            <Avatar.Icon
              size={46}
              icon="account"
              style={[styles.avatar, { backgroundColor: avatarColor }]}
            />

            <View style={styles.info}>

              <Text style={[styles.customer, { color: textColor }]}>
                {item.customerName || "Unknown Customer"}
              </Text>

              <Text style={[styles.date, { color: secondaryText }]}>
                {item.visitDate || ""}
              </Text>

              <Text
                numberOfLines={2}
                style={[styles.summary, { color: secondaryText }]}
              >
                {item.aiSummary || "No summary available"}
              </Text>

              {item.syncStatus !== "synced" && (

                <Button
                  mode="outlined"
                  compact
                  style={{ marginTop:8 }}
                  onPress={() => retrySync(item)}
                >
                  Retry Sync
                </Button>

              )}

            </View>

          </Card.Content>

        </Card>

      </Swipeable>

    );

  };

  /* LOADER */

  if (loading) {

    return (
      <View style={[styles.loader, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );

  }

  return (

    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <Appbar.Header style={styles.appbar}>

        <View style={styles.headerText}>
          <Text style={styles.logo}>Dealzy</Text>
          <Text style={styles.subtitle}>Sales Visit Dashboard</Text>
        </View>

        <View style={{ flex: 1 }} />

        <Appbar.Action
          icon="account-circle"
          iconColor="white"
          onPress={() => router.push("/profile")}
        />

      </Appbar.Header>

      <View style={styles.filterRow}>

        <Chip selected={filter === "all"} onPress={() => setFilter("all")}>
          All
        </Chip>

        <Chip selected={filter === "synced"} onPress={() => setFilter("synced")}>
          Synced
        </Chip>

        <Chip selected={filter === "pending"} onPress={() => setFilter("pending")}>
          Pending
        </Chip>

      </View>

      {filteredVisits.length === 0 ? (

        <View style={styles.empty}>
          <Text variant="titleMedium">No visits yet</Text>
          <Text>Add your first customer visit</Text>
        </View>

      ) : (

        <FlatList
          data={filteredVisits}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

      )}

      <FAB
        icon="plus"
        label="Add Visit"
        style={styles.fab}
        onPress={() => router.push("/addvisit")}
      />

    </View>

  );

}

const styles = StyleSheet.create({

  container:{
    flex:1
  },

  appbar:{
    backgroundColor:"#1C3A7A"
  },

  headerText:{
    marginLeft:12
  },

  logo:{
    color:"white",
    fontSize:20,
    fontWeight:"bold"
  },

  subtitle:{
    color:"white",
    fontSize:12,
    opacity:0.85
  },

  filterRow:{
    flexDirection:"row",
    justifyContent:"space-evenly",
    paddingVertical:12
  },

  card:{
    marginBottom:14,
    borderRadius:18,
    elevation:4
  },

  cardContent:{
    flexDirection:"row"
  },

  avatar:{
    marginRight:14
  },

  info:{
    flex:1
  },

  customer:{
    fontSize:16,
    fontWeight:"bold"
  },

  date:{
    fontSize:12,
    marginBottom:6
  },

  summary:{
    fontSize:13
  },

  statusDot:{
    position:"absolute",
    top:12,
    right:12,
    width:10,
    height:10,
    borderRadius:6
  },

  deleteBox:{
    backgroundColor:"#EF4444",
    justifyContent:"center",
    alignItems:"center",
    width:80,
    borderRadius:14,
    marginBottom:14
  },

  fab:{
    position:"absolute",
    right:20,
    bottom:6,
    backgroundColor:"#5B8DBF",
    elevation:6
  },

  loader:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },

  empty:{
    marginTop:80,
    alignItems:"center"
  }

});
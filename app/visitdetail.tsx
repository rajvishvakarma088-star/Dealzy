import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import {
  Card,
  Text,
  Chip,
  Avatar,
  ActivityIndicator,
  Button,
  Appbar,
  useTheme
} from "react-native-paper";

import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../src/services/firebaseConfig";

export default function VisitDetail() {

  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();

  const [visit, setVisit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisit();
  }, []);

  const fetchVisit = async () => {

    try {

      const docRef = doc(db, "visits", String(id));
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setVisit(docSnap.data());
      }

    } catch (error) {

      console.log("Error loading visit:", error);

    }

    setLoading(false);

  };

  const deleteVisit = async () => {

    Alert.alert(
      "Delete Visit",
      "Are you sure you want to delete this visit?",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          onPress: async () => {

            try {

              await deleteDoc(doc(db, "visits", String(id)));

              Alert.alert("Deleted", "Visit deleted successfully");

              router.replace("/visitlist");

            } catch (error) {

              console.log("Delete error:", error);

            }

          }
        }
      ]
    );

  };

  const editVisit = () => {
    router.push(`/editvisit?id=${id}`);
  };

  if (loading) {

    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );

  }

  if (!visit) {

    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text variant="titleMedium">No visit details available</Text>
      </View>
    );

  }

  const statusColor =
    visit.syncStatus === "synced"
      ? "#22C55E"
      : visit.syncStatus === "syncing"
      ? "#F59E0B"
      : "#EF4444";

  return (

    <View style={{flex:1, backgroundColor:colors.background}}>

      {/* Premium Top App Bar */}

      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction color="white" onPress={() => router.back()} />
        <Appbar.Content
          title="Visit Details"
          titleStyle={styles.appbarTitle}
        />
      </Appbar.Header>

      <ScrollView style={styles.container}>

        {/* Customer Card */}

        <Card style={styles.card}>

          <Card.Title
            title={visit.customerName}
            subtitle={visit.visitDate}
            titleStyle={styles.customerName}
            left={(props) => (
              <Avatar.Icon
                {...props}
                icon="account"
                style={styles.avatar}
              />
            )}
          />

        </Card>

        {/* Details Card */}

        <Card style={styles.card}>

          <Card.Content>

            <View style={styles.section}>
              <Text style={styles.label}>Contact Person</Text>
              <Text style={styles.value}>{visit.contactPerson}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{visit.location}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Meeting Notes</Text>
              <Text style={styles.value}>{visit.meetingNotes}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>AI Summary</Text>
              <Text style={styles.value}>{visit.aiSummary}</Text>
            </View>

            <Chip
              style={[styles.statusChip, { backgroundColor: statusColor }]}
              textStyle={{ color: "white", fontWeight:"bold" }}
            >
              {visit.syncStatus}
            </Chip>

          </Card.Content>

        </Card>

        {/* Actions */}

        <View style={styles.actions}>

          <Button
            mode="contained"
            style={styles.editButton}
            onPress={editVisit}
          >
            Edit Visit
          </Button>

          <Button
            mode="contained"
            buttonColor="#EF4444"
            style={styles.deleteButton}
            onPress={deleteVisit}
          >
            Delete Visit
          </Button>

        </View>

      </ScrollView>

    </View>

  );

}

const styles = StyleSheet.create({

  container:{
    flex:1,
    padding:15
  },

  appbar:{
    backgroundColor:"#1C3A7A"
  },

  appbarTitle:{
    color:"white",
    fontWeight:"bold"
  },

  card:{
    marginBottom:15,
    borderRadius:16,
    elevation:3
  },

  avatar:{
    backgroundColor:"#1C3A7A"
  },

  customerName:{
    fontWeight:"bold",
    fontSize:18
  },

  section:{
    marginBottom:14
  },

  label:{
    fontWeight:"bold",
    fontSize:13,
    color:"#6B7280",
    marginBottom:3
  },

  value:{
    fontSize:15,
    lineHeight:20
  },

  statusChip:{
    alignSelf:"flex-start",
    marginTop:10
  },

  actions:{
    marginTop:10
  },

  editButton:{
    marginBottom:10,
    backgroundColor:"#5B8DBF"
  },

  deleteButton:{
    marginBottom:30
  },

  center:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  }

});
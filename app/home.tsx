import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../src/services/firebaseConfig";

export default function HomeScreen() {

const [visits, setVisits] = useState<any[]>([]);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {

    const snapshot = await getDocs(collection(db, "visits"));

    const data = snapshot.docs.map(doc => doc.data());

    setVisits(data);

  };

  const totalVisits = visits.length;

  const followUps = visits.filter(
    (v: any) => v.outcome === "Follow-up Needed"
  ).length;

  const closedDeals = visits.filter(
    (v: any) => v.outcome === "Closed Deal"
  ).length;

  return (

    <View style={styles.container}>

      <Text variant="headlineMedium" style={styles.title}>
        Sales Dashboard
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">{totalVisits}</Text>
          <Text>Total Visits</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">{followUps}</Text>
          <Text>Follow Ups Required</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">{closedDeals}</Text>
          <Text>Closed Deals</Text>
        </Card.Content>
      </Card>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F3F4F6"
  },

  title: {
    marginBottom: 20,
    fontWeight: "bold"
  },

  card: {
    marginBottom: 15
  }

});
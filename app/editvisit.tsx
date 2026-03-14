import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  TextInput,
  Button,
  Card,
  Text,
  ActivityIndicator,
  Appbar,
  useTheme
} from "react-native-paper";

import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../src/services/firebaseConfig";

export default function EditVisit() {

  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors, dark } = useTheme();

  /* Dark mode input styling */

  const inputBg = dark ? "#1E1E1E" : "#F9FAFB";
  const inputText = dark ? "#FFFFFF" : "#000000";

  const [customer, setCustomer] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVisit();
  }, []);

  const loadVisit = async () => {

    try {

      const docRef = doc(db, "visits", String(id));
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {

        const data:any = docSnap.data();

        setCustomer(data.customerName || "");
        setContact(data.contactPerson || "");
        setLocation(data.location || "");
        setNotes(data.meetingNotes || "");
        setSummary(data.aiSummary || "");

      }

    } catch (error) {

      console.log("Error loading visit:", error);

    }

    setLoading(false);

  };

  const updateVisit = async () => {

    if (!customer || !contact || !location || !notes) {
      Alert.alert("Missing Fields", "Please fill all required fields");
      return;
    }

    try {

      const docRef = doc(db, "visits", String(id));

      await updateDoc(docRef, {

        customerName: customer,
        contactPerson: contact,
        location: location,
        meetingNotes: notes,
        aiSummary: summary

      });

      Alert.alert("Success", "Visit updated successfully");

      router.back();

    } catch (error) {

      console.log("Update error:", error);
      Alert.alert("Error", "Failed to update visit");

    }

  };

  if (loading) {

    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );

  }

  return (

    <View style={{flex:1, backgroundColor:colors.background}}>

      {/* AppBar */}

      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction color="white" onPress={() => router.back()} />
        <Appbar.Content
          title="Edit Visit"
          titleStyle={styles.appbarTitle}
        />
      </Appbar.Header>

      <ScrollView style={styles.container}>

        <Card style={styles.card}>

          <Card.Content>

            <Text style={styles.sectionTitle}>
              Visit Information
            </Text>

            {/* CUSTOMER */}

            <TextInput
              label="Customer Name"
              value={customer}
              onChangeText={setCustomer}
              mode="outlined"
              textColor={inputText}
              style={[styles.input,{ backgroundColor: inputBg }]}
              outlineColor={dark ? "#444" : "#ccc"}
              activeOutlineColor="#1C3A7A"
              left={<TextInput.Icon icon="account" />}
            />

            {/* CONTACT */}

            <TextInput
              label="Contact Person"
              value={contact}
              onChangeText={setContact}
              mode="outlined"
              textColor={inputText}
              style={[styles.input,{ backgroundColor: inputBg }]}
              outlineColor={dark ? "#444" : "#ccc"}
              activeOutlineColor="#1C3A7A"
              left={<TextInput.Icon icon="account-tie" />}
            />

            {/* LOCATION */}

            <TextInput
              label="Location"
              value={location}
              onChangeText={setLocation}
              mode="outlined"
              textColor={inputText}
              style={[styles.input,{ backgroundColor: inputBg }]}
              outlineColor={dark ? "#444" : "#ccc"}
              activeOutlineColor="#1C3A7A"
              left={<TextInput.Icon icon="map-marker" />}
            />

            {/* NOTES */}

            <TextInput
              label="Meeting Notes"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              mode="outlined"
              textColor={inputText}
              style={[styles.notesInput,{ backgroundColor: inputBg }]}
              outlineColor={dark ? "#444" : "#ccc"}
              activeOutlineColor="#1C3A7A"
              left={<TextInput.Icon icon="note-text" />}
            />

            {/* AI SUMMARY */}

            <TextInput
              label="AI Summary"
              value={summary}
              onChangeText={setSummary}
              multiline
              numberOfLines={3}
              mode="outlined"
              textColor={inputText}
              style={[styles.notesInput,{ backgroundColor: inputBg }]}
              outlineColor={dark ? "#444" : "#ccc"}
              activeOutlineColor="#1C3A7A"
              left={<TextInput.Icon icon="robot" />}
            />

            <Button
              mode="contained"
              style={styles.saveButton}
              onPress={updateVisit}
            >
              Update Visit
            </Button>

          </Card.Content>

        </Card>

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
    borderRadius:16,
    elevation:3
  },

  sectionTitle:{
    fontSize:18,
    fontWeight:"bold",
    marginBottom:15
  },

  input:{
    marginBottom:15
  },

  notesInput:{
    marginBottom:15,
    minHeight:90
  },

  saveButton:{
    marginTop:10,
    backgroundColor:"#5B8DBF"
  },

  center:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  }

});
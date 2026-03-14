import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Text, Card, Button, Switch, Appbar } from "react-native-paper";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../src/services/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../src/services/firebaseConfig";
import { ThemeContext } from "../src/context/ThemeContext";

export default function ProfileScreen() {

  const router = useRouter();

  const themeContext = useContext(ThemeContext);

  const theme = themeContext?.theme ?? "light";
  const toggleTheme = themeContext?.toggleTheme ?? (() => {});

  const isDark = theme === "dark";

  const userEmail = auth.currentUser?.email || "No email found";

  const [total, setTotal] = useState(0);
  const [synced, setSynced] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {

    try {

      const snapshot = await getDocs(collection(db, "visits"));
      const visits = snapshot.docs.map(doc => doc.data());

      const totalVisits = visits.length;
      const syncedVisits = visits.filter((v:any) => v.syncStatus === "synced").length;
      const pendingVisits = totalVisits - syncedVisits;

      setTotal(totalVisits);
      setSynced(syncedVisits);
      setPending(pendingVisits);

    } catch (error) {

      console.log("Stats error:", error);

    }

  };

  const logout = async () => {

    await signOut(auth);
    router.replace("/login");

  };

  const bgColor = isDark ? "#121212" : "#F3F4F6";
  const cardColor = isDark ? "#1E1E1E" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#000000";
  const secondaryText = isDark ? "#BBBBBB" : "gray";

  return (

<View style={[styles.container,{backgroundColor:bgColor}]}>

  {/* Top AppBar */}

  <Appbar.Header style={styles.appbar}>
    <Appbar.Content
      title="Profile"
      titleStyle={{color:"white",fontWeight:"bold"}}
    />
  </Appbar.Header>

  {/* Profile Header */}

  <View style={styles.profileHeader}>

    <Avatar.Icon
      size={90}
      icon="account"
      style={styles.avatar}
    />

    <Text style={[styles.name,{color:textColor}]}>
      Sales Representative
    </Text>

    <Text style={{color:secondaryText}}>
      {userEmail}
    </Text>

  </View>

  {/* Stats */}

  <View style={styles.statsContainer}>

    <Card style={[styles.statCard,{backgroundColor:cardColor}]}>
      <Card.Content style={styles.center}>
        <Text style={[styles.statNumber,{color:textColor}]}>
          {total}
        </Text>
        <Text style={{color:secondaryText}}>
          Total Visits
        </Text>
      </Card.Content>
    </Card>

    <Card style={[styles.statCard,{backgroundColor:cardColor}]}>
      <Card.Content style={styles.center}>
        <Text style={[styles.statNumber,{color:textColor}]}>
          {synced}
        </Text>
        <Text style={{color:secondaryText}}>
          Synced
        </Text>
      </Card.Content>
    </Card>

    <Card style={[styles.statCard,{backgroundColor:cardColor}]}>
      <Card.Content style={styles.center}>
        <Text style={[styles.statNumber,{color:textColor}]}>
          {pending}
        </Text>
        <Text style={{color:secondaryText}}>
          Pending
        </Text>
      </Card.Content>
    </Card>

  </View>

  {/* Account Card */}

  <Card style={[styles.card,{backgroundColor:cardColor}]}>

    <Card.Content>

      <Text style={[styles.sectionTitle,{color:textColor}]}>
        Account Information
      </Text>

      <Text style={{color:secondaryText}}>
        Email
      </Text>

      <Text style={{color:textColor}}>
        {userEmail}
      </Text>

    </Card.Content>

  </Card>

  {/* Dark Mode */}

  <Card style={[styles.card,{backgroundColor:cardColor}]}>

    <Card.Content style={styles.row}>

      <Text style={{color:textColor}}>
        Dark Mode
      </Text>

      <Switch
        value={isDark}
        onValueChange={toggleTheme}
      />

    </Card.Content>

  </Card>

  {/* Logout */}

  <Button
    mode="contained"
    style={styles.logout}
    onPress={logout}
  >
    Logout
  </Button>

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

profileHeader:{
alignItems:"center",
marginTop:20,
marginBottom:20
},

avatar:{
backgroundColor:"#1C3A7A",
marginBottom:10
},

name:{
fontSize:20,
fontWeight:"bold"
},

statsContainer:{
flexDirection:"row",
justifyContent:"space-between",
paddingHorizontal:15,
marginBottom:20
},

statCard:{
flex:1,
marginHorizontal:5,
borderRadius:12,
elevation:3
},

center:{
alignItems:"center"
},

statNumber:{
fontSize:20,
fontWeight:"bold"
},

card:{
marginHorizontal:15,
marginBottom:15,
borderRadius:12,
elevation:2
},

sectionTitle:{
fontWeight:"bold",
marginBottom:10
},

row:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
},

logout:{
marginHorizontal:15,
marginTop:10,
backgroundColor:"#5B8DBF"
}

});
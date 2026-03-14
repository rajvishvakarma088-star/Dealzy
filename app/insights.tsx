import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
  RefreshControl,
} from "react-native";

import { Card, Text, Appbar, useTheme } from "react-native-paper";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../src/services/firebaseConfig";

import { BarChart, PieChart, LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Insights() {

  const { colors, dark } = useTheme();

  const [total, setTotal] = useState(0);
  const [closed, setClosed] = useState(0);
  const [followups, setFollowups] = useState(0);
  const [notInterested, setNotInterested] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const bgColor = dark ? "#121212" : "#F3F4F6";
  const cardColor = dark ? "#1E1E1E" : "#FFFFFF";
  const textColor = dark ? "#FFFFFF" : "#1C3A7A";
  const secondaryText = dark ? "#BBBBBB" : "#6B7280";

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {

    try {

      const snapshot = await getDocs(collection(db, "visits"));
      const visits = snapshot.docs.map((doc) => doc.data());

      const totalVisits = visits.length;

      const closedDeals = visits.filter(
        (v:any) => v.outcome === "Closed Deal"
      ).length;

      const followUp = visits.filter(
        (v:any) => v.outcome === "Follow-up Needed"
      ).length;

      const notInt = visits.filter(
        (v:any) => v.outcome === "Not Interested"
      ).length;

      setTotal(totalVisits);
      setClosed(closedDeals);
      setFollowups(followUp);
      setNotInterested(notInt);

    } catch (error) {

      console.log("Insights error:", error);

    }

  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const barData = {
    labels: ["Closed", "Follow Up", "Not Int"],
    datasets: [
      {
        data: [closed, followups, notInterested],
      },
    ],
  };

  const pieData = [
    {
      name: "Closed",
      population: closed,
      color: "#22C55E",
      legendFontColor: secondaryText,
      legendFontSize: 12,
    },
    {
      name: "Follow Up",
      population: followups,
      color: "#F59E0B",
      legendFontColor: secondaryText,
      legendFontSize: 12,
    },
    {
      name: "Not Interested",
      population: notInterested,
      color: "#EF4444",
      legendFontColor: secondaryText,
      legendFontSize: 12,
    },
  ];

  const lineData = {
    labels: ["W1", "W2", "W3", "W4"],
    datasets: [
      {
        data: [
          Math.max(total - 3, 0),
          Math.max(total - 2, 0),
          Math.max(total - 1, 0),
          total,
        ],
      },
    ],
  };

  const chartConfig = {

    backgroundGradientFrom: cardColor,
    backgroundGradientTo: cardColor,

    decimalPlaces: 0,

    color: (opacity = 1) => `rgba(91,141,191,${opacity})`,

    labelColor: () => textColor,

    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#5B8DBF",
    },

  };

  return (

    <ScrollView
      style={[styles.container, { backgroundColor: bgColor }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >

      {/* Header */}

      <Appbar.Header style={styles.appbar}>

        <Appbar.Content
          title="Sales Insights"
          subtitle="Dealzy Performance Dashboard"
          titleStyle={styles.headerTitle}
          subtitleStyle={styles.headerSubtitle}
        />

        <Appbar.Action
          icon="refresh"
          iconColor="white"
          onPress={loadStats}
        />

      </Appbar.Header>

      {/* Stats */}

      <View style={styles.statsRow}>

        <Card style={[styles.statCard, { backgroundColor: cardColor }]}>
          <Card.Content>
            <Text style={[styles.statNumber, { color: textColor }]}>{total}</Text>
            <Text style={{ color: secondaryText }}>Total Visits</Text>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: cardColor }]}>
          <Card.Content>
            <Text style={[styles.statNumber, { color: textColor }]}>{closed}</Text>
            <Text style={{ color: secondaryText }}>Closed Deals</Text>
          </Card.Content>
        </Card>

      </View>

      {/* Pie Chart */}

      <Card style={[styles.chartCard, { backgroundColor: cardColor }]}>

        <Text style={[styles.chartTitle, { color: textColor }]}>
          Outcome Distribution
        </Text>

        <PieChart
          data={pieData}
          width={screenWidth - 40}
          height={220}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          chartConfig={chartConfig}
        />

      </Card>

      {/* Bar Chart */}

      <Card style={[styles.chartCard, { backgroundColor: cardColor }]}>

        <Text style={[styles.chartTitle, { color: textColor }]}>
          Visit Outcomes
        </Text>

        <BarChart
          data={barData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
        />

      </Card>

      {/* Line Chart */}

      <Card style={[styles.chartCard, { backgroundColor: cardColor }]}>

        <Text style={[styles.chartTitle, { color: textColor }]}>
          Visit Trend
        </Text>

        <LineChart
          data={lineData}
          width={screenWidth - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
        />

      </Card>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container:{
    flex:1
  },

  appbar:{
    backgroundColor:"#1C3A7A"
  },

  headerTitle:{
    color:"white",
    fontWeight:"bold",
    fontSize:20
  },

  headerSubtitle:{
    color:"white",
    fontSize:12
  },

  statsRow:{
    flexDirection:"row",
    justifyContent:"space-around",
    marginVertical:15
  },

  statCard:{
    width:"42%",
    alignItems:"center",
    borderRadius:16,
    elevation:3
  },

  statNumber:{
    fontSize:28,
    fontWeight:"bold"
  },

  chartCard:{
    margin:15,
    padding:10,
    borderRadius:16,
    elevation:3
  },

  chartTitle:{
    textAlign:"center",
    marginBottom:10,
    fontWeight:"bold",
    fontSize:16
  }

});
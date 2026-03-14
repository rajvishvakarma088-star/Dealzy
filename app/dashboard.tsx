import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Pressable, Dimensions, BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

import { useFocusEffect } from "expo-router";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from "react-native-reanimated";

import VisitList from "./visitlist";
import Insights from "./insights";
import ProfileScreen from "./profile";

const { width } = Dimensions.get("window");
const TAB_WIDTH = (width - 40) / 3;

export default function Dashboard() {

  const { colors, dark } = useTheme();

  const [tab, setTab] = useState(0);

  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  /* FIXED Android Back Button */

  useFocusEffect(
    useCallback(() => {

      const backAction = () => {

        if (tab !== 0) {
          setTab(0);
          return true;
        }

        return false; 
        // allow normal navigation (VisitDetail → VisitList)

      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();

    }, [tab])
  );

  /* Animation */

  useEffect(() => {

    translateX.value = withTiming(tab * TAB_WIDTH, {
      duration: 220
    });

    scale.value = withTiming(0.9, { duration: 80 });

    setTimeout(() => {
      scale.value = withTiming(1, { duration: 150 });
    }, 80);

  }, [tab]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value }
    ]
  }));

  const activeColor = colors.primary;
  const inactiveColor = dark ? "#9CA3AF" : "#6B7280";

  return (

    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Screens */}

      <View style={{ flex: 1, paddingBottom: 110 }}>
        {tab === 0 && <VisitList />}
        {tab === 1 && <Insights />}
        {tab === 2 && <ProfileScreen />}
      </View>

      {/* Floating Bottom Bar */}

      <View
        style={[
          styles.bottomBar,
          { backgroundColor: colors.surface }
        ]}
      >

        <Animated.View
          style={[
            styles.indicator,
            indicatorStyle,
            { backgroundColor: dark ? "#2A2A2A" : "#E6EAF5" }
          ]}
        />

        <Pressable style={styles.tab} onPress={() => setTab(0)}>
          <Ionicons
            name="clipboard-outline"
            size={26}
            color={tab === 0 ? activeColor : inactiveColor}
          />
        </Pressable>

        <Pressable style={styles.tab} onPress={() => setTab(1)}>
          <Ionicons
            name="bar-chart-outline"
            size={26}
            color={tab === 1 ? activeColor : inactiveColor}
          />
        </Pressable>

        <Pressable style={styles.tab} onPress={() => setTab(2)}>
          <Ionicons
            name="person-outline"
            size={26}
            color={tab === 2 ? activeColor : inactiveColor}
          />
        </Pressable>

      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  container:{
    flex:1
  },

  bottomBar:{

    position:"absolute",
    bottom:20,
    left:20,
    right:20,

    height:72,
    borderRadius:36,

    flexDirection:"row",
    justifyContent:"space-around",
    alignItems:"center",

    elevation:15,

    shadowColor:"#000",
    shadowOpacity:0.18,
    shadowRadius:12,
    shadowOffset:{width:0,height:6}

  },

  tab:{
    flex:1,
    alignItems:"center"
  },

  indicator:{

    position:"absolute",

    width:46,
    height:46,

    borderRadius:23,

    top:13,
    left:(TAB_WIDTH / 2) - 23,

    shadowColor:"#5B8DBF",
    shadowOpacity:0.3,
    shadowRadius:10,
    shadowOffset:{width:0,height:3}

  }

});
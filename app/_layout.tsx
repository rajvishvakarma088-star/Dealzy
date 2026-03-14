import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme
} from "react-native-paper";

import { ThemeProvider, ThemeContext } from "../src/context/ThemeContext";
import { useContext } from "react";

function AppContent() {

  const { theme } = useContext(ThemeContext);

  const paperTheme =
    theme === "dark"
      ? MD3DarkTheme
      : MD3LightTheme;

  return (

    <PaperProvider theme={paperTheme}>

      <Stack
        initialRouteName="index"
        screenOptions={{ headerShown:false }}
      />

    </PaperProvider>

  );

}

export default function Layout() {

  return (

    <GestureHandlerRootView style={{ flex:1 }}>

      <ThemeProvider>

        <AppContent />

      </ThemeProvider>

    </GestureHandlerRootView>

  );

}
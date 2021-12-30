import { WebView } from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { Feather } from "expo-vector-icons";

const DEFAULT_URI = "http://192.168.1.107";

export default function App() {
  const storage = useAsyncStorage("uri");
  const [uri, setURI] = useState<string | undefined>(undefined);

  const [mode, setMode] = useState<"VIEW" | "INPUT">("VIEW");

  useEffect(() => {
    async function getInitialURL() {
      const value = await storage.getItem();
      if (value) {
        setURI(value);
      } else {
        setURI(DEFAULT_URI);
        storage.setItem(DEFAULT_URI);
      }
    }

    getInitialURL();
  });

  const handleUpdateURL = () => {
    Alert.prompt(
      "Seteaza adresa",
      "Introdu adresa",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: (value) => {
            setURI(value);
            if (value) {
              storage.setItem(value);
            }
          },
        },
      ],
      undefined,
      uri || "undefined"
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto"></StatusBar>

      <SafeAreaView style={styles.safeArea}>
        {uri ? (
          <WebView style={styles.webview} source={{ uri }} />
        ) : (
          <Text>Nu ai setat adresa IP</Text>
        )}
      </SafeAreaView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={handleUpdateURL} style={styles.updateButton}>
          <Feather name="settings" size={24} color="#000"></Feather>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  updateButton: {
    width: 40,
  },
  webview: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    position: "relative",
    flex: 1,
    display: "flex",
    backgroundColor: "#fff",
  },
});

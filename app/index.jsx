import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else router.replace("/login");
    });
    return unsub;
  }, []);

  if (!user)
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.subtitle}>{user.displayName || user.email}</Text>
      <Button title="Logout" onPress={() => signOut(auth)} />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 18, marginBottom: 20, color: "#666" },
});

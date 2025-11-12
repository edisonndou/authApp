import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, GithubAuthProvider, signInWithCredential } from "firebase/auth";

import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = "Ov23liMjIVMX9vNzwjAh";
const CLIENT_SECRET = "9c55bc325f39c43ced4ad1bed7f4d7e029d74069";
const REDIRECT_URI = AuthSession.makeRedirectUri({ useProxy: true });

const DISCOVERY = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
};

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ["read:user", "user:email"],
      redirectUri: REDIRECT_URI,
    },
    DISCOVERY
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;

      (async () => {
        try {
          const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: { Accept: "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code }),
          });

          const data = await tokenResponse.json();

          if (data.access_token) {
            const credential = GithubAuthProvider.credential(data.access_token);
            await signInWithCredential(auth, credential);
            router.replace("/");
          } else {
            throw new Error("Failed to get access token from GitHub");
          }
        } catch (error) {
          setMsg(error.message);
        }
      })();
    }
  }, [response]);

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Us ✨</Text>
      <Text style={styles.subtitle}>Create your free account</Text>

      <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={setPassword} />

      <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister}>
        <Text style={styles.primaryText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.githubBtn} onPress={() => promptAsync()}>
        <Text style={styles.githubText}>🐱 Sign up with GitHub</Text>
      </TouchableOpacity>

      {msg ? <Text style={styles.error}>{msg}</Text> : null}

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: "center", backgroundColor: "#f3f4f6" },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 5 },
  subtitle: { textAlign: "center", color: "#555", marginBottom: 20 },
  input: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginVertical: 8, borderWidth: 1, borderColor: "#ddd" },
  primaryBtn: { backgroundColor: "#10B981", padding: 14, borderRadius: 12, marginTop: 10 },
  primaryText: { color: "#fff", fontWeight: "600", textAlign: "center" },
  githubBtn: { flexDirection: "row", justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#333", borderRadius: 12, padding: 14, marginTop: 15, backgroundColor: "#fff" },
  githubText: { fontWeight: "600", color: "#333" },
  link: { textAlign: "center", color: "#2563EB", marginTop: 25 },
  error: { color: "red", textAlign: "center", marginTop: 10 },
});

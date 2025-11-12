import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import {
  GithubAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = "YOUR_GITHUB_CLIENT_ID"; // Replace with yours
const REDIRECT_URI = AuthSession.makeRedirectUri({ useProxy: true });
const DISCOVERY = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
};

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    { clientId: CLIENT_ID, scopes: ["identity"], redirectUri: REDIRECT_URI },
    DISCOVERY
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      const credential = GithubAuthProvider.credential(code);
      signInWithCredential(auth, credential)
        .then(() => router.replace("/"))
        .catch((e) => setMsg(e.message));
    }
  }, [response]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
        <Text style={styles.primaryText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.githubBtn} onPress={() => promptAsync()}>
        <Text style={styles.githubText}>🐱 Sign in with GitHub</Text>
      </TouchableOpacity>

      {msg ? <Text style={styles.error}>{msg}</Text> : null}

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>New here? Create an account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, justifyContent: "center", backgroundColor: "#f3f4f6" },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 5 },
  subtitle: { textAlign: "center", color: "#555", marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  primaryBtn: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  primaryText: { color: "#fff", fontWeight: "600", textAlign: "center" },
  githubBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    padding: 14,
    marginTop: 15,
    backgroundColor: "#fff",
  },
  githubText: { fontWeight: "600", color: "#333" },
  link: { textAlign: "center", color: "#2563EB", marginTop: 25 },
  error: { color: "red", textAlign: "center", marginTop: 10 },
});

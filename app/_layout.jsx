import { Stack } from "expo-router";
import * as AuthSession from "expo-auth-session";

export default function Layout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#f8f9fb" },
          headerTitleStyle: { fontWeight: "600" },
          headerShadowVisible: false,
          title: "Firebase Auth App",
        }}
      />
    </>
  );
}

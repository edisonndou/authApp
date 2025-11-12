import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#f8f9fb" },
        headerTitleStyle: { fontWeight: "600" },
        headerShadowVisible: false,
        title: "Firebase Auth App",
      }}
    />
  );
}

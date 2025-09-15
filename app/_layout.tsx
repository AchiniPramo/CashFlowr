
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView
import { AuthProvider, useAuth } from "../src/auth/AuthContext";
import { TransactionsProvider } from "../src/transactions/TransactionsContext";

const InitialLayout = () => {
  const { user, loading } = useAuth(); // Get loading state
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inTabsGroup = segments[0] === "(tabs)";
    // Only redirect if not loading
    if (!loading) {
      if (user && !inTabsGroup) {
        // User is logged in, but not in the tabs group -> go to tabs
        router.replace("/(tabs)");
      } else if (!user && inTabsGroup) {
        // User is NOT logged in, but IS in the tabs group -> go to login
        router.replace("/login");
      } else if (!user && segments[0] !== 'login' && segments[0] !== 'register') {
        // User is NOT logged in and not on login/register page -> go to login
        router.replace("/login");
      }
    }
  }, [user, loading, segments]); // Depend on loading as well

  return <Slot />;
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <TransactionsProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <InitialLayout />
        </GestureHandlerRootView>
      </TransactionsProvider>
    </AuthProvider>
  );
};

export default RootLayout;

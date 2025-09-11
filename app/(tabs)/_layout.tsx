
import { useAuth } from '@/src/auth/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'; 

const CustomHeader = () => {
  const { logout } = useAuth();

  return (
    <View style={headerStyles.headerContainer}>
      <Text style={headerStyles.appName}>Native Finance</Text>
      <TouchableOpacity onPress={logout} style={headerStyles.logoutButton}>
        <Text style={headerStyles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function TabLayout() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'alert-circle';

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'transactions') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'analysis') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#059669', // emerald-600
        tabBarInactiveTintColor: '#64748b', // slate-500
        headerShown: true, // Show the header
        header: () => <CustomHeader />, // Use the custom header component
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerTitle: () => null, // Explicitly hide default header title
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          headerTitle: () => null, // Explicitly hide default header title
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: 'Analysis',
          headerTitle: () => null, // Explicitly hide default header title
        }}
      />
    </Tabs>
  );
}

const headerStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 40, // Adjust for status bar
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  appName: {
    fontSize: 24, // Increased font size
    fontWeight: 'bold',
    color: '#059669',
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#ef4444',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

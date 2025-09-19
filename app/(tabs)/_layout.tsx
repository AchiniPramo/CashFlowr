
import { useAuth } from '@/src/auth/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, Platform, Pressable, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

function AppHeader() {
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const statusPad = Platform.OS === 'android' ? (Constants.statusBarHeight || 0) : 0;

  return (
    <SafeAreaView style={{ backgroundColor: 'white' }}>
      <View
        style={{
          paddingTop: statusPad,
          height: 80 + statusPad,
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e2e8f0',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={require('../../assets/images/Cashflowr2.jpeg')} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }} />
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#ea580c' }}>Cashflowr</Text>
        </View>

        <View>
          <TouchableOpacity onPress={() => setShowMenu((s) => !s)} activeOpacity={0.8}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
              style={{ width: 34, height: 34, borderRadius: 17 }}
            />
          </TouchableOpacity>
          <Modal
            visible={showMenu}
            transparent
            animationType="fade"
            onRequestClose={() => setShowMenu(false)}
          >
            <Pressable style={{ flex: 1 }} onPress={() => setShowMenu(false)}>
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    position: 'absolute',
                    top: statusPad + 20,
                    right: 4,
                    backgroundColor: 'white',
                    borderRadius: 8,
                    paddingVertical: 6,
                    minWidth: 160,
                    shadowColor: '#000',
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 3 },
                    elevation: 4,
                    borderWidth: 1,
                    borderColor: '#e2e8f0',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => { setShowMenu(false); router.push('/'); }}
                    style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Ionicons name="home-outline" size={20} color="#ea580c" />
                    <Text style={{ marginLeft: 12, color: '#0f172a', fontWeight: '600', fontSize: 16 }}>Dashboard</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => { setShowMenu(false); router.push('/transactions'); }}
                    style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Ionicons name="list-outline" size={20} color="#ea580c" />
                    <Text style={{ marginLeft: 12, color: '#0f172a', fontWeight: '600', fontSize: 16 }}>Transactions</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => { setShowMenu(false); router.push('/analysis'); }}
                    style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Ionicons name="stats-chart-outline" size={20} color="#ea580c" />
                    <Text style={{ marginLeft: 12, color: '#0f172a', fontWeight: '600', fontSize: 16 }}>Analysis</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => { setShowMenu(false); router.push('/profile'); }}
                    style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Ionicons name="person-circle-outline" size={20} color="#ea580c" />
                    <Text style={{ marginLeft: 12, color: '#0f172a', fontWeight: '600', fontSize: 16 }}>Profile</Text>
                  </TouchableOpacity>
                  <View style={{ height: 1, backgroundColor: '#e2e8f0', marginVertical: 4 }} />
                  <TouchableOpacity
                    onPress={async () => {
                      setShowMenu(false);
                      await logout();
                    }}
                    style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                    <Text style={{ marginLeft: 12, color: '#ef4444', fontWeight: '700', fontSize: 16 }}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
}

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
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ea580c', // orange-600
        tabBarInactiveTintColor: '#94a3b8', // slate-400
        headerShown: true,
        header: () => <AppHeader />,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
        }}
      />
    </Tabs>
  );
}

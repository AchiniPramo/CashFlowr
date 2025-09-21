import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../src/auth/AuthContext";

interface ProfileHeaderProps {
  showNavigation?: boolean;
}

export default function ProfileHeader({ showNavigation = true }: ProfileHeaderProps) {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const statusPad = Platform.OS === "android" ? 0 : 0;

  // Get first letter of user's name for avatar fallback
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <View
        style={{
          paddingTop: statusPad,
          height: 100 + statusPad,
          backgroundColor: "white",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#e2e8f0",
          justifyContent: "space-between",
        }}
      >
        {/* Profile Info */}
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          {/* Avatar */}
          <View style={{ marginRight: 16 }}>
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={{ width: 60, height: 60, borderRadius: 30 }}
              />
            ) : (
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: "#ea580c",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 24,
                    fontWeight: "700",
                  }}
                >
                  {getInitials(user?.name || null)}
                </Text>
              </View>
            )}
          </View>

          {/* User Info */}
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#0f172a",
                marginBottom: 2,
              }}
            >
              {user?.name || "User"}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#64748b",
              }}
            >
              {user?.email}
            </Text>
          </View>
        </View>

        {/* Navigation Menu */}
        {showNavigation && (
          <View>
            <TouchableOpacity
              onPress={() => setShowMenu((s) => !s)}
              activeOpacity={0.8}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#f1f5f9",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="menu" size={24} color="#ea580c" />
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
                      position: "absolute",
                      top: statusPad + 20,
                      right: 4,
                      backgroundColor: "white",
                      borderRadius: 8,
                      paddingVertical: 6,
                      minWidth: 160,
                      shadowColor: "#000",
                      shadowOpacity: 0.15,
                      shadowRadius: 8,
                      shadowOffset: { width: 0, height: 3 },
                      elevation: 4,
                      borderWidth: 1,
                      borderColor: "#e2e8f0",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setShowMenu(false);
                        router.push("/");
                      }}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons name="home-outline" size={20} color="#ea580c" />
                      <Text
                        style={{
                          marginLeft: 12,
                          color: "#0f172a",
                          fontWeight: "600",
                          fontSize: 16,
                        }}
                      >
                        Dashboard
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setShowMenu(false);
                        router.push("/transactions");
                      }}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons name="list-outline" size={20} color="#ea580c" />
                      <Text
                        style={{
                          marginLeft: 12,
                          color: "#0f172a",
                          fontWeight: "600",
                          fontSize: 16,
                        }}
                      >
                        Transactions
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setShowMenu(false);
                        router.push("/analysis");
                      }}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Ionicons
                        name="stats-chart-outline"
                        size={20}
                        color="#ea580c"
                      />
                      <Text
                        style={{
                          marginLeft: 12,
                          color: "#0f172a",
                          fontWeight: "600",
                          fontSize: 16,
                        }}
                      >
                        Analysis
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setShowMenu(false);
                        router.push("/profile");
                      }}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#fef3c7",
                      }}
                    >
                      <Ionicons
                        name="person-circle"
                        size={20}
                        color="#ea580c"
                      />
                      <Text
                        style={{
                          marginLeft: 12,
                          color: "#0f172a",
                          fontWeight: "700",
                          fontSize: 16,
                        }}
                      >
                        Profile
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Pressable>
            </Modal>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

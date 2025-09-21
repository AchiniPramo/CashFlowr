import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../src/auth/AuthContext";

export default function ProfilePage() {
  const { user, logout, updateProfile, uploadPhoto, changePassword } =
    useAuth();
  const router = useRouter();

  const [displayName, setDisplayName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [uploading, setUploading] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      if (updateProfile) {
        await updateProfile({ displayName });
      }
      Alert.alert("Profile updated");
    } catch (e) {
      Alert.alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const pickImageAndUpload = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please grant photo permissions");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.cancelled) {
      try {
        setUploading(true);
        const url = await uploadPhoto!(result.uri);
        Alert.alert("Photo uploaded");
      } catch (e) {
        console.error(e);
        Alert.alert("Upload failed");
      } finally {
        setUploading(false);
      }
    }
  };

  const onChangePassword = async () => {
    if (!newPassword) {
      Alert.alert("Enter a new password");
      return;
    }
    try {
      // @ts-ignore
      await changePassword(newPassword);
      Alert.alert("Password changed");
      setNewPassword("");
    } catch (e: any) {
      console.error(e);
      Alert.alert("Password change failed", e.message || String(e));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile</Text>

      {user?.photoURL ? (
        <Image
          source={{ uri: user.photoURL }}
          style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 12 }}
        />
      ) : (
        <Image
          source={{ uri: "https://i.pravatar.cc/150" }}
          style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 12 }}
        />
      )}

      <TouchableOpacity
        style={{ marginBottom: 12 }}
        onPress={pickImageAndUpload}
      >
        <Text style={{ color: "#ea580c", fontWeight: "700" }}>
          {uploading ? "Uploading..." : "Change Photo"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Your name"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, { backgroundColor: "#f1f5f9" }]}
        value={email}
        editable={false}
      />

      <TouchableOpacity
        style={styles.saveButton}
        onPress={onSave}
        disabled={saving}
      >
        <Text style={styles.saveText}>{saving ? "Saving..." : "Save"}</Text>
      </TouchableOpacity>

      <Text style={[styles.label, { marginTop: 18 }]}>Change Password</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="New password"
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: "#2563eb" }]}
        onPress={onChangePassword}
      >
        <Text style={styles.saveText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          await logout();
          router.replace("/login");
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ea580c",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#ea580c",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  logoutText: {
    color: "#ef4444",
    fontWeight: "700",
    fontSize: 16,
  },
});

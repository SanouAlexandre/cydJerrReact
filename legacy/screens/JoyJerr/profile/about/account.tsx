
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from "react-native";

const AccountContent = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSave = () => {
    Alert.alert("Save", "Profile changes saved successfully!");
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action is permanent.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => Alert.alert("Deleted", "Your account has been deleted.") }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert("Export Data", "Your community data export has been requested.");
  };

  return (
    <ScrollView style={styles.container}>
      {/* ACCOUNT DATA */}
      <Text style={styles.header}>Your Account</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Current Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter current password"
          placeholderTextColor="#999"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <Text style={styles.label}>User Name</Text>
        <TextInput 
          style={[styles.input, styles.disabledInput]} 
          value="demo" 
          editable={false} 
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Email *</Text>
        <TextInput 
          style={[styles.input, styles.disabledInput]} 
          value="demo@fake-email.peepso.com" 
          editable={false}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          placeholderTextColor="#999"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <Button title="Save" onPress={handleSave} disabled={!currentPassword || !newPassword} />
        <Text style={styles.note}>Fields marked with an asterisk (*) are required.</Text>
      </View>

      {/* PROFILE DELETION */}
      <Text style={styles.header}>Profile Deletion</Text>
      <View style={styles.section}>
        <Text style={styles.alert}>
          Deleting your account is instant and permanent. Some information may still be visible to others, such as your name in their friends list and messages you sent.
        </Text>
        <Button title="Delete Account" color="red" onPress={handleDelete} />
      </View>

      {/* GDPR / DATA EXPORT */}
      <Text style={styles.header}>Export Your Community Data</Text>
      <View style={styles.section}>
        <Text style={styles.alert}>
          You can download a complete copy of all the data you have shared in this Community. The data will be delivered in a machine-readable JSON format. Preparing your download may take a while.
        </Text>
        <Button title="Export my Community data" onPress={handleExportData} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#f5f5f5" 
  },
  header: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginVertical: 12,
    color: "#333"
  },
  section: { 
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: { 
    fontSize: 14, 
    fontWeight: "500", 
    marginBottom: 4,
    color: "#333"
  },
  input: { 
    borderWidth: 1, 
    borderColor: "#ddd", 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 12,
    fontSize: 16
  },
  disabledInput: { 
    backgroundColor: "#f9f9f9",
    color: "#666"
  },
  note: { 
    fontSize: 12, 
    color: "#666", 
    marginTop: 8,
    fontStyle: "italic"
  },
  alert: { 
    fontSize: 14, 
    color: "#555", 
    marginBottom: 12,
    lineHeight: 20
  }
});

export default AccountContent;

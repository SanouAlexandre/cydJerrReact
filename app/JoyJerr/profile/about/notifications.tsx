import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";

// Notification item component
const NotificationItem = ({ title, subtitle, types, index, onEnableAll, onDisableAll, onReset, onDisableEmails }) => {
  const [state, setState] = useState(
    Object.fromEntries(types.map((type) => [type, true]))
  );

  // Enregistrer les callbacks dans les références
  React.useEffect(() => {
    if (onEnableAll) {
      const enableAll = () => {
        setState(Object.fromEntries(types.map((type) => [type, true])));
      };
      onEnableAll.current[index] = enableAll;
    }
  }, [onEnableAll, types, index]);

  React.useEffect(() => {
    if (onDisableAll) {
      const disableAll = () => {
        setState(Object.fromEntries(types.map((type) => [type, false])));
      };
      onDisableAll.current[index] = disableAll;
    }
  }, [onDisableAll, types, index]);

  React.useEffect(() => {
    if (onReset) {
      const reset = () => {
        setState(Object.fromEntries(types.map((type) => [type, true])));
      };
      onReset.current[index] = reset;
    }
  }, [onReset, types, index]);

  React.useEffect(() => {
    if (onDisableEmails) {
      const disableEmails = () => {
        setState((prev) => ({
          ...prev,
          email: false // Désactive seulement email, garde Notification et Phone
        }));
      };
      onDisableEmails.current[index] = disableEmails;
    }
  }, [onDisableEmails, index]);

  const toggleSwitch = (type) => {
    setState((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <View style={styles.allNotificationItem}>
      <Text style={styles.allNotificationTitle}>{title}</Text>
      {subtitle && <Text style={styles.allNotificationSubtitle}>{subtitle}</Text>}
      <View style={styles.switchRow}>
        {types.map((type) => (
          <View key={type} style={styles.switchContainer}>
            <Text style={styles.switchLabel}>{type.replace("_", " ")}</Text>
            <Switch
              value={state[type]}
              onValueChange={() => toggleSwitch(type)}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={state[type] ? "#007bff" : "#f4f3f4"}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

// All notifications component
const AllNotificationsContent = ({ onEnableAll, onDisableAll, onReset, onDisableEmails }) => {
  const notificationsList = [
    { title: "Someone commented on a post", subtitle: "Applies to all posts you follow", types: ["Notification", "email", "Phone"] },
    { title: "Someone reacted to a post", subtitle: "Applies to all posts you follow", types: ["Notification", "email", "Phone"] },
    { title: "Someone reacted to my comment", types: ["Notification", "email", "Phone"] },
    { title: "Someone replied to my comment", types: ["Notification", "email", "Phone"] },
    { title: "Someone liked my profile", types: ["Notification", "email", "Phone"] },
    { title: "Someone wrote a post on my profile", types: ["Notification", "email", "Phone"] },
    { title: "Someone mentioned me in a post", types: ["Notification", "email", "Phone"] },
    { title: "Someone mentioned me in a comment", types: ["Notification", "email", "Phone"] },
    { title: "Someone sent me a new message", types: ["Notification", "email", "Phone"] },
    { title: "Someone sent me a friend request", types: ["Notification", "email", "Phone"] },
    { title: "Video conversion complete", types: ["Notification", "email", "Phone"] },
    { title: "Video conversion failed", types: ["Notification", "email", "Phone"] },
    { title: "Classic Cars (Group)", types: ["Notification", "email", "Phone"] },
    { title: "Everyone loves Andrea (Group)", types: ["Notification", "email", "Phone"] },
    { title: "Exit Festival (Group)", types: ["Notification", "email", "Phone"] },
    { title: "PeepSo Updates (Group)", types: ["Notification", "email", "Phone"] },
    { title: "Sports Today (Group)", types: ["Notification", "email", "Phone"] },
    { title: "Awedesk (Page)", types: ["Notification", "email", "Phone"] },
  ];

  return (
    <View style={styles.allNotificationsContainer}>
      {notificationsList.map((notif, index) => (
        <NotificationItem
          key={index}
          title={notif.title}
          subtitle={notif.subtitle}
          types={notif.types}
          index={index}
          onEnableAll={onEnableAll}
          onDisableAll={onDisableAll}
          onReset={onReset}
          onDisableEmails={onDisableEmails}
        />
      ))}
    </View>
  );
};

const NotificationsContent = () => {
  const [emailIntensity, setEmailIntensity] = useState("0");
  const [showEmailPicker, setShowEmailPicker] = useState(false);

  // Références pour contrôler les notifications globales
  const enableAllRef = React.useRef([]);
  const disableAllRef = React.useRef([]);
  const resetRef = React.useRef([]);
  const disableEmailsRef = React.useRef([]);

  // Example notification states
  const [notifications, setNotifications] = useState({
    user_comment_email: true,
    like_post_email: true,
    like_comment_email: true,
    stream_reply_comment_email: true,
    profile_like_email: true,
    wall_post_email: true,
    tag_email: true,
    tag_comment_email: true,
    new_message_email: true,
    friends_requests_email: true,
    video_conversion_complete_email: true,
    video_conversion_failed_email: true,
    group_259_email: true,
  });

  const toggleNotification = (key) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const emailOptions = [
    { label: "Real time", value: "0" },
    { label: "One hour", value: "60" },
    { label: "Two hours", value: "120" },
    { label: "Three hours", value: "180" },
    { label: "Four times a day", value: "360" },
    { label: "Two times a day", value: "720" },
    { label: "Once a day", value: "1440" },
    { label: "Once in 7 days", value: "10080" },
    { label: "Never", value: "999999" },
  ];

  const emailDescriptions = {
    "0": "All enabled email notifications will be sent out immediately.",
    "60": "You will receive a summary of unread on-site notifications approximately every hour.",
    "120":
      "You will receive a summary of unread on-site notifications approximately every two hours.",
    "180":
      "You will receive a summary of unread on-site notifications approximately every three hours.",
    "360":
      "You will receive a summary of unread on-site notifications approximately four times a day.",
    "720":
      "You will receive a summary of unread on-site notifications approximately two times a day.",
    "1440":
      "You will receive a summary of unread on-site notifications approximately once a day.",
    "10080":
      "You will receive a summary of unread on-site notifications approximately once a week.",
    "999999": "You will not receive any email notifications.",
  };

  const getSelectedEmailLabel = () => {
    const selected = emailOptions.find(
      (option) => option.value === emailIntensity,
    );
    return selected ? selected.label : "Real time";
  };

  const CustomPicker = ({
    visible,
    options,
    selectedValue,
    onSelect,
    onClose,
    title,
  }) => {
    if (!visible) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity style={styles.modalCloseIcon} onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalScrollView}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionItem,
                  selectedValue === option.value && styles.selectedOption,
                ]}
                onPress={() => {
                  onSelect(option.value);
                  onClose();
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedValue === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
                {selectedValue === option.value && (
                  <Ionicons name="checkmark" size={20} color="#007bff" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Email Notification Intensity */}
      <View style={styles.section}>
        <Text style={styles.title}>Email Notification Intensity</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowEmailPicker(true)}
        >
          <Text style={styles.pickerButtonText}>{getSelectedEmailLabel()}</Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
        <Text style={styles.description}>
          {emailDescriptions[emailIntensity]}
        </Text>
      </View>

      {/* Shortcuts Section */}
      <View style={styles.section}>
        <Text style={styles.title}>Shortcuts</Text>
        <Text style={styles.description}>
          Quickly manage all your preferences at once.
        </Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.shortcutButton}
            onPress={() => {
              // Enable all notifications dans All Notifications
              enableAllRef.current.forEach(callback => {
                if (callback) callback();
              });
            }}
          >
            <Text style={styles.buttonText}>Enable all</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutButton}
            onPress={() => {
              // Disable all notifications dans All Notifications
              disableAllRef.current.forEach(callback => {
                if (callback) callback();
              });
            }}
          >
            <Text style={styles.buttonText}>Disable all</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutButton}
            onPress={() => {
              // Disable only email notifications dans All Notifications
              disableEmailsRef.current.forEach(callback => {
                if (callback) callback();
              });
            }}
          >
            <Text style={styles.buttonText}>Disable emails</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutButton}
            onPress={() => {
              // Reset to default dans All Notifications
              resetRef.current.forEach(callback => {
                if (callback) callback();
              });
            }}
          >
            <Text style={styles.buttonText}>Reset to default</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* All Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.title}>All Notifications</Text>
        <Text style={styles.description}>
          Email notifications require an on-site notification enabled.
        </Text>
        
        <AllNotificationsContent 
          onEnableAll={enableAllRef}
          onDisableAll={disableAllRef}
          onReset={resetRef}
          onDisableEmails={disableEmailsRef}
        />
      </View>

      {/* Notifications List */}
      {/*
       <View style={styles.section}>
        <Text style={styles.title}>Notifications</Text>
        {Object.keys(notifications).map((key) => (
          <View key={key} style={styles.notificationItem}>
            <Text style={styles.notificationLabel}>
              {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
            <Switch
              value={notifications[key]}
              onValueChange={() => toggleNotification(key)}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={notifications[key] ? "#007bff" : "#f4f3f4"}
            />
          </View>
        ))}
      </View>
      */}

      {/* Custom Picker Modal */}
      <CustomPicker
        visible={showEmailPicker}
        options={emailOptions}
        selectedValue={emailIntensity}
        onSelect={setEmailIntensity}
        onClose={() => setShowEmailPicker(false)}
        title="Email Notification Intensity"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  pickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginBottom: 8,
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#333",
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  notificationLabel: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    marginRight: 16,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 100,
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  modalCloseIcon: {
    padding: 4,
  },
  modalScrollView: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedOption: {
    backgroundColor: "#f0f8ff",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  selectedOptionText: {
    color: "#007bff",
    fontWeight: "500",
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  shortcutButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    minWidth: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  advancedButton: {
    backgroundColor: "#28A745",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    minWidth: "48%",
    alignItems: "center",
  },
  allNotificationsContainer: {
    marginTop: 8,
  },
  allNotificationItem: {
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  allNotificationTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  allNotificationSubtitle: {
    fontSize: 12,
    color: "#777",
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchContainer: {
    alignItems: "center",
    flex: 1,
  },
  switchLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    textAlign: "center",
    textTransform: "capitalize",
  },
});

export default NotificationsContent;

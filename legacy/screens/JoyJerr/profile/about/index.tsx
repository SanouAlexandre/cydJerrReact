import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import AboutContent from "./about";
import AccountContent from "./account";
import NotificationsContent from "./notifications";
import PreferencesContent from "./preferences";

const AboutTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "About", icon: "person-circle-outline" },
    { key: "Preferences", icon: "options-outline" },
    { key: "Notifications", icon: "notifications-outline" },
    { key: "Account", icon: "person" },
  ];

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tabItem, activeTab === tab.key && styles.activeTab]}
          onPress={() => setActiveTab(tab.key)}
        >
          <Ionicons
            name={tab.icon as any}
            size={18}
            color={activeTab === tab.key ? "#007bff" : "#555"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.key}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const AboutHomeContent = () => {
  const [activeTab, setActiveTab] = useState("About");

  const renderContent = () => {
    switch (activeTab) {
      case "About":
        return <AboutContent />;
      case "Preferences":
        return <PreferencesContent />;
      case "Notifications":
        return <NotificationsContent />;
      case "Account":
        return <AccountContent />;
      default:
        return <AboutContent />;
    }
  };

  return (
    <View style={styles.container}>
      <AboutTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ScrollView style={styles.scrollContainer}>{renderContent()}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#007bff",
  },
  tabText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#555",
  },
  activeTabText: {
    color: "#007bff",
    fontWeight: "600",
  },
});

export default AboutHomeContent;

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons";

import AlbumsContent from "./albums";
import PhotosContent from "./photos";

const AboutTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "Photos", icon: "images-outline" },
    { key: "Albums", icon: "albums-outline" },
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

const PhotosHomeContent = () => {
  // 🔥 Par défaut, "Photos" est sélectionné
  const [activeTab, setActiveTab] = useState("Photos");

  const renderContent = () => {
    switch (activeTab) {
      case "Photos":
        return <PhotosContent />;
      case "Albums":
        return <AlbumsContent />;
    }
  };

  return (
    <View style={styles.container}>
      <AboutTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
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

export default PhotosHomeContent;


import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";

interface GroupsHeaderProps {
  onSearch: (query: string) => void;
  onFilterToggle: () => void;
  onCreateGroup: () => void;
}

const GroupsHeader: React.FC<GroupsHeaderProps> = ({
  onSearch,
  onFilterToggle,
  onCreateGroup,
}) => {
  const [query, setQuery] = useState("");

  const handleSearch = (text: string) => {
    setQuery(text);
    if (onSearch) onSearch(text);
  };

  return (
    <View style={styles.header}>
      <View style={styles.searchRow}>
        <View style={styles.searchWrapper}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search groups..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={query}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={onFilterToggle}>
          <Ionicons name="filter" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.createButton} onPress={onCreateGroup}>
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.createButtonText}>Create Group</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  filterButton: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default GroupsHeader;

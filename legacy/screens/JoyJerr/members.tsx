import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Modal,
  Switch,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { JoyJerrStackParamList } from "../../../src/navigation/types";
import NavigationMenu from "./components/NavigationMenu";
import DateTimePicker from "@react-native-community/datetimepicker";

const Header = ({ onSearch, showNavigationMenu, setShowNavigationMenu }) => {
  const navigation = useNavigation<NativeStackNavigationProp<JoyJerrStackParamList>>();
  const [query, setQuery] = useState("");

  const handleSearch = (text) => {
    setQuery(text);
    if (onSearch) onSearch(text);
  };

  return (
    <View style={styles.headerWrapper}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      {/* Avatar avec badge au centre */}
      <View style={styles.avatarWrapper}>
        <Image
          source={{
            uri: "https://demo.peepso.com/wp-content/peepso/users/2/ec758423ef-avatar-full.jpg",
          }}
          style={styles.avatar}
        />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>9</Text>
        </View>
      </View>
      {/* Menu à droite */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setShowNavigationMenu(true)}
      >
        <Ionicons name="menu" size={28} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const MembersFilters = ({ visible, onClose, onApply }) => {
  const [gender, setGender] = useState("");
  const [sort, setSort] = useState("");
  const [following, setFollowing] = useState("-1");
  const [moderation, setModeration] = useState("0");
  const [onlyAvatars, setOnlyAvatars] = useState(false);

  const genderOptions = [
    { label: "Any", value: "" },
    { label: "Male", value: "m" },
    { label: "Female", value: "f" },
  ];

  const sortOptions = [
    { label: "Alphabetical", value: "" },
    { label: "Recently online", value: "peepso_last_activity|asc" },
    { label: "Latest members", value: "registered|desc" },
    { label: "Most liked", value: "most_liked|desc" },
    { label: "Most followers", value: "most_followers|desc" },
  ];

  const followingOptions = [
    { label: "All members", value: "-1" },
    { label: "Members I follow", value: "1" },
    { label: "Members I don't follow", value: "0" },
  ];

  const moderationOptions = [
    { label: "All members", value: "0" },
    { label: "Reported", value: "1" },
  ];

  const handleApply = () => {
    onApply({
      gender,
      sort,
      following,
      moderation,
      onlyAvatars,
    });
    onClose();
  };

  const handleReset = () => {
    setGender("");
    setSort("");
    setFollowing("-1");
    setModeration("0");
    setOnlyAvatars(false);
  };

  const renderOptionSelector = (
    title,
    options,
    selectedValue,
    onValueChange,
  ) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterLabel}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              selectedValue === option.value && styles.optionButtonSelected,
            ]}
            onPress={() => onValueChange(option.value)}
          >
            <Text
              style={[
                styles.optionText,
                selectedValue === option.value && styles.optionTextSelected,
              ]}
            >
              {option.label}
            </Text>
            {selectedValue === option.value && (
              <Ionicons name="checkmark" size={16} color="#007AFF" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderOptionSelector("Gender", genderOptions, gender, setGender)}
            {renderOptionSelector("Sort by", sortOptions, sort, setSort)}
            {renderOptionSelector(
              "Following",
              followingOptions,
              following,
              setFollowing,
            )}
            {renderOptionSelector(
              "Moderation",
              moderationOptions,
              moderation,
              setModeration,
            )}

            {/* Avatars Switch */}
            <View style={styles.filterSection}>
              <View style={styles.switchRow}>
                <Text style={styles.filterLabel}>Only users with avatars</Text>
                <Switch
                  value={onlyAvatars}
                  onValueChange={setOnlyAvatars}
                  trackColor={{ false: "#E5E5EA", true: "#34C759" }}
                  thumbColor={onlyAvatars ? "#fff" : "#fff"}
                  ios_backgroundColor="#E5E5EA"
                />
              </View>
            </View>
          </ScrollView>

          {/* Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const MembersHeader = ({ onSearch, onToggleFilters }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (text) => {
    setQuery(text);
    if (onSearch) onSearch(text);
  };

  return (
    <View style={styles.header}>
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Start typing to search..."
        placeholderTextColor="#666"
        value={query}
        onChangeText={handleSearch}
      />

      {/* Filters Button */}
      <TouchableOpacity style={styles.filterButton} onPress={onToggleFilters}>
        <Ionicons name="settings-outline" size={22} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const members = [
  {
    id: 1,
    name: "Alexia Torman",
    avatar:
      "https://demo.peepso.com/wp-content/peepso/users/21/e494f7960d-avatar-full.jpg",
    mutualFriends: 23,
    followers: 156,
  },
  {
    id: 2,
    name: "Andy Gibbs",
    avatar:
      "https://demo.peepso.com/wp-content/peepso/users/25/2e065a7559-avatar-full.jpg",
    mutualFriends: 14,
    followers: 89,
  },
  {
    id: 3,
    name: "Astrid Jarvis",
    avatar:
      "https://demo.peepso.com/wp-content/peepso/users/8/8564d62b3a-avatar-full.jpg",
    mutualFriends: 22,
    followers: 134,
  },
  {
    id: 4,
    name: "Catherine Siregar",
    avatar:
      "https://demo.peepso.com/wp-content/peepso/users/13/fcd81dfe6b-avatar-full.jpg",
    mutualFriends: 18,
    followers: 76,
  },
  {
    id: 5,
    name: "Cinda Phelps",
    avatar:
      "https://demo.peepso.com/wp-content/peepso/users/4/453025cc85-avatar-full.jpg",
    mutualFriends: 7,
    followers: 43,
  },
  {
    id: 6,
    name: "Tobias Westbrook",
    avatar:
      "https://demo.peepso.com/wp-content/peepso/users/1/5731bf0708-avatar-full.jpg",
    mutualFriends: 2,
    followers: 28,
  },
];

const MembersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    gender: "",
    sort: "",
    following: "-1",
    moderation: "0",
    onlyAvatars: false,
  });
  const [showUserActionsModal, setShowUserActionsModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [banDate, setBanDate] = useState(new Date(2025, 8, 10)); // September 10, 2025
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Custom date picker states
  const [selectedDay, setSelectedDay] = useState("10");
  const [selectedMonth, setSelectedMonth] = useState("September");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // Date picker options
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleToggleFilters = () => {
    setShowFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setShowFilterModal(false);
  };

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
    console.log("Applied filters:", filters);
    setShowFilterModal(false);
  };

  const handleUserActions = (user) => {
    setSelectedUser(user);
    setShowUserActionsModal(true);
  };

  const handleBanUser = () => {
    setShowUserActionsModal(false);
    setShowBanModal(true);
  };

  const handleReportUser = () => {
    setShowUserActionsModal(false);
    console.log("Report user:", selectedUser?.name);
    // Add report user logic here
  };

  const handleBanUntilDate = () => {
    setShowBanModal(false);
    console.log("Ban user until:", banDate, selectedUser?.name);
    // Add ban until date logic here
  };

  const handleBanIndefinitely = () => {
    setShowBanModal(false);
    console.log("Ban user indefinitely:", selectedUser?.name);
    // Add ban indefinitely logic here
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "popular" && member.followers > 100) ||
      (selectedFilter === "friends" && member.mutualFriends > 15) ||
      (selectedFilter === "new" && member.followers < 50);

    return matchesSearch && matchesFilter;
  });

  const renderMember = ({ item }) => (
    <TouchableOpacity style={styles.memberCard}>
      <View style={styles.memberInfo}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
        </View>

        <View style={styles.memberDetails}>
          <Text style={styles.memberName}>{item.name}</Text>
          <Text style={styles.mutualFriendsText}>
            {item.mutualFriends} mutual friends
          </Text>
          <Text style={styles.followersText}>
            {item.followers} followers
          </Text>
        </View>
      </View>

      <View style={styles.memberActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="person-add-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleUserActions(item)}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderFilters = () => {
    if (!showFilters) return null;

    const filters = [
      { key: "all", label: "All Members", icon: "people-outline" },
      { key: "popular", label: "Popular", icon: "star-outline" },
      { key: "friends", label: "Many Friends", icon: "heart-outline" },
      { key: "new", label: "New Members", icon: "person-add-outline" },
    ];

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterChip,
              selectedFilter === filter.key && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Ionicons
              name={filter.icon}
              size={16}
              color={selectedFilter === filter.key ? "#fff" : "#666"}
            />
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === filter.key && styles.filterChipTextActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        onSearch={handleSearch}
        showNavigationMenu={showNavigationMenu}
        setShowNavigationMenu={setShowNavigationMenu}
      />

      <MembersHeader
        onSearch={handleSearch}
        onToggleFilters={handleToggleFilters}
      />

      <MembersFilters
        visible={showFilterModal}
        onClose={handleCloseFilterModal}
        onApply={handleApplyFilters}
      />

      {renderFilters()}

      <FlatList
        data={filteredMembers}
        renderItem={renderMember}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.membersList}
        showsVerticalScrollIndicator={false}
      />

      <NavigationMenu
        visible={showNavigationMenu}
        onClose={() => setShowNavigationMenu(false)}
      />

      {/* User Actions Modal */}
      <Modal
        visible={showUserActionsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUserActionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.userActionsModal}>
            <TouchableOpacity
              style={styles.userActionItem}
              onPress={handleReportUser}
            >
              <Ionicons name="flag-outline" size={20} color="#FF3B30" />
              <Text style={styles.userActionText}>Report User</Text>
            </TouchableOpacity>

            <View style={styles.userActionDivider} />

            <TouchableOpacity
              style={styles.userActionItem}
              onPress={handleBanUser}
            >
              <Ionicons name="ban-outline" size={20} color="#FF3B30" />
              <Text style={styles.userActionText}>Ban</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.userActionCancel}
              onPress={() => setShowUserActionsModal(false)}
            >
              <Text style={styles.userActionCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Ban User Modal */}
      <Modal
        visible={showBanModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBanModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.banModalContent}>
            <View style={styles.banModalHeader}>
              <Text style={styles.banModalTitle}>Ban this user</Text>
              <TouchableOpacity
                onPress={() => setShowBanModal(false)}
                style={styles.banCloseButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.banOptions}>
              <TouchableOpacity
                style={styles.banOption}
                onPress={() => {
                  setShowBanModal(false);
                  setShowCustomDatePicker(true);
                }}
              >
                <Text style={styles.banOptionTitle}>Ban until</Text>
                <Text style={styles.banOptionDate}>
                  {selectedDay} {selectedMonth} {selectedYear}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.banOption}
                onPress={handleBanIndefinitely}
              >
                <Text style={styles.banOptionTitle}>Ban indefinitely</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.banModalFooter}>
              <TouchableOpacity
                style={styles.banCancelButton}
                onPress={() => setShowBanModal(false)}
              >
                <Text style={styles.banCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.banConfirmButton}
                onPress={handleBanUntilDate}
              >
                <Text style={styles.banConfirmText}>Ban this user</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.banFollowingText}>Following</Text>
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.datePickerCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.datePickerDone}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={banDate}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setBanDate(selectedDate);
                  }
                }}
                minimumDate={new Date()}
                style={styles.datePicker}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Custom Date Picker Modal */}
      <Modal
        visible={showCustomDatePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCustomDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.customDatePickerContainer}>
            <View style={styles.customDatePickerHeader}>
              <TouchableOpacity onPress={() => setShowCustomDatePicker(false)}>
                <Text style={styles.datePickerCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.customDatePickerTitle}>Select ban until date</Text>
              <TouchableOpacity onPress={() => setShowCustomDatePicker(false)}>
                <Text style={styles.datePickerDone}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.customDatePickerContent}>
              <Text style={styles.sectionLabel}>Date</Text>
              <View style={styles.datePickerRow}>
                <TouchableOpacity
                  style={styles.datePickerItem}
                  onPress={() => {
                    setShowDayPicker(!showDayPicker);
                    setShowMonthPicker(false);
                    setShowYearPicker(false);
                  }}
                >
                  <Text style={styles.datePickerText}>{selectedDay}</Text>
                  <Ionicons name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.datePickerItem}
                  onPress={() => {
                    setShowMonthPicker(!showMonthPicker);
                    setShowDayPicker(false);
                    setShowYearPicker(false);
                  }}
                >
                  <Text style={styles.datePickerText}>{selectedMonth}</Text>
                  <Ionicons name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.datePickerItem}
                  onPress={() => {
                    setShowYearPicker(!showYearPicker);
                    setShowDayPicker(false);
                    setShowMonthPicker(false);
                  }}
                >
                  <Text style={styles.datePickerText}>{selectedYear}</Text>
                  <Ionicons name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Day Picker */}
              {showDayPicker && (
                <View style={styles.pickerDropdown}>
                  <ScrollView style={styles.pickerScrollView}>
                    {days.map((day) => (
                      <TouchableOpacity
                        key={day}
                        style={styles.pickerOption}
                        onPress={() => {
                          setSelectedDay(day);
                          setShowDayPicker(false);
                        }}
                      >
                        <Text style={styles.pickerOptionText}>{day}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Month Picker */}
              {showMonthPicker && (
                <View style={styles.pickerDropdown}>
                  <ScrollView style={styles.pickerScrollView}>
                    {months.map((month) => (
                      <TouchableOpacity
                        key={month}
                        style={styles.pickerOption}
                        onPress={() => {
                          setSelectedMonth(month);
                          setShowMonthPicker(false);
                        }}
                      >
                        <Text style={styles.pickerOptionText}>{month}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Year Picker */}
              {showYearPicker && (
                <View style={styles.pickerDropdown}>
                  <ScrollView style={styles.pickerScrollView}>
                    {years.map((year) => (
                      <TouchableOpacity
                        key={year}
                        style={styles.pickerOption}
                        onPress={() => {
                          setSelectedYear(year.toString());
                          setShowYearPicker(false);
                        }}
                      >
                        <Text style={styles.pickerOptionText}>{year}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 4,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  menuButton: {
    marginLeft: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  filtersContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  filterChipActive: {
    backgroundColor: "#007AFF",
  },
  filterChipText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
  },
  filterChipTextActive: {
    color: "#fff",
  },
  membersCount: {
    padding: 10,
    backgroundColor: "#fff",
  },
  membersCountText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  membersList: {
    padding: 10,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  mutualFriendsText: {
    fontSize: 12,
    color: "#007AFF",
    marginBottom: 2,
    fontWeight: "500",
  },
  followersText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  memberActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
  },
  closeButton: {
    padding: 4,
  },
  modalScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  filterSection: {
    marginBottom: 25,
  },
  filterLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  optionButtonSelected: {
    backgroundColor: "#E3F2FD",
    borderColor: "#007AFF",
  },
  optionText: {
    fontSize: 16,
    color: "#1C1C1E",
  },
  optionTextSelected: {
    color: "#007AFF",
    fontWeight: "600",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 12,
  },
  resetButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    alignItems: "center",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  // User Actions Modal Styles
  userActionsModal: {
    backgroundColor: "#fff",
    borderRadius: 15,
    margin: 20,
    minWidth: 200,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userActionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingHorizontal: 20,
  },
  userActionText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "500",
  },
  userActionDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 15,
  },
  userActionCancel: {
    padding: 15,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginTop: 10,
  },
  userActionCancelText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  // Ban Modal Styles
  banModalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: 20,
    paddingBottom: 30,
    maxHeight: "50%",
    width: "90%",
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: "auto",
  },
  banModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  banModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  banCloseButton: {
    padding: 4,
  },
  banOptions: {
    padding: 20,
    gap: 15,
  },
  banOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
  },
  banOptionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  banOptionDate: {
    fontSize: 14,
    color: "#666",
  },
  banModalFooter: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 10,
  },
  banCancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    alignItems: "center",
  },
  banConfirmButton: {
    flex: 2,
    paddingVertical: 12,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
    alignItems: "center",
  },
  banCancelText: {
    fontSize: 16,
    color: "#1C1C1E",
    fontWeight: "500",
  },
  banConfirmText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  banFollowingText: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  // Date Picker Styles
  datePickerOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },
  datePickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "100%",
    maxWidth: 350,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  datePickerCancel: {
    fontSize: 16,
    color: "#007AFF",
  },
  datePickerDone: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  datePicker: {
    backgroundColor: "#fff",
  },
  // Custom Date Picker Styles
  customDatePickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    width: "90%",
    maxHeight: "70%",
    alignSelf: "center",
    marginTop: "auto",
    marginBottom: "auto",
  },
  customDatePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  customDatePickerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  customDatePickerContent: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  datePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  datePickerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  datePickerText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  pickerDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    maxHeight: 150,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    zIndex: 10,
    marginTop: 5,
  },
  pickerScrollView: {
    maxHeight: 150,
  },
  pickerOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  pickerOptionText: {
    fontSize: 14,
    color: "#333",
  },
});

export default MembersList;
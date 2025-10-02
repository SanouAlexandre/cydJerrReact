
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const AboutContent = () => {
  const profileCompletion = 55; // Profile completion percentage
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [fieldValues, setFieldValues] = useState({
    firstName: "Ashley",
    lastName: "Smith",
    gender: "Female",
    birthdate: "March 25, 1985",
    education: "PeepSo University",
    hobby: "Tell us about it.",
    aboutMe: "Tell us something about yourself.",
    website: "What's your website's address?",
    location: "Share your location",
  });

  const [tempValue, setTempValue] = useState("");

  const [fieldVisibilities, setFieldVisibilities] = useState({
    firstName: "Public",
    lastName: "Public",
    gender: "Public",
    birthdate: "Public",
    education: "Public",
    hobby: "Public",
    aboutMe: "Public",
    website: "Public",
    location: "Public",
  });

  const visibilityOptions = [
    {
      key: "Public",
      label: "Public",
      description: "Everyone can see this field",
    },
    {
      key: "Site Members",
      label: "Site Members",
      description: "Only registered users can see this field",
    },
    {
      key: "Friends Only",
      label: "Friends Only",
      description: "Only your friends can see this field",
    },
    {
      key: "Only Me",
      label: "Only Me",
      description: "Only you can see this field",
    },
  ];

  // Custom date picker states
  const [selectedDay, setSelectedDay] = useState("25");
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [selectedYear, setSelectedYear] = useState("1985");
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // Generate options for date pickers
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => String(currentYear - i));

  const handleVisibilityPress = (fieldKey) => {
    setSelectedField(fieldKey);
    setShowVisibilityModal(true);
  };

  const updateFieldVisibility = (visibility) => {
    setFieldVisibilities((prev) => ({
      ...prev,
      [selectedField]: visibility,
    }));
    setShowVisibilityModal(false);
  };

  const handleEditPress = (fieldKey) => {
    setEditingField(fieldKey);
    if (fieldKey === "birthdate") {
      setShowDatePicker(true);
    } else if (fieldKey === "gender") {
      setShowEditModal(true);
    } else {
      setTempValue(fieldValues[fieldKey]);
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (editingField !== "birthdate" && editingField !== "gender") {
      setFieldValues((prev) => ({
        ...prev,
        [editingField]: tempValue,
      }));
    }
    setShowEditModal(false);
    setTempValue("");
    setEditingField("");
  };

  const handleDateSave = () => {
    const formattedDate = `${selectedMonth} ${selectedDay}, ${selectedYear}`;
    setFieldValues((prev) => ({
      ...prev,
      birthdate: formattedDate,
    }));
    setShowDatePicker(false);
    setEditingField("");
  };

  const handleGenderSelect = (gender) => {
    setFieldValues((prev) => ({
      ...prev,
      gender: gender,
    }));
    setShowEditModal(false);
    setEditingField("");
  };

  const renderEditContent = () => {
    if (editingField === "gender") {
      return (
        <View>
          <Text style={styles.modalTitle}>Select Gender</Text>
          {["Male", "Female", "Other", "Prefer not to say"].map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.genderOption,
                fieldValues.gender === option && styles.genderOptionSelected,
              ]}
              onPress={() => handleGenderSelect(option)}
            >
              <Text
                style={[
                  styles.genderOptionText,
                  fieldValues.gender === option &&
                    styles.genderOptionTextSelected,
                ]}
              >
                {option}
              </Text>
              {fieldValues.gender === option && (
                <Ionicons name="checkmark" size={20} color="#007bff" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.modalTitle}>
          Edit {editingField.charAt(0).toUpperCase() + editingField.slice(1)}
        </Text>
        <TextInput
          style={styles.editInput}
          value={tempValue}
          onChangeText={setTempValue}
          placeholder={`Enter ${editingField}`}
          multiline={editingField === "aboutMe" || editingField === "hobby"}
          numberOfLines={
            editingField === "aboutMe" || editingField === "hobby" ? 4 : 1
          }
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={styles.modalCancelButton}
            onPress={() => {
              setShowEditModal(false);
              setTempValue("");
              setEditingField("");
            }}
          >
            <Text style={styles.modalCancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalSaveButton}
            onPress={handleSaveEdit}
          >
            <Text style={styles.modalSaveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Completion Progress */}
      <View style={styles.progressSection}>
        <Text style={styles.progressTitle}>
          Your profile is {profileCompletion}% complete
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${profileCompletion}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* Profile Fields Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Profile fields</Text>
        </View>

        <View style={styles.profileField}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>FIRST NAME *</Text>
            <View style={styles.fieldActions}>
              <TouchableOpacity
                style={[
                  styles.visibilityButton,
                  styles.visibilityButtonDisabled,
                ]}
                disabled={true}
              >
                <Text
                  style={[styles.visibilityText, styles.visibilityTextDisabled]}
                >
                  {fieldVisibilities.firstName}
                </Text>
                <Ionicons name="chevron-down" size={12} color="#ccc" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditPress("firstName")}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.fieldValue}>{fieldValues.firstName}</Text>
        </View>

        <View style={styles.profileField}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>LAST NAME *</Text>
            <View style={styles.fieldActions}>
              <TouchableOpacity
                style={[
                  styles.visibilityButton,
                  styles.visibilityButtonDisabled,
                ]}
                disabled={true}
              >
                <Text
                  style={[styles.visibilityText, styles.visibilityTextDisabled]}
                >
                  {fieldVisibilities.lastName}
                </Text>
                <Ionicons name="chevron-down" size={12} color="#ccc" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditPress("lastName")}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.fieldValue}>{fieldValues.lastName}</Text>
        </View>

        <View style={styles.profileField}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>GENDER *</Text>
            <View style={styles.fieldActions}>
              <TouchableOpacity
                style={styles.visibilityButton}
                onPress={() => handleVisibilityPress("gender")}
              >
                <Text style={styles.visibilityText}>
                  {fieldVisibilities.gender}
                </Text>
                <Ionicons name="chevron-down" size={12} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditPress("gender")}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.fieldValue}>{fieldValues.gender}</Text>
        </View>

        <View style={styles.profileField}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>BIRTHDATE *</Text>
            <View style={styles.fieldActions}>
              <TouchableOpacity
                style={styles.visibilityButton}
                onPress={() => handleVisibilityPress("birthdate")}
              >
                <Text style={styles.visibilityText}>
                  {fieldVisibilities.birthdate}
                </Text>
                <Ionicons name="chevron-down" size={12} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditPress("birthdate")}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.fieldValue}>{fieldValues.birthdate}</Text>
        </View>

        <View style={styles.profileField}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>EDUCATION</Text>
            <View style={styles.fieldActions}>
              <TouchableOpacity
                style={styles.visibilityButton}
                onPress={() => handleVisibilityPress("education")}
              >
                <Text style={styles.visibilityText}>
                  {fieldVisibilities.education}
                </Text>
                <Ionicons name="chevron-down" size={12} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditPress("education")}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={[
              styles.fieldValue,
              fieldValues.education === "PeepSo University"
                ? null
                : styles.fieldPlaceholder,
            ]}
          >
            {fieldValues.education}
          </Text>
        </View>

        <View style={styles.profileField}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>HOBBY</Text>
            <View style={styles.fieldActions}>
              <TouchableOpacity
                style={styles.visibilityButton}
                onPress={() => handleVisibilityPress("hobby")}
              >
                <Text style={styles.visibilityText}>
                  {fieldVisibilities.hobby}
                </Text>
                <Ionicons name="chevron-down" size={12} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditPress("hobby")}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={[
              styles.fieldValue,
              fieldValues.hobby === "Tell us about it."
                ? styles.fieldPlaceholder
                : null,
            ]}
          >
            {fieldValues.hobby}
          </Text>
        </View>

        <View style={styles.profileField}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>ABOUT ME</Text>
            <View style={styles.fieldActions}>
              <TouchableOpacity
                style={styles.visibilityButton}
                onPress={() => handleVisibilityPress("aboutMe")}
              >
                <Text style={styles.visibilityText}>
                  {fieldVisibilities.aboutMe}
                </Text>
                <Ionicons name="chevron-down" size={12} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditPress("aboutMe")}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={[
              styles.fieldValue,
              fieldValues.aboutMe === "Tell us something about yourself."
                ? styles.fieldPlaceholder
                : null,
            ]}
          >
            {fieldValues.aboutMe}
          </Text>
        </View>

        <View style={styles.profileField}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>WEBSITE</Text>
            <View style={styles.fieldActions}>
              <TouchableOpacity
                style={styles.visibilityButton}
                onPress={() => handleVisibilityPress("website")}
              >
                <Text style={styles.visibilityText}>
                  {fieldVisibilities.website}
                </Text>
                <Ionicons name="chevron-down" size={12} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditPress("website")}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={[
              styles.fieldValue,
              fieldValues.website === "What's your website's address?"
                ? styles.fieldPlaceholder
                : null,
            ]}
          >
            {fieldValues.website}
          </Text>
        </View>

        <View style={styles.profileField}>
          <View style={styles.fieldHeader}>
            <Text style={styles.fieldLabel}>LOCATION</Text>
            <View style={styles.fieldActions}>
              <TouchableOpacity
                style={styles.visibilityButton}
                onPress={() => handleVisibilityPress("location")}
              >
                <Text style={styles.visibilityText}>
                  {fieldVisibilities.location}
                </Text>
                <Ionicons name="chevron-down" size={12} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditPress("location")}
              >
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text
            style={[
              styles.fieldValue,
              fieldValues.location === "Share your location"
                ? styles.fieldPlaceholder
                : null,
            ]}
          >
            {fieldValues.location}
          </Text>
        </View>
      </View>

      {/* Edit Field Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowEditModal(false);
          setTempValue("");
          setEditingField("");
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>{renderEditContent()}</View>
        </View>
      </Modal>

      {/* Custom Date Picker */}
      {showDatePicker && (
        <Modal
          visible={showDatePicker}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setShowDatePicker(false);
            setEditingField("");
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.datePickerModalContent}>
              <Text style={styles.modalTitle}>Select Birthdate</Text>

              <Text style={styles.datePickerLabel}>Date</Text>
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
                          setSelectedYear(year);
                          setShowYearPicker(false);
                        }}
                      >
                        <Text style={styles.pickerOptionText}>{year}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => {
                    setShowDatePicker(false);
                    setEditingField("");
                  }}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={handleDateSave}
                >
                  <Text style={styles.modalSaveButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Visibility Settings Modal */}
      <Modal
        visible={showVisibilityModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVisibilityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Visibility Settings</Text>

            {visibilityOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.visibilityOption,
                  fieldVisibilities[selectedField] === option.key &&
                    styles.visibilityOptionSelected,
                ]}
                onPress={() => updateFieldVisibility(option.key)}
              >
                <View style={styles.visibilityOptionHeader}>
                  <Text style={styles.visibilityOptionTitle}>
                    {option.label}
                  </Text>
                  {fieldVisibilities[selectedField] === option.key && (
                    <Ionicons name="checkmark" size={20} color="#007bff" />
                  )}
                </View>
                <Text style={styles.visibilityOptionDescription}>
                  {option.description}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.modalBackButton}
              onPress={() => setShowVisibilityModal(false)}
            >
              <Text style={styles.modalBackButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  progressSection: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 8,
    padding: 16,
    marginBottom: 5,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  progressBarContainer: {
    width: "100%",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  section: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 8,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  profileField: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  fieldHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#888",
    letterSpacing: 0.5,
  },
  fieldActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  visibilityButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#f8f8f8",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginRight: 8,
  },
  visibilityButtonDisabled: {
    backgroundColor: "#f0f0f0",
    borderColor: "#ccc",
  },
  visibilityText: {
    fontSize: 12,
    color: "#666",
    marginRight: 4,
  },
  visibilityTextDisabled: {
    color: "#ccc",
  },
  editButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#f8f8f8",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  editButtonText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
  fieldValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  fieldPlaceholder: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  datePickerModalContent: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    minHeight: 300,
  },
  datePickerLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  datePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    position: "relative",
  },
  datePickerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: "space-between",
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  visibilityOption: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  visibilityOptionSelected: {
    borderColor: "#007bff",
    backgroundColor: "#f0f8ff",
  },
  visibilityOptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  visibilityOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  visibilityOptionDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  modalBackButton: {
    backgroundColor: "#6c757d",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  modalBackButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "#6c757d",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  modalSaveButton: {
    flex: 1,
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 10,
  },
  modalCancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalSaveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  genderOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  genderOptionSelected: {
    borderColor: "#007bff",
    backgroundColor: "#f0f8ff",
  },
  genderOptionText: {
    fontSize: 16,
    color: "#333",
  },
  genderOptionTextSelected: {
    color: "#007bff",
    fontWeight: "600",
  },
});

export default AboutContent;


import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';

const PreferencesContent = () => {
  const [displayNameOption, setDisplayNameOption] = useState('real_name');
  const [profileLikable, setProfileLikable] = useState(true);
  const [hideBirthdayYear, setHideBirthdayYear] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('10');
  const [profilePostPermission, setProfilePostPermission] = useState('20');
  const [hideOnlineStatus, setHideOnlineStatus] = useState(false);
  const [timezone, setTimezone] = useState('0');
  const [theme, setTheme] = useState('new_preset');
  const [chatEnabled, setChatEnabled] = useState(true);
  const [chatMinimized, setChatMinimized] = useState(false);
  const [chatFriendsOnly, setChatFriendsOnly] = useState(true);

  // Modal states for pickers
  const [showDisplayNamePicker, setShowDisplayNamePicker] = useState(false);
  const [showVisibilityPicker, setShowVisibilityPicker] = useState(false);
  const [showPostPermissionPicker, setShowPostPermissionPicker] = useState(false);
  const [showTimezonePicker, setShowTimezonePicker] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const displayNameOptions = [
    { label: "Full name: Ashley Smith", value: "real_name" },
    { label: "First name: Ashley", value: "real_name_first" },
    { label: "First name + last name initial: Ashley S.", value: "real_name_first_last_initial" },
    { label: "Username: demo", value: "username" }
  ];

  const visibilityOptions = [
    { label: "Public", value: "10" },
    { label: "Site Members", value: "20" }
  ];

  const postPermissionOptions = [
    { label: "Site Members", value: "20" },
    { label: "Friends Only", value: "30" },
    { label: "Only Me", value: "40" }
  ];

  const timezoneOptions = [
    { label: "UTC-12", value: "-12" },
    { label: "UTC-11", value: "-11" },
    { label: "UTC-10", value: "-10" },
    { label: "UTC-9", value: "-9" },
    { label: "UTC-8", value: "-8" },
    { label: "UTC-7", value: "-7" },
    { label: "UTC-6", value: "-6" },
    { label: "UTC-5", value: "-5" },
    { label: "UTC-4", value: "-4" },
    { label: "UTC-3", value: "-3" },
    { label: "UTC-2", value: "-2" },
    { label: "UTC-1", value: "-1" },
    { label: "UTC+0", value: "0" },
    { label: "UTC+1", value: "1" },
    { label: "UTC+2", value: "2" },
    { label: "UTC+3", value: "3" },
    { label: "UTC+4", value: "4" },
    { label: "UTC+5", value: "5" },
    { label: "UTC+6", value: "6" },
    { label: "UTC+7", value: "7" },
    { label: "UTC+8", value: "8" },
    { label: "UTC+9", value: "9" },
    { label: "UTC+10", value: "10" },
    { label: "UTC+11", value: "11" },
    { label: "UTC+12", value: "12" },
    { label: "UTC+13", value: "13" },
    { label: "UTC+14", value: "14" }
  ];

  const themeOptions = [
    { label: "Light Theme", value: "light_theme" },
    { label: "Dark Theme", value: "dark_theme" },
    { label: "New preset", value: "new_preset" }
  ];

  const renderPickerModal = (visible, setVisible, options, selectedValue, onSelect, title) => {
    if (!visible) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity
              style={styles.modalCloseIcon}
              onPress={() => setVisible(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView 
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={true}
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionItem,
                  selectedValue === option.value && styles.selectedOption
                ]}
                onPress={() => {
                  onSelect(option.value);
                  setVisible(false);
                }}
              >
                <Text style={[
                  styles.optionText,
                  selectedValue === option.value && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
                {selectedValue === option.value && (
                  <Ionicons name="checkmark" size={20} color="#007bff" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setVisible(false)}
          >
            <Text style={styles.modalCloseButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPickerField = (label, selectedValue, options, onPress) => {
    const selectedOption = options.find(opt => opt.value === selectedValue);
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TouchableOpacity style={styles.pickerButton} onPress={onPress}>
          <Text style={styles.pickerButtonText}>
            {selectedOption ? selectedOption.label : "Select..."}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSwitchField = (label, value, onValueChange) => (
    <View style={styles.switchContainer}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#e0e0e0', true: '#007bff' }}
        thumbColor={value ? '#fff' : '#fff'}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        
        {renderPickerField(
          "Display my name as",
          displayNameOption,
          displayNameOptions,
          () => setShowDisplayNamePicker(true)
        )}

        {renderSwitchField(
          "Allow others to \"like\" my profile",
          profileLikable,
          setProfileLikable
        )}

        {renderSwitchField(
          "Hide my birthday year",
          hideBirthdayYear,
          setHideBirthdayYear
        )}

        {renderPickerField(
          "Who can see my profile",
          profileVisibility,
          visibilityOptions,
          () => setShowVisibilityPicker(true)
        )}

        {renderPickerField(
          "Who can post on my profile",
          profilePostPermission,
          postPermissionOptions,
          () => setShowPostPermissionPicker(true)
        )}
      </View>

      {/* Other Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other</Text>
        
        {renderSwitchField(
          "Don't show my online status",
          hideOnlineStatus,
          setHideOnlineStatus
        )}

        {renderPickerField(
          "My timezone",
          timezone,
          timezoneOptions,
          () => setShowTimezonePicker(true)
        )}
      </View>

      {/* Theme Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Theme</Text>
        
        {renderPickerField(
          "Preferred color theme",
          theme,
          themeOptions,
          () => setShowThemePicker(true)
        )}
      </View>

      {/* Messages and Chat Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Messages and Chat</Text>

        {renderSwitchField(
          "Enable Chat (Messages will still work if you disable Chat)",
          chatEnabled,
          setChatEnabled
        )}

        {renderSwitchField(
          "Open minimized chat window for new message",
          chatMinimized,
          setChatMinimized
        )}

        {renderSwitchField(
          "Allow new messages only from friends",
          chatFriendsOnly,
          setChatFriendsOnly
        )}
      </View>

      {/* Modals */}
      {renderPickerModal(
        showDisplayNamePicker,
        setShowDisplayNamePicker,
        displayNameOptions,
        displayNameOption,
        setDisplayNameOption,
        "Display Name Options"
      )}

      {renderPickerModal(
        showVisibilityPicker,
        setShowVisibilityPicker,
        visibilityOptions,
        profileVisibility,
        setProfileVisibility,
        "Profile Visibility"
      )}

      {renderPickerModal(
        showPostPermissionPicker,
        setShowPostPermissionPicker,
        postPermissionOptions,
        profilePostPermission,
        setProfilePostPermission,
        "Post Permissions"
      )}

      {renderPickerModal(
        showTimezonePicker,
        setShowTimezonePicker,
        timezoneOptions,
        timezone,
        setTimezone,
        "Select Timezone"
      )}

      {renderPickerModal(
        showThemePicker,
        setShowThemePicker,
        themeOptions,
        theme,
        setTheme,
        "Select Theme"
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 8,
    padding: 16,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
  },
  pickerButtonText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    marginRight: 12,
    lineHeight: 20,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  modalCloseIcon: {
    padding: 4,
  },
  modalScrollView: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedOption: {
    borderColor: '#007bff',
    backgroundColor: '#f0f8ff',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  selectedOptionText: {
    color: '#007bff',
    fontWeight: '600',
  },
  modalCloseButton: {
    backgroundColor: '#6c757d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PreferencesContent;

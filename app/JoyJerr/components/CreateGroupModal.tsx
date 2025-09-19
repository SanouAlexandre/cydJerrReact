import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";

const CreateGroupModal = ({ visible, onClose, onCreateGroup }) => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const handleCreate = () => {
    if (!groupName.trim()) {
      return; // Don't create if name is empty
    }

    const groupData = {
      name: groupName.trim(),
      description: groupDescription.trim(),
    };

    if (onCreateGroup) {
      onCreateGroup(groupData);
    }

    // Reset and close
    setGroupName("");
    setGroupDescription("");
    onClose();
  };

  const handleCancel = () => {
    setGroupName("");
    setGroupDescription("");
    onClose();
  };

  const nameCharCount = groupName.length;
  const descriptionCharCount = groupDescription.length;
  const maxNameLength = 64;
  const maxDescriptionLength = 1500;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Group</Text>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Name Field */}
            <View style={styles.fieldContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.fieldLabel}>Name</Text>
                <Text style={styles.requiredAsterisk}>*</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your group's name ..."
                value={groupName}
                onChangeText={setGroupName}
                maxLength={maxNameLength}
                placeholderTextColor="#aaa"
              />
              <Text style={styles.charCount}>{nameCharCount}</Text>
            </View>

            {/* Description Field */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Enter your group's description ..."
                value={groupDescription}
                onChangeText={setGroupDescription}
                maxLength={maxDescriptionLength}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#aaa"
              />
              <Text style={styles.charCount}>{descriptionCharCount}</Text>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.createButton,
                !groupName.trim() && styles.createButtonDisabled,
              ]}
              onPress={handleCreate}
              disabled={!groupName.trim()}
            >
              <Text
                style={[
                  styles.createButtonText,
                  !groupName.trim() && styles.createButtonTextDisabled,
                ]}
              >
                Create
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingTop: 20,
    maxHeight: "80%",
    minHeight: "60%",
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    padding: 4,
  },
  modalScrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  requiredAsterisk: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff4444",
    marginLeft: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#f8f9fa",
  },
  textArea: {
    minHeight: 100,
    maxHeight: 150,
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fff",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#495057",
    fontWeight: "500",
    textAlign: "center",
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  createButtonDisabled: {
    backgroundColor: "#ccc",
  },
  createButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  createButtonTextDisabled: {
    color: "#999",
  },
});

export default CreateGroupModal;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useUserProfile } from "../../../legacy/hooks/useApi";
import { Ionicons, FontAwesome5 } from "react-native-vector-icons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { VideoView, useVideoPlayer } from "expo-video";
import CommunityPosts from "./CommunityPosts";
import NavigationMenu from "./NavigationMenu";
const CommunityContent: React.FC = () => {
  const router = useRouter();
  const [text, setText] = useState<string>("");
  const [mood, setMood] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<string>("Public");
  const [showTextInput, setShowTextInput] = useState<boolean>(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState<boolean>(false);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [pinStatus, setPinStatus] = useState<string>("none"); // "none", "indefinitely", "until"
  const [pinDate, setPinDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [selectedHour, setSelectedHour] = useState<string>("12");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toLocaleString("en-US", { month: "long" }),
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("PM");
  const [showDayPicker, setShowDayPicker] = useState<boolean>(false);
  const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);
  const [showYearPicker, setShowYearPicker] = useState<boolean>(false);
  const [showHourPicker, setShowHourPicker] = useState<boolean>(false);
  const [showMinutePicker, setShowMinutePicker] = useState<boolean>(false);
  const [showPeriodPicker, setShowPeriodPicker] = useState<boolean>(false);

  // Schedule modal states
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [showScheduleDatePicker, setShowScheduleDatePicker] =
    useState<boolean>(false);
  const [scheduleStatus, setScheduleStatus] = useState<string>("immediate"); // "immediate", "scheduled"
  const [scheduleSelectedDay, setScheduleSelectedDay] = useState<number>(
    new Date().getDate(),
  );
  const [scheduleSelectedHour, setScheduleSelectedHour] =
    useState<string>("12");
  const [scheduleSelectedMonth, setScheduleSelectedMonth] = useState<string>(
    new Date().toLocaleString("en-US", { month: "long" }),
  );
  const [scheduleSelectedYear, setScheduleSelectedYear] = useState<string>(
    new Date().getFullYear().toString(),
  );
  const [scheduleSelectedMinute, setScheduleSelectedMinute] =
    useState<string>("00");
  const [scheduleSelectedPeriod, setScheduleSelectedPeriod] =
    useState<string>("PM");
  const [showScheduleDayPicker, setShowScheduleDayPicker] =
    useState<boolean>(false);
  const [showScheduleMonthPicker, setShowScheduleMonthPicker] =
    useState<boolean>(false);
  const [showScheduleYearPicker, setShowScheduleYearPicker] =
    useState<boolean>(false);
  const [showScheduleHourPicker, setShowScheduleHourPicker] =
    useState<boolean>(false);
  const [showScheduleMinutePicker, setShowScheduleMinutePicker] =
    useState<boolean>(false);
  const [showSchedulePeriodPicker, setShowSchedulePeriodPicker] =
    useState<boolean>(false);

  // Mood modal states
  const [showMoodModal, setShowMoodModal] = useState<boolean>(false);

  // Location modal states
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [userCoordinates, setUserCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Image upload states
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Audio URL state
  const [showAudioInput, setShowAudioInput] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>("");

  // Video URL and upload states
  const [showVideoInput, setShowVideoInput] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);

  // Text formatting states
  const [showTextFormatting, setShowTextFormatting] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedTextColor, setSelectedTextColor] = useState<string>("#000000");

  // Help functionality states
  const [showHelpOptions, setShowHelpOptions] = useState<boolean>(false);
  const [helpOptions, setHelpOptions] = useState<string[]>([
    "Option 1",
    "Option 2",
  ]);
  const [selectedHelpOptions, setSelectedHelpOptions] = useState<string[]>([]);
  const [allowMultipleSelection, setAllowMultipleSelection] =
    useState<boolean>(false);
  const [newOptionText, setNewOptionText] = useState<string>("");
  const [editingOption, setEditingOption] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  // File attachment states
  const [showFileAttachment, setShowFileAttachment] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  // GIF functionality states
  const [showGifSelector, setShowGifSelector] = useState<boolean>(false);
  const [gifQuery, setGifQuery] = useState<string>("");
  const [loadingGifs, setLoadingGifs] = useState<boolean>(false);
  const [gifs, setGifs] = useState<any[]>([]);
  const [selectedGif, setSelectedGif] = useState<any | null>(null);

  // Filter visibility state
  const [showFilterContent, setShowFilterContent] = useState<boolean>(false);

  // Navigation menu state
  const [showNavigationMenu, setShowNavigationMenu] = useState<boolean>(false);

  // Post Source selection states
  const [showPostSourceModal, setShowPostSourceModal] =
    useState<boolean>(false);
  const [selectedPostSource, setSelectedPostSource] =
    useState<string>("Community");

  // My Posts selection states
  const [showMyPostsModal, setShowMyPostsModal] = useState<boolean>(false);
  const [selectedMyPosts, setSelectedMyPosts] =
    useState<string>("Show my posts");

  // Sort By selection states
  const [showSortByModal, setShowSortByModal] = useState<boolean>(false);
  const [selectedSortBy, setSelectedSortBy] = useState<string>("New posts");

  // Video player configuration
  const player = useVideoPlayer(uploadedVideo || "", (player) => {
    player.loop = false;
    player.muted = false; // Ensure audio is enabled
    player.volume = 1.0; // Set volume to maximum
  });

  // File attachment functions
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/zip",
          "application/x-zip-compressed",
          "application/x-7z-compressed",
          "application/x-rar-compressed",
          "application/vnd.rar",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newFiles = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.name || `file_${Date.now()}`,
          size: asset.size || 0,
          type: asset.mimeType || "unknown",
        }));

        // Check file size (10MB = 10 * 1024 * 1024 bytes)
        const maxSize = 10 * 1024 * 1024;
        const invalidFiles = newFiles.filter((file) => file.size > maxSize);

        if (invalidFiles.length > 0) {
          Alert.alert(
            "Fichiers trop volumineux",
            "Certains fichiers dépassent la limite de 10MB.",
          );
          return;
        }

        setUploadedFiles((prev) => [...prev, ...newFiles]);
      }
    } catch (error) {
      console.error("Erreur lors de la sélection de fichiers:", error);
      Alert.alert("Erreur", "Impossible de sélectionner les fichiers");
    }
  };

  const removeFile = (indexToRemove: number) => {
    setUploadedFiles((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  // GIF functionality functions
  const fetchTrendingGifs = async () => {
    setLoadingGifs(true);
    try {
      // Using Giphy's public API for trending GIFs
      const API_KEY = "GlVGYHkr3WSBnllca54iNt0yFbjz7L65"; // Demo key
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=25&rating=g`,
      );
      const json = await response.json();
      const gifs = json.data.map((item: any) => ({
        id: item.id,
        url: item.images.fixed_width.url,
        preview_url: item.images.fixed_width_small.url,
      }));
      setGifs(gifs);
    } catch (error) {
      console.error("Erreur lors du chargement des GIFs tendance:", error);
      setGifs([]);
    } finally {
      setLoadingGifs(false);
    }
  };

  const fetchGifs = async (searchTerm: string) => {
    setLoadingGifs(true);
    try {
      // Using Giphy's public API (you would replace with your API key)
      const API_KEY = "GlVGYHkr3WSBnllca54iNt0yFbjz7L65"; // Demo key
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=25&rating=g`,
      );
      const json = await response.json();
      const gifs = json.data.map((item: any) => ({
        id: item.id,
        url: item.images.fixed_width.url,
        preview_url: item.images.fixed_width_small.url,
      }));
      setGifs(gifs);
    } catch (error) {
      console.error("Erreur lors de la recherche de GIFs:", error);
      setGifs([]);
    } finally {
      setLoadingGifs(false);
    }
  };

  const selectGif = (gif: any) => {
    setSelectedGif(gif);
  };

  const removeGif = () => {
    setSelectedGif(null);
  };

  // Effect for GIF search and trending GIFs
  useEffect(() => {
    if (showGifSelector && gifQuery.length === 0) {
      // Load trending GIFs when selector opens and no search query
      fetchTrendingGifs();
    } else if (gifQuery.length > 2) {
      const timeoutId = setTimeout(() => {
        fetchGifs(gifQuery);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else if (gifQuery.length <= 2 && gifQuery.length > 0) {
      setGifs([]);
    }
  }, [gifQuery, showGifSelector]);

  const moods = [
    { name: "joyful", emoji: "😄" },
    { name: "meh", emoji: "😑" },
    { name: "love", emoji: "😍" },
    { name: "flattered", emoji: "😊" },
    { name: "crazy", emoji: "🤪" },
    { name: "cool", emoji: "😎" },
    { name: "tired", emoji: "😴" },
    { name: "confused", emoji: "😕" },
    { name: "speechless", emoji: "😶" },
    { name: "confident", emoji: "😤" },
    { name: "relaxed", emoji: "😌" },
    { name: "strong", emoji: "💪" },
    { name: "happy", emoji: "😃" },
    { name: "angry", emoji: "😠" },
    { name: "scared", emoji: "😨" },
    { name: "sick", emoji: "🤒" },
    { name: "sad", emoji: "😢" },
    { name: "blessed", emoji: "🙏" },
  ];

  // Background presets
  const backgrounds = [
    {
      id: 214,
      url: "https://demo.peepso.com/wp-content/plugins/peepso/assets/images/post-backgrounds/1.png",
      color: "#ffffff",
    },
    {
      id: 215,
      url: "https://demo.peepso.com/wp-content/plugins/peepso/assets/images/post-backgrounds/2.png",
      color: "rgba(255,255,255,0.75)",
    },
    {
      id: 216,
      url: "https://demo.peepso.com/wp-content/plugins/peepso/assets/images/post-backgrounds/3.png",
      color: "#000000",
    },
    {
      id: 217,
      url: "https://demo.peepso.com/wp-content/plugins/peepso/assets/images/post-backgrounds/4.png",
      color: "rgba(255,255,255,0.75)",
    },
    {
      id: 218,
      url: "https://demo.peepso.com/wp-content/plugins/peepso/assets/images/post-backgrounds/5.png",
      color: "#ffffff",
    },
    {
      id: 219,
      url: "https://demo.peepso.com/wp-content/plugins/peepso/assets/images/post-backgrounds/6.png",
      color: "#ffffff",
    },
  ];

  // Text color options
  const textColors = [
    { id: "black", color: "#000000", name: "Noir" },
    { id: "white", color: "#ffffff", name: "Blanc" },
    { id: "red", color: "#dc3545", name: "Rouge" },
    { id: "blue", color: "#007bff", name: "Bleu" },
    { id: "green", color: "#28a745", name: "Vert" },
    { id: "purple", color: "#6f42c1", name: "Violet" },
    { id: "orange", color: "#fd7e14", name: "Orange" },
    { id: "pink", color: "#e83e8c", name: "Rose" },
    { id: "yellow", color: "#ffc107", name: "Jaune" },
    { id: "cyan", color: "#17a2b8", name: "Cyan" },
  ];

  // Post Source options
  const postSourceOptions = [
    {
      id: "Community",
      title: "Community",
      description: "Posts from the entire community",
      icon: "people",
    },
    {
      id: "Friends",
      title: "Friends",
      description: "Posts from your friends",
      icon: "person",
    },
    {
      id: "Following",
      title: "Following",
      description: "Posts from members, groups, pages & posts you follow",
      icon: "checkmark-done",
    },
    {
      id: "Saved",
      title: "Saved posts",
      description: 'Posts you added to your "Saved" list',
      icon: "bookmark",
    },
    {
      id: "Scheduled",
      title: "All scheduled posts",
      description: "All community posts scheduled for later",
      icon: "time",
    },
    {
      id: "Moderation",
      title: "Moderation",
      description: "All reported content",
      icon: "shield",
    },
  ];

  // My Posts options
  const myPostsOptions = [
    {
      id: "Show my posts",
      title: "Show my posts",
      icon: "person-add",
    },
    {
      id: "Hide my posts",
      title: "Hide my posts",
      icon: "person-remove",
    },
  ];

  // Sort By options
  const sortByOptions = [
    {
      id: "New posts",
      title: "New posts",
      icon: "chatbubble",
    },
    {
      id: "New posts & comments",
      title: "New posts & comments",
      icon: "chatbubbles",
    },
  ];

  const privacyOptions = ["Public", "Site Members", "Friends Only", "Only Me"];

  // Picker options
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
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
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = ["00", "15", "30", "45"];
  const periods = ["AM", "PM"];

  // Geolocation functions
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "L'accès à la localisation est nécessaire pour obtenir votre adresse automatiquement.",
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Erreur lors de la demande de permission:", error);
      return false;
    }
  };

  const getCurrentUserLocation = async () => {
    setIsLoadingLocation(true);
    setCurrentLocation("Recherche de votre position...");

    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setCurrentLocation("Permission de localisation refusée");
        setIsLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Reverse geocoding pour obtenir l'adresse
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const fullAddress = `${address.streetNumber || ""} ${
          address.street || ""
        }, ${address.city || ""}, ${address.postalCode || ""}, ${
          address.country || ""
        }`
          .replace(/,\s*,/g, ",")
          .replace(/^,\s*/, "")
          .replace(/,\s*$/, "");
        setCurrentLocation(fullAddress);
      } else {
        setCurrentLocation(
          `Position trouvée: ${location.coords.latitude.toFixed(
            6,
          )}, ${location.coords.longitude.toFixed(6)}`,
        );
      }
    } catch (error) {
      console.error("Erreur lors de la géolocalisation:", error);
      setCurrentLocation("Impossible de récupérer votre position");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const useCurrentLocation = () => {
    if (
      currentLocation &&
      currentLocation !== "Recherche de votre position..." &&
      currentLocation !== "Permission de localisation refusée" &&
      currentLocation !== "Impossible de récupérer votre position"
    ) {
      setLocation(currentLocation);
      setShowLocationModal(false);
    }
  };

  // Auto-fetch location when modal opens
  useEffect(() => {
    if (showLocationModal && !currentLocation) {
      getCurrentUserLocation();
    }
  }, [showLocationModal]);

  // Image upload function
  const pickImage = async () => {
    try {
      // Request permission to access media library
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission requise",
          "Permission d'accès à la galerie requise pour sélectionner une image.",
        );
        return;
      }

      // Launch image picker with multiple selection
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImageUris = result.assets.map((asset) => asset.uri);
        setUploadedImages((prev) => [...prev, ...newImageUris]);
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement de l'image:", error);
      Alert.alert("Erreur", "Impossible de télécharger l'image");
    }
  };

  // Remove image function
  const removeImage = (indexToRemove: number) => {
    setUploadedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  // Video upload function
  const pickVideo = async () => {
    try {
      // Request permission to access media library
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission requise",
          "Permission d'accès à la galerie requise pour sélectionner une vidéo.",
        );
        return;
      }

      // Launch video picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 0.8,
        videoMaxDuration: 300, // 5 minutes max
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const videoAsset = result.assets[0];

        // Check file size (20MB = 20 * 1024 * 1024 bytes)
        const maxSize = 20 * 1024 * 1024;
        if (videoAsset.fileSize && videoAsset.fileSize > maxSize) {
          Alert.alert(
            "Fichier trop volumineux",
            "La taille de la vidéo ne peut pas dépasser 20MB.",
          );
          return;
        }

        setUploadedVideo(videoAsset.uri);
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement de la vidéo:", error);
      Alert.alert("Erreur", "Impossible de télécharger la vidéo");
    }
  };

  // Remove video function
  const removeVideo = () => {
    if (player) {
      player.release();
    }
    setUploadedVideo(null);
  };

  // Help functionality functions
  const addNewHelpOption = () => {
    if (newOptionText.trim() && !helpOptions.includes(newOptionText.trim())) {
      setHelpOptions((prev) => [...prev, newOptionText.trim()]);
      setNewOptionText("");
    }
  };

  const toggleHelpOption = (option: string) => {
    if (allowMultipleSelection) {
      setSelectedHelpOptions((prev) =>
        prev.includes(option)
          ? prev.filter((item) => item !== option)
          : [...prev, option],
      );
    } else {
      setSelectedHelpOptions((prev) => (prev.includes(option) ? [] : [option]));
    }
  };

  const removeHelpOption = (optionToRemove: string) => {
    setHelpOptions((prev) =>
      prev.filter((option) => option !== optionToRemove),
    );
    setSelectedHelpOptions((prev) =>
      prev.filter((option) => option !== optionToRemove),
    );
  };

  const updateHelpOption = (oldOption: string, newOption: string) => {
    if (newOption.trim() && newOption.trim() !== oldOption) {
      setHelpOptions((prev) =>
        prev.map((option) =>
          option === oldOption ? newOption.trim() : option,
        ),
      );
      setSelectedHelpOptions((prev) =>
        prev.map((option) =>
          option === oldOption ? newOption.trim() : option,
        ),
      );
    }
  };

  // Reset all content function
  const resetAllContent = () => {
    setUploadedImages([]);
    setShowAudioInput(false);
    setAudioUrl("");
    setShowVideoInput(false);
    setVideoUrl("");
    setUploadedVideo(null);
    setShowTextFormatting(false);
    setSelectedTheme(null);
    setSelectedTextColor("#000000");
    setShowHelpOptions(false);
    setSelectedHelpOptions([]);
    setNewOptionText("");
    setShowFileAttachment(false);
    setUploadedFiles([]);
    setShowGifSelector(false);
    setGifQuery("");
    setGifs([]);
    setSelectedGif(null);
  };

  // Récupérer les données de l'utilisateur connecté
  const { data } = useUserProfile("current"); // data = { success: boolean, user: {...} }

  // 🔍 Debug complet
  console.log("✅ Contenu brut de data:", data);
  console.log("✅ Contenu JSON de data:", JSON.stringify(data, null, 2));

  // Extraire l'utilisateur
  const user = data?.user?.data?.user;

  // Avatar par défaut si l'utilisateur n'en a pas
  const avatarUri = user?.avatar?.url;

  // Nom complet
  const userName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Anonymous";

  // 🔍 Debug
  console.log("✅ Utilisateur connecté :", user);
  console.log("✅ Avatar URI :", avatarUri);
  console.log("✅ Nom utilisateur :", userName);

  return (
    <View style={styles.container}>
      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Post Box */}
        <View style={styles.postBox}>
          <View style={styles.postHeader}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.postAvatar} />
            ) : (
              <View style={[styles.avatar, styles.defaultAvatar]}>
                <Ionicons name="person" size={24} color="#666" />
              </View>
            )}
            {!showTextInput ? (
              <TouchableOpacity onPress={() => setShowTextInput(true)}>
                <Text style={styles.postTitle}>
                  Say what is on your mind...
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.userInfoSection}>
                <Text style={styles.userName}>{userName}</Text>
                <TouchableOpacity
                  style={styles.privacyDropdown}
                  onPress={() => setShowPrivacyModal(true)}
                >
                  <Text style={styles.privacyText}>{privacy}</Text>
                  <Ionicons name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowTextInput(false)}
                >
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {showTextInput && !showTextFormatting && (
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Say what is on your mind..."
                placeholderTextColor="#999"
                value={text}
                onChangeText={setText}
                multiline
                autoFocus
              />
            </View>
          )}

          {/* Background-styled text input when formatting is enabled */}
          {showTextInput && showTextFormatting && (
            <View style={styles.backgroundSection}>
              {selectedTheme ? (
                <View style={styles.backgroundImageContainer}>
                  <Image
                    source={{
                      uri: backgrounds.find(
                        (bg) => bg.id.toString() === selectedTheme,
                      )?.url,
                    }}
                    style={styles.backgroundImage}
                  />
                  <TextInput
                    style={[
                      styles.backgroundTextInput,
                      { color: selectedTextColor },
                    ]}
                    placeholder="Rédigez votre statut..."
                    placeholderTextColor={
                      selectedTextColor === "#ffffff" ||
                      selectedTextColor === "#ffc107"
                        ? "rgba(255,255,255,0.7)"
                        : selectedTextColor === "#28a745" ||
                            selectedTextColor === "#17a2b8"
                          ? "rgba(255,255,255,0.6)"
                          : "rgba(0,0,0,0.6)"
                    }
                    value={text}
                    onChangeText={setText}
                    multiline
                    autoFocus
                    textAlign="center"
                  />
                </View>
              ) : (
                <View style={styles.backgroundImageContainer}>
                  <View style={styles.defaultBackground} />
                  <TextInput
                    style={[
                      styles.backgroundTextInput,
                      {
                        color: selectedTextColor,
                        textShadowColor:
                          selectedTextColor === "#ffffff"
                            ? "rgba(0,0,0,0.5)"
                            : "transparent",
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius:
                          selectedTextColor === "#ffffff" ? 2 : 0,
                      },
                    ]}
                    placeholder="Rédigez votre statut..."
                    placeholderTextColor={
                      selectedTextColor === "#ffffff" ||
                      selectedTextColor === "#ffc107"
                        ? "rgba(200,200,200,0.8)"
                        : selectedTextColor === "#28a745" ||
                            selectedTextColor === "#17a2b8"
                          ? "rgba(180,180,180,0.7)"
                          : selectedTextColor === "#000000"
                            ? "rgba(120,120,120,0.8)"
                            : "rgba(100,100,100,0.7)"
                    }
                    value={text}
                    onChangeText={setText}
                    multiline
                    autoFocus
                    textAlign="center"
                  />
                </View>
              )}
            </View>
          )}

          {/* Uploaded Images Display */}
          {showTextInput && uploadedImages.length > 0 && (
            <ScrollView
              horizontal
              style={styles.imagesScrollContainer}
              showsHorizontalScrollIndicator={false}
            >
              {uploadedImages.map((imageUri, index) => (
                <View key={index} style={styles.uploadedImageContainer}>
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.uploadedImage}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#ff4444" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Add More Images Button */}
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={pickImage}
              >
                <Ionicons name="add" size={32} color="#666" />
                <Text style={styles.addImageText}>Ajouter</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* Background Selector */}
          {showTextInput && showTextFormatting && (
            <View style={styles.themeSelectorContainer}>
              <Text style={styles.themeSelectorTitle}>
                Choisir un arrière-plan :
              </Text>
              <ScrollView
                horizontal
                style={styles.themesScrollContainer}
                showsHorizontalScrollIndicator={false}
              >
                {backgrounds.map((background) => (
                  <TouchableOpacity
                    key={background.id}
                    style={[
                      styles.themeItem,
                      selectedTheme === background.id.toString() &&
                        styles.themeItemSelected,
                    ]}
                    onPress={() => setSelectedTheme(background.id.toString())}
                  >
                    <Image
                      source={{ uri: background.url }}
                      style={[
                        styles.themePreview,
                        selectedTheme === background.id.toString() &&
                          styles.themePreviewSelected,
                      ]}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.colorSelectorTitle}>Couleur du texte :</Text>
              <ScrollView
                horizontal
                style={styles.colorsScrollContainer}
                showsHorizontalScrollIndicator={false}
              >
                {textColors.map((textColor) => (
                  <TouchableOpacity
                    key={textColor.id}
                    style={[
                      styles.colorItem,
                      selectedTextColor === textColor.color &&
                        styles.colorItemSelected,
                    ]}
                    onPress={() => setSelectedTextColor(textColor.color)}
                  >
                    <View
                      style={[
                        styles.colorPreview,
                        { backgroundColor: textColor.color },
                        selectedTextColor === textColor.color &&
                          styles.colorPreviewSelected,
                      ]}
                    />
                    <Text style={styles.colorName}>{textColor.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Audio URL Input */}
          {showTextInput && showAudioInput && (
            <View style={styles.audioInputContainer}>
              <View style={styles.audioInputHeader}>
                <Ionicons name="musical-notes" size={20} color="#666" />
                <Text style={styles.audioInputLabel}>Audio URL</Text>
                <TouchableOpacity
                  style={styles.removeAudioButton}
                  onPress={() => {
                    setShowAudioInput(false);
                    setAudioUrl("");
                  }}
                >
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.audioUrlInput}
                placeholder="Entrez l'URL de votre fichier audio"
                placeholderTextColor="#666"
                value={audioUrl}
                onChangeText={setAudioUrl}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>
          )}

          {/* File Attachment Display */}
          {showTextInput && showFileAttachment && (
            <View style={styles.fileAttachmentContainer}>
              <View style={styles.fileAttachmentHeader}>
                <Ionicons name="attach" size={20} color="#666" />
                <Text style={styles.fileAttachmentLabel}>Fichiers</Text>
                <TouchableOpacity
                  style={styles.removeFileAttachmentButton}
                  onPress={() => {
                    setShowFileAttachment(false);
                    setUploadedFiles([]);
                  }}
                >
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              {uploadedFiles.length === 0 ? (
                <TouchableOpacity
                  style={styles.fileUploadArea}
                  onPress={pickFile}
                >
                  <Ionicons name="cloud-upload" size={32} color="#007bff" />
                  <Text style={styles.fileUploadText}>
                    Click here to start uploading files
                  </Text>
                  <Text style={styles.fileUploadSubtext}>
                    Max file size: 10MB
                  </Text>
                  <Text style={styles.fileUploadSubtext}>
                    Allowed file types: PDF, ZIP, 7Z, RAR, DOCX
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.uploadedFilesContainer}>
                  <ScrollView style={styles.filesScrollContainer}>
                    {uploadedFiles.map((file, index) => (
                      <View key={index} style={styles.uploadedFileItem}>
                        <View style={styles.fileInfo}>
                          <Ionicons name="document" size={24} color="#007bff" />
                          <View style={styles.fileDetails}>
                            <Text style={styles.fileName} numberOfLines={1}>
                              {file.name}
                            </Text>
                            <Text style={styles.fileSize}>
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.removeFileButton}
                          onPress={() => removeFile(index)}
                        >
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color="#ff4444"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>

                  <TouchableOpacity
                    style={styles.addMoreFilesButton}
                    onPress={pickFile}
                  >
                    <Ionicons name="add" size={16} color="#007bff" />
                    <Text style={styles.addMoreFilesText}>Add more files</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* GIF Selector Display */}
          {showTextInput && showGifSelector && (
            <View style={styles.gifSelectorContainer}>
              <View style={styles.gifSelectorHeader}>
                <View style={styles.headerSpacer} />
                <TouchableOpacity
                  style={styles.removeGifSelectorButton}
                  onPress={() => {
                    setShowGifSelector(false);
                    setGifQuery("");
                    setGifs([]);
                    setSelectedGif(null);
                  }}
                >
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Search Input */}
              <View style={styles.gifSearchContainer}>
                <TextInput
                  style={styles.gifSearchInput}
                  placeholder="Rechercher un GIF..."
                  placeholderTextColor="#666"
                  value={gifQuery}
                  onChangeText={setGifQuery}
                />
                <Text style={styles.poweredByText}>Powered by GIPHY</Text>
              </View>

              {/* Loading indicator */}
              {loadingGifs && (
                <View style={styles.gifLoadingContainer}>
                  <ActivityIndicator size="small" color="#007bff" />
                  <Text style={styles.loadingText}>Recherche en cours...</Text>
                </View>
              )}

              {/* Selected GIF Preview */}
              {selectedGif && (
                <View style={styles.selectedGifContainer}>
                  <Image
                    source={{ uri: selectedGif.url }}
                    style={styles.selectedGifImage}
                  />
                  <TouchableOpacity
                    style={styles.changeGifButton}
                    onPress={() => setSelectedGif(null)}
                  >
                    <Text style={styles.changeGifText}>Changer l'image</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* GIF Carousel */}
              {!selectedGif && gifs.length > 0 && (
                <View style={styles.gifsCarouselContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.gifsScrollView}
                    contentContainerStyle={styles.gifsScrollContent}
                  >
                    {gifs.map((gif) => (
                      <TouchableOpacity
                        key={gif.id}
                        style={styles.gifItem}
                        onPress={() => selectGif(gif)}
                      >
                        <Image
                          source={{ uri: gif.preview_url || gif.url }}
                          style={styles.gifThumbnail}
                        />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Empty state */}
              {!selectedGif &&
                gifs.length === 0 &&
                gifQuery.length <= 2 &&
                !loadingGifs && (
                  <View style={styles.gifEmptyState}>
                    <Text style={styles.gifEmptyText}>
                      {gifQuery.length === 0
                        ? "Chargement des GIFs tendance..."
                        : "Tapez au moins 3 caractères pour rechercher"}
                    </Text>
                  </View>
                )}

              {/* No results */}
              {!selectedGif &&
                gifs.length === 0 &&
                gifQuery.length > 2 &&
                !loadingGifs && (
                  <View style={styles.gifEmptyState}>
                    <Text style={styles.gifEmptyText}>
                      Aucun GIF trouvé pour "{gifQuery}"
                    </Text>
                  </View>
                )}
            </View>
          )}

          {/* Help Options Display */}
          {showTextInput && showHelpOptions && (
            <View style={styles.helpOptionsContainer}>
              <View style={styles.helpOptionsHeader}>
                <Ionicons name="help-circle" size={20} color="#666" />
                <Text style={styles.helpOptionsLabel}>Options</Text>
                <TouchableOpacity
                  style={styles.removeHelpButton}
                  onPress={() => {
                    setShowHelpOptions(false);
                    setSelectedHelpOptions([]);
                    setNewOptionText("");
                  }}
                >
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Help Options List */}
              <View style={styles.helpOptionsList}>
                {helpOptions.map((option, index) => (
                  <View
                    key={index}
                    style={[
                      styles.helpOptionItem,
                      selectedHelpOptions.includes(option) &&
                        styles.helpOptionItemSelected,
                    ]}
                  >
                    {editingOption === option ? (
                      <View style={styles.editingContainer}>
                        <TextInput
                          style={styles.editingInput}
                          value={editingText}
                          onChangeText={setEditingText}
                          onSubmitEditing={() => {
                            updateHelpOption(option, editingText);
                            setEditingOption(null);
                            setEditingText("");
                          }}
                          onBlur={() => {
                            updateHelpOption(option, editingText);
                            setEditingOption(null);
                            setEditingText("");
                          }}
                          autoFocus
                        />
                        <TouchableOpacity
                          style={styles.saveEditButton}
                          onPress={() => {
                            updateHelpOption(option, editingText);
                            setEditingOption(null);
                            setEditingText("");
                          }}
                        >
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="#28a745"
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <>
                        <TouchableOpacity
                          style={styles.optionTextContainer}
                          onPress={() => toggleHelpOption(option)}
                        >
                          <Text
                            style={[
                              styles.helpOptionText,
                              selectedHelpOptions.includes(option) &&
                                styles.helpOptionTextSelected,
                            ]}
                          >
                            {option}
                          </Text>
                          {selectedHelpOptions.includes(option) && (
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color="#007bff"
                            />
                          )}
                        </TouchableOpacity>
                        <View style={styles.optionButtons}>
                          <TouchableOpacity
                            style={styles.editOptionButton}
                            onPress={() => {
                              setEditingOption(option);
                              setEditingText(option);
                            }}
                          >
                            <Ionicons name="pencil" size={14} color="#007bff" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.removeOptionButton}
                            onPress={() => removeHelpOption(option)}
                          >
                            <Ionicons
                              name="close-circle"
                              size={16}
                              color="#ff4444"
                            />
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </View>
                ))}
              </View>

              {/* Add New Option */}
              <View style={styles.addOptionContainer}>
                <TextInput
                  style={styles.newOptionInput}
                  placeholder="Add new option"
                  placeholderTextColor="#666"
                  value={newOptionText}
                  onChangeText={setNewOptionText}
                  onSubmitEditing={addNewHelpOption}
                />
                <TouchableOpacity
                  style={styles.addOptionButton}
                  onPress={addNewHelpOption}
                >
                  <Ionicons name="add" size={20} color="#007bff" />
                </TouchableOpacity>
              </View>

              {/* Multiple Selection Toggle */}
              <TouchableOpacity
                style={styles.multipleSelectionToggle}
                onPress={() =>
                  setAllowMultipleSelection(!allowMultipleSelection)
                }
              >
                <View
                  style={[
                    styles.toggleCheckbox,
                    allowMultipleSelection && styles.toggleCheckboxChecked,
                  ]}
                >
                  {allowMultipleSelection && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
                <Text style={styles.multipleSelectionText}>
                  Allow multiple options selection
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Video URL Input and Upload */}
          {showTextInput && showVideoInput && (
            <View style={styles.videoInputContainer}>
              <View style={styles.videoInputHeader}>
                <Ionicons name="videocam" size={20} color="#666" />
                <Text style={styles.videoInputLabel}>Vidéo</Text>
                <TouchableOpacity
                  style={styles.removeVideoButton}
                  onPress={() => {
                    setShowVideoInput(false);
                    setVideoUrl("");
                    setUploadedVideo(null);
                  }}
                >
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Video URL Input */}
              <TextInput
                style={styles.videoUrlInput}
                placeholder="Enter video URL here"
                placeholderTextColor="#666"
                value={videoUrl}
                onChangeText={setVideoUrl}
                autoCapitalize="none"
                keyboardType="url"
              />

              <View style={styles.videoOrSeparator}>
                <View style={styles.separatorLine} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.separatorLine} />
              </View>

              {/* Video Upload Button */}
              {!uploadedVideo ? (
                <TouchableOpacity
                  style={styles.videoUploadButton}
                  onPress={pickVideo}
                >
                  <Ionicons name="cloud-upload" size={24} color="#007bff" />
                  <Text style={styles.videoUploadText}>Upload</Text>
                  <Text style={styles.videoUploadSubtext}>
                    Max file size: 20MB
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.uploadedVideoContainer}>
                  <View style={styles.videoPlayerContainer}>
                    <VideoView
                      style={styles.videoPlayer}
                      player={player}
                      allowsFullscreen
                      allowsPictureInPicture
                      nativeControls
                      contentFit="contain"
                      startsPictureInPictureAutomatically={false}
                    />
                    <TouchableOpacity
                      style={styles.removeVideoButtonOverlay}
                      onPress={removeVideo}
                    >
                      <Ionicons name="close-circle" size={24} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.videoFileName}>Vidéo sélectionnée</Text>
                </View>
              )}
            </View>
          )}

          {/* Actions */}
          {showTextInput && (
            <View style={styles.actions}>
              {/* First Row */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => setShowPinModal(true)}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons name="pin" size={20} color="#666" />
                    {pinStatus !== "none" && (
                      <View style={styles.pinBadge}>
                        <View style={styles.pinBadgeInner} />
                      </View>
                    )}
                  </View>
                  <Text style={styles.actionText}>Pin</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => setShowScheduleModal(true)}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons name="time" size={20} color="#666" />
                    {scheduleStatus === "scheduled" && (
                      <View style={styles.pinBadge}>
                        <View style={styles.pinBadgeInner} />
                      </View>
                    )}
                  </View>
                  <Text style={styles.actionText}>Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => setShowMoodModal(true)}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons name="happy" size={20} color="#666" />
                    {mood && (
                      <View style={styles.pinBadge}>
                        <View style={styles.pinBadgeInner} />
                      </View>
                    )}
                  </View>
                  <Text style={styles.actionText}>Mood</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionItem}
                  onPress={() => setShowLocationModal(true)}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons name="location" size={20} color="#666" />
                    {location && (
                      <View style={styles.pinBadge}>
                        <View style={styles.pinBadgeInner} />
                      </View>
                    )}
                  </View>
                  <Text style={styles.actionText}>Location</Text>
                </TouchableOpacity>
              </View>

              {/* Second Row */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.iconOnlyAction}
                  onPress={() => {
                    resetAllContent();
                    pickImage();
                  }}
                >
                  <Ionicons name="image" size={24} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconOnlyAction}
                  onPress={() => {
                    resetAllContent();
                    setShowAudioInput(true);
                  }}
                >
                  <Ionicons name="musical-notes" size={24} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconOnlyAction}
                  onPress={() => {
                    resetAllContent();
                    setShowVideoInput(true);
                  }}
                >
                  <Ionicons name="videocam" size={24} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconOnlyAction}
                  onPress={() => {
                    resetAllContent();
                    setShowTextFormatting(true);
                  }}
                >
                  <FontAwesome5 name="align-left" size={20} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconOnlyAction}
                  onPress={() => {
                    resetAllContent();
                    setShowHelpOptions(true);
                  }}
                >
                  <Ionicons name="help-circle" size={24} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconOnlyAction}
                  onPress={() => {
                    resetAllContent();
                    setShowFileAttachment(true);
                  }}
                >
                  <Ionicons name="attach" size={24} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconOnlyAction}
                  onPress={() => {
                    resetAllContent();
                    setShowGifSelector(true);
                  }}
                >
                  <Text style={styles.gifText}>GIF</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Filter Box */}
        <View style={styles.filterBox}>
          {/* Filter Header with Icons */}
          <TouchableOpacity
            style={styles.filterHeader}
            onPress={() => setShowFilterContent(!showFilterContent)}
          >
            <Text style={styles.filterTitle}>Filters</Text>
            <View style={styles.filterHeaderIcons}>
              <Ionicons
                name="people"
                size={20}
                color="#007bff"
                style={styles.filterHeaderIcon}
              />
              <Ionicons
                name="person-add"
                size={20}
                color="#007bff"
                style={styles.filterHeaderIcon}
              />
              <Ionicons
                name="chatbubble"
                size={20}
                color="#007bff"
                style={styles.filterHeaderIcon}
              />
            </View>
            <Ionicons
              name={showFilterContent ? "chevron-up" : "chevron-down"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>

          {/* Filter Content (conditionally visible) */}
          {showFilterContent && (
            <View style={styles.filterContent}>
              {/* Post Source Filter */}
              <Text style={styles.filterSectionTitle}>Post Source</Text>
              <View style={styles.filterOptionsContainer}>
                <TouchableOpacity
                  style={[styles.filterOption, styles.filterOptionSelected]}
                  onPress={() => setShowPostSourceModal(true)}
                >
                  <Ionicons
                    name={
                      postSourceOptions.find(
                        (option) => option.id === selectedPostSource,
                      )?.icon || "people"
                    }
                    size={16}
                    color="#007bff"
                  />
                  <Text
                    style={[
                      styles.filterOptionLabel,
                      styles.filterOptionLabelSelected,
                    ]}
                  >
                    {selectedPostSource}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={14}
                    color="#007bff"
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              </View>

              {/* My Posts Filter */}
              <Text style={styles.filterSectionTitle}>My Posts</Text>
              <View style={styles.filterOptionsContainer}>
                <TouchableOpacity
                  style={[styles.filterOption, styles.filterOptionSelected]}
                  onPress={() => setShowMyPostsModal(true)}
                >
                  <Ionicons
                    name={
                      myPostsOptions.find(
                        (option) => option.id === selectedMyPosts,
                      )?.icon || "person-add"
                    }
                    size={16}
                    color="#007bff"
                  />
                  <Text
                    style={[
                      styles.filterOptionLabel,
                      styles.filterOptionLabelSelected,
                    ]}
                  >
                    {selectedMyPosts}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={14}
                    color="#007bff"
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              </View>

              {/* Sort By Filter */}
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              <View style={styles.filterOptionsContainer}>
                <TouchableOpacity
                  style={[styles.filterOption, styles.filterOptionSelected]}
                  onPress={() => setShowSortByModal(true)}
                >
                  <Ionicons
                    name={
                      sortByOptions.find(
                        (option) => option.id === selectedSortBy,
                      )?.icon || "chatbubble"
                    }
                    size={16}
                    color="#007bff"
                  />
                  <Text
                    style={[
                      styles.filterOptionLabel,
                      styles.filterOptionLabelSelected,
                    ]}
                  >
                    {selectedSortBy}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={14}
                    color="#007bff"
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Community Posts */}
        <CommunityPosts />
      </ScrollView>

      {/* Privacy Settings Modal */}
      <Modal
        visible={showPrivacyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Privacy Settings</Text>

            <TouchableOpacity
              style={[
                styles.privacyOption,
                privacy === "Public" && styles.privacyOptionSelected,
              ]}
              onPress={() => {
                setPrivacy("Public");
                setShowPrivacyModal(false);
              }}
            >
              <View style={styles.privacyOptionHeader}>
                <Text style={styles.privacyOptionTitle}>Public</Text>
                {privacy === "Public" && (
                  <Ionicons name="checkmark" size={20} color="#007bff" />
                )}
              </View>
              <Text style={styles.privacyOptionDescription}>
                Everyone, including non-registered users, can see this post.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.privacyOption,
                privacy === "Site Members" && styles.privacyOptionSelected,
              ]}
              onPress={() => {
                setPrivacy("Site Members");
                setShowPrivacyModal(false);
              }}
            >
              <View style={styles.privacyOptionHeader}>
                <Text style={styles.privacyOptionTitle}>Site Members</Text>
                {privacy === "Site Members" && (
                  <Ionicons name="checkmark" size={20} color="#007bff" />
                )}
              </View>
              <Text style={styles.privacyOptionDescription}>
                Only registered members of the site can see this post.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.privacyOption,
                privacy === "Friends Only" && styles.privacyOptionSelected,
              ]}
              onPress={() => {
                setPrivacy("Friends Only");
                setShowPrivacyModal(false);
              }}
            >
              <View style={styles.privacyOptionHeader}>
                <Text style={styles.privacyOptionTitle}>Friends Only</Text>
                {privacy === "Friends Only" && (
                  <Ionicons name="checkmark" size={20} color="#007bff" />
                )}
              </View>
              <Text style={styles.privacyOptionDescription}>
                Only your friends can see this post.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.privacyOption,
                privacy === "Only Me" && styles.privacyOptionSelected,
              ]}
              onPress={() => {
                setPrivacy("Only Me");
                setShowPrivacyModal(false);
              }}
            >
              <View style={styles.privacyOptionHeader}>
                <Text style={styles.privacyOptionTitle}>Only Me</Text>
                {privacy === "Only Me" && (
                  <Ionicons name="checkmark" size={20} color="#007bff" />
                )}
              </View>
              <Text style={styles.privacyOptionDescription}>
                Only you can see this post.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.privacyBackButton}
              onPress={() => setShowPrivacyModal(false)}
            >
              <Text style={styles.privacyBackButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Pin Settings Modal */}
      <Modal
        visible={showPinModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pin your post</Text>

            <TouchableOpacity
              style={styles.pinOption}
              onPress={() => {
                setPinStatus("none");
                setShowPinModal(false);
              }}
            >
              <Text style={styles.pinOptionTitle}>Do not pin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pinOption}
              onPress={() => {
                setPinStatus("indefinitely");
                setShowPinModal(false);
              }}
            >
              <Text style={styles.pinOptionTitle}>Pin indefinitely</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pinOption}
              onPress={() => {
                setShowPinModal(false);
                setShowDatePicker(true);
              }}
            >
              <Text style={styles.pinOptionTitle}>Pin until ...</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.privacyBackButton}
              onPress={() => setShowPinModal(false)}
            >
              <Text style={styles.privacyBackButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Schedule Settings Modal */}
      <Modal
        visible={showScheduleModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowScheduleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Schedule your post</Text>

            <TouchableOpacity
              style={styles.pinOption}
              onPress={() => {
                setScheduleStatus("immediate");
                setShowScheduleModal(false);
              }}
            >
              <Text style={styles.pinOptionTitle}>Post immediately</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pinOption}
              onPress={() => {
                setShowScheduleModal(false);
                setShowScheduleDatePicker(true);
              }}
            >
              <Text style={styles.pinOptionTitle}>Select date and time</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.privacyBackButton}
              onPress={() => setShowScheduleModal(false)}
            >
              <Text style={styles.privacyBackButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Mood Settings Modal */}
      <Modal
        visible={showMoodModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMoodModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How are you feeling?</Text>

            <ScrollView style={styles.moodsList}>
              {moods.map((moodItem) => (
                <TouchableOpacity
                  key={moodItem.name}
                  style={[
                    styles.moodOption,
                    mood === moodItem.name && styles.moodOptionSelected,
                  ]}
                  onPress={() => {
                    setMood(moodItem.name);
                    setShowMoodModal(false);
                  }}
                >
                  <View style={styles.moodOptionContent}>
                    <Text style={styles.moodEmoji}>{moodItem.emoji}</Text>
                    <Text style={styles.moodOptionTitle}>{moodItem.name}</Text>
                    {mood === moodItem.name && (
                      <Ionicons name="checkmark" size={20} color="#007bff" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.privacyBackButton}
              onPress={() => setShowMoodModal(false)}
            >
              <Text style={styles.privacyBackButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Location Settings Modal */}
      <Modal
        visible={showLocationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.locationModalContent}>
            <View style={styles.locationHeader}>
              <View style={styles.locationIconContainer}>
                <Ionicons name="map" size={32} color="#007bff" />
              </View>
              <TouchableOpacity
                style={styles.locationBackButton}
                onPress={() => setShowLocationModal(false)}
              >
                <Text style={styles.locationBackButtonText}>Back</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.locationInput}
              placeholder="Enter your location"
              value={location}
              onChangeText={setLocation}
              multiline={false}
            />

            <View style={styles.mapsContainer}>
              <View style={styles.mapsContent}>
                <Ionicons
                  name={isLoadingLocation ? "refresh" : "location-outline"}
                  size={24}
                  color="#666"
                  style={[
                    styles.mapsIcon,
                    isLoadingLocation && styles.loadingIcon,
                  ]}
                />
                <Text style={styles.mapsText}>
                  {currentLocation || "En attente de localisation..."}
                </Text>
              </View>

              {!isLoadingLocation && (
                <View style={styles.locationActions}>
                  <TouchableOpacity
                    style={styles.refreshLocationButton}
                    onPress={getCurrentUserLocation}
                  >
                    <Ionicons name="refresh" size={16} color="#007bff" />
                    <Text style={styles.refreshLocationText}>Actualiser</Text>
                  </TouchableOpacity>

                  {currentLocation &&
                    currentLocation !== "Permission de localisation refusée" &&
                    currentLocation !==
                      "Impossible de récupérer votre position" && (
                      <TouchableOpacity
                        style={styles.useLocationButton}
                        onPress={useCurrentLocation}
                      >
                        <Ionicons name="checkmark" size={16} color="#28a745" />
                        <Text style={styles.useLocationText}>
                          Utiliser cette adresse
                        </Text>
                      </TouchableOpacity>
                    )}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.locationSaveButton}
              onPress={() => {
                if (location.trim()) {
                  setShowLocationModal(false);
                }
              }}
            >
              <Text style={styles.locationSaveButtonText}>
                Enregistrer l'adresse
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Schedule Date Picker Modal */}
      <Modal
        visible={showScheduleDatePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowScheduleDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select date and time</Text>

            <Text style={styles.sectionLabel}>Date</Text>
            <View style={styles.datePickerRow}>
              <TouchableOpacity
                style={styles.datePickerItem}
                onPress={() => setShowScheduleDayPicker(!showScheduleDayPicker)}
              >
                <Text style={styles.datePickerText}>{scheduleSelectedDay}</Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.datePickerItem}
                onPress={() =>
                  setShowScheduleMonthPicker(!showScheduleMonthPicker)
                }
              >
                <Text style={styles.datePickerText}>
                  {scheduleSelectedMonth}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.datePickerItem}
                onPress={() =>
                  setShowScheduleYearPicker(!showScheduleYearPicker)
                }
              >
                <Text style={styles.datePickerText}>
                  {scheduleSelectedYear}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Schedule Day Picker */}
            {showScheduleDayPicker && (
              <View style={styles.pickerDropdown}>
                <ScrollView style={styles.pickerScrollView}>
                  {days.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={styles.pickerOption}
                      onPress={() => {
                        setScheduleSelectedDay(day);
                        setShowScheduleDayPicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{day}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Schedule Month Picker */}
            {showScheduleMonthPicker && (
              <View style={styles.pickerDropdown}>
                <ScrollView style={styles.pickerScrollView}>
                  {months.map((month) => (
                    <TouchableOpacity
                      key={month}
                      style={styles.pickerOption}
                      onPress={() => {
                        setScheduleSelectedMonth(month);
                        setShowScheduleMonthPicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{month}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Schedule Year Picker */}
            {showScheduleYearPicker && (
              <View style={styles.pickerDropdown}>
                <ScrollView style={styles.pickerScrollView}>
                  {years.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={styles.pickerOption}
                      onPress={() => {
                        setScheduleSelectedYear(year.toString());
                        setShowScheduleYearPicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{year}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <Text style={styles.sectionLabel}>Time</Text>
            <View style={styles.timePickerRow}>
              <TouchableOpacity
                style={styles.timePickerItem}
                onPress={() =>
                  setShowScheduleHourPicker(!showScheduleHourPicker)
                }
              >
                <Text style={styles.datePickerText}>
                  {scheduleSelectedHour}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
              <Text style={styles.timeSeparator}>:</Text>
              <TouchableOpacity
                style={styles.timePickerItem}
                onPress={() =>
                  setShowScheduleMinutePicker(!showScheduleMinutePicker)
                }
              >
                <Text style={styles.datePickerText}>
                  {scheduleSelectedMinute}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.timePickerItem}
                onPress={() =>
                  setShowSchedulePeriodPicker(!showSchedulePeriodPicker)
                }
              >
                <Text style={styles.datePickerText}>
                  {scheduleSelectedPeriod}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Schedule Hour Picker */}
            {showScheduleHourPicker && (
              <View style={styles.pickerDropdown}>
                <ScrollView style={styles.pickerScrollView}>
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={styles.pickerOption}
                      onPress={() => {
                        setScheduleSelectedHour(
                          hour.toString().padStart(2, "0"),
                        );
                        setShowScheduleHourPicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>
                        {hour.toString().padStart(2, "0")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Schedule Minute Picker */}
            {showScheduleMinutePicker && (
              <View style={styles.pickerDropdown}>
                <ScrollView style={styles.pickerScrollView}>
                  {minutes.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={styles.pickerOption}
                      onPress={() => {
                        setScheduleSelectedMinute(minute);
                        setShowScheduleMinutePicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{minute}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Schedule Period Picker */}
            {showSchedulePeriodPicker && (
              <View style={styles.pickerDropdown}>
                <ScrollView style={styles.pickerScrollView}>
                  {periods.map((period) => (
                    <TouchableOpacity
                      key={period}
                      style={styles.pickerOption}
                      onPress={() => {
                        setScheduleSelectedPeriod(period);
                        setShowSchedulePeriodPicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{period}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => {
                setScheduleStatus("scheduled");
                setShowScheduleDatePicker(false);
              }}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Post Source Selection Modal */}
      <Modal
        visible={showPostSourceModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPostSourceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.postSourceModalContent}>
            <View style={styles.postSourceHeader}>
              <Text style={styles.postSourceModalTitle}>Post Source</Text>
              <TouchableOpacity
                style={styles.postSourceBackButton}
                onPress={() => setShowPostSourceModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.postSourceOptionsContainer}>
              {postSourceOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.postSourceOption,
                    selectedPostSource === option.id &&
                      styles.postSourceOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedPostSource(option.id);
                    setShowPostSourceModal(false);
                  }}
                >
                  <View style={styles.postSourceOptionContent}>
                    <View style={styles.postSourceOptionLeft}>
                      <Ionicons
                        name={option.icon}
                        size={24}
                        color={
                          selectedPostSource === option.id ? "#007bff" : "#666"
                        }
                        style={styles.postSourceOptionIcon}
                      />
                      <View style={styles.postSourceOptionTexts}>
                        <Text
                          style={[
                            styles.postSourceOptionTitle,
                            selectedPostSource === option.id &&
                              styles.postSourceOptionTitleSelected,
                          ]}
                        >
                          {option.title}
                        </Text>
                        <Text style={styles.postSourceOptionDescription}>
                          {option.description}
                        </Text>
                      </View>
                    </View>
                    {selectedPostSource === option.id && (
                      <Ionicons name="checkmark" size={20} color="#007bff" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* My Posts Selection Modal */}
      <Modal
        visible={showMyPostsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMyPostsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.postSourceModalContent}>
            <View style={styles.postSourceHeader}>
              <Text style={styles.postSourceModalTitle}>My Posts</Text>
              <TouchableOpacity
                style={styles.postSourceBackButton}
                onPress={() => setShowMyPostsModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.postSourceOptionsContainer}>
              {myPostsOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.postSourceOption,
                    selectedMyPosts === option.id &&
                      styles.postSourceOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedMyPosts(option.id);
                    setShowMyPostsModal(false);
                  }}
                >
                  <View style={styles.postSourceOptionContent}>
                    <View style={styles.postSourceOptionLeft}>
                      <Ionicons
                        name={option.icon}
                        size={24}
                        color={
                          selectedMyPosts === option.id ? "#007bff" : "#666"
                        }
                        style={styles.postSourceOptionIcon}
                      />
                      <View style={styles.postSourceOptionTexts}>
                        <Text
                          style={[
                            styles.postSourceOptionTitle,
                            selectedMyPosts === option.id &&
                              styles.postSourceOptionTitleSelected,
                          ]}
                        >
                          {option.title}
                        </Text>
                      </View>
                    </View>
                    {selectedMyPosts === option.id && (
                      <Ionicons name="checkmark" size={20} color="#007bff" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Sort By Selection Modal */}
      <Modal
        visible={showSortByModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSortByModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.postSourceModalContent}>
            <View style={styles.postSourceHeader}>
              <Text style={styles.postSourceModalTitle}>Sort By</Text>
              <TouchableOpacity
                style={styles.postSourceBackButton}
                onPress={() => setShowSortByModal(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.postSourceOptionsContainer}>
              {sortByOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.postSourceOption,
                    selectedSortBy === option.id &&
                      styles.postSourceOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedSortBy(option.id);
                    setShowSortByModal(false);
                  }}
                >
                  <View style={styles.postSourceOptionContent}>
                    <View style={styles.postSourceOptionLeft}>
                      <Ionicons
                        name={option.icon}
                        size={24}
                        color={
                          selectedSortBy === option.id ? "#007bff" : "#666"
                        }
                        style={styles.postSourceOptionIcon}
                      />
                      <View style={styles.postSourceOptionTexts}>
                        <Text
                          style={[
                            styles.postSourceOptionTitle,
                            selectedSortBy === option.id &&
                              styles.postSourceOptionTitleSelected,
                          ]}
                        >
                          {option.title}
                        </Text>
                      </View>
                    </View>
                    {selectedSortBy === option.id && (
                      <Ionicons name="checkmark" size={20} color="#007bff" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pin until ...</Text>

            <Text style={styles.sectionLabel}>Date</Text>
            <View style={styles.datePickerRow}>
              <TouchableOpacity
                style={styles.datePickerItem}
                onPress={() => setShowDayPicker(!showDayPicker)}
              >
                <Text style={styles.datePickerText}>{selectedDay}</Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.datePickerItem}
                onPress={() => setShowMonthPicker(!showMonthPicker)}
              >
                <Text style={styles.datePickerText}>{selectedMonth}</Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.datePickerItem}
                onPress={() => setShowYearPicker(!showYearPicker)}
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

            <Text style={styles.sectionLabel}>Time</Text>
            <View style={styles.timePickerRow}>
              <TouchableOpacity
                style={styles.timePickerItem}
                onPress={() => setShowHourPicker(!showHourPicker)}
              >
                <Text style={styles.datePickerText}>{selectedHour}</Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
              <Text style={styles.timeSeparator}>:</Text>
              <TouchableOpacity
                style={styles.timePickerItem}
                onPress={() => setShowMinutePicker(!showMinutePicker)}
              >
                <Text style={styles.datePickerText}>{selectedMinute}</Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.timePickerItem}
                onPress={() => setShowPeriodPicker(!showPeriodPicker)}
              >
                <Text style={styles.datePickerText}>{selectedPeriod}</Text>
                <Ionicons name="chevron-down" size={16} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Hour Picker */}
            {showHourPicker && (
              <View style={styles.pickerDropdown}>
                <ScrollView style={styles.pickerScrollView}>
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={styles.pickerOption}
                      onPress={() => {
                        setSelectedHour(hour.toString().padStart(2, "0"));
                        setShowHourPicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>
                        {hour.toString().padStart(2, "0")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Minute Picker */}
            {showMinutePicker && (
              <View style={styles.pickerDropdown}>
                <ScrollView style={styles.pickerScrollView}>
                  {minutes.map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={styles.pickerOption}
                      onPress={() => {
                        setSelectedMinute(minute);
                        setShowMinutePicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{minute}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Period Picker */}
            {showPeriodPicker && (
              <View style={styles.pickerDropdown}>
                <ScrollView style={styles.pickerScrollView}>
                  {periods.map((period) => (
                    <TouchableOpacity
                      key={period}
                      style={styles.pickerOption}
                      onPress={() => {
                        setSelectedPeriod(period);
                        setShowPeriodPicker(false);
                      }}
                    >
                      <Text style={styles.pickerOptionText}>{period}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => {
                setPinStatus("until");
                setShowDatePicker(false);
              }}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Navigation Menu */}
      <NavigationMenu
        visible={showNavigationMenu}
        onClose={() => setShowNavigationMenu(false)}
      />
    </View>
  );
};

export default CommunityContent;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 16 },
  postBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
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
  defaultAvatar: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  postHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  postTitle: { fontSize: 16, fontWeight: "600" },
  userInfoSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userName: { fontSize: 16, fontWeight: "600", color: "#333" },
  privacyDropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  privacyText: { fontSize: 14, color: "#666", marginRight: 4 },
  closeButton: {
    padding: 4,
    marginLeft: 8,
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  privacyOption: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  privacyOptionSelected: {
    borderColor: "#007bff",
    backgroundColor: "#f0f8ff",
  },
  privacyOptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  privacyOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  privacyOptionDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  privacyBackButton: {
    backgroundColor: "#6c757d",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  privacyBackButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  textInputContainer: {
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    fontSize: 16,
    lineHeight: 22,
  },

  actions: {
    marginTop: 12,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    minWidth: 70,
  },
  actionText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontWeight: "500",
  },
  iconOnlyAction: {
    padding: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  gifText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#666",
  },
  pinOption: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  pinOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  iconContainer: {
    position: "relative",
  },
  pinBadge: {
    position: "absolute",
    bottom: -4,
    left: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  pinBadgeInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8B5CF6",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 12,
  },
  datePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  timePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  datePickerItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    minWidth: 80,
    justifyContent: "space-between",
  },
  timePickerItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    minWidth: 60,
    justifyContent: "space-between",
    marginHorizontal: 4,
  },
  datePickerText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  timeSeparator: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  doneButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  pickerDropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    marginTop: 8,
    maxHeight: 200,
  },
  pickerScrollView: {
    maxHeight: 200,
  },
  pickerOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  pickerOptionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  moodsList: {
    maxHeight: 400,
    marginBottom: 20,
  },
  moodOption: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  moodOptionSelected: {
    borderColor: "#007bff",
    backgroundColor: "#f0f8ff",
  },
  moodOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  moodOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    textTransform: "capitalize",
  },
  locationModalContent: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    minHeight: 300,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  locationIconContainer: {
    padding: 8,
  },
  locationBackButton: {
    backgroundColor: "#6c757d",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  locationBackButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  locationInput: {
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "#f8f9fa",
  },
  mapsContainer: {
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e1f0ff",
    minHeight: 80,
    justifyContent: "center",
  },
  mapsContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  mapsIcon: {
    marginRight: 12,
  },
  mapsText: {
    fontSize: 16,
    color: "#495057",
    fontStyle: "italic",
    flex: 1,
  },
  locationSaveButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  locationSaveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingIcon: {
    transform: [{ rotate: "180deg" }],
  },
  locationActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 8,
  },
  refreshLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#007bff",
    flex: 1,
    justifyContent: "center",
  },
  refreshLocationText: {
    color: "#007bff",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  useLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fff0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#28a745",
    flex: 1,
    justifyContent: "center",
  },
  useLocationText: {
    color: "#28a745",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  imagesScrollContainer: {
    marginBottom: 12,
    paddingVertical: 8,
  },
  uploadedImageContainer: {
    position: "relative",
    marginRight: 12,
  },
  uploadedImage: {
    width: 120,
    height: 90,
    borderRadius: 8,
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  addImageButton: {
    width: 120,
    height: 90,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addImageText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontWeight: "500",
  },
  audioInputContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  audioInputHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  audioInputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  removeAudioButton: {
    padding: 4,
  },
  audioUrlInput: {
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#333",
  },
  videoInputContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  videoInputHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  videoInputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  removeVideoButton: {
    padding: 4,
  },
  videoUrlInput: {
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#333",
    marginBottom: 12,
  },
  videoOrSeparator: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e9ecef",
  },
  orText: {
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  videoUploadButton: {
    backgroundColor: "#f0f8ff",
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  videoUploadText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007bff",
    marginTop: 4,
  },
  videoUploadSubtext: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  uploadedVideoContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  videoPlayerContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#000",
    marginBottom: 8,
  },
  videoPlayer: {
    width: "100%",
    height: "100%",
  },
  removeVideoButtonOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 2,
  },
  videoFileName: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
  },
  themeSelectorContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  themeSelectorTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  themesScrollContainer: {
    marginBottom: 8,
  },
  themeItem: {
    alignItems: "center",
    marginRight: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "transparent",
    minWidth: 70,
  },
  themeItemSelected: {
    borderColor: "#007bff",
    backgroundColor: "#f0f8ff",
  },
  themePreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    resizeMode: "cover",
    borderWidth: 2,
    borderColor: "transparent",
  },
  themePreviewSelected: {
    borderColor: "#007bff",
  },
  backgroundSection: {
    marginBottom: 12,
  },
  backgroundImageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  defaultBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#e9ecef",
  },
  backgroundTextInput: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 80,
    maxWidth: "90%",
    backgroundColor: "transparent",
    borderWidth: 0,
    textAlignVertical: "center",
  },
  colorSelectorTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
    marginBottom: 8,
  },
  colorsScrollContainer: {
    marginBottom: 8,
  },
  colorItem: {
    alignItems: "center",
    marginRight: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "transparent",
    minWidth: 60,
  },
  colorItemSelected: {
    borderColor: "#007bff",
    backgroundColor: "#f0f8ff",
  },
  colorPreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#e9ecef",
    marginBottom: 4,
  },
  colorPreviewSelected: {
    borderColor: "#007bff",
  },
  colorName: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
  helpOptionsContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  helpOptionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  helpOptionsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  removeHelpButton: {
    padding: 4,
  },
  helpOptionsList: {
    marginBottom: 12,
  },
  helpOptionItem: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  helpOptionItemSelected: {
    borderColor: "#007bff",
    backgroundColor: "#f0f8ff",
  },
  optionTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  helpOptionText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    fontWeight: "500",
  },
  helpOptionTextSelected: {
    color: "#007bff",
    fontWeight: "600",
  },
  optionButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  editOptionButton: {
    padding: 4,
    marginRight: 4,
  },
  removeOptionButton: {
    padding: 4,
  },
  editingContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  editingInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    backgroundColor: "#f0f8ff",
    marginRight: 8,
  },
  saveEditButton: {
    padding: 4,
  },
  addOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  newOptionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#333",
    marginRight: 8,
  },
  addOptionButton: {
    backgroundColor: "#f0f8ff",
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  multipleSelectionToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  toggleCheckbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderRadius: 3,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  toggleCheckboxChecked: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  multipleSelectionText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  // File attachment styles
  fileAttachmentContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  fileAttachmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  fileAttachmentLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  removeFileAttachmentButton: {
    padding: 4,
  },
  fileUploadArea: {
    backgroundColor: "#f0f8ff",
    borderWidth: 2,
    borderColor: "#007bff",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  fileUploadText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007bff",
    marginTop: 8,
    textAlign: "center",
  },
  fileUploadSubtext: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  uploadedFilesContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
  },
  filesScrollContainer: {
    maxHeight: 150,
    marginBottom: 8,
  },
  uploadedFileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  fileDetails: {
    marginLeft: 10,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    color: "#666",
  },
  removeFileButton: {
    padding: 4,
  },
  addMoreFilesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f8ff",
    borderWidth: 1,
    borderColor: "#007bff",
    borderRadius: 6,
    padding: 8,
  },
  addMoreFilesText: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "500",
    marginLeft: 4,
  },
  // GIF selector styles
  gifSelectorContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  gifSelectorHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 12,
  },
  headerSpacer: {
    flex: 1,
  },
  gifSelectorLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  removeGifSelectorButton: {
    padding: 4,
  },
  gifSearchContainer: {
    marginBottom: 12,
  },
  gifSearchInput: {
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#333",
    marginBottom: 4,
  },
  poweredByText: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  gifLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  selectedGifContainer: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  selectedGifImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: "cover",
  },
  changeGifButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  changeGifText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  gifsCarouselContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  gifsScrollView: {
    maxHeight: 120,
  },
  gifsScrollContent: {
    paddingHorizontal: 4,
  },
  gifItem: {
    marginRight: 8,
    borderRadius: 6,
    overflow: "hidden",
  },
  gifThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 6,
    resizeMode: "cover",
  },
  gifEmptyState: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  gifEmptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  // Filter Box styles
  filterBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  filterHeaderIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  filterHeaderIcon: {
    marginRight: 8,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  filterContent: {
    marginTop: 16,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginTop: 12,
    marginBottom: 8,
  },
  filterOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  filterOptionSelected: {
    backgroundColor: "#f0f8ff",
    borderColor: "#007bff",
  },
  filterOptionLabel: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
    fontWeight: "500",
  },
  filterOptionLabelSelected: {
    color: "#007bff",
    fontWeight: "600",
  },
  // Post Source Modal styles
  postSourceModalContent: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    maxWidth: 400,
    width: "90%",
    maxHeight: "80%",
  },
  postSourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  postSourceModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  postSourceBackButton: {
    padding: 4,
  },
  postSourceOptionsContainer: {
    maxHeight: 400,
  },
  postSourceOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  postSourceOptionSelected: {
    backgroundColor: "#f0f8ff",
  },
  postSourceOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  postSourceOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  postSourceOptionIcon: {
    marginRight: 12,
  },
  postSourceOptionTexts: {
    flex: 1,
  },
  postSourceOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  postSourceOptionTitleSelected: {
    color: "#007bff",
  },
  postSourceOptionDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});

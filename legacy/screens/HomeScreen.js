import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from "react-native";
import { useState, useMemo, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import Ionicons from "react-native-vector-icons/Ionicons";

// Get screen width for pagination
const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth > 768; // simple check tablette

// Define all apps data

const appsData = [
  {
    id: 1,
    name: "Ambassadeur",
    icon: "megaphone-outline",
    bgColor: "#FF6B6B",
    style: "appLogo1",
    route: "/Ambassadeur",
  },
  {
    id: 2,
    name: "Parrainage",
    icon: "gift-outline",
    bgColor: "#FFD93D",
    style: "appLogo2",
    route: "/Parrainage",
  },
  {
    id: 3,
    name: "Livre blanc",
    icon: "book-outline",
    bgColor: "#6BCB77",
    style: "appLogo3",
    route: "/LivreBlanc",
  },
  {
    id: 4,
    name: "Change euro/JRC",
    icon: "cash-outline",
    bgColor: "#4D96FF",
    style: "appLogo4",
    route: "/ChangeEuroJerr",
  },
  {
    id: 5,
    name: "Paramètres",
    icon: "settings-outline",
    bgColor: "#A084DC",
    style: "appLogo5",
    route: "/Parametres",
  },
  {
    id: 6,
    name: "NewsJerr",
    icon: "newspaper-outline",
    bgColor: "#FF6B6B",
    style: "appLogo6",
    route: "/NewsJerr",
  },
  {
    id: 7,
    name: "CapiJerr",
    icon: "trending-up-outline",
    bgColor: "#FFD93D",
    style: "appLogo7",
    route: "/CapiJerr",
  },
  {
    id: 8,
    name: "ChabJerr",
    icon: "chatbubbles-outline",
    bgColor: "#6BCB77",
    style: "appLogo8",
    route: "/ChabJerr",
  },
  {
    id: 9,
    name: "EvenJerr",
    icon: "calendar-outline",
    bgColor: "#4D96FF",
    style: "appLogo9",
    route: "/EvenJerr",
  },
  {
    id: 10,
    name: "PiolJerr",
    icon: "airplane-outline",
    bgColor: "#FF6B6B",
    style: "appLogo10",
    route: "/PiolJerr",
  },
  {
    id: 11,
    name: "VagoJerr",
    icon: "bicycle-outline",
    bgColor: "#FFD93D",
    style: "appLogo11",
    route: "/VagoJerr",
  },
  {
    id: 12,
    name: "SpeakJerr",
    icon: "people-outline",
    bgColor: "#6BCB77",
    style: "appLogo12",
    route: "/SpeakJerr",
  },
  {
    id: 13,
    name: "JobJerr",
    icon: "briefcase-outline",
    bgColor: "#4D96FF",
    style: "appLogo13",
    route: "/JobJerr",
  },
  {
    id: 14,
    name: "CodeJerr",
    icon: "code-slash-outline",
    bgColor: "#A084DC",
    style: "appLogo14",
    route: "/CodeJerr",
  },
  {
    id: 15,
    name: "LeaseJerr",
    icon: "car-outline",
    bgColor: "#FF6B6B",
    style: "appLogo15",
    route: "/LeaseJerr",
  },
  {
    id: 16,
    name: "StarJerr",
    icon: "star-outline",
    bgColor: "#FFD93D",
    style: "appLogo16",
    route: "/StarJerr",
  },
  {
    id: 17,
    name: "TeachJerr",
    icon: "school-outline",
    bgColor: "#6BCB77",
    style: "appLogo17",
    route: "/TeachJerr",
  },
  {
    id: 18,
    name: "CloudJerr",
    icon: "cloud-outline",
    bgColor: "#4D96FF",
    style: "appLogo18",
    route: "/CloudJerr",
  },
  {
    id: 19,
    name: "AssuJerr",
    icon: "shield-checkmark-outline",
    bgColor: "#A084DC",
    style: "appLogo19",
    route: "/AssuJerr",
  },
  {
    id: 20,
    name: "FundingJerr",
    icon: "wallet-outline",
    bgColor: "#FF6B6B",
    style: "appLogo20",
    route: "/FundingJerr",
  },
  {
    id: 21,
    name: "AvoJerr",
    icon: "scale-outline",
    bgColor: "#FFD93D",
    style: "appLogo21",
    route: "/AvoJerr",
  },
  {
    id: 22,
    name: "ShopJerr",
    icon: "cart-outline",
    bgColor: "#6BCB77",
    style: "appLogo22",
    route: "/ShopJerr",
  },
  {
    id: 23,
    name: "ImmoJerr",
    icon: "home-outline",
    bgColor: "#4D96FF",
    style: "appLogo23",
    route: "/ImmoJerr",
  },
  {
    id: 24,
    name: "DoctoJerr",
    icon: "medkit-outline",
    bgColor: "#A084DC",
    style: "appLogo24",
    route: "/DoctoJerr",
  },
  {
    id: 25,
    name: "AppJerr",
    icon: "apps-outline",
    bgColor: "#FF6B6B",
    style: "appLogo25",
    route: "/AppJerr",
  },
  {
    id: 26,
    name: "DomJerr",
    icon: "id-card-outline",
    bgColor: "#FFD93D",
    style: "appLogo26",
    route: "/DomJerr",
  },
  {
    id: 27,
    name: "PicJerr",
    icon: "camera-outline",
    bgColor: "#6BCB77",
    style: "appLogo27",
    route: "/PicJerr",
  },
  {
    id: 28,
    name: "SmadJerr",
    icon: "pricetag-outline",
    bgColor: "#4D96FF",
    style: "appLogo28",
    route: "/SmadJerr",
  },
];

// Table de correspondance des routes Expo Router vers les noms d'écrans React Navigation
const routeMap = {
  "/CydJerrNation": "CydJerrNation",
  "/JoyJerr": "JoyJerr",
  "/KidJerr": "KidJerr",
  "/NewsJerr": "NewsJerr",
  "/SpeakJerr": "SpeakJerr",
  "/ChabJerr": "ChabJerr",
  "/PiolJerr": "PiolJerr",
  "/EvenJerr": "EvenJerr",
  "/ShopJerr": "ShopJerr",
  "/CapiJerr": "CapiJerr",
  "/JobJerr": "JobJerr",
  "/TeachJerr": "TeachJerr",
  "/StarJerr": "StarJerr",
  "/FundingJerr": "FundingJerr",
  "/KidJerr": "KidJerr",
  "/CloudJerr": "CloudJerr",
  "/FileManager": "FileManager",
  "/StoragePlans": "StoragePlans",
  "/CloudSettings": "CloudSettings",
  "/DoctoJerr": "DoctoJerr",
  "/AvoJerr": "AvoJerr",
  "/AssuJerr": "AssuJerr",
  "/DomJerr": "DomJerr",
  "/VagoJerr": "VagoJerr",
  "/ImmoJerr": "ImmoJerr",
  "/AppJerr": "AppJerr",
  "/SmadJerr": "SmadJerr",
  "/GameJerr": "GameJerr",
  "/PicJerr": "PicJerr",
  "/CodJerr": "CodJerr",
  "/CodeJerr": "CodJerr", // correction vers l'écran legacy
  "/LeaseJerr": "LeaseJerr",
};

// Component for rendering the first page (only JoyJerr and OngKidJerr sections)
const HomePage = ({ onAppPress, onJoyPress, onKidPress }) => (
  <View style={styles.pageContainer}>
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.logosContainer}>
        {/* JoyJerr Section */}
        <View style={styles.centerLogo2Container}>
          <TouchableOpacity onPress={onJoyPress}>
            <Image
              source={require("../../attached_assets/joyJerr_1756297239250.png")}
              style={styles.centerLogo}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        {appsData.slice(5, 11).map((app) => (
          <TouchableOpacity
            key={`page1-${app.id}`}
            style={[styles.appLogoItem, styles[app.style]]}
            onPress={() => onAppPress(app)}
          >
            <View
              style={[styles.iconWrapper, { backgroundColor: app.bgColor }]}
            >
              <Ionicons name={app.icon} size={28} color="#fff" />
            </View>
            <View style={styles.appNameBorder}>
              <View style={styles.appNameContainer}>
                <Text style={styles.appNameText}>{app.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* OngKidJerr Section */}
        <View style={styles.centerLogo3Container}>
          <TouchableOpacity onPress={onKidPress}>
            <Image
              source={require("../../attached_assets/ongKidJerr_1756297246621.png")}
              style={styles.centerLogo}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        {appsData.slice(11, 17).map((app) => (
          <TouchableOpacity
            key={`page1-${app.id}`}
            style={[styles.appLogoItem, styles[app.style]]}
            onPress={() => onAppPress(app)}
          >
            <View
              style={[styles.iconWrapper, { backgroundColor: app.bgColor }]}
            >
              <Ionicons name={app.icon} size={28} color="#fff" />
            </View>
            <View style={styles.appNameBorder}>
              <View style={styles.appNameContainer}>
                <Text style={styles.appNameText}>{app.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  </View>
);

// Component for rendering the second page (only other apps)
const HomePage2 = ({ onAppPress }) => (
  <View style={styles.pageContainer}>
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.logosContainer}>
        {appsData.slice(17, 28).map((app) => (
          <TouchableOpacity
            key={`page2-${app.id}`}
            style={[styles.appLogoItem, styles[app.style]]}
            onPress={() => onAppPress(app)}
          >
            <View
              style={[styles.iconWrapper, { backgroundColor: app.bgColor }]}
            >
              <Ionicons name={app.icon} size={28} color="#fff" />
            </View>
            <View style={styles.appNameBorder}>
              <View style={styles.appNameContainer}>
                <Text style={styles.appNameText}>{app.name}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  </View>
);

// Component for rendering search results
const SearchResultItem = ({ app, onPress }) => (
  <TouchableOpacity
    style={styles.searchResultItem}
    onPress={() => onPress(app)}
  >
    <View style={[styles.iconWrapper, { backgroundColor: app.bgColor }]}>
      <Ionicons name={app.icon} size={24} color="#fff" />
    </View>
    <Text style={styles.searchResultText}>{app.name}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const horizontalScrollRef = useRef(null);

  const navigateByRoutePath = (routePath) => {
    const target = routeMap[routePath] || (routePath.startsWith("/") ? routePath.slice(1) : routePath);
    if (target) {
      try {
        navigation.navigate(target);
      } catch (e) {
        console.warn(`[HomeScreen] Navigation échouée vers ${target}:`, e?.message || e);
      }
    } else {
      console.warn(`[HomeScreen] Route non mappée: ${routePath}`);
    }
  };

  const onAppPress = (app) => navigateByRoutePath(app.route);

  // Filter apps based on search text
  const filteredApps = useMemo(() => {
    if (!searchText.trim()) {
      return appsData;
    }
    return appsData.filter((app) =>
      app.name.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText]);

  // Handle scroll end for pagination
  const handleScrollEnd = (event) => {
    const { contentOffset } = event.nativeEvent;
    const pageIndex = Math.round(contentOffset.x / screenWidth);
    setCurrentPage(pageIndex);
  };

  // Handle app selection from search results
  const handleAppSelect = (app) => {
    console.log("Selected app:", app.name);
    setSearchText("");
    setIsSearchFocused(false);
    onAppPress(app);
  };

  // Handle search input focus
  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  // Handle search input blur
  const handleSearchBlur = () => {
    // Delay hiding to allow for app selection
    setTimeout(() => {
      if (!searchText.trim()) {
        setIsSearchFocused(false);
      }
    }, 150);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../attached_assets/cydJerrBackground_1756295909925.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        {/* Fixed Main Card with Search Bar and CydJerr Nation */}
        <View style={styles.mainCard}>
          {/* Search Container */}
          <View style={styles.searchContainer}>
            <View
              style={[
                styles.outerBorder,
                isSearchFocused && styles.searchBarFocused,
              ]}
            >
              <View style={styles.innerBorder}>
                <TextInput
                  placeholder="Rechercher une app..."
                  placeholderTextColor="rgba(255, 255, 255, 0.7)"
                  style={styles.searchInput}
                  value={searchText}
                  onChangeText={setSearchText}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  returnKeyType="search"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>
            {isSearchFocused && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setSearchText("");
                  setIsSearchFocused(false);
                  Keyboard.dismiss();
                }}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Fixed CydJerr Nation Section */}
          {!isSearchFocused && (
            <View style={styles.fixedCydJerrSection}>
              <View style={styles.centerLogoContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("CydJerrNation")}>
                  <Image
                    source={require("../../attached_assets/cydJerrNation_1756297038427.png")}
                    style={styles.centerLogo}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.appLogosContainer}>
                {appsData.slice(0, 5).map((app) => (
                  <TouchableOpacity
                    key={`fixed-${app.id}`}
                    style={[styles.appLogoItem, styles[app.style]]}
                    onPress={() => onAppPress(app)}
                  >
                    <View
                      style={[
                        styles.iconWrapper,
                        { backgroundColor: app.bgColor },
                      ]}
                    >
                      <Ionicons name={app.icon} size={28} color="#fff" />
                    </View>
                    <View style={styles.appNameBorder}>
                      <View style={styles.appNameContainer}>
                        <Text style={styles.appNameText}>{app.name}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Search Results Overlay */}
        {isSearchFocused && (
          <View style={styles.searchOverlay}>
            <View style={styles.searchResultsContainer}>
              <FlatList
                data={filteredApps}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <SearchResultItem app={item} onPress={handleAppSelect} />
                )}
                style={styles.searchResultsList}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>
                      Aucune application trouvée pour "{searchText}"
                    </Text>
                  </View>
                }
              />
            </View>
          </View>
        )}

        {/* Scrollable Content - Only show when search is not focused */}
        {!isSearchFocused && (
          <>
            {/* Horizontal pagination container */}
            <ScrollView
              ref={horizontalScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScrollView}
              onMomentumScrollEnd={handleScrollEnd}
              scrollEventThrottle={16}
            >
              {/* First Page */}
              <HomePage
                onAppPress={onAppPress}
                onJoyPress={() => navigation.navigate("JoyJerr")}
                onKidPress={() => navigation.navigate("KidJerr")}
              />

              {/* Second Page */}
              <HomePage2 onAppPress={onAppPress} />
            </ScrollView>

            {/* Page indicators */}
            <View style={styles.paginationContainer}>
              <View
                style={[
                  styles.paginationDot,
                  currentPage === 0 && styles.activeDot,
                ]}
              />
              <View
                style={[
                  styles.paginationDot,
                  currentPage === 1 && styles.activeDot,
                ]}
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: responsiveWidth(100),
    height: responsiveHeight(120),
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  mainCard: {
    paddingTop: responsiveHeight(5),
    paddingHorizontal: responsiveWidth(0),
    zIndex: 10,
  },
  searchContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(10),
    marginBottom: responsiveHeight(4),
  },
  cancelButton: {
    paddingHorizontal: responsiveWidth(1),
    paddingVertical: responsiveHeight(1),
    marginLeft: responsiveWidth(1),
  },
  cancelButtonText: {
    color: "#ffffff",
    fontSize: responsiveFontSize(2),
    fontWeight: "600",
  },
  outerBorder: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: responsiveWidth(6),
    paddingHorizontal: responsiveWidth(4),
    shadowColor: "#ffffffff",
    shadowOffset: { width: 0, height: responsiveHeight(0.5) },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  searchBarFocused: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    shadowOpacity: 0.5,
  },
  innerBorder: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: responsiveWidth(4.5),
    shadowColor: "#ffffffff",
    shadowOffset: { width: 0, height: responsiveHeight(0.3) },
    shadowOpacity: 0.2,
    shadowRadius: responsiveWidth(1),
    elevation: 4,
  },
  searchInput: {
    height: responsiveHeight(5),
    paddingHorizontal: responsiveWidth(5),
    fontSize: responsiveFontSize(1.8),
    color: "#ffffffff",
    backgroundColor: "transparent",
  },
  // Fixed CydJerr Nation Section
  fixedCydJerrSection: {
    height: responsiveHeight(25),
    width: "100%",
    alignItems: "center",
    position: "relative",
  },
  centerLogoContainer: {
    position: "absolute",
    top: -4,
    alignItems: "center",
    zIndex: 10,
  },
  centerLogo: {
    width: responsiveWidth(30),
    height: responsiveHeight(10),
    resizeMode: "contain",
  },
  appLogosContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  appLogoItem: {
    position: "absolute",
    alignItems: "center",
  },
  appLogo: {
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    resizeMode: "contain",
    marginBottom: responsiveHeight(0.2),
  },
  appLogoSize2: {
    width: responsiveWidth(16),
    height: responsiveWidth(16),
    resizeMode: "contain",
    marginBottom: responsiveHeight(0.2),
  },
  appNameContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: responsiveWidth(4),
    paddingHorizontal: responsiveWidth(1),
    paddingVertical: responsiveHeight(0.5),
    elevation: 4,
  },
  appNameBorder: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: responsiveWidth(6),
    paddingHorizontal: responsiveWidth(1.2),
    shadowColor: "#ffffffff",
    shadowOffset: { width: 0, height: responsiveHeight(0.4) },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appNameText: {
    color: "#ffffff",
    fontSize: responsiveFontSize(1.5),
    fontWeight: "600",
    textAlign: "center",
  },
  // Search Results Styles
  searchOverlay: {
    position: "absolute",
    top: responsiveHeight(15),
    left: responsiveWidth(5),
    right: responsiveWidth(5),
    bottom: responsiveHeight(4),
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderRadius: responsiveWidth(4),
    zIndex: 20,
  },
  searchResultsContainer: {
    flex: 1,
    padding: responsiveWidth(2),
  },
  searchResultsList: {
    flex: 1,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(3),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  searchResultLogo: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    marginRight: responsiveWidth(4),
    resizeMode: "contain",
  },
  searchResultText: {
    color: "#ffffff",
    fontSize: responsiveFontSize(2),
    fontWeight: "500",
  },
  horizontalScrollView: {
    flex: 1,
    width: responsiveWidth(100),
    backgroundColor: "transparent",
  },
  pageContainer: {
    width: screenWidth,
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: responsiveWidth(100),
  },
  scrollContent: {
    paddingBottom: responsiveHeight(90),
    alignItems: "center",
    flexGrow: 1,
  },
  logosContainer: {
    width: responsiveWidth(100),
    alignItems: "center",
    marginTop: responsiveHeight(3),
    position: "relative",
    height: responsiveHeight(90),
    minHeight: responsiveHeight(80),
  },
  centerLogo2Container: {
    position: "absolute",
    top: responsiveHeight(0),
    alignItems: "center",
    zIndex: 10,
  },
  centerLogo3Container: {
    position: "absolute",
    top: responsiveHeight(28),
    alignItems: "center",
    zIndex: 10,
  },
  paginationContainer: {
    position: "absolute",
    bottom: responsiveHeight(2),
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: responsiveWidth(2),
    backgroundColor: "transparent",
  },
  paginationDot: {
    width: responsiveWidth(2.8),
    height: responsiveWidth(2.8),
    borderRadius: responsiveWidth(1.9),
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.3)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: responsiveHeight(0.5) },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  activeDot: {
    backgroundColor: "#ffffff",
    width: responsiveWidth(2.8),
    height: responsiveWidth(2.8),
    borderRadius: responsiveWidth(2.4),
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.5)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: responsiveHeight(0.5) },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 8,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: responsiveWidth(10),
  },
  noResultsText: {
    color: "#ffffff",
    fontSize: responsiveFontSize(2),
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.8,
  },
  // App positioning styles (responsive) for fixed CydJerr Nation section
  appLogo1: {
    top: responsiveHeight(0),
    left: responsiveWidth(6),
  },
  appLogo2: {
    top: responsiveHeight(12),
    left: responsiveWidth(9),
  },
  appLogo3: {
    top: responsiveHeight(16),
    alignSelf: "center",
    alignItems: "center",
  },
  appLogo4: {
    top: responsiveHeight(12),
    right: responsiveWidth(9),
  },
  appLogo5: {
    top: responsiveHeight(0),
    right: responsiveWidth(6),
  },
  // App positioning styles for scrollable sections (adjusted for new layout)
  appLogo6: {
    top: responsiveHeight(0),
    left: responsiveWidth(6),
  },
  appLogo7: {
    top: responsiveHeight(14),
    left: responsiveWidth(6),
  },
  appLogo8: {
    top: responsiveHeight(14),
    left: responsiveWidth(30),
  },
  appLogo9: {
    top: responsiveHeight(14),
    right: responsiveWidth(30),
  },
  appLogo10: {
    top: responsiveHeight(14),
    right: responsiveWidth(6),
  },
  appLogo11: {
    top: responsiveHeight(0),
    right: responsiveWidth(6),
  },
  appLogo12: {
    top: responsiveHeight(28),
    left: responsiveWidth(6),
  },
  appLogo13: {
    top: responsiveHeight(42),
    left: responsiveWidth(6),
  },
  appLogo14: {
    top: responsiveHeight(42),
    left: responsiveWidth(30),
  },
  appLogo15: {
    top: responsiveHeight(42),
    right: responsiveWidth(30),
  },
  appLogo16: {
    top: responsiveHeight(42),
    right: responsiveWidth(6),
  },
  appLogo17: {
    top: responsiveHeight(28),
    right: responsiveWidth(6),
  },
  // Apps for page 2 (adjusted positioning)
  appLogo18: {
    top: responsiveHeight(0),
    left: responsiveWidth(6),
  },
  appLogo19: {
    top: responsiveHeight(0),
    left: responsiveWidth(30),
  },
  appLogo20: {
    top: responsiveHeight(0),
    right: responsiveWidth(30),
  },
  appLogo21: {
    top: responsiveHeight(0),
    right: responsiveWidth(6),
  },
  appLogo22: {
    top: responsiveHeight(14),
    left: responsiveWidth(6),
  },
  appLogo23: {
    top: responsiveHeight(14),
    left: responsiveWidth(30),
  },
  appLogo24: {
    top: responsiveHeight(14),
    right: responsiveWidth(30),
  },
  appLogo25: {
    top: responsiveHeight(14),
    right: responsiveWidth(6),
  },
  appLogo26: {
    top: responsiveHeight(28),
    left: responsiveWidth(6),
  },
  appLogo27: {
    top: responsiveHeight(28),
    left: responsiveWidth(30),
  },
  appLogo28: {
    top: responsiveHeight(28),
    right: responsiveWidth(30),
  },

  iconWrapper: {
    marginBottom: responsiveHeight(1),
    width: responsiveWidth(14), // ~60px sur un écran classique
    height: responsiveWidth(14), // idem, pour rester carré
    borderRadius: responsiveWidth(4.5), // cercle proportionnel
    justifyContent: "center", // centre verticalement
    alignItems: "center", // centre horizontalement
    shadowColor: "#000",
    shadowOffset: { width: 0, height: responsiveHeight(0.3) },
    shadowOpacity: 0.2,
    shadowRadius: responsiveWidth(1.5),
    elevation: 4,
  },
});

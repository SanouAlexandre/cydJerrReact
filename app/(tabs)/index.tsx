import { Image } from "expo-image";
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

// Get screen width for pagination
const { width: screenWidth } = Dimensions.get("window");
const isTablet = screenWidth > 768; // simple check tablette

// Define all apps data
const appsData = [
  {
    id: 1,
    name: "Ambassadeur",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo1",
  },
  {
    id: 2,
    name: "Parrainage",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo2",
  },
  {
    id: 3,
    name: "Livre blanc",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo3",
  },
  {
    id: 4,
    name: "Change euro/Jerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo4",
  },
  {
    id: 5,
    name: "Paramètres",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo5",
  },
  {
    id: 6,
    name: "NewsJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo6",
  },
  {
    id: 7,
    name: "CapiJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo7",
  },
  {
    id: 8,
    name: "ChabJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo8",
  },
  {
    id: 9,
    name: "EvenJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo9",
  },
  {
    id: 10,
    name: "PiolJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo10",
  },
  {
    id: 11,
    name: "VagoJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo11",
  },
  {
    id: 12,
    name: "SpeekJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo12",
  },
  {
    id: 13,
    name: "JobJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo13",
  },
  {
    id: 14,
    name: "CodeJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo14",
  },
  {
    id: 15,
    name: "LeaseJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo15",
  },
  {
    id: 16,
    name: "StarJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo16",
  },
  {
    id: 17,
    name: "TeachJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo17",
  },
  {
    id: 18,
    name: "CloudJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo18",
  },
  {
    id: 19,
    name: "AssuJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo19",
  },
  {
    id: 20,
    name: "FundingJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo20",
  },
  {
    id: 21,
    name: "AvoJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo21",
  },
  {
    id: 22,
    name: "ShopJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo22",
  },
  {
    id: 23,
    name: "ImmoJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo23",
  },
  {
    id: 24,
    name: "DoctoJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo24",
  },
  {
    id: 25,
    name: "AppJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo25",
  },
  {
    id: 26,
    name: "DomJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo26",
  },
  {
    id: 27,
    name: "PicJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo27",
  },
  {
    id: 28,
    name: "SmadJerr",
    logo: require("@/attached_assets/logoCydJerr4Grand_1756299210471.png"),
    style: "appLogo28",
  },
];

// Component for rendering the first page (only JoyJerr and OngKidJerr sections)
const HomePage = () => (
  <View style={styles.pageContainer}>
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.logosContainer}>
        {/* JoyJerr Section */}
        <View style={styles.centerLogo2Container}>
          <Image
            source={require("@/attached_assets/joyJerr_1756297239250.png")}
            style={styles.centerLogo}
          />
        </View>
        {appsData.slice(5, 11).map((app) => (
          <View
            key={`page1-${app.id}`}
            style={[styles.appLogoItem, styles[app.style]]}
          >
            <Image source={app.logo} style={styles.appLogoSize2} />
            <View style={styles.appNameBorder}>
              <View style={styles.appNameContainer}>
                <Text style={styles.appNameText}>{app.name}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* OngKidJerr Section */}
        <View style={styles.centerLogo3Container}>
          <Image
            source={require("@/attached_assets/ongKidJerr_1756297246621.png")}
            style={styles.centerLogo}
          />
        </View>
        {appsData.slice(11, 17).map((app) => (
          <View
            key={`page1-${app.id}`}
            style={[styles.appLogoItem, styles[app.style]]}
          >
            <Image source={app.logo} style={styles.appLogoSize2} />
            <View style={styles.appNameBorder}>
              <View style={styles.appNameContainer}>
                <Text style={styles.appNameText}>{app.name}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  </View>
);

// Component for rendering the second page (only other apps)
const HomePage2 = () => (
  <View style={styles.pageContainer}>
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.logosContainer}>
        {appsData.slice(17, 28).map((app) => (
          <View
            key={`page2-${app.id}`}
            style={[styles.appLogoItem, styles[app.style]]}
          >
            <Image source={app.logo} style={styles.appLogoSize2} />
            <View style={styles.appNameBorder}>
              <View style={styles.appNameContainer}>
                <Text style={styles.appNameText}>{app.name}</Text>
              </View>
            </View>
          </View>
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
    <Image source={app.logo} style={styles.searchResultLogo} />
    <Text style={styles.searchResultText}>{app.name}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const horizontalScrollRef = useRef(null);

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
    // Add your app navigation logic here
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
        source={require("@/attached_assets/cydJerrBackground_1756295909925.png")}
        style={styles.backgroundImage}
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
                <Image
                  source={require("@/attached_assets/cydJerrNation_1756297038427.png")}
                  style={styles.centerLogo}
                />
              </View>
              <View style={styles.appLogosContainer}>
                {appsData.slice(0, 5).map((app) => (
                  <View
                    key={`fixed-${app.id}`}
                    style={[styles.appLogoItem, styles[app.style]]}
                  >
                    <Image source={app.logo} style={styles.appLogo} />
                    <View style={styles.appNameBorder}>
                      <View style={styles.appNameContainer}>
                        <Text style={styles.appNameText}>{app.name}</Text>
                      </View>
                    </View>
                  </View>
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
              <HomePage />

              {/* Second Page */}
              <HomePage2 />
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
    height: responsiveHeight(100),
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
    height: responsiveHeight(4.5),
    paddingHorizontal: responsiveWidth(5),
    fontSize: responsiveFontSize(2),
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
    top: 0,
    alignItems: "center",
    zIndex: 10,
  },
  centerLogo: {
    width: responsiveWidth(30),
    height: responsiveHeight(10),
    contentFit: "contain",
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
    contentFit: "contain",
    marginBottom: responsiveHeight(0.2),
  },
  appLogoSize2: {
    width: responsiveWidth(16),
    height: responsiveWidth(16),
    contentFit: "contain",
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
    contentFit: "contain",
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
    marginTop: responsiveHeight(2),
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
    top: responsiveHeight(24),
    alignItems: "center",
    zIndex: 10,
  },
  paginationContainer: {
    position: "absolute",
    bottom: responsiveHeight(8),
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: responsiveWidth(2),
    backgroundColor: "transparent",
  },
  paginationDot: {
    width: responsiveWidth(3.8),
    height: responsiveWidth(3.8),
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
    width: responsiveWidth(4.8),
    height: responsiveWidth(4.8),
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
    top: responsiveHeight(1),
    left: responsiveWidth(6),
  },
  appLogo2: {
    top: responsiveHeight(10.5),
    left: responsiveWidth(9),
  },
  appLogo3: {
    top: responsiveHeight(12),
    alignSelf: "center",
    alignItems: "center",
  },
  appLogo4: {
    top: responsiveHeight(10.5),
    right: responsiveWidth(9),
  },
  appLogo5: {
    top: responsiveHeight(1),
    right: responsiveWidth(6),
  },
  // App positioning styles for scrollable sections (adjusted for new layout)
  appLogo6: {
    top: responsiveHeight(0),
    left: responsiveWidth(6),
  },
  appLogo7: {
    top: responsiveHeight(12),
    left: responsiveWidth(6),
  },
  appLogo8: {
    top: responsiveHeight(12),
    left: responsiveWidth(30),
  },
  appLogo9: {
    top: responsiveHeight(12),
    right: responsiveWidth(30),
  },
  appLogo10: {
    top: responsiveHeight(12),
    right: responsiveWidth(6),
  },
  appLogo11: {
    top: responsiveHeight(0),
    right: responsiveWidth(6),
  },
  appLogo12: {
    top: responsiveHeight(24),
    left: responsiveWidth(6),
  },
  appLogo13: {
    top: responsiveHeight(36),
    left: responsiveWidth(6),
  },
  appLogo14: {
    top: responsiveHeight(36),
    left: responsiveWidth(30),
  },
  appLogo15: {
    top: responsiveHeight(36),
    right: responsiveWidth(30),
  },
  appLogo16: {
    top: responsiveHeight(36),
    right: responsiveWidth(6),
  },
  appLogo17: {
    top: responsiveHeight(24),
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
    top: responsiveHeight(12),
    left: responsiveWidth(6),
  },
  appLogo23: {
    top: responsiveHeight(12),
    left: responsiveWidth(30),
  },
  appLogo24: {
    top: responsiveHeight(12),
    right: responsiveWidth(30),
  },
  appLogo25: {
    top: responsiveHeight(12),
    right: responsiveWidth(6),
  },
  appLogo26: {
    top: responsiveHeight(24),
    left: responsiveWidth(6),
  },
  appLogo27: {
    top: responsiveHeight(24),
    left: responsiveWidth(30),
  },
  appLogo28: {
    top: responsiveHeight(24),
    right: responsiveWidth(30),
  },
});

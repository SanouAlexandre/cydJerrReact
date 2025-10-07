# Présentation des applications Legacy

Ce document décrit, application par application, les fonctionnalités clés et les flux principaux tels qu’implémentés dans le code du dossier `legacy`. Chaque section est basée sur l’analyse des écrans, services et utilitaires correspondants. Le but est d’offrir une vue claire pour une présentation à un responsable. Nous procédons sans doublon, une app à la fois.

## CloudJerr

- Objectif: Gestion de fichiers personnelle type « cloud » (navigation par dossiers, recherche, tri, favoris, partage et téléchargement).
- Écrans principaux: `CloudJerrScreen.js`, `FileManagerScreen.js`, `StoragePlansScreen.js`.
- Service: `services/cloudService.js` (intègre `apiClient`).

Fonctionnalités clés (côté écrans):
- `CloudJerrScreen`: tableau de bord cloud avec raccourcis (Mon Drive, Mes Fichiers, Fichiers récents, Partagés), indicateurs de quota de stockage, et navigation vers le gestionnaire de fichiers via `navigation.navigate('FileManager', { ... })`.
- `FileManagerScreen`: liste et grille des fichiers avec recherche (`searchQuery`), tri (`sortBy`, `sortOrder`), rafraîchissement (`RefreshControl`) et actions sur fichier (Télécharger, Partager, Supprimer). Affichage riche avec blur, gradient, icônes dynamiques.
- `StoragePlansScreen`: consultation des plans/quotas avec chargement via `cloudService`, indicateurs visuels, et logique d’upgrade.

Fonctionnalités clés (côté service `cloudService.js`):
- `getStorageStats()`: récupère les statistiques de stockage utilisateur.
- `getFiles(options)`: pagination, filtres (`category`, `type`, `folder`, `search`) et tri (`sortBy`, `sortOrder`). Retour des fichiers via `/cloud/files`.
- `uploadFile(fileUri, options)`: envoi multipart avec métadonnées (`description`, `folder`, `tags`, `type`).
- `getFileById(fileId)`, `updateFile(fileId, updates)`, `deleteFile(fileId)`: CRUD sur fichiers.
- `shareFile(fileId, email, permission)`: partage avec permissions (`view` par défaut).
- `getDownloadUrl(fileId)`: construit l’URL de téléchargement.
- Collections utiles: `getFolders()`, `getSharedFiles()`, `getRecentFiles(limit)`, `getFavoriteFiles()`, `toggleFavorite(fileId)`, `searchFiles(query, options)`.
- Aides UI: `formatFileSize(bytes)`, `getFileIcon(mimeType)`, `getFileIconColor(mimeType)`.
- Maintenance: `clearCache()`, `exportUserData()`.

Flux utilisateur typique:
- Arrivée sur `CloudJerrScreen` pour vision d’ensemble: quota, accès rapides.
- Navigation vers `FileManager` pour consulter et agir sur les fichiers (recherche, tri, actions contextuelles).
- Téléchargement/partage/suppression déclenchés par `Alert` d’action dans `FileManagerScreen` qui appelle `cloudService`.
- Consultation des plans et options de stockage via `StoragePlansScreen`.

Points techniques notables:

## StarJerr

- Objectif: Découverte et gestion d’informations sur des célébrités, avec une dimension « token » (prix, market cap, change 24h) et navigation par catégories.
- Écrans principaux: `StarJerrScreen.js` (hub), `CategoryDetailsScreen.js` (grille de stars par catégorie), `StarDetailsScreen.js` (fiche détaillée + section token), `StarJerrCategoryScreen.js` (vue catégorie avec tri et recherche), `StarJerrSearchResultsScreen.js` (résultats de recherche filtrés et triés).
- Services et utilitaires: `services/starJerrService.js`, `styles/starJerrStyles`, `utils/starJerrTokens`, `utils/celebrityImages`.

Fonctionnalités clés (côté écrans):
- `StarJerrScreen`: page d’accueil avec animations, header, stats « marché », barre de recherche, et grille de catégories (`SJCategoryGrid`) filtrée par `query` dans Redux (`starJerrSlice`).
- `CategoryDetailsScreen`: affichage des célébrités d’une catégorie, image, badge « Token » si disponible, prix en JERR, et navigation vers la fiche détail. Chargement via `starJerrService`.
- `StarDetailsScreen`: fiche complète d’une célébrité (image, vérification, bio, réseaux sociaux) et section « Informations Token » avec `currentPrice`, `change24h`, `totalTokens`, `marketCap`, `volume`, `holders`, et actions « Acheter/Vendre ».
- `StarJerrCategoryScreen`: vue catégorie avec recherche locale, tri (`marketCap`, `price`, `change`), animations d’entrée, et grille de célébrités.
- `StarJerrSearchResultsScreen`: recherche avancée avec filtres (catégories, pays, verified, etc.) et tris (Pertinence, Market Cap, Prix, Change 24h). Gestion des états de chargement et d’absence de résultats.

Fonctionnalités clés (côté service):
- `starJerrService`: récupération des stars, détails par slug/ID, tendances, recherche, œuvres notables, actualités, mise en avant; interactions via `apiClient`.
- `starService` (API): variantes orientées endpoints `/stars`, avec filtres et pagination.

Flux utilisateur typique:
- Arrivée sur `StarJerrScreen` pour découvrir catégories et tendances.
- Sélection d’une catégorie: `CategoryDetailsScreen` présente la grille des célébrités et leur état token.
- Ouverture de la fiche: `StarDetailsScreen` pour bio et données token, avec actions buy/sell.
- Recherche globale: `StarJerrSearchResultsScreen` pour filtrer/ordonner selon critères métiers.

Points techniques notables:
- Intégration Redux (`starJerrSlice`) pour requête de recherche et catégories.
- Design consistant via `starJerrStyles` et tokens (`starJerrTokens`).
- Navigation paramétrée (slug, categorySlug) et utilitaires d’images (`getCelebrityImage`).
- Intégration `apiClient` pour les appels authentifiés.
- UI soignée: `LinearGradient`, `BlurView`, icônes `Ionicons` dynamiques selon `mimeType`.
- Paramètres de navigation riches (`title`, `folder`, `view`) pour adapter l’expérience.

## SpeakJerr

- Objectif: Application de communication temps réel (messages, statuts, appels, groupes) avec WebSocket et gestion d’état via Redux.
- Écrans principaux: `SpeakJerrScreen.js` (legacy/screens), `SpeakJerr/SpeakJerrScreen.js` (version modulaire), onglets `ConversationsTab`, `StatusTab`, `CallsTab`, `GroupsTab`, et `ChatScreen` pour les fils de discussion.
- Services: `services/socketService.js` pour la couche WebSocket, `services/speakjerrApi.js` pour les appels REST (messages, statuts, appels, historique, feedback).

Fonctionnalités clés (côté écrans):
- `SpeakJerrScreen` (legacy/screens):
  - Initialisation du socket (`socketService.initialize()`), mise en place des écouteurs (`incoming_call`, `call_ended`), et synchronisation avec Redux (`connectSocket`, `disconnectSocket`, `setIncomingCall`).
  - Navigation par onglets: Discussions, Statuts, Appels, Groupes.
  - En-tête avec actions de recherche et menu.
- `SpeakJerr/SpeakJerrScreen` (structure modulaire):
  - Indicateur d’état de connexion (En ligne/Hors ligne) via Redux (`setSocketConnected`).
  - Chargement initial des conversations et statuts (`fetchConversations`, `fetchStatuses`).
  - Écoute et dispatch temps réel: `new_message`, `new_status`, `incoming_call`.
  - Gestion de l’utilisateur connecté (redirige vers `Login` si absent).
- `ChatScreen`: affichage d’un fil de messages, envoi (`sendMessage`), marquage comme lu (`markMessageAsRead`), et écoute de typing/lecture via socket.

Fonctionnalités clés (côté services):
- `socketService.js`:
  - Gestion de la connexion WebSocket, ré-émission d’événements applicatifs (`new_message`, `message_read`, `typing_start/stop`).
  - Module d’appels: `incoming_call`, `call_answered/declined/ended`, participants (`joined/left`), mise à jour média, et signalisation WebRTC (`webrtc_offer/answer`).
- `speakjerrApi.js`:
  - Endpoints pour appels: rejoindre/quitter, mise à jour média (`audioEnabled`, `videoEnabled`, `screenSharing`), historique, feedback, détails.
  - Endpoints pour messages/statuts (non exhaustif d’après extrait), typiques: liste, création, marquage lu.

Flux utilisateur typique:
- Ouverture `SpeakJerr`: initialisation socket et récupération des données initiales.
- Navigation par onglets pour consulter conversations, statuts, appels, groupes.
- Réception de nouveaux messages/statuts en temps réel; affichage d’un modal d’appel entrant (à implémenter côté UI).
- Depuis `ChatScreen`, envoyer des messages, voir l’état « en train d’écrire », marquer lus.

Points techniques notables:
- WebSocket centralisé avec un service émetteur d’événements et des écouteurs dédiés dans les écrans.
- Redux pour l’état réseau, les collections (conversations, statuts, appels, groupes) et les notifications d’événements.
- Deux implémentations d’écran (legacy et modulaire) coexistent; la version modulaire affiche l’état de connexion et charge les données.
- Signalisation WebRTC prévue via socket pour les appels (offer/answer), ouvrant la voie à la visiophonie.
- Gestion des erreurs et d’état de connexion (`connection_status`, `connection_error`) relayée à l’UI.

## NewsJerr

- Objectif: Application d’actualité avec catégories, fil d’articles, tendances et « Top Newsers », adaptée mobile et tablette.
- Écran principal: `NewsJerrScreen.js`.

Fonctionnalités clés (côté écran):
- Catégories horizontales: `À la Une`, `Monde`, `Business`, `Tech`, `Sport`, `Culture`, `Santé`, `Science` avec mise en évidence de la catégorie active.
- Données mockées in‑screen: `newsArticles`, `trendingTopics`, `topNewsers` pour démonstration.
- Deux layouts:
  - Tablet/Desktop: colonne feed (`FlatList` des articles) + colonne widgets (Tendances, Top Newsers).
  - Mobile: feed scrollable et widgets affichés conditionnellement pour `À la Une`.
- Carte article: image, catégorie, temps, titre, extrait, actions (favori, partager, enregistrer) avec `BlurView` et `LinearGradient`.
- Bouton flottant « Live News » ouvrant une feuille d’action animée (`Animated.View` + `fade/scale`).

Services/Redux:
- Aucun service externe explicite dans l’extrait; l’intégration future se fera via un service d’API (ex: `newsService`) et/ou Redux pour la persistance des catégories et favoris.

Flux utilisateur typique:
- Sélection d’une catégorie pour filtrer le feed.
- Consultation d’articles; interactions via actions rapides.
- Découverte des tendances et des auteurs populaires.

Points techniques notables:
- UI riche avec `LinearGradient`, `BlurView`, icônes `Ionicons/MaterialIcons`.
- Gestion réactive des layouts via `Dimensions` et `isTablet`.
- Animation de feuille d’action (`Animated.Value` pour `fade` et `scale`).

## AppJerr

- Objectif: Boutique d’applications façon store (découverte, recherche, catégories) avec installation/désinstallation simulées et mise en avant de sélections.
- Écrans principaux: `AppJerrScreen.js` (legacy/screens, écran unique), référencé dans la navigation (`src/navigation/AppNavigator.tsx`) et accessible depuis `HomeScreen.js`.
- État/Redux: `redux/appjerrSlice.js` (catégories, sélection, apps, recherche, installations) et actions (`setSearchQuery`, `setActiveCategory`, `installApp`, `uninstallApp`).
- Utilitaire: `utils/price.js` avec `formatJerr` pour afficher les prix en JERR.

Fonctionnalités clés (côté écran `AppJerrScreen.js`):
- En-tête (`AppJerrStoreHeader`): bouton retour, titre « AppJerr Store », bouton filtre (placeholder pour futurs critères).
- Barre de recherche (`SearchBar`): champ texte relié à Redux via `setSearchQuery`; déclenche le filtrage en temps réel.
- Bouton Studio (`StudioButton`): bouton gradient qui oriente vers « Studio AppJerr » (accès aux apps du studio, navigation à implémenter selon routes disponibles).
- Catégories (`CategoriesSection`): ruban horizontal de catégories; sélection active gérée par `setActiveCategory`. Le filtrage s’applique au reste de la page.
- Sélection mise en avant (`SelectionSection`):
  - `FeaturedAppCard`: carte d’une application mise en avant (icône, nom, développeur, note, téléchargements) avec bouton d’action.
  - `SecondaryAppCard`: cartes secondaires similaires, en grille/listing.
  - Bouton d’action: affiche `Installer` si non installée, `Désinstaller` si déjà installée, ou le prix formaté via `formatJerr` quand applicable.
- Tous les apps (`AllAppsSection`): liste des applications filtrée par catégorie active et requête de recherche; chaque carte contient icône, nom, développeur, description, note, téléchargements et bouton d’installation/désinstallation.
- Logique d’installation: `handleInstallPress(appId)` bascule entre `installApp` et `uninstallApp` en animant légèrement le feedback utilisateur.
- Design: arrière-plan `LinearGradient` avec motifs décoratifs (cercles et grille), `StatusBar` stylisée, styles réactifs et polices spécifiques par plateforme.

Fonctionnalités clés (côté slice `appjerrSlice.js`):
- État initial: 
  - `categories`: ensemble de catégories métiers/tech/divertissement (ex. Productivité, Création, Éducation, Jeux, Finance…).
  - `featuredApps` et `secondaryApps`: sélections éditoriales avec métadonnées (nom, développeur, icône, note, téléchargements, prix, catégorie).
  - `allApps`: catalogue étendu avec description et attributs similaires.
  - `installedApps`: liste des IDs installés.
  - `searchQuery` et `activeCategory` pour le filtrage.
- Actions et reducers:
  - `setSearchQuery(text)`: met à jour la requête de recherche.
  - `setActiveCategory(category)`: bascule la catégorie active.
  - `installApp(appId)`: ajoute l’app à `installedApps`.
  - `uninstallApp(appId)`: retire l’app de `installedApps`.

Flux utilisateur typique:
- Arrivée sur AppJerr: découverte de la sélection et des catégories.
- Recherche: saisir une requête pour filtrer le catalogue et la sélection.
- Catégories: choisir une catégorie pour n’afficher que les apps concernées.
- Installation: appuyer sur `Installer`; l’app apparaît alors comme installée et le bouton devient `Désinstaller`. Inversement, `Désinstaller` la retire de la liste d’installations.
- Accès Studio: utiliser le bouton gradient pour aller vers l’espace « Studio AppJerr » (si route configurée).

Points techniques notables:
- Écran orchestré via `ScrollView` avec sections fonctionnelles et styles isolés (`StyleSheet`).
- Redux uniquement pour l’état de l’UI store (catégorie, recherche, liste d’installations); pas d’appels réseau réels dans l’extrait (données mockées).
- `formatJerr` pour l’affichage des prix, réutilisé dans d’autres écrans (ImmoJerr, CodJerr, etc.).
- UI riche: `LinearGradient`, `BlurView`, icônes `Ionicons/MaterialCommunityIcons`; décoratifs (cercles, grille) pour une identité visuelle.
- Filtrage côté écran via `getFilteredApps` croisant `activeCategory` et `searchQuery`.

## JoyJerr

- Objectif: Réseau social communautaire multi‑sections (Community, Membres, Pages, Groupes, Blog, Profil) avec feed, groupes, messages, notifications, stories et profil riche.
- Écrans principaux:
  - `src/navigation/JoyJerrNavigator.tsx`: registre des écrans `JoyJerrIndex`, `JoyJerrCommunity`, `JoyJerrMembers`, `JoyJerrPages`, `JoyJerrGroups`, `JoyJerrBlog`, `JoyJerrProfile`.
  - `legacy/screens/JoyJerr/index.tsx`: page d’accueil JoyJerr avec logo et grille de sections.
  - `legacy/screens/JoyJerr/profile/index.tsx`: profil modulaire avec sous‑pages (`stream`, `about`, `blog`, `followers`, `friends`, `groups`, `photos`, `audio-videos`, `files`, `pages`) et composants (`NavigationMenu`, `ProfileCover`, `ProfileFooter`).
  - `legacy/screens/JoyJerr/pages.tsx`: gestion des Pages (en‑tête, filtres, création via `CreatePageModal`, contenu `PagesContent`).
  - `legacy/screens/JoyJerrScreen.js`: implémentation legacy tout‑en‑un du hub (posts, groupes, messages, notifications, stories).
- Hooks/Services:
  - `legacy/hooks/useApi.js`: hooks génériques (`usePosts`, `useNotifications`, clés `QUERY_KEYS` pour `GROUPS`, `MESSAGES`, etc.), intégrés à `apiClient` et aux `ENDPOINTS` de `legacy/config/api.js` (`POSTS`, `GROUPS`, `MESSAGES`, `NOTIFICATIONS`).
  - `services/api` (`apiClient`): couche REST utilisée par les hooks et l’écran legacy.

Fonctionnalités clés (côté écrans):
- `JoyJerr/index.tsx`: navigation vers les sections via `useNavigation` et `JoyJerrStackParamList`, UI en grille avec icônes `Ionicons`.
- `JoyJerr/profile/index.tsx`: navigation intra‑profil et pages de contenu (flux, à propos, médias, fichiers, groupes, pages), couverture et pied de profil.
- `JoyJerr/pages.tsx`: filtres et création de pages; navigation vers le détail des pages.
- `JoyJerrScreen.js` (legacy):
  - Onglets: `Accueil`, `Groupes`, `Messages`, `Notifications`.
  - Composer de post: saisie multi‑ligne, sélection média (`launchImageLibrary`/`launchCamera`), géolocalisation (`Geolocation`).
  - Interactions: like, share; gestion des commentaires via modal (lecture/ajout/réponses).
  - Carousel Stories; listes de groupes (mes groupes et tendances); conversations; notifications.
  - Rafraîchissement avec `useFocusEffect` et `RefreshControl`.

Fonctionnalités clés (côté hooks/services):
- `usePosts`: liste de posts, création (`useCreatePost`), like/share, commentaires (`getPostComments`, `addComment`), invalidation de cache `['posts']`.
- `useMyGroups` / `useTrendingGroups`: récupération et rafraîchissement des groupes.
- `useConversations`: conversations avec `unreadCount`, envoi de message.
- `useNotifications`: liste, `unreadCount`, marquage lu et tout lu.
- `useStories`: stories JoyJerr.
- `ENDPOINTS` (`legacy/config/api.js`): routes pour posts, commentaires, groupes, messages, notifications.

Flux utilisateur typique:
- Ouvrir JoyJerr: choisir une section (Community/Membres/Pages/Groupes/Blog/Profil) ou passer par le hub legacy.
- Accueil: parcourir le feed, ajouter un post avec médias et localisation, liker/partager/commenter.
- Groupes: voir tendances et mes groupes, créer/joindre/quitter.
- Messages: consulter les conversations, envoyer des messages, voir les non lus.
- Notifications: consulter et marquer comme lues.
- Profil: naviguer dans les sous‑pages (flux, médias, fichiers, relations).

Points techniques notables:
- Navigation moderne dédiée (`JoyJerrNavigator.tsx`) et écran legacy (`JoyJerrScreen.js`) coexistent.
- Intégration React Query pour la data (caching, invalidation), Redux minimal pour l’utilisateur (`selectAuth`).
- UI riche: `LinearGradient`, `BlurView`, icônes `Ionicons/MaterialCommunityIcons`, effets glassmorphism; performances via `FlatList` et rafraîchissements sélectifs.
- Gestion des médias (Image Picker) et géolocalisation intégrées.
- Rafraîchissement orchestré via `useFocusEffect` selon l’onglet actif.

## ChabJerr

- Objectif: Plateforme vidéo/sociale type hub multimédia (feed, tendances, shorts, lives), avec recherche, likes/partages, démarrage et gestion de lives, et prise en charge de posts vidéo (upload, édition, suppression).
- Écran principal: `ChabJerrScreen.js`.
- Hooks/Services: `hooks/useApi.js` expose des hooks dédiés ChabJerr (feed, tendances, vidéos, shorts, récents, recherche), interactions (like/share), gestion des lives et des appels; utilise `apiClient` (REST) et React Query.

Fonctionnalités clés (côté écran `ChabJerrScreen.js`):
- Navigation par onglets: `Accueil`, `Tendances`, `Shorts`, `Lives`, `Abonnements` avec sélection dynamique du hook approprié (`useChabJerrFeed`, `useChabJerrTrending`, `useChabJerrShorts`, `useChabJerrLives`, `useChabJerrRecent`).
- Recherche intégrée: champ de recherche avec bascule sur `useChabJerrSearch` quand la requête (`searchText`) dépasse 2 caractères.
- Interactions posts: `like` via `useChabJerrLikePost`, `share` via `useChabJerrSharePost`; incrément de vues vidéo avec `useIncrementVideoViews`.
- Gestion des Lives: liste des lives (`useChabJerrLives`), démarrage/arrêt (`useStartLive`, `useStopLive`), rejoindre/quitter (`useJoinLive`, `useLeaveLive`) et affichage des détails/participants via `useLiveDetails`, `useLiveParticipants`.
- Upload et gestion de vidéos: `useUploadVideo`, création/mise à jour/suppression de posts vidéo (`useCreateVideoPost`, `useUpdateVideoPost`, `useDeleteVideoPost`).
- UI et expérience: header avec actions (recherche, notifications, chat, avatar), filtres thématiques (`Tous`, `Musique`, `Gaming`, `Sport`, `Tech`, `Lifestyle`), cartes vidéo riches (thumbnail, stats, prix en Jerr), animations du FAB pour actions rapides (Live, Upload).

Fonctionnalités clés (côté hooks `hooks/useApi.js`):
- Feed et collections:
  - `useChabJerrFeed(params)`: récupère le feed principal (`type: 'feed'`).
  - `useChabJerrTrending(params)`: contenus tendances (`type: 'trending'`).
  - `useChabJerrVideos(params)`: contenus vidéo (`type: 'video'`).
  - `useChabJerrShorts(params)`: shorts (`type: 'shorts'`, `duration: 'short'`).
  - `useChabJerrRecent(params)`: posts récents (`type: 'recent'`).
  - `useChabJerrSearch(query, filters)`: recherche de posts (`ENDPOINTS.POSTS.SEARCH`).
- Interactions:
  - `useChabJerrLikePost()`: like de post, invalidation des caches `['chabjerr']` et `['posts']`.
  - `useChabJerrSharePost()`: partage d’un post.
  - `useIncrementVideoViews()`: incrémente les vues et invalide les stats du post.
- Upload/vidéo:
  - `useUploadVideo()`: upload via multipart (`/posts`).
  - `useCreateVideoPost()`: création post vidéo (FormData ou JSON, `type: 'video'`).
  - `useUpdateVideoPost()`: mise à jour (`PUT /posts/:id`).
  - `useDeleteVideoPost()`: suppression (`DELETE /posts/:id`).
- Lives et appels:
  - `useStartLive()`, `useStopLive()`, `useJoinLive()`, `useLeaveLive()`.
  - `useCreateLive()`, `useUpdateLive()`, `useLiveDetails(liveId)`, `useLiveParticipants(liveId)`.
  - Gestion d’appel: `useActiveCall()`, `useUpdateCallMedia()` (intégration avec SpeakJerr pour la signalisation/média).
- Paramètres React Query pertinents: `staleTime` adaptés (lives rafraîchi toutes 30s), `refetchInterval` pour données temps réel.

Flux utilisateur typique:
- Arrivée sur `ChabJerr`: consultation du feed ou des tendances; filtrage rapide par catégories et recherche.
- Ouverture d’un live ou démarrage rapide d’un live via FAB; rejoindre/quitter un live.
- Publication de contenu vidéo: upload/création, puis édition/suppression si nécessaire.
- Interaction avec les posts: like, partager, consulter détails et statistiques de vues.

Points techniques notables:
- Architecture basée sur React Query (`useQuery`/`useMutation`) avec invalidation fine des caches `['chabjerr']` et `['posts']`.
- Unification des endpoints via `apiClient` et `ENDPOINTS.POSTS.*` (liste, détails, recherche, like, share).
- UI dense et performante: `LinearGradient`, `Ionicons/MaterialIcons/Feather`, effets verre via `glass`, tailles via `react-native-size-matters`.
- Intégration Redux minimale (utilisateur via `selectUser`) et navigation `useNavigation`.
- Gestion des états: loading, error, empty state, et header/filtres dynamiques.

## JobJerr

- Objectif: Réseau social professionnel centré sur le partage d’actualités métiers, avec publication rapide et interactions (réactions, commentaires, partages).
- Écran principal: `JobJerrScreen.js`.
- État et logique: `redux/jobjerrSlice.js` gère le texte du composer, la liste des posts et les compteurs d’interactions.

Fonctionnalités clés (côté écran):
- Header en verre/gradient avec actions (`Retour`, `Notifications`, `Paramètres`).
- Composer de publication:
  - Zone de saisie multi‑ligne avec compteur (`maxLength = 2000`).
  - Mode étendu au focus, actions média (photo, vidéo, document) et bouton `Publier` activé si texte non vide.
  - À la publication, dispatch de `publishPost` puis reset du champ via `setComposerText('')`.
- Feed des posts via `FlatList`:
  - `ListHeaderComponent` intègre le composer.
  - Optimisations: `windowSize`, `initialNumToRender`, `maxToRenderPerBatch`, `removeClippedSubviews`, `getItemLayout`.
- Carte de post (`JobJerrPostCard`):
  - En‑tête: avatar emoji, nom, titre, timestamp formaté (`À l’instant`, `xh`, `xj`).
  - Contenu: texte du post.
  - Actions:
    - Réactions (like, celebrate, support, insightful, curious) avec `toggleReaction` qui gère l’unicité de la réaction utilisateur et les compteurs.
    - Commenter `addCommentCount`, Partager `addShareCount` incrémentent les compteurs.

Fonctionnalités clés (côté slice `jobjerrSlice.js`):
- `setComposerText(text)`: met à jour la saisie.
- `publishPost({ author, content })`: crée un post avec `id = Date.now()`, timestamp ISO, compteurs initialisés à 0, insertion en tête de liste.
- `toggleReaction({ postId, reactionType })`: bascule la réaction unique de l’utilisateur en ajustant les compteurs.
- `addCommentCount(postId)`, `addShareCount(postId)`: incrémentent les compteurs correspondants.
- Données mock: 6 posts réalistes avec auteurs, contenus, timestamps (`2h`, `4h`, `1j`…), et compteurs.

Flux utilisateur typique:
- Arrivée sur `JobJerr`: lecture du feed et des cartes.
- Publication rapide via le composer; le post apparaît immédiatement en tête.
- Interaction sur un post: choisir une réaction (une seule active), commenter et partager.

Points techniques notables:
- UI consistante via `jobjerrStyles`, `glass.card`, `shadows.soft`, `LinearGradient`, `BlurView`, icônes `Ionicons`.
- Accessibilité des boutons et champs (`accessibilityRole`, `accessibilityLabel`).
- Formatage performant du feed et timestamp relatif côté UI.

## CapiJerr

- Objectif: Gestion de portefeuille JERR/SOL et investissements, avec vue consolidée des soldes, statistiques globales, plans d'investissement et historique des transactions.
- Écrans principaux: `CapiJerrScreen.js` (hub financier), `CapiJerrProfileScreen.js` (profil et synthèse), `PlanDetailsScreen.js` (détails et performance d’un plan), `InvestmentHistoryScreen.js` (historique des transactions).
- Services: `services/capiJerrService.js` (agrégation), `services/walletService.js` (wallet et consolidation), `services/solanaService.js` (soldes, adresses, compatibilité legacy), `services/investmentService.js` (plans et statistiques).

Fonctionnalités clés (côté écrans):
- `CapiJerrScreen`:
  - Chargement orchestré via `loadWalletData`: wallet local (`walletService.getLocalWalletInfo()`), soldes consolidés (`walletService.getConsolidatedBalances()`), statistiques globales et plans (`investmentService.getGlobalStats()`, `getAllPlans()`), et données Solana (`solanaService.getAllWalletsBalances()`).
  - Mise à jour de la vue portefeuille: `balance` JERR, `solBalance`, `totalValueEUR`, totaux JERR/SOL, avec affichage des wallets et leur valeur estimée.
  - Présentation des plans d’investissement: liste, indicateurs de performance, accès aux détails.
  - Section Wallet Solana: BOSS/MNT selon utilisateur, accès rapide à l’adresse publique.
- `CapiJerrProfileScreen`:
  - Agrégation via `Promise.all`: `investmentService.getGlobalStats()`, `investmentService.getAllPlans()`, `solanaService.getAllWalletsBalances()`, `investmentService.getTransactionHistory()`, et récupération de l’adresse `solanaService.getWalletAddress('BOSS')`.
  - Synthèse compte: numéro/adresse Solana, investissements totaux, rendement moyen, nombre de plans actifs, statut et palier (Standard/Gold/Premium).
  - Historique: dernières transactions et accès à l’historique complet.

## TeachJerr

- Objectif: Plateforme d’apprentissage avec découverte des cours (best‑sellers, nouveautés, recommandations), recherche temps réel, et mise en avant des promotions.
- Écran principal: `TeachJerrScreen.js`.
- État/Redux: `redux/coursesSlice.js` (chargement des sections `bestSellers`, `newCourses`, `recommended`) et `redux/searchSlice.js` (requête, résultats, recherches récentes) avec thunk `searchCourses`.
- Styles et utilitaires: `styles/teachjerr.styles`, `utils/price.js` (`formatJerr`, `applyPromo`), `utils/theme` pour les couleurs et gradients.

Fonctionnalités clés (côté écran `TeachJerrScreen.js`):
- En‑tête fixe: bouton retour, titre « Découvrir », actions notifications et favoris; fond `LinearGradient` et animations d’entrée (`fade`, `slide`, `scale`).
- Barre de recherche « Hero »: champ `TextInput` lié à Redux via `setQuery`; déclenche `searchCourses` au‑delà de 2 caractères; résultats rendus en grille avec cartes cours.
- Bannière promotionnelle: gradient doré, emoji, titre/sous‑titre, CTA « Découvrir ».
- Sections de cours:
  - « Cours Best‑Seller » (liste horizontale, badges « 📈 Best‑Seller »).
  - « Nouveautés » (grille, badges « ✨ Nouveau »).
  - « Recommandé pour vous » (grille).

## ShopJerr

- Objectif: Application e‑commerce orientée découverte et recommandations, avec mise en avant des « Flash Deals », présentation des nouveautés, et un panier flottant.
- Écran principal: `ShopJerrScreen.js`.
- État/Redux: `useSelector`/`useDispatch` intégrés (placeholders, logique locale dans l’écran pour les listes de produits). Gestion d’animations et d’interactions au niveau composant.
- Styles et utilitaires: styles inline via `StyleSheet.create`, `LinearGradient`, `BlurView`, icônes `Feather`, `MaterialCommunityIcons`, `Ionicons`. Utilitaires locaux `eurosToJerr` et `formatJerr` pour conversion/formatage des prix.

Fonctionnalités clés (côté écran `ShopJerrScreen.js`):
- En‑tête: bouton retour, titre « ShopJerr », bouton panier avec badge dynamique (`cartItems`).
- Bannière « Hero »: grande image avec overlay blur, titre « Collection Hiver 2025 », sous‑titre, et CTA gradient « Découvrir maintenant ».
- Section « Flash Deals »:
  - En‑tête avec icône flamme animée et timer `HH:MM:SS` (état `timeLeft`).
  - Carrousel horizontal de cartes deals rendues via `renderFlashDealCard`, avec image produit, nom, réduction, stock restant, prix barré et prix JERR (`eurosToJerr` + `formatJerr`).
  - Bouton « Acheter » sur chaque carte (gradient or).
- Section « ✨ Nouveautés »:
  - Grille de nouveaux produits via `renderNewProductCard`, affichant image, nom, catégories et prix JERR.
- Section « Recommandé pour toi »:
  - Liste de recommandations via `renderRecommendationCard`.
  - Widget météo en blur (« 22°C ») à droite de l’en‑tête.
  - Carte explicative « Comment ça marche ? » décrivant l’algorithme (achats, localisation, tendances).
- Actions flottantes:
  - FAB QR scanner (icône `qrcode-scan`) déclenchant `handleQRScan` (alerte placeholder).
  - Panier flottant conditionnel si `cartItems > 0`, affichant `X articles` et CTA « Voir le panier ».

Flux utilisateur typique:
- Arrivée sur la page avec bannière inspirante et CTA.
- Consultation des « Flash Deals » en profitant du timer.
- Découverte des nouveautés et recommandations personnalisées.
- Ajout d’articles, visualisation du panier flottant, et scan de QR si nécessaire.

Points techniques notables:
- UI riche: `LinearGradient` pour fonds/CTA, `BlurView` pour overlays, animations `Animated` pour l’icône flamme.
- Conversion/formatage prix: utilitaires locaux `eurosToJerr` et `formatJerr` (EUR → JERR, affichage compact).
- Layout réactif: carrousel horizontal, grilles, widgets flottants.
- Intégration basique Redux: `useSelector`/`useDispatch` disponibles; les listes (`flashDeals`, `newProducts`, `recommendations`) sont mockées au niveau écran.

## KidJerr

- Objectif: Présentation d’une ONG dédiée à l’enfance (mission, statistiques d’impact, projets urgents) avec navigation par onglets et appel au don.
- Écran principal: `KidJerrScreen.js`.
- État/UI: état local `activeTab` pour les onglets; données mockées in‑screen (`stats`, `urgentProjects`). Utilisation d’`Ionicons`, `LinearGradient`, `BlurView`, et styles `StyleSheet`.

Fonctionnalités clés (côté écran `KidJerrScreen.js`):
- En‑tête glassmorphique: bouton retour, titre « ONG KidJerr », bouton favori (cœur).
- Navigation par onglets: `Accueil`, `Projets`, `Équipe`, `Partenaires`, `Faire un don` (sélection via `activeTab`).
- Accueil:
  - Carte « Hero »: emoji 💛, slogan, CTA gradient « Faire un don maintenant ».
  - Statistiques d’impact: grille de cartes en blur (Enfants aidés, Fonds collectés en Jerr, Bénévoles, Pays).
  - « Notre Mission »: texte de mission avec header 🎯.
  - « Projets urgents »: cartes projet avec image, description, barre de progression (gradient or/rose), montants collectés/objectif, boutons « Voir détails » et « Faire un don ».
- Autres onglets: sections en développement affichées via placeholders.

Flux utilisateur typique:
- Navigation vers `Accueil` pour comprendre la mission et l’impact.
- Parcours des projets urgents et engagement via le CTA de don.
- Consultation des onglets additionnels pour découvrir l’équipe et les partenaires.

Points techniques notables:
- UI soignée: `BlurView` pour l’entête et cartes, `LinearGradient` pour CTA et progress bars.
- Données mockées locales; intégration future possible avec services de collecte/dons et back‑office ONG.
- Layout responsive avec grilles et carrousels simples; styles `Poppins` pour cohérence visuelle.

## CodJerr

- Objectif: Hub « développeurs et projets » pour découvrir des missions, filtrer par technologies et repérer des profils top.
- Écran principal: `CodJerrScreen.js`.
- État/UI: état local `searchQuery` et `activeFilter` (tags: `Tous`, `React`, `Node.js`, `Mobile`, `IA`, `Blockchain`), animation `scaleAnim` pour le bouton retour. Données mockées en‑écran: `mockRecentProjects` et `mockTopDevelopers`.
- Utilitaires et styles: `formatJerr` (depuis `utils/price`) pour l’affichage des prix en JERR, `LinearGradient` pour fonds et avatars, `BlurView` pour cartes et barres, icônes `Ionicons`, `MaterialCommunityIcons`, `Feather`, styles via `StyleSheet.create`.

Fonctionnalités clés (côté écran `CodJerrScreen.js`):
- En‑tête: bouton retour animé (`Animated.sequence`), titre « CodJerr » avec icône `code-tags`, bouton recherche décoratif en verre.
- Recherche et filtres: barre de recherche (placeholder « Rechercher un projet ou développeur… ») liée à `searchQuery`; ruban horizontal de tags avec intensité de blur variable selon `activeFilter`.
- Statistiques rapides: cartes « Projets actifs (247) », « Développeurs (1.2K) », « Note moyenne (4.8) ».
- Section « Projets récents »: liste rendue via `FlatList` sur `mockRecentProjects`.
  - Carte projet: image, nom, description, prix JERR (`formatJerr(item.price)`), durée, badges technologies (scroll horizontal), footer client avec rating, méta (localisation, propositions, date).
- Section « Top développeurs »: liste `FlatList` sur `mockTopDevelopers`.
  - Carte développeur: avatar dans `LinearGradient`, nom, spécialité, stats (note, projets, ville), badges de compétences (scroll horizontal).

Flux utilisateur typique:
- Arrivée sur l’écran avec header et défilement vertical des sections.
- Saisie d’une requête, sélection d’un tag pour filtrer mentalement les contenus.
- Parcours des projets récents; repérage par technologies, durée et budget en JERR.
- Consultation des top profils; vérification des compétences et historique projets.

Points techniques notables:
- UI soignée et performante: `BlurView` pour glassmorphism, `LinearGradient` pour identité visuelle, `Animated` pour feedback.
- Formatage prix: `formatJerr` centralisé (réutilisable dans d’autres écrans).
- Layout réactif: listes `FlatList` sans scroll interne (`scrollEnabled={false}`) pour un défilement parent fluide; carrousels horizontaux pour badges.
- Données mockées: projets et profils intégrés au fichier; pas d’appels réseau dans l’extrait.
- Cartes cours (`CourseCard`): image, titre, instructeur, étoiles/nombre d’avis, durée, niveau, prix avec promotion (`applyPromo` pour `original` vs `final`, affichage via `formatJerr`), compteur d’étudiants.

Fonctionnalités clés (côté Redux):
- `coursesSlice`:
  - État: `bestSellers`, `newCourses`, `recommended`, `status`, `error`.
  - Thunks: `loadBestSellers`, `loadNewCourses`, `loadRecommended` (alimentés par `mockCourses`, tri/filtre par attributs `isBestSeller`, `isNew`).
  - Sélecteurs: `selectBestSellers`, `selectNewCourses`, `selectRecommended`, `selectCoursesStatus`.
- `searchSlice`:
  - État: `searchQuery`, `isSearchActive`, `searchResults`, `recentSearches`, `status`.
  - Actions: `setQuery`, `clearQuery`, `setSearchResults`, `addRecentSearch`.
  - Thunk: `searchCourses(query)` qui fusionne les trois sections, déduplique, et filtre par `title`, `teacher`, `category`.

Flux utilisateur typique:
- Arrivée sur TeachJerr: animations d’entrée; sections chargées si `status === 'idle'`.
- Saisie dans la recherche: au‑delà de 2 caractères, affichage des résultats; sinon présentation des sections.
- Consultation d’un cours: visualiser détails, badge, prix promo, puis CTA (navigation à préciser selon routes disponibles).

Points techniques notables:
- UI riche: `LinearGradient`, `Animated`, badges, étoiles, grilles/horizontales; styles centralisés `teachjerr.styles`.
- Conversion/prix: `applyPromo` calcule prix promo; `formatJerr` formate en JERR.
- Responsive: adaptation tablette via `Dimensions` (`isTablet`).
- Architecture: découplage affichage/état via Redux; recherche client avec déduplication; mock data pour démonstration.
- `PlanDetailsScreen`:
  - Détails du plan: relecture `investmentService.getPlanById(plan.id)`, historique de performance via `getPlanPerformanceHistory(plan.id)`, indicateurs de tendance.
- `InvestmentHistoryScreen`:
  - Historique transactions: chargement via `investmentService.getTransactionHistory()`, filtrage par type, rafraîchissement.

Fonctionnalités clés (côté services):
- `capiJerrService.js`:
  - `getWalletInfo()`: agrège `walletService.getLocalWalletInfo()` et `getConsolidatedBalances()` pour exposer `balance`, `solBalance`, `totalValueEUR`, totaux JERR/SOL.
  - `getGlobalStats()`: combine `investmentService.getGlobalStats()` et `solanaService.getAllWalletsBalances()` pour exposer investissements/retours et circulation totale JERR/SOL.
- `walletService.js`:
  - Auth et headers: récupération du token (`getAuthToken()`), headers JSON/Bearer.
  - Wallet: `getWallet()`, `getWalletData()`, `getBalance()`, `getWalletStats()/getStats()`.
  - Consolidation: `getLocalWalletInfo()` (depuis tokens), `getConsolidatedBalances()` avec conversions EUR (`JERR_EUR_RATE = 0.01`, `SOL_EUR_RATE = 100`) et enrichissement par wallet (`eurValue`).
  - Plans et transactions: `getInvestmentPlans()`, `getTransactions(params)`.
  - Paramètres et sécurité: `updateWalletSettings(settings)`, `getWalletSecurity()`.
  - Synchronisation: `syncSolanaBalance()` (appelle `getConsolidatedBalances()` et optionnel POST `/wallet/sync`).
- `solanaService.js`:
  - Données utilisateur: `getUserWalletData(forceRefresh)` avec cache (timestamp, timeout), `clearCache()`, `refreshWalletData()`.
  - Compatibilité utilisateur: `isLegacyUser()` (détection par clé publique), prise en charge legacy et comptes spécifiques (BOSS/MNT) avec soldes réels hardcodés, sinon fallback sur wallet utilisateur.
  - Soldes: `getSolBalance(walletType)`, `getTokenBalance(walletType, tokenAddress)`, `getAllBalances(walletType)`, `getAllWalletsBalances()`.
  - Adresse: `getWalletAddress(walletType)`.
- `investmentService.js`:
  - Plans: `getUserPlans()`/`getAllPlans()`, `createInvestmentPlan(planType, amount, allocation)`, `fundPlan(planId, amount)`, `deletePlan(planId)`, `updatePlanAllocation(planId, newAllocation)`.
  - Performance: `simulatePlanPerformance(planType, amount, timeframe)`, `getPlanById(planId)`, `getPlanPerformanceHistory(planId)`, `simulatePerformanceUpdate(planId)`.
  - Statistiques et historique: `getInvestmentStats()`/`getGlobalStats()`, `getTransactionHistory(planId?)`.

Flux utilisateur typique:
- Arrivée sur `CapiJerr`: chargement wallet + soldes consolidés, affichage des plans et statistiques globales.
- Création/Alimentation d’un plan d’investissement, suivi de performance et consultation des détails.
- Consultation de l’historique des transactions, filtrage par type, rafraîchissement.
- Vérification/copie de l’adresse Solana et synchronisation des soldes.

Points techniques notables:
- Agrégation multi‑services, gestion de cache et compatibilité utilisateurs (legacy vs nouveaux), avec fallback robuste et logs.
- Conversion de valeurs JERR/SOL vers EUR pour une vue unifiée (`walletService`).
- Utilisation d’`AsyncStorage` pour persistance (plans, transactions) et token d’auth.
- UI riche (`LinearGradient`, `BlurView`) et intégration Redux pour les données utilisateur.
- Gestion correcte des erreurs: valeurs par défaut, `catch()` côté écrans pour lisser l’expérience.

## Ambassadeur

- Objectif: Programme ambassadeur pour promouvoir l’écosystème CydJerr. Permet de créer/partager des liens d’invitation, suivre les parrainages et attribuer des récompenses en JERR.
- État actuel: Une route `"/Ambassadeur"` est déclarée dans `legacy/screens/HomeScreen.js` (`appsData`), mais aucun écran dédié n’existe à ce stade et la route n’apparaît pas dans les mappeurs de navigation (`routeMap` de `HomeScreen.js`, `AppNavigator.tsx`). Pas d’imports d’un écran Ambassadeur dans les navigateurs legacy/moderne.

Écrans principaux (prévu):
- `AmbassadeurScreen` (hub): tableau de bord avec KPIs (invités, conversions, JERR gagnés), accès aux campagnes et aux liens.
- `CreateCampaignScreen`: création/édition de campagnes ambassadeur (nom, audience, période, objectifs).
- `ReferralLinksScreen`: génération et gestion de liens/ref codes (UTM, QR, expiration).
- `StatsRewardsScreen`: historique des performance, détails des conversions, récompenses, retrait vers le wallet JERR.
- `LeaderboardScreen`: classement des ambassadeurs (filtre par période, secteur, pays).

Services (prévu):
- `services/ambassadorService.js`: CRUD campagnes, génération de liens/ref codes, statistiques agrégées.
- `services/referralService.js`: attribution et tracking des conversions (clics, inscriptions, achats), anti‑fraude basique.
- Intégrations: `walletService` pour les récompenses en JERR (crédit/retrait), `apiClient` pour les endpoints REST.

Fonctionnalités clés (prévu côté écrans):
- Tableau de bord: KPIs en temps réel, cartes métriques, filtres de période.
- Liens d’invitation: création de short links, QR code, partage rapide.
- Campagnes: création, activation/désactivation, archivage, objectifs et budget.
- Récompenses: historique des gains, seuils de retrait, transfert vers wallet.
- Classement: top ambassadeurs, filtres et export.

Flux utilisateur typique (prévu):
- Depuis `HomeScreen`, ouvrir Ambassadeur.
- Créer un lien ou une campagne selon l’objectif.
- Partager le lien; suivre les conversions et performances.
- Réclamer les récompenses en JERR et transférer vers le wallet.

Points techniques notables (prévu):
- Tracking via short links/ref codes; attribution par cookies/local storage et paramètres UTM.
- Anti‑fraude: détection d’anomalies (multi‑compte, spam), rate limiting côté API.
- État global via Redux (`ambassadorSlice`) pour campagnes, liens et stats; React Query possible pour la data.
- Export CSV/JSON des performances; webhooks pour notifications.

Actions de cadrage immédiates:
- Créer `legacy/screens/AmbassadeurScreen.js` (hub minimal) et l’intégrer dans `AppNavigator.tsx` et `routeMap`.
- Esquisser `services/ambassadorService.js` et `referralService.js` avec endpoints placeholders.
- Définir `redux/ambassadorSlice.js` (état campagnes, liens, stats) et le connecter au store.

## Paramètres

- Objectif: Gérer les préférences transverses de l’utilisateur (thème, notifications, confidentialité, compte, sécurité), avec des zones spécifiques par application si besoin.
- État actuel: Une route `"/Parametres"` est déclarée dans `legacy/screens/HomeScreen.js` (`appsData`), mais aucun écran générique « Paramètres » n’est implémenté ni référencé dans la navigation (`routeMap` de `HomeScreen.js`, `src/navigation/AppNavigator.tsx`). Des écrans de paramètres existent de manière spécialisée, par exemple `CloudSettingsScreen.js` (paramètres de CloudJerr) et des préférences dans JoyJerr (`legacy/screens/JoyJerr/profile/about/preferences.tsx`). `ProfileScreen.js` liste « Paramètres » parmi les options du profil, mais sans navigation dédiée.

Écrans principaux (prévu):
- `GeneralSettingsScreen`: thème (clair/sombre), langue, visibilité du statut en ligne, fuseau horaire.
- `AccountSettingsScreen`: informations du compte (nom, e‑mail), suppression/désactivation du compte, export des données.
- `SecuritySettingsScreen`: 2FA, gestion des sessions et des appareils, confidentialité (qui peut voir/contacter).
- `NotificationsSettingsScreen`: bascule globale des notifications, catégories par application (NewsJerr, JoyJerr, etc.), sons/badges.
- `DataManagementScreen`: vider le cache, gestion stockage local, export/import des préférences.
- `AboutLegalScreen`: À propos, politique de confidentialité, CGU, versions et licences.

Services (prévu):
- `services/settingsService.js`: lecture/écriture des préférences, persistance locale (`AsyncStorage`) et synchronisation serveur (`apiClient`).
- `services/notificationService.js`: gestion du token push, abonnements aux canaux, préférences par catégorie.
- Intégrations: `userService` pour mises à jour du profil et suppression compte; réutilisation des patterns vus dans `CloudSettingsScreen.js` (export via `RNFS`/`RNShare`).

Fonctionnalités clés (prévu côté écrans):
- Toggles et pickers pour thème, notifications, confidentialité, fuseau horaire.
- Persistance locale immédiate avec rollback en cas d’échec serveur.
- Lien vers paramètres spécifiques d’app (ex. bouton « Paramètres Cloud » ouvre `CloudSettings`).
- Export des préférences en JSON et partage (email/Drive).
- Mode « Zone de danger » pour les actions irréversibles (vider cache, suppression compte).

Flux utilisateur typique (prévu):
- Depuis `HomeScreen` ou le profil, ouvrir « Paramètres ».
- Ajuster thème/notifications/confidentialité et sauvegarder.
- Accéder aux paramètres dédiés (CloudJerr, SpeakJerr) si nécessaire.
- Exporter ses préférences ou gérer la sécurité du compte.

Points techniques notables (prévu):
- Stockage: `AsyncStorage` pour préférences locales, synchronisation via `apiClient`.
- iOS Privacy: conformité via `PrivacyInfo.xcprivacy` (UserDefaults, etc.).
- Architecture: slice `settingsSlice` Redux ou contexte global pour thème/notifications; composants réutilisables de switch/picker.
- Sécurité: protection des opérations sensibles (confirmation `Alert`, rate limit côté API).

Actions de cadrage immédiates:
- Créer `legacy/screens/ParametresScreen.js` (hub minimal) et l’intégrer dans `AppNavigator.tsx` et `routeMap`.
- Esquisser `services/settingsService.js` et `redux/settingsSlice.js` (état thème, notifications, confidentialité) et connecter au store.
- Ajouter lien depuis `ProfileScreen.js` et le menu vers `Parametres`.

## Parrainage

- Objectif: Programme de parrainage « inviter un ami » orienté grand public. Générer un lien personnel, suivre les inscriptions/conversions des filleuls et attribuer des récompenses en JERR au parrain et au filleul (bonus d’accueil).
- État actuel: Une route `"/Parrainage"` est déclarée dans `legacy/screens/HomeScreen.js` (`appsData`). Aucun écran dédié n’est présent dans la navigation (`routeMap` de `HomeScreen.js`, `AppNavigator.tsx`, `legacy/navigation/TabNavigator.js`). Pas d’imports d’un écran Parrainage.

Écrans principaux (prévu):
- `ParrainageScreen` (hub): résumé des invitations, statut des filleuls, total des JERR gagnés.
- `GenerateLinkScreen`: génération de lien/ref code, QR code, partage rapide.
- `InvitesListScreen`: liste des invités avec statut (invité, inscrit, actif, achat effectué).
- `RewardsHistoryScreen`: historique des récompenses, réclamations, transferts vers le wallet.

Services (prévu):
- `services/referralService.js`: génération de liens/ref codes, attribution des conversions, liste des filleuls.
- `services/rewardService.js`: calcul et attribution des récompenses, seuils de retrait, transfert vers wallet via `walletService`.
- Intégrations: `apiClient` pour endpoints REST, `walletService` pour crédit en JERR.

Fonctionnalités clés (prévu côté écrans):
- Lien personnel (short link), QR code, partage via `Share`.
- Suivi des invites: filtre par statut/période, recherche.
- Récompenses: détails par filleul, seuils, réclamation et transfert.
- Import des contacts pour inviter (permissions), template de message.

Flux utilisateur typique (prévu):
- Ouvrir « Parrainage » depuis `HomeScreen`.
- Générer/partager un lien de parrainage.
- Suivre l’inscription/activité des filleuls.
- Réclamer les JERR et transférer vers le wallet.

Points techniques notables (prévu):
- Deep links et paramètres UTM; attribution via local storage/cookies si web, device ID si mobile.
- Anti‑fraude (multi‑compte, spams), limites de taux côté API.
- État global via `referralSlice` Redux; React Query pour synchroniser la data.
- Export CSV/JSON; notifications pour nouveaux filleuls.

Actions de cadrage immédiates:
- Créer `legacy/screens/ParrainageScreen.js` (hub minimal) et l’intégrer dans `AppNavigator.tsx` et `routeMap`.
- Esquisser `services/referralService.js` et `services/rewardService.js`.
- Définir `redux/referralSlice.js` et connecter au store.

## Livre blanc

- Objectif: Présenter le whitepaper/vision de l’écosystème CydJerr avec lecture confortable, recherche, signets et consultation hors‑ligne.
- État actuel: Une route `"/LivreBlanc"` est déclarée dans `legacy/screens/HomeScreen.js` (`appsData`). Aucun écran `LivreBlanc` dédié n’est référencé dans les navigateurs (`routeMap`, `AppNavigator.tsx`).

Écrans principaux (prévu):
- `LivreBlancScreen` (viewer): lecture chapitre par chapitre, pagination, dark/light mode.
- `ChaptersTOCScreen`: sommaire/TOC, accès rapide aux sections.
- `SearchScreen`: recherche plein texte dans le contenu.
- `BookmarksNotesScreen`: signets et prises de notes.
- `UpdatesScreen`: changelog, versions du whitepaper.

Services (prévu):
- `services/contentService.js`: chargement du contenu (Markdown/HTML/JSON), cache local (`AsyncStorage`/`RNFS`), versioning.
- `services/searchService.js`: indexation/recherche (simple, locale).
- Intégrations: `RNShare` pour export/partage (PDF/MD), `WebView` ou `react-native-render-html` pour rendu.

Fonctionnalités clés (prévu côté écrans):
- Rendu riche (titres, images, tableaux), thèmes, taille de police.
- Recherche, signets, notes, partage/export.
- Gestion hors‑ligne: téléchargement du contenu et mise à jour des versions.

Flux utilisateur typique (prévu):
- Ouvrir « Livre blanc ».
- Parcourir le sommaire, lire les chapitres.
- Rechercher un terme, poser un signet, ajouter une note.
- Télécharger pour lecture hors‑ligne et consulter les mises à jour.

Points techniques notables (prévu):
- Performance sur gros documents; virtualisation possible.
- Liens d’ancrage/chapitres; deep links vers sections.
- Gestion des versions; i18n FR/EN.

Actions de cadrage immédiates:
- Créer `legacy/screens/LivreBlancScreen.js` (viewer minimal) et intégrer navigation (`AppNavigator.tsx`, `routeMap`).
- Préparer pipeline de contenu (assets statiques JSON/MD) et `contentService`.
- Esquisser `SearchScreen` simple et sommaire.

## Change euro/JRC

- Objectif: Convertisseur EUR ↔ JERR, consultation des taux, simulateur d’achat/vente (intégration ultérieure avec le wallet et KYC si nécessaire).
- État actuel: Une route `"/ChangeEuroJerr"` est déclarée dans `legacy/screens/HomeScreen.js`. Aucun écran dédié n’est présent dans la navigation. Des utilitaires de conversion existent déjà: `legacy/utils/price.js` (`eurToJerr`, `jerrToEur`), utilisés dans des écrans comme `ShopJerrScreen.js` et `VagoJerrScreen.js`.

Écrans principaux (prévu):
- `ConverterScreen`: champ « montant » avec bascule EUR/JERR, arrondis sécurisés.
- `RateHistoryScreen`: graphique des prix JERR (7j/30j), rafraîchissement.
- `BuySellScreen` (future): formulaire d’ordre, aperçu des frais, confirmation.
- `FeesInfoScreen`: informations et avertissements (disclaimer).

Services (prévu):
- `services/rateService.js`: récupération du taux JERR/EUR (par défaut 0.01), cache et rafraîchissement.
- `services/walletService.js`: intégration des soldes et transferts (étapes futures pour achat/vente).
- `services/kycService.js` (future): conformité avant achat/vente.

Fonctionnalités clés (prévu côté écrans):
- Conversion instantanée EUR ↔ JERR, copie du résultat.
- Simulation d’ordre d’achat/vente avec estimation des frais.
- Historique des prix, dernière mise à jour, indicateur de tendance.

Flux utilisateur typique (prévu):
- Ouvrir « Change euro/JRC ».
- Saisir montant en EUR ou JERR et voir la conversion.
- Consulter l’historique et, plus tard, simuler un ordre.

Points techniques notables (prévu):
- Arrondis et précision (éviter erreurs flottantes); fonctions `eurToJerr`/`jerrToEur` centralisées.
- Cache et valeurs par défaut hors‑ligne (0.01 EUR/JERR).
- Gestion des erreurs réseau et des états « taux indisponible ».

Actions de cadrage immédiates:
- Créer `legacy/screens/ChangeEuroJerrScreen.js` (convertisseur minimal) et intégrer dans `AppNavigator.tsx` et `routeMap`.
- Esquisser `services/rateService.js` avec valeur par défaut et rafraîchissement.
- Ajouter `redux/rateSlice.js` pour stocker le taux courant et l’historique.
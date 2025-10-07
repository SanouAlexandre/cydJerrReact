# Présentation du projet frontend cydJerrReact

Ce document présente la structure, les technologies, les modules clés et les points d’attention du projet frontend React Native `cydJerrReact`. Il est destiné à une audience management pour faciliter la compréhension du périmètre, de l’architecture et des risques.

## 1. Vue d’ensemble
- Application mobile React Native (iOS/Android) centrée sur des services “Jerr” (réseaux sociaux, finance, contenus, etc.).
- Deux ensembles coexistent :
  - Noyau moderne TypeScript (`App.tsx`, `src/navigation`, composants de base).
  - Espace `legacy/` contenant la majorité des écrans et services historiques en JavaScript.
- Intégration crypto Solana pour la gestion de jetons (JERR/BOSS/MNT), transferts et balances.

## 2. Pile technologique
- Framework : `React Native` avec `TypeScript` (partiel).
- Navigation : `@react-navigation` (stacks/tab navigators).
- État : `Redux` (slices sous `legacy/redux`).
- Outils : ESLint/Prettier, Jest pour tests basiques.
- Mobile : configurations Android (`gradle`) et iOS (Xcode, CocoaPods).

## 3. Structure du dépôt (haut niveau)
- Racine
  - `App.tsx`, `index.js`, `app.json`, `package.json`, config Babel/Metro, ESLint/Prettier.
  - `assets/` (polices), `attached_assets/` (logos), `components/` (UI génériques), `constants/`, `hooks/`.
  - `src/navigation/` (navigateurs modernes en TS).
- `legacy/`
  - `screens/` : +30 écrans métiers (ex. `CapiJerrScreen.js`, `TransferScreen.js`, `StarJerrScreen.js`, etc.).
  - `services/` : API et crypto (`walletService.js`, `solanaService.js`, `capiJerrService.js`).
  - `redux/` : slices et store (`store.js`, `userSlice.js`, ...).
  - `utils/` : utilitaires (`tokenUtils.js`, `price.js`, `validation.js`).
  - `navigation/` : navigateurs historiques (`TabNavigator.js`, `AuthNavigator.js`).
  - `styles/` : styles génériques et spécifiques.
- Mobile
  - `android/` : gradle, keystore de debug, assets.
  - `ios/` : projet Xcode, `Podfile`, `Info.plist`.

## 4. Navigation et flux
- Moderne : `src/navigation/AppNavigator.tsx`, `JoyJerrNavigator.tsx` définissent des stacks/tab pour les nouveaux écrans.
- Legacy : `legacy/navigation/TabNavigator.js` et `AuthNavigator.js` organisent la majorité des écrans.
- Flux d’authentification basique, puis accès aux écrans domaines (ex. CapiJerr, StarJerr, Transfer).

## 5. État et données
- `legacy/redux/store.js` : store Redux central.
- Slices clés : `userSlice.js`, `starJerrSlice.js`, `appjerrSlice.js`, etc.
- Hooks data : `legacy/hooks/useApi.js`, `usePosts.js`, `useNotifications.js` pour les appels et caches légers.

## 6. Services API
- `legacy/services/api.js` et `config/api.js` : base URL, headers, gestion réponses.
- Services métiers :
  - `walletService.js` : auth, wallet data, transferts JERR (`transferJerr`), consolidation balances.
  - `capiJerrService.js` : plans d’investissement, stats, agrégation portefeuille.
  - `starJerrService.js` : tokens “Star”, validation, prix.
  - `solanaService.js` : intégration Solana, clés/addresses, balances.

## 7. Intégration Crypto / Solana
- Fichier clé : `legacy/services/solanaService.js`.
  - Configuration Solana, initialisation `Keypair`, gestion d’adresses pour profils (legacy, réel, nouveaux).
  - Constantes : `JERR_TOKEN_ADDRESSES` pour BOSS/MNT, clés réelles pour utilisateurs spécifiques.
  - Méthodes : balances SOL/JERR, récupération d’adresses selon type d’utilisateur.
- `legacy/services/walletService.js`
  - Consolide balances via `solanaService.getAllWalletsBalances`.
  - Convertit en EUR avec `JERR_EUR_RATE` (0.01) et `SOL_EUR_RATE` (100).
  - Réalise des transferts via `transferJerr` (clé publique du destinataire requise).
- `legacy/utils/tokenUtils.js`
  - Données de jetons `v1/v2`, dérivation de la “main wallet”, utilitaires clés.

## 8. Principaux écrans / domaines
- `CapiJerrScreen.js` : plans d’investissement, statistiques, affichage balances JERR/SOL, cas spécifiques pour `cydjerr.c@gmail.com`.
- `TransferScreen.js` : flux de transfert JERR (sélection destinataire, montant, validation, modal de recherche).
- `StarJerrScreen.js` et `StarTokensScreen.js` : tokens stars, création/validation.
- Autres domaines : AppJerr, JoyJerr, CloudJerr, SpeakJerr, etc. (liste sous `legacy/screens/`).

## 9. Styles et UI
- Composants UI génériques : `components/` (ex. `ThemedText`, `ThemedView`, `ParallaxScrollView`).
- Styles legacy : `legacy/styles/` (thèmes, ombres, gradients, glass effect).
- Icônes, polices et assets intégrés.

## 10. Configuration et sécurité
- Mobile : `android/build.gradle`, `ios/Podfile`, `Info.plist`.
- Lint/format : `.eslintrc.js`, `.prettierrc.js`.
- Sensible : présence de clés privées/addresses “réelles” en dur dans `solanaService.js` (à auditer et extraire).

## 11. Tests et qualité
- Tests : `__tests__/App.test.tsx` (basique).
- Suggestion : étendre tests unitaires pour services (`walletService`, `solanaService`) et écrans critiques (Transfer).

## 12. Build et déploiement
- Android : Gradle, `debug.keystore` pour dev.
- iOS : Xcode project, CocoaPods via `Podfile`.
- Bundling contrôlé par `metro.config.js`, `babel.config.js`.

## 13. Exécution locale
- Installation dépendances : `npm install` ou `yarn`.
- iOS : `cd ios && pod install`, puis lancement via Xcode ou `react-native run-ios` (selon config).
- Android : `react-native run-android` ou lancement depuis Android Studio.
- Dev server Metro auto-lancé.

## 14. Points d’attention
- Sécurité : retirer clés privées et emails “réels” codés en dur (`cydjerr.c@gmail.com`, etc.).
- Normalisation affichage EUR/JERR : aligner UI et back sur taux (`JERR_EUR_RATE`, `SOL_EUR_RATE`).
- Migration progressive vers TypeScript : réduire surface `legacy/`.
- Tests sur flux critiques : transfert JERR, recherche utilisateurs, synchronisation Solana.
- Navigation : unifier navigateurs legacy et modernes.

## 15. Annexes — chemins clés
- Navigation moderne : `src/navigation/AppNavigator.tsx`, `JoyJerrNavigator.tsx`.
- Navigation legacy : `legacy/navigation/TabNavigator.js`, `AuthNavigator.js`.
- Services crypto : `legacy/services/solanaService.js`, `legacy/services/walletService.js`.
- Utilitaires jetons : `legacy/utils/tokenUtils.js`.
- Écrans crypto : `legacy/screens/CapiJerrScreen.js`, `legacy/screens/TransferScreen.js`.
- Redux store : `legacy/redux/store.js`, `legacy/redux/userSlice.js`.

---

Dernière mise à jour : générée pour la présentation management. Pour approfondir un domaine, se référer aux fichiers mentionnés ou aux services correspondants.
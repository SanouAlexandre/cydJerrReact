import { Share, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

/**
 * Partager un post via les options natives de partage
 * @param {Object} post - L'objet post à partager
 * @param {string} post.id - ID du post
 * @param {string} post.title - Titre du post
 * @param {string} post.description - Description du post
 * @param {string} post.videoUrl - URL de la vidéo
 */
export const sharePost = async (post) => {
  try {
    const shareUrl = `https://cydjerr.com/post/${post.id}`;
    const message = `${post.title}\n\n${post.description}\n\nRegardez cette vidéo sur CydJerr: ${shareUrl}`;
    
    const result = await Share.share({
      message,
      url: shareUrl,
      title: post.title,
    });
    
    return result;
  } catch (error) {
    console.error('Erreur lors du partage:', error);
    Alert.alert('Erreur', 'Impossible de partager ce contenu');
    throw error;
  }
};

/**
 * Copier le lien d'un post dans le presse-papiers
 * @param {string} postId - ID du post
 */
export const copyPostLink = async (postId) => {
  try {
    const shareUrl = `https://cydjerr.com/post/${postId}`;
    await Clipboard.setStringAsync(shareUrl);
    Alert.alert('Succès', 'Lien copié dans le presse-papiers');
    return shareUrl;
  } catch (error) {
    console.error('Erreur lors de la copie:', error);
    Alert.alert('Erreur', 'Impossible de copier le lien');
    throw error;
  }
};

/**
 * Partager via une plateforme spécifique
 * @param {string} platform - Plateforme de partage ('whatsapp', 'telegram', 'twitter', etc.)
 * @param {Object} post - L'objet post à partager
 */
export const shareToSpecificPlatform = async (platform, post) => {
  try {
    const shareUrl = `https://cydjerr.com/post/${post.id}`;
    let platformUrl = '';
    
    switch (platform.toLowerCase()) {
      case 'whatsapp':
        platformUrl = `whatsapp://send?text=${encodeURIComponent(`${post.title} - ${shareUrl}`)}`;
        break;
      case 'telegram':
        platformUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`;
        break;
      case 'twitter':
        platformUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        platformUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        throw new Error('Plateforme non supportée');
    }
    
    // Ouvrir l'URL de la plateforme
    const { Linking } = require('react-native');
    const supported = await Linking.canOpenURL(platformUrl);
    
    if (supported) {
      await Linking.openURL(platformUrl);
    } else {
      // Fallback vers le partage natif
      return await sharePost(post);
    }
  } catch (error) {
    console.error('Erreur lors du partage spécifique:', error);
    // Fallback vers le partage natif
    return await sharePost(post);
  }
};

/**
 * Générer les options de partage pour un post
 * @param {Object} post - L'objet post
 * @returns {Array} Liste des options de partage
 */
export const getShareOptions = (post) => {
  return [
    {
      title: 'Partager',
      icon: 'share',
      action: () => sharePost(post),
    },
    {
      title: 'Copier le lien',
      icon: 'link',
      action: () => copyPostLink(post.id),
    },
    {
      title: 'WhatsApp',
      icon: 'logo-whatsapp',
      action: () => shareToSpecificPlatform('whatsapp', post),
    },
    {
      title: 'Telegram',
      icon: 'paper-plane',
      action: () => shareToSpecificPlatform('telegram', post),
    },
    {
      title: 'Twitter',
      icon: 'logo-twitter',
      action: () => shareToSpecificPlatform('twitter', post),
    },
    {
      title: 'Facebook',
      icon: 'logo-facebook',
      action: () => shareToSpecificPlatform('facebook', post),
    },
  ];
};

export default {
  sharePost,
  copyPostLink,
  shareToSpecificPlatform,
  getShareOptions,
};
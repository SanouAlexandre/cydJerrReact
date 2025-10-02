import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import { StyleProp, TextStyle } from 'react-native';

// Define weight type for consistency
type SymbolWeight = 'ultraLight' | 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy' | 'black';

export interface IconSymbolProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}

// Map of common icon names to MaterialIcons equivalents
const iconNameMap: Record<string, string> = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'plus': 'add',
  'person.fill': 'person',
  'gear': 'settings',
  'magnifyingglass': 'search',
  'heart.fill': 'favorite',
  'star.fill': 'star',
  'bookmark.fill': 'bookmark',
  'share': 'share',
  'trash.fill': 'delete',
  'pencil': 'edit',
  'camera.fill': 'camera-alt',
  'photo.fill': 'photo',
  'video.fill': 'videocam',
  'music.note': 'music-note',
  'bell.fill': 'notifications',
  'envelope.fill': 'email',
  'phone.fill': 'phone',
  'location.fill': 'location-on',
  'calendar': 'event',
  'clock.fill': 'access-time',
  'lock.fill': 'lock',
  'key.fill': 'vpn-key',
  'eye.fill': 'visibility',
  'eye.slash.fill': 'visibility-off',
  'checkmark': 'check',
  'xmark': 'close',
  'exclamationmark.triangle.fill': 'warning',
  'info.circle.fill': 'info',
  'questionmark.circle.fill': 'help',
  'arrow.right': 'arrow-forward',
  'arrow.left': 'arrow-back',
  'arrow.up': 'arrow-upward',
  'arrow.down': 'arrow-downward',
};

/**
 * An icon component that renders MaterialIcons.
 * This replaces the SF Symbols functionality with Material Design icons.
 */
export function IconSymbol({ name, size = 24, color = '#000', style, weight }: IconSymbolProps) {
  // Map the SF Symbol name to MaterialIcons name
  const materialIconName = iconNameMap[name] || name;
  
  return (
    <MaterialIcons
      name={materialIconName}
      size={size}
      color={color}
      style={style}
    />
  );
}
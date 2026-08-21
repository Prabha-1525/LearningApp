import React, {type ReactNode} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {BackButton} from '@shared/ui';

export interface LearningHeaderProps {
  /** Title of the learning module or lesson */
  readonly title: string;
  /** Optional subtitle or step info */
  readonly subtitle?: string;
  /** Optional emoji displayed next to the title */
  readonly emoji?: string;
  /** Optional custom onBack handler */
  readonly onBack?: () => void;
  /** Whether to show the back button (default: true) */
  readonly showBack?: boolean;
  /** Accessibility label for back button */
  readonly backLabel?: string;
  /** Lesson progress percentage (0 - 100) */
  readonly progress?: number;
  /** Whether to show the progress bar */
  readonly showProgress?: boolean;
  /** Current stars count */
  readonly stars?: number;
  /** Whether to show the stars pill */
  readonly showStars?: boolean;
  /** Visual theme for stars pill: 'gold' (default in lessons) or 'green' (in hubs) */
  readonly starVariant?: 'gold' | 'green' | 'default';
  /** Action when audio/speaker button is pressed */
  readonly onAudioPress?: () => void;
  /** Text spoken when audio button is pressed */
  readonly audioPromptText?: string;
  /** Whether to show audio button */
  readonly showAudio?: boolean;
  /** Custom right-side element (e.g. Avatar, Favorite, Gallery button) */
  readonly rightElement?: ReactNode;
  /** Accent color for progress fill or highlights */
  readonly accentColor?: string;
  /** Custom text color for the title */
  readonly titleColor?: string;
  /** Custom container style */
  readonly containerStyle?: StyleProp<ViewStyle>;
  /** Optional testID */
  readonly testID?: string;
}

export function LearningHeader({
  title,
  subtitle,
  emoji,
  onBack,
  showBack = true,
  backLabel = 'Go back',
  progress,
  showProgress,
  stars,
  showStars,
  starVariant = 'gold',
  onAudioPress,
  audioPromptText,
  showAudio,
  rightElement,
  accentColor,
  titleColor,
  containerStyle,
  testID,
}: LearningHeaderProps) {
  const navigation = useNavigation<any>();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (
      navigation &&
      typeof navigation.canGoBack === 'function' &&
      navigation.canGoBack()
    ) {
      navigation.goBack();
    }
  };

  const handleAudio = () => {
    if (onAudioPress) {
      onAudioPress();
    } else if (audioPromptText) {
      try {
        // Fallback to react-native-tts if available

        const Tts =
          require('react-native-tts').default ?? require('react-native-tts');
        if (Tts && typeof Tts.speak === 'function') {
          Tts.speak(audioPromptText);
        }
      } catch {
        // Ignored
      }
    }
  };

  const hasProgress =
    (showProgress ?? typeof progress === 'number') &&
    typeof progress === 'number';
  const hasStars =
    (showStars ?? typeof stars === 'number') && typeof stars === 'number';
  const hasAudio =
    (showAudio ?? (Boolean(onAudioPress) || Boolean(audioPromptText))) &&
    (Boolean(onAudioPress) || Boolean(audioPromptText));

  return (
    <View style={[styles.header, containerStyle]} testID={testID}>
      {/* Back Button */}
      {showBack ? (
        <BackButton
          label={backLabel}
          onPress={handleBack}
          testID={testID ? `${testID}-back` : 'header-back-button'}
        />
      ) : null}

      {/* Center Title & Subtitle */}
      <View style={styles.titleWrap}>
        <View style={styles.titleRow}>
          {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}
          <Text
            style={[
              styles.headerTitle,
              titleColor ? {color: titleColor} : null,
            ]}
            numberOfLines={1}
            accessibilityRole="header">
            {title}
          </Text>
        </View>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* Right-Side Group */}
      <View style={styles.headerRight}>
        {/* Mini Progress Indicator */}
        {hasProgress ? (
          <View style={styles.progressMini}>
            <View style={styles.progressMiniTrack}>
              <View
                style={[
                  styles.progressMiniFill,
                  {
                    width: `${Math.min(100, Math.max(0, progress ?? 0))}%`,
                  },
                  accentColor ? {backgroundColor: accentColor} : null,
                ]}
              />
            </View>
            <Text style={styles.progressStar}>★</Text>
          </View>
        ) : null}

        {/* Stars Pill */}
        {hasStars ? (
          <View
            style={[
              styles.starPill,
              starVariant === 'green' && styles.starPillGreen,
            ]}>
            <Text
              style={[
                styles.starIcon,
                starVariant === 'green' && styles.starIconGreen,
              ]}>
              ★
            </Text>
            <Text
              style={[
                styles.starValue,
                starVariant === 'green' && styles.starValueGreen,
              ]}>
              {stars}
            </Text>
          </View>
        ) : null}

        {/* Audio / Speaker Button */}
        {hasAudio ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Listen instructions"
            onPress={handleAudio}
            style={styles.audioButton}>
            <Text style={styles.audioIcon}>🔊</Text>
          </Pressable>
        ) : null}

        {/* Custom Right Element */}
        {rightElement}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    gap: 10,
    minHeight: 56,
  },
  titleWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emoji: {
    fontSize: 20,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#1A3A5C',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  progressMiniTrack: {
    width: 60,
    height: 8,
    backgroundColor: '#EDF2F7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressMiniFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressStar: {
    fontSize: 12,
    color: '#F59E0B',
  },
  starPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF4D6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  starPillGreen: {
    backgroundColor: '#2ECC71',
    borderRadius: 999,
    paddingHorizontal: 12,
  },
  starIcon: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D97706',
  },
  starIconGreen: {
    color: '#FFF4A3',
  },
  starValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D97706',
  },
  starValueGreen: {
    color: '#FFFFFF',
  },
  audioButton: {
    backgroundColor: '#EAF1F6',
    borderRadius: 14,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioIcon: {
    fontSize: 18,
  },
});

import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {phonicsAudio} from '../../domain/audio/phonicsAudioEngine';

interface PhonicsHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly stars?: number;
  readonly onBack?: () => void;
  readonly accentColor?: string;
  readonly audioPromptText?: string;
}

export function PhonicsHeader({
  title,
  subtitle,
  stars,
  onBack,
  accentColor = '#3B82F6',
  audioPromptText,
}: PhonicsHeaderProps) {
  const navigation = useNavigation();

  const handleBack = () => {
    phonicsAudio.playTone(400, 50);
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleSpeakGuide = () => {
    if (audioPromptText) {
      phonicsAudio.speak(audioPromptText);
    } else if (subtitle) {
      phonicsAudio.speak(subtitle);
    } else {
      phonicsAudio.speak(title);
    }
  };

  return (
    <View style={[styles.container, {borderBottomColor: accentColor}]}>
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleBack}
          style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </Pressable>

        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {(audioPromptText || subtitle) && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Listen instruction"
              onPress={handleSpeakGuide}
              style={styles.speakerBtn}>
              <Text style={styles.speakerIcon}>🔊</Text>
            </Pressable>
          )}
        </View>

        {typeof stars === 'number' ? (
          <View style={styles.starsPill}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.starText}>{stars}</Text>
          </View>
        ) : (
          <View style={styles.emptyBox} />
        )}
      </View>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 3,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#374151',
    lineHeight: 30,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    marginHorizontal: 8,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
  },
  speakerBtn: {
    padding: 4,
  },
  speakerIcon: {
    fontSize: 18,
  },
  starsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  starIcon: {
    fontSize: 14,
  },
  starText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#B45309',
  },
  emptyBox: {
    width: 38,
    height: 38,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
});

import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {animalsAudio} from '../../domain/audio/animalsAudioEngine';

interface AnimalsHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly emoji?: string;
  readonly accentColor?: string;
  readonly onBack?: () => void;
}

export function AnimalsHeader({
  title,
  subtitle,
  emoji = '🐾',
  accentColor = '#F59E0B',
  onBack,
}: AnimalsHeaderProps) {
  const navigation = useNavigation();

  const handleBack = () => {
    animalsAudio.playTone(400, 50);
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleAudioPrompt = () => {
    animalsAudio.speak(`${title}. ${subtitle ?? ''}`);
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
          <Text style={styles.headerEmoji}>{emoji}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Listen instructions"
          onPress={handleAudioPrompt}
          style={[styles.audioBtn, {backgroundColor: accentColor}]}>
          <Text style={styles.audioBtnText}>🔊</Text>
        </Pressable>
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
    marginBottom: 12,
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
  },
  headerEmoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F2937',
  },
  audioBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioBtnText: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
  },
});

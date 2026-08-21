import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {shapesAudio} from '../../domain/audio/shapesAudioEngine';

interface ShapesHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly emoji?: string;
  readonly accentColor?: string;
  readonly rightElement?: React.ReactNode;
}

export function ShapesHeader({
  title,
  subtitle,
  emoji = '🔷',
  accentColor = '#3B82F6',
  rightElement,
}: ShapesHeaderProps) {
  const navigation = useNavigation();

  const handleBack = () => {
    shapesAudio.playTone(392, 60);
    navigation.goBack();
  };

  const handleHearTitle = () => {
    shapesAudio.speak(`${title}. ${subtitle ?? ''}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleBack}
          style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <Pressable
          onPress={handleHearTitle}
          accessibilityRole="button"
          accessibilityLabel={`Listen to title: ${title}`}
          style={styles.titleWrapper}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={[styles.title, {color: accentColor}]}>{title}</Text>
          <Text style={styles.speakerIcon}>🔊</Text>
        </Pressable>

        <View style={styles.rightSlot}>{rightElement}</View>
      </View>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  backText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F2937',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  speakerIcon: {
    fontSize: 16,
    opacity: 0.8,
  },
  rightSlot: {
    minWidth: 44,
    alignItems: 'flex-end',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
});

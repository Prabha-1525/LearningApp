import React, {useState} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {ColorItem} from '../../domain/entities/drawingEntities';
import {drawingAudio} from '../../domain/audio/drawingAudioEngine';

interface ColorCardProps {
  readonly color: ColorItem;
  readonly onMasterColor?: (colorId: string) => void;
}

export function ColorCard({color}: ColorCardProps) {
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const bounceAnim = React.useRef(new Animated.Value(1)).current;

  const handlePlayVoice = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    drawingAudio.playTone(520, 80);

    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.05,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    await drawingAudio.speak(color.audioPronunciation);
    setIsPlaying(false);
  };

  const handleTapObject = (obj: (typeof color.objects)[number]) => {
    setSelectedObjectId(obj.id);
    drawingAudio.playTone(600, 80);
    drawingAudio.speak(
      `${obj.name}. A ${color.name.toLowerCase()} ${obj.name.toLowerCase()}!`,
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, {transform: [{scale: bounceAnim}]}]}>
        {/* Large Color Swatch Header */}
        <View style={[styles.colorSwatch, {backgroundColor: color.hex}]}>
          <View style={styles.badgeRow}>
            <View style={styles.tagPill}>
              <Text style={styles.tagText}>
                {color.isPrimary ? 'Primary Color 🌟' : 'Color Blend 🎨'}
              </Text>
            </View>
          </View>
          <Text style={styles.colorNameTitle}>{color.name.toUpperCase()}</Text>
          <Text style={styles.soundHint}>{color.soundHint}</Text>
        </View>

        {/* Listen Button */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Pronounce ${color.name}`}
          onPress={handlePlayVoice}
          style={[styles.speakBtn, {backgroundColor: color.darkHex}]}>
          <Text style={styles.speakBtnText}>
            {isPlaying ? '🔊 Speaking...' : `🔊 Say "${color.name}"`}
          </Text>
        </Pressable>

        {/* Familiar Objects Section */}
        <View style={styles.objectsSection}>
          <Text style={styles.sectionHeader}>Tap {color.name} Objects:</Text>
          <View style={styles.objectsGrid}>
            {color.objects.map(obj => {
              const isSelected = selectedObjectId === obj.id;
              return (
                <Pressable
                  key={obj.id}
                  accessibilityRole="button"
                  accessibilityLabel={obj.name}
                  onPress={() => handleTapObject(obj)}
                  style={[
                    styles.objectItem,
                    isSelected && {
                      borderColor: color.hex,
                      backgroundColor: color.lightHex,
                    },
                  ]}>
                  <Text style={styles.objectEmoji}>{obj.emoji}</Text>
                  <Text style={styles.objectName}>{obj.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Fun Fact Pill */}
        <View style={styles.funFactBox}>
          <Text style={styles.funFactText}>💡 {color.funFact}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 6,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  colorSwatch: {
    width: '100%',
    height: 140,
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeRow: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  tagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1F2937',
  },
  colorNameTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: {width: 1, height: 2},
    textShadowRadius: 4,
    letterSpacing: 2,
  },
  soundHint: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 2,
  },
  speakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 16,
    width: '100%',
  },
  speakBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  objectsSection: {
    gap: 8,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
  },
  objectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  objectItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  objectEmoji: {
    fontSize: 26,
  },
  objectName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
    flex: 1,
  },
  funFactBox: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  funFactText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    lineHeight: 16,
  },
});

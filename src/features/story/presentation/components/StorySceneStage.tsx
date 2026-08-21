import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import type {
  SceneCharacterPlacement,
  StorySceneDef,
} from '../../domain/entities/storyEntities';
import {storyAudio} from '../../domain/audio/storyAudioEngine';

interface StorySceneStageProps {
  readonly scene: StorySceneDef;
  readonly onCharacterTap?: (char: SceneCharacterPlacement) => void;
}

export function StorySceneStage({scene, onCharacterTap}: StorySceneStageProps) {
  const hopAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const wiggleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Looping character hopping
    const hopLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(hopAnim, {
          toValue: -14,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(hopAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    );

    // Looping floating / flying
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 12,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );

    // Looping wave / wiggle
    const wiggleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(wiggleAnim, {
          toValue: 0.08,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(wiggleAnim, {
          toValue: -0.08,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    );

    hopLoop.start();
    floatLoop.start();
    wiggleLoop.start();

    return () => {
      hopLoop.stop();
      floatLoop.stop();
      wiggleLoop.stop();
    };
  }, [floatAnim, hopAnim, wiggleAnim]);

  const handleTap = (char: SceneCharacterPlacement) => {
    storyAudio.playTone(600, 70);
    if (char.speechBubble) {
      storyAudio.speak(char.speechBubble);
    }
    if (onCharacterTap) {
      onCharacterTap(char);
    }
  };

  const getCharAnimatedStyle = (animType: string) => {
    switch (animType) {
      case 'hop':
      case 'bounce':
        return {transform: [{translateY: hopAnim}]};
      case 'fly':
      case 'float':
        return {transform: [{translateY: floatAnim}]};
      case 'wave':
      case 'wag_tail':
        return {
          transform: [
            {
              rotate: wiggleAnim.interpolate({
                inputRange: [-0.1, 0.1],
                outputRange: ['-10deg', '10deg'],
              }),
            },
          ],
        };
      default:
        return {};
    }
  };

  return (
    <View
      style={[
        styles.stage,
        {
          backgroundColor: scene.bgColors[0] ?? '#BAE6FD',
          borderColor: '#E2E8F0',
        },
      ]}>
      {/* Background Decor Emojis */}
      {scene.bgDecorEmoji && (
        <View style={styles.decorContainer}>
          {scene.bgDecorEmoji.map((decor, idx) => (
            <Text
              key={idx}
              style={[styles.decorItem, {left: `${idx * 28 + 10}%`}]}>
              {decor}
            </Text>
          ))}
        </View>
      )}

      {/* Characters Stage Layer */}
      <View style={styles.charactersContainer}>
        {scene.characters.map(char => {
          const isLeft = char.position === 'left';
          const isRight = char.position === 'right';
          const isTop = char.position === 'top';

          return (
            <View
              key={char.id}
              style={[
                styles.characterWrapper,
                isLeft && styles.posLeft,
                isRight && styles.posRight,
                isTop && styles.posTop,
                char.position === 'center' && styles.posCenter,
              ]}>
              {/* Speech Bubble */}
              {char.speechBubble && (
                <View style={styles.speechBubble}>
                  <Text style={styles.speechText}>{char.speechBubble}</Text>
                  <View style={styles.bubbleTail} />
                </View>
              )}

              {/* Animated Character Sprite */}
              <Animated.View style={getCharAnimatedStyle(char.animation)}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={char.name ?? char.id}
                  onPress={() => handleTap(char)}
                  style={styles.charCircle}>
                  <Text style={styles.charEmoji}>{char.emoji}</Text>
                </Pressable>
              </Animated.View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: '100%',
    height: 250,
    borderRadius: 28,
    borderWidth: 3.5,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  decorContainer: {
    position: 'absolute',
    top: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
  },
  decorItem: {
    position: 'absolute',
    fontSize: 26,
    opacity: 0.85,
  },
  charactersContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  characterWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  posLeft: {
    left: '12%',
    bottom: 20,
  },
  posRight: {
    right: '12%',
    bottom: 20,
  },
  posCenter: {
    alignSelf: 'center',
    bottom: 20,
  },
  posTop: {
    alignSelf: 'center',
    top: 30,
  },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 6,
    maxWidth: 160,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  speechText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
    textAlign: 'center',
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  charCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  charEmoji: {
    fontSize: 48,
  },
});

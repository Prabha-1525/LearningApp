import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {storyAudio} from '../../domain/audio/storyAudioEngine';

interface StoryHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly isFavorite?: boolean;
  readonly onToggleFavorite?: () => void;
  readonly onBack?: () => void;
  readonly accentColor?: string;
}

export function StoryHeader({
  title,
  subtitle,
  isFavorite,
  onToggleFavorite,
  onBack,
  accentColor = '#C4A05A',
}: StoryHeaderProps) {
  const navigation = useNavigation();

  const handleBack = () => {
    storyAudio.playTone(400, 50);
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
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
          <Text style={styles.headerEmoji}>📖</Text>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {onToggleFavorite ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? 'Remove favorite' : 'Add favorite'}
            onPress={onToggleFavorite}
            style={styles.favBtn}>
            <Text style={styles.favIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </Pressable>
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
    marginBottom: 10,
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
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  headerEmoji: {
    fontSize: 22,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
  },
  favBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favIcon: {
    fontSize: 18,
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
    marginTop: 6,
  },
});

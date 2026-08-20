import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

interface CodingHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly emoji?: string;
  readonly accentColor?: string;
  readonly stars?: number;
}

export function CodingHeader({
  title,
  subtitle,
  emoji = '🧩',
  accentColor = '#6366F1',
  stars,
}: CodingHeaderProps) {
  const navigation = useNavigation();
  const {t} = useTranslation();

  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('common.back', 'Back')}
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
        style={styles.backBtn}>
        <Text style={styles.backBtnText}>‹</Text>
      </Pressable>

      <View style={styles.titleWrap}>
        <View style={styles.titleRow}>
          <Text style={styles.headerEmoji}>{emoji}</Text>
          <Text
            style={[styles.headerTitle, {color: accentColor}]}
            numberOfLines={1}>
            {title}
          </Text>
        </View>
        {subtitle ? <Text style={styles.headerSub}>{subtitle}</Text> : null}
      </View>

      {stars !== undefined ? (
        <View style={styles.starPill}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={styles.starCount}>{stars}</Text>
        </View>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  backBtnText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#334155',
    lineHeight: 32,
    marginTop: -2,
  },
  titleWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerEmoji: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  headerSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  starPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  starIcon: {
    fontSize: 14,
  },
  starCount: {
    fontSize: 14,
    fontWeight: '900',
    color: '#B45309',
  },
  placeholder: {
    width: 40,
  },
});

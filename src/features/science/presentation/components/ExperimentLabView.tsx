import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  COLOR_MIXES,
  FLOAT_EXPERIMENT_ITEMS,
  type FloatItem,
} from '../../domain/catalog/scienceData';

type ExperimentLabViewProps = {
  readonly onExperimentDone?: (expId: string) => void;
};

export function ExperimentLabView({onExperimentDone}: ExperimentLabViewProps) {
  const {t} = useTranslation();
  const [activeTab, setActiveTab] = useState<'float' | 'colors' | 'shadow'>(
    'float',
  );

  // Float Tank State
  const [testedItems, setTestedItems] = useState<FloatItem[]>([]);
  const [currentFloatItem, setCurrentFloatItem] = useState<FloatItem | null>(
    null,
  );

  // Color Mix State
  const [selectedColor1, setSelectedColor1] = useState<string | null>(null);
  const [selectedColor2, setSelectedColor2] = useState<string | null>(null);
  const [mixedResult, setMixedResult] = useState<string | null>(null);

  // Shadow State
  const [lightDistance, setLightDistance] = useState<number>(2); // 1 = close, 2 = mid, 3 = far

  const itemY = useSharedValue(0);

  const testFloatItem = (item: FloatItem) => {
    setCurrentFloatItem(item);
    itemY.value = 0;
    // Animate drop into water
    itemY.value = item.doesFloat
      ? withTiming(40, {duration: 600}) // floats near surface
      : withTiming(110, {duration: 800}); // sinks to bottom

    if (!testedItems.some(i => i.id === item.id)) {
      const next = [...testedItems, item];
      setTestedItems(next);
      if (next.length >= 3) {
        onExperimentDone?.('float-sink');
      }
    }
  };

  const handleMixColor = (color: string) => {
    if (!selectedColor1) {
      setSelectedColor1(color);
      setMixedResult(null);
    } else if (!selectedColor2 && selectedColor1 !== color) {
      setSelectedColor2(color);
      // Check mix result
      const match = COLOR_MIXES.find(
        m =>
          (m.color1.includes(selectedColor1) && m.color2.includes(color)) ||
          (m.color2.includes(selectedColor1) && m.color1.includes(color)),
      );
      if (match) {
        setMixedResult(t(match.resultNameKey, ''));
        onExperimentDone?.('color-mix');
      }
    } else {
      setSelectedColor1(color);
      setSelectedColor2(null);
      setMixedResult(null);
    }
  };

  const animatedDropStyle = useAnimatedStyle(() => ({
    transform: [{translateY: itemY.value}],
  }));

  return (
    <View style={styles.container}>
      {/* Experiment Selector Tabs */}
      <View style={styles.tabRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setActiveTab('float')}
          style={[styles.tabBtn, activeTab === 'float' && styles.activeTabBtn]}>
          <Text style={styles.tabEmoji}>🌊</Text>
          <Text
            style={[
              styles.tabText,
              activeTab === 'float' && styles.activeTabText,
            ]}>
            {t('science.experiments.floatTab', 'Sink or Float')}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => setActiveTab('colors')}
          style={[
            styles.tabBtn,
            activeTab === 'colors' && styles.activeTabBtn,
          ]}>
          <Text style={styles.tabEmoji}>🎨</Text>
          <Text
            style={[
              styles.tabText,
              activeTab === 'colors' && styles.activeTabText,
            ]}>
            {t('science.experiments.colorsTab', 'Mix Colors')}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => setActiveTab('shadow')}
          style={[
            styles.tabBtn,
            activeTab === 'shadow' && styles.activeTabBtn,
          ]}>
          <Text style={styles.tabEmoji}>🔦</Text>
          <Text
            style={[
              styles.tabText,
              activeTab === 'shadow' && styles.activeTabText,
            ]}>
            {t('science.experiments.shadowTab', 'Shadows')}
          </Text>
        </Pressable>
      </View>

      {/* FLOAT OR SINK EXPERIMENT */}
      {activeTab === 'float' && (
        <View style={styles.expBox}>
          {/* Water Tank */}
          <View style={styles.waterTank}>
            <View style={styles.waterSurface} />
            <View style={styles.waterBody}>
              {currentFloatItem && (
                <Animated.View
                  style={[styles.floatingItemWrap, animatedDropStyle]}>
                  <Text style={styles.floatingEmoji}>
                    {currentFloatItem.emoji}
                  </Text>
                </Animated.View>
              )}
            </View>
          </View>

          {currentFloatItem ? (
            <View
              style={[
                styles.resultCard,
                {
                  backgroundColor: currentFloatItem.doesFloat
                    ? '#ECFDF5'
                    : '#FEF2F2',
                },
              ]}>
              <Text
                style={[
                  styles.resultTitle,
                  {
                    color: currentFloatItem.doesFloat ? '#059669' : '#DC2626',
                  },
                ]}>
                {currentFloatItem.doesFloat
                  ? `✨ ${t(currentFloatItem.nameKey, '')} FLOATS! 🛶`
                  : `⬇️ ${t(currentFloatItem.nameKey, '')} SINKS! 🪨`}
              </Text>
              <Text style={styles.resultDesc}>
                {t(currentFloatItem.explanationKey, '')}
              </Text>
            </View>
          ) : (
            <Text style={styles.promptHint}>
              {t(
                'science.experiments.floatPrompt',
                'Tap an object below to drop it into the water tank!',
              )}
            </Text>
          )}

          {/* Items Selector */}
          <View style={styles.itemsGrid}>
            {FLOAT_EXPERIMENT_ITEMS.map(item => (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                onPress={() => testFloatItem(item)}
                style={[
                  styles.itemBtn,
                  currentFloatItem?.id === item.id && styles.activeItemBtn,
                ]}>
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                <Text style={styles.itemName}>{t(item.nameKey, item.id)}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* COLOR MIXING EXPERIMENT */}
      {activeTab === 'colors' && (
        <View style={styles.expBox}>
          <View style={styles.beakerWrap}>
            <View style={styles.beaker}>
              <Text style={styles.beakerEmoji}>
                {mixedResult ? '🧪' : '🥛'}
              </Text>
              <Text style={styles.mixResultText}>
                {mixedResult
                  ? `✨ ${mixedResult}!`
                  : selectedColor1
                  ? `${selectedColor1} + ?`
                  : 'Pick 2 colors'}
              </Text>
            </View>
          </View>

          <Text style={styles.promptHint}>
            {t(
              'science.experiments.colorsPrompt',
              'Pick two primary colors to mix and discover the new color!',
            )}
          </Text>

          <View style={styles.colorPillsRow}>
            {['Red', 'Blue', 'Yellow'].map(col => {
              const isSelected =
                selectedColor1 === col || selectedColor2 === col;
              const colorBg =
                col === 'Red'
                  ? '#EF4444'
                  : col === 'Blue'
                  ? '#3B82F6'
                  : '#F59E0B';
              return (
                <Pressable
                  key={col}
                  accessibilityRole="button"
                  onPress={() => handleMixColor(col)}
                  style={[
                    styles.colorPill,
                    {backgroundColor: colorBg},
                    isSelected && styles.selectedColorPill,
                  ]}>
                  <Text style={styles.colorPillText}>
                    {col === 'Red'
                      ? '🔴 Red'
                      : col === 'Blue'
                      ? '🔵 Blue'
                      : '🟡 Yellow'}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {mixedResult && (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setSelectedColor1(null);
                setSelectedColor2(null);
                setMixedResult(null);
              }}
              style={styles.resetBtn}>
              <Text style={styles.resetBtnText}>
                🔄 {t('science.experiments.tryAgain', 'Mix Again')}
              </Text>
            </Pressable>
          )}
        </View>
      )}

      {/* SHADOW EXPERIMENT */}
      {activeTab === 'shadow' && (
        <View style={styles.expBox}>
          <View style={styles.shadowStage}>
            {/* Flashlight */}
            <View style={styles.torchWrap}>
              <Text style={styles.torchEmoji}>🔦</Text>
              <Text style={styles.torchBeam}>
                {lightDistance === 1
                  ? '⚡⚡⚡'
                  : lightDistance === 2
                  ? '⚡⚡'
                  : '⚡'}
              </Text>
            </View>

            {/* Object */}
            <Text style={styles.shadowObjectEmoji}>🧸</Text>

            {/* Projected Shadow */}
            <View
              style={[
                styles.shadowProjection,
                {
                  transform: [
                    {
                      scale:
                        lightDistance === 1
                          ? 1.6
                          : lightDistance === 2
                          ? 1.1
                          : 0.7,
                    },
                  ],
                  opacity: lightDistance === 1 ? 0.9 : 0.6,
                },
              ]}>
              <Text style={styles.shadowEmoji}>🧸</Text>
            </View>
          </View>

          <Text style={styles.shadowFact}>
            {lightDistance === 1
              ? '🔍 Light is CLOSE = Shadow is BIG!'
              : lightDistance === 3
              ? '🔍 Light is FAR = Shadow is SMALL!'
              : '🔍 Move the flashlight to change the shadow!'}
          </Text>

          <View style={styles.sliderRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setLightDistance(1);
                onExperimentDone?.('shadow');
              }}
              style={[
                styles.distanceBtn,
                lightDistance === 1 && styles.activeDistanceBtn,
              ]}>
              <Text style={styles.distanceBtnText}>🔦 Close (Big)</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setLightDistance(2);
                onExperimentDone?.('shadow');
              }}
              style={[
                styles.distanceBtn,
                lightDistance === 2 && styles.activeDistanceBtn,
              ]}>
              <Text style={styles.distanceBtnText}>🔦 Medium</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setLightDistance(3);
                onExperimentDone?.('shadow');
              }}
              style={[
                styles.distanceBtn,
                lightDistance === 3 && styles.activeDistanceBtn,
              ]}>
              <Text style={styles.distanceBtnText}>🔦 Far (Small)</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 16,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 4,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 14,
  },
  activeTabBtn: {
    backgroundColor: '#8B5CF6',
  },
  tabEmoji: {
    fontSize: 18,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  expBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 14,
  },
  waterTank: {
    width: '100%',
    height: 180,
    borderRadius: 18,
    backgroundColor: '#F0F9FF',
    borderWidth: 2,
    borderColor: '#38BDF8',
    overflow: 'hidden',
  },
  waterSurface: {
    height: 30,
    backgroundColor: '#BAE6FD',
  },
  waterBody: {
    flex: 1,
    backgroundColor: '#7DD3FC',
    alignItems: 'center',
    position: 'relative',
  },
  floatingItemWrap: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
  },
  floatingEmoji: {
    fontSize: 44,
  },
  resultCard: {
    width: '100%',
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '900',
  },
  resultDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
    marginTop: 4,
  },
  promptHint: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  itemBtn: {
    width: '30%',
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeItemBtn: {
    borderColor: '#0284C7',
    backgroundColor: '#E0F2FE',
    transform: [{scale: 1.04}],
  },
  itemEmoji: {
    fontSize: 26,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
    marginTop: 2,
  },
  beakerWrap: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  beaker: {
    width: 140,
    height: 140,
    borderRadius: 24,
    backgroundColor: '#F5F3FF',
    borderWidth: 3,
    borderColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  beakerEmoji: {
    fontSize: 52,
  },
  mixResultText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#5B21B6',
  },
  colorPillsRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  colorPill: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
  },
  selectedColorPill: {
    borderWidth: 3,
    borderColor: '#1E1B4B',
    transform: [{scale: 1.08}],
  },
  colorPillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  resetBtn: {
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  shadowStage: {
    width: '100%',
    height: 160,
    backgroundColor: '#1E293B',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  torchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  torchEmoji: {
    fontSize: 32,
  },
  torchBeam: {
    fontSize: 14,
    color: '#FDE047',
    marginLeft: 4,
  },
  shadowObjectEmoji: {
    fontSize: 40,
  },
  shadowProjection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowEmoji: {
    fontSize: 40,
    opacity: 0.25,
    tintColor: '#000000',
  },
  shadowFact: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4C1D95',
    textAlign: 'center',
  },
  sliderRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  distanceBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  activeDistanceBtn: {
    backgroundColor: '#7C3AED',
    borderColor: '#6D28D9',
  },
  distanceBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
});

import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import type {ShapeDefinition} from '../../domain/entities/shapeEntities';
import {shapesAudio} from '../../domain/audio/shapesAudioEngine';

interface ShapePropertiesViewerProps {
  readonly shape: ShapeDefinition;
  readonly onNext?: () => void;
}

export function ShapePropertiesViewer({
  shape,
  onNext,
}: ShapePropertiesViewerProps) {
  const [countedSides, setCountedSides] = useState<number[]>([]);
  const [countedCorners, setCountedCorners] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'sides' | 'corners'>('sides');

  useEffect(() => {
    setCountedSides([]);
    setCountedCorners([]);
    shapesAudio.speak(
      `Let's count the properties of a ${shape.name}! A ${shape.name} has ${shape.sides} sides and ${shape.corners} corners.`,
    );
  }, [shape]);

  const handleTapSide = (idx: number) => {
    if (!countedSides.includes(idx)) {
      const next = [...countedSides, idx];
      setCountedSides(next);
      shapesAudio.playSideCountTone(next.length);
      shapesAudio.speak(`${next.length} side${next.length > 1 ? 's' : ''}!`);
    }
  };

  const handleTapCorner = (idx: number) => {
    if (!countedCorners.includes(idx)) {
      const next = [...countedCorners, idx];
      setCountedCorners(next);
      shapesAudio.playSideCountTone(next.length);
      shapesAudio.speak(`${next.length} corner${next.length > 1 ? 's' : ''}!`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Property Tabs */}
      <View style={styles.tabsRow}>
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Count sides"
          onPress={() => setActiveTab('sides')}
          style={[styles.tabBtn, activeTab === 'sides' && styles.tabBtnActive]}>
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'sides' && styles.tabBtnTextActive,
            ]}>
            Count Sides 📏 ({shape.sides})
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          accessibilityLabel="Count corners"
          onPress={() => setActiveTab('corners')}
          style={[
            styles.tabBtn,
            activeTab === 'corners' && styles.tabBtnActive,
          ]}>
          <Text
            style={[
              styles.tabBtnText,
              activeTab === 'corners' && styles.tabBtnTextActive,
            ]}>
            Count Corners 📍 ({shape.corners})
          </Text>
        </Pressable>
      </View>

      {/* Main Interactive Shape Board */}
      <View
        style={[
          styles.board,
          {backgroundColor: shape.lightColor, borderColor: shape.color},
        ]}>
        <View style={[styles.shapeCircle, {backgroundColor: shape.color}]}>
          <Text style={styles.shapeEmoji}>{shape.emoji}</Text>
        </View>

        {shape.sides === 0 ? (
          <View style={styles.roundInfoBox}>
            <Text style={styles.roundInfoTitle}>⭕ Perfectly Curved!</Text>
            <Text style={styles.roundInfoDesc}>
              A {shape.name} has 0 straight sides and 0 sharp corners. It is
              completely round!
            </Text>
          </View>
        ) : activeTab === 'sides' ? (
          <View style={styles.itemsList}>
            <Text style={styles.instructionText}>
              Tap each side below to count all {shape.sides} sides:
            </Text>
            <View style={styles.buttonsGrid}>
              {shape.sideLabels.map((label, idx) => {
                const isCounted = countedSides.includes(idx);
                return (
                  <Pressable
                    key={idx}
                    accessibilityRole="button"
                    accessibilityLabel={`Side ${idx + 1}: ${label}`}
                    onPress={() => handleTapSide(idx)}
                    style={[
                      styles.countPill,
                      isCounted
                        ? {
                            backgroundColor: shape.color,
                            borderColor: shape.darkColor,
                          }
                        : styles.uncountedPill,
                    ]}>
                    <Text
                      style={[
                        styles.pillNum,
                        isCounted && styles.pillNumActive,
                      ]}>
                      {isCounted ? `✓ Side ${idx + 1}` : `Tap Side ${idx + 1}`}
                    </Text>
                    <Text
                      style={[
                        styles.pillLabel,
                        isCounted && styles.pillLabelActive,
                      ]}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={[styles.scoreSummary, {color: shape.darkColor}]}>
              Counted: {countedSides.length} / {shape.sides} Sides
            </Text>
          </View>
        ) : (
          <View style={styles.itemsList}>
            <Text style={styles.instructionText}>
              Tap each corner to count all {shape.corners} corners:
            </Text>
            <View style={styles.buttonsGrid}>
              {shape.cornerLabels.map((label, idx) => {
                const isCounted = countedCorners.includes(idx);
                return (
                  <Pressable
                    key={idx}
                    accessibilityRole="button"
                    accessibilityLabel={`Corner ${idx + 1}: ${label}`}
                    onPress={() => handleTapCorner(idx)}
                    style={[
                      styles.countPill,
                      isCounted
                        ? {
                            backgroundColor: shape.color,
                            borderColor: shape.darkColor,
                          }
                        : styles.uncountedPill,
                    ]}>
                    <Text
                      style={[
                        styles.pillNum,
                        isCounted && styles.pillNumActive,
                      ]}>
                      {isCounted
                        ? `✓ Corner ${idx + 1}`
                        : `Tap Corner ${idx + 1}`}
                    </Text>
                    <Text
                      style={[
                        styles.pillLabel,
                        isCounted && styles.pillLabelActive,
                      ]}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={[styles.scoreSummary, {color: shape.darkColor}]}>
              Counted: {countedCorners.length} / {shape.corners} Corners
            </Text>
          </View>
        )}
      </View>

      {/* Next Button */}
      {onNext && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next shape"
          onPress={onNext}
          style={[styles.nextBtn, {backgroundColor: shape.color}]}>
          <Text style={styles.nextBtnText}>Explore Next Shape ➔</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 14,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6B7280',
  },
  tabBtnTextActive: {
    color: '#059669',
    fontWeight: '900',
  },
  board: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 3,
    padding: 20,
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  shapeCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shapeEmoji: {
    fontSize: 48,
  },
  roundInfoBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  roundInfoTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#EF4444',
  },
  roundInfoDesc: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    textAlign: 'center',
  },
  itemsList: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  instructionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
    textAlign: 'center',
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    width: '100%',
  },
  countPill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    minWidth: 120,
  },
  uncountedPill: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
  },
  pillNum: {
    fontSize: 13,
    fontWeight: '900',
    color: '#4B5563',
  },
  pillNumActive: {
    color: '#FFFFFF',
  },
  pillLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 2,
  },
  pillLabelActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scoreSummary: {
    fontSize: 15,
    fontWeight: '900',
    marginTop: 6,
  },
  nextBtn: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 18,
    width: '100%',
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
});

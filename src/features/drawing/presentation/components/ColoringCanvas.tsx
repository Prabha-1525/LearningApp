import React, {useState} from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {
  ColoringPage,
  ColoringRegion,
} from '../../domain/entities/drawingEntities';
import {DrawingToolbar, PALETTE_COLORS} from './DrawingToolbar';
import {drawingAudio} from '../../domain/audio/drawingAudioEngine';
import {saveGalleryArtwork} from '../../data/progress/drawingProgress';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CANVAS_SIZE = Math.min(SCREEN_WIDTH - 32, 340);

interface ColoringCanvasProps {
  readonly page: ColoringPage;
  readonly onComplete?: (pageId: string) => void;
}

export function ColoringCanvas({page, onComplete}: ColoringCanvasProps) {
  const [selectedColor, setSelectedColor] = useState<string>(
    PALETTE_COLORS[0] ?? '#EF4444',
  );
  const [filledRegions, setFilledRegions] = useState<Record<string, string>>(
    {},
  );
  const [history, setHistory] = useState<Record<string, string>[]>([]);
  const [redoStack, setRedoStack] = useState<Record<string, string>[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const celebrationScale = React.useRef(new Animated.Value(0)).current;

  const scaleFactor = CANVAS_SIZE / page.viewBox.width;

  const handleTapRegion = (region: ColoringRegion) => {
    drawingAudio.playTone(620, 60);
    const newFills = {
      ...filledRegions,
      [region.id]: selectedColor,
    };
    setHistory(prev => [...prev, filledRegions]);
    setRedoStack([]);
    setFilledRegions(newFills);

    // Check if all regions are colored
    const allColored = page.regions.every(r => !!newFills[r.id]);
    if (allColored && !isFinished) {
      setIsFinished(true);
      drawingAudio.playCelebrationFanfare();
      drawingAudio.speak(`Wonderful! You colored the ${page.title}!`);
      Animated.spring(celebrationScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();

      if (onComplete) {
        onComplete(page.id);
      }
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    if (previous) {
      setRedoStack(prev => [...prev, filledRegions]);
      setHistory(prev => prev.slice(0, prev.length - 1));
      setFilledRegions(previous);
    }
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    if (next) {
      setHistory(prev => [...prev, filledRegions]);
      setRedoStack(prev => prev.slice(0, prev.length - 1));
      setFilledRegions(next);
    }
  };

  const handleClear = () => {
    setHistory(prev => [...prev, filledRegions]);
    setFilledRegions({});
  };

  const handleSave = () => {
    saveGalleryArtwork({
      id: `coloring_${page.id}_${Date.now()}`,
      title: page.title,
      createdAt: new Date().toISOString(),
      strokes: [],
      filledRegions,
      coloringPageId: page.id,
      type: 'coloring',
      isFavorite: false,
      emojiThumbnail: page.emoji,
      backgroundColor: '#FFFFFF',
    });
    drawingAudio.speak('Saved to My Gallery!');
  };

  return (
    <View style={styles.container}>
      {/* Title and Category Badge */}
      <View style={styles.titleRow}>
        <Text style={styles.pageTitle}>
          {page.emoji} {page.title}
        </Text>
        <View style={styles.hintBadge}>
          <Text style={styles.hintBadgeText}>Tap any area to fill color</Text>
        </View>
      </View>

      {/* Interactive Vector Coloring Board */}
      <View
        style={[styles.canvasBox, {width: CANVAS_SIZE, height: CANVAS_SIZE}]}>
        {page.regions.map(region => {
          const currentColor = filledRegions[region.id] ?? '#FFFFFF';
          const left = region.x * scaleFactor;
          const top = region.y * scaleFactor;
          const width = region.width * scaleFactor;
          const height = region.height * scaleFactor;
          const borderRadius = (region.borderRadius ?? 0) * scaleFactor;

          return (
            <Pressable
              key={region.id}
              accessibilityRole="button"
              accessibilityLabel={`Fill ${region.name}`}
              onPress={() => handleTapRegion(region)}
              style={[
                styles.regionShape,
                {
                  left,
                  top,
                  width,
                  height,
                  borderRadius,
                  backgroundColor: currentColor,
                },
                region.shapeType === 'triangle' && styles.triangleStyle,
              ]}>
              {/* If unfilled, show gentle dotted hint */}
              {!filledRegions[region.id] && (
                <View style={styles.unfilledPattern}>
                  <Text style={styles.regionHintText}>{region.name}</Text>
                </View>
              )}
            </Pressable>
          );
        })}

        {/* Completion Celebration Overlay */}
        {isFinished && (
          <Animated.View
            style={[
              styles.celebrationOverlay,
              {transform: [{scale: celebrationScale}]},
            ]}>
            <Text style={styles.celebrationEmoji}>🎉 ⭐ 🌟</Text>
            <Text style={styles.celebrationText}>Beautiful Artwork!</Text>
          </Animated.View>
        )}
      </View>

      {/* Suggested Color Hints Row */}
      <View style={styles.hintsRow}>
        <Text style={styles.hintsLabel}>Suggested Hints:</Text>
        <View style={styles.hintsList}>
          {page.regions.map(r => (
            <Pressable
              key={r.id}
              accessibilityRole="button"
              accessibilityLabel={`Pick suggested color for ${r.name}`}
              onPress={() => setSelectedColor(r.suggestedColorHex)}
              style={[styles.hintPill, {borderColor: r.suggestedColorHex}]}>
              <View
                style={[styles.hintDot, {backgroundColor: r.suggestedColorHex}]}
              />
              <Text style={styles.hintName}>{r.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Color Palette & Action Toolbar */}
      <DrawingToolbar
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onSave={handleSave}
        showStrokeWidths={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
  },
  titleRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
  },
  hintBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  hintBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
  },
  canvasBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#374151',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  regionShape: {
    position: 'absolute',
    borderWidth: 2.5,
    borderColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  triangleStyle: {
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
  },
  unfilledPattern: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  regionHintText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  celebrationOverlay: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  celebrationEmoji: {
    fontSize: 24,
  },
  celebrationText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#059669',
    marginTop: 2,
  },
  hintsRow: {
    width: '100%',
    gap: 4,
  },
  hintsLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4B5563',
  },
  hintsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  hintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  hintDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  hintName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
});

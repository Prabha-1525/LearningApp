import React, {useRef, useState} from 'react';
import {Dimensions, PanResponder, StyleSheet, View} from 'react-native';
import type {
  DrawingStroke,
  DrawingStrokePoint,
} from '../../domain/entities/drawingEntities';
import {DrawingToolbar, PALETTE_COLORS} from './DrawingToolbar';
import {drawingAudio} from '../../domain/audio/drawingAudioEngine';
import {saveGalleryArtwork} from '../../data/progress/drawingProgress';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CANVAS_WIDTH = Math.min(SCREEN_WIDTH - 32, 360);
const CANVAS_HEIGHT = 380;

interface DrawingCanvasProps {
  readonly initialTitle?: string;
  readonly categoryType?: 'free_drawing' | 'guided_drawing' | 'challenge';
  readonly onSaveSuccess?: () => void;
  readonly backgroundGuideComponent?: React.ReactNode;
}

export function DrawingCanvas({
  initialTitle = 'My Creative Drawing',
  categoryType = 'free_drawing',
  onSaveSuccess,
  backgroundGuideComponent,
}: DrawingCanvasProps) {
  const [selectedColor, setSelectedColor] = useState<string>(
    PALETTE_COLORS[0] ?? '#EF4444',
  );
  const [selectedWidth, setSelectedWidth] = useState<number>(8);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
  const [redoStrokes, setRedoStrokes] = useState<DrawingStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<DrawingStrokePoint[]>([]);

  // Ref to hold live drawing state for PanResponder
  const strokeStateRef = useRef({
    selectedColor,
    selectedWidth,
    isEraser,
    points: [] as DrawingStrokePoint[],
  });

  strokeStateRef.current = {
    selectedColor,
    selectedWidth,
    isEraser,
    points: strokeStateRef.current.points,
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => {
        const {locationX, locationY} = evt.nativeEvent;
        strokeStateRef.current.points = [{x: locationX, y: locationY}];
        setCurrentStroke([{x: locationX, y: locationY}]);
      },
      onPanResponderMove: evt => {
        const {locationX, locationY} = evt.nativeEvent;
        const newPoints = [
          ...strokeStateRef.current.points,
          {x: locationX, y: locationY},
        ];
        strokeStateRef.current.points = newPoints;
        setCurrentStroke(newPoints);
      },
      onPanResponderRelease: () => {
        const points = strokeStateRef.current.points;
        if (points.length > 0) {
          const completedStroke: DrawingStroke = {
            id: `stroke_${Date.now()}_${Math.random()}`,
            color: strokeStateRef.current.isEraser
              ? '#FFFFFF'
              : strokeStateRef.current.selectedColor,
            width: strokeStateRef.current.isEraser
              ? strokeStateRef.current.selectedWidth * 2.5
              : strokeStateRef.current.selectedWidth,
            isEraser: strokeStateRef.current.isEraser,
            points,
          };
          setStrokes(prev => [...prev, completedStroke]);
          setRedoStrokes([]);
        }
        strokeStateRef.current.points = [];
        setCurrentStroke([]);
      },
    }),
  ).current;

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const last = strokes[strokes.length - 1];
    if (last) {
      setRedoStrokes(prev => [...prev, last]);
      setStrokes(prev => prev.slice(0, prev.length - 1));
    }
  };

  const handleRedo = () => {
    if (redoStrokes.length === 0) return;
    const next = redoStrokes[redoStrokes.length - 1];
    if (next) {
      setStrokes(prev => [...prev, next]);
      setRedoStrokes(prev => prev.slice(0, prev.length - 1));
    }
  };

  const handleClear = () => {
    setStrokes([]);
    setRedoStrokes([]);
    setCurrentStroke([]);
  };

  const handleSave = () => {
    saveGalleryArtwork({
      id: `art_${Date.now()}`,
      title: initialTitle,
      createdAt: new Date().toISOString(),
      strokes,
      type: categoryType,
      isFavorite: false,
      emojiThumbnail: '🎨',
      backgroundColor: '#FFFFFF',
    });
    drawingAudio.speak('Great artwork! Saved to your Gallery!');
    if (onSaveSuccess) onSaveSuccess();
  };

  return (
    <View style={styles.container}>
      {/* Drawing Canvas Area */}
      <View
        style={[
          styles.canvasFrame,
          {width: CANVAS_WIDTH, height: CANVAS_HEIGHT},
        ]}
        {...panResponder.panHandlers}>
        {/* Optional Background Guidelines or Steps */}
        {backgroundGuideComponent && (
          <View style={styles.guideLayer}>{backgroundGuideComponent}</View>
        )}

        {/* Render Saved Strokes */}
        {strokes.map(stroke => (
          <View
            key={stroke.id}
            style={StyleSheet.absoluteFill}
            pointerEvents="none">
            {stroke.points.map((pt, pIdx) => {
              if (pIdx === 0) {
                return (
                  <View
                    key={pIdx}
                    style={{
                      position: 'absolute',
                      left: pt.x - stroke.width / 2,
                      top: pt.y - stroke.width / 2,
                      width: stroke.width,
                      height: stroke.width,
                      borderRadius: stroke.width / 2,
                      backgroundColor: stroke.color,
                    }}
                  />
                );
              }
              const prev = stroke.points[pIdx - 1];
              if (!prev) return null;
              const dx = pt.x - prev.x;
              const dy = pt.y - prev.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);

              return (
                <View
                  key={pIdx}
                  style={{
                    position: 'absolute',
                    left: prev.x,
                    top: prev.y - stroke.width / 2,
                    width: dist,
                    height: stroke.width,
                    backgroundColor: stroke.color,
                    borderRadius: stroke.width / 2,
                    transform: [{rotate: `${angle}deg`}],
                    transformOrigin: 'left center',
                  }}
                />
              );
            })}
          </View>
        ))}

        {/* Render Live Drawing Stroke */}
        {currentStroke.length > 0 && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {currentStroke.map((pt, pIdx) => {
              const strokeWidth = isEraser
                ? selectedWidth * 2.5
                : selectedWidth;
              const strokeColor = isEraser ? '#FFFFFF' : selectedColor;

              if (pIdx === 0) {
                return (
                  <View
                    key={pIdx}
                    style={{
                      position: 'absolute',
                      left: pt.x - strokeWidth / 2,
                      top: pt.y - strokeWidth / 2,
                      width: strokeWidth,
                      height: strokeWidth,
                      borderRadius: strokeWidth / 2,
                      backgroundColor: strokeColor,
                    }}
                  />
                );
              }
              const prev = currentStroke[pIdx - 1];
              if (!prev) return null;
              const dx = pt.x - prev.x;
              const dy = pt.y - prev.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);

              return (
                <View
                  key={pIdx}
                  style={{
                    position: 'absolute',
                    left: prev.x,
                    top: prev.y - strokeWidth / 2,
                    width: dist,
                    height: strokeWidth,
                    backgroundColor: strokeColor,
                    borderRadius: strokeWidth / 2,
                    transform: [{rotate: `${angle}deg`}],
                    transformOrigin: 'left center',
                  }}
                />
              );
            })}
          </View>
        )}
      </View>

      {/* Control & Color Toolbar */}
      <DrawingToolbar
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
        selectedWidth={selectedWidth}
        onSelectWidth={setSelectedWidth}
        isEraser={isEraser}
        onToggleEraser={setIsEraser}
        canUndo={strokes.length > 0}
        canRedo={redoStrokes.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onSave={handleSave}
        showStrokeWidths={true}
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
  canvasFrame: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#374151',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  guideLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

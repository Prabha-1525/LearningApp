import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {drawingAudio} from '../../domain/audio/drawingAudioEngine';

export const PALETTE_COLORS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#10B981', // Green
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#78350F', // Brown
  '#18181B', // Black
  '#64748B', // Gray
  '#FFFFFF', // White
];

interface DrawingToolbarProps {
  readonly selectedColor: string;
  readonly onSelectColor: (color: string) => void;
  readonly selectedWidth?: number;
  readonly onSelectWidth?: (width: number) => void;
  readonly isEraser?: boolean;
  readonly onToggleEraser?: (isEraser: boolean) => void;
  readonly canUndo?: boolean;
  readonly canRedo?: boolean;
  readonly onUndo?: () => void;
  readonly onRedo?: () => void;
  readonly onClear?: () => void;
  readonly onSave?: () => void;
  readonly showStrokeWidths?: boolean;
}

export function DrawingToolbar({
  selectedColor,
  onSelectColor,
  selectedWidth = 6,
  onSelectWidth,
  isEraser = false,
  onToggleEraser,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  onClear,
  onSave,
  showStrokeWidths = true,
}: DrawingToolbarProps) {
  const handlePickColor = (color: string) => {
    drawingAudio.playTone(520, 50);
    if (isEraser && onToggleEraser) {
      onToggleEraser(false);
    }
    onSelectColor(color);
  };

  const handleToggleEraser = () => {
    if (onToggleEraser) {
      drawingAudio.playEraserSound();
      onToggleEraser(!isEraser);
    }
  };

  const handleUndo = () => {
    if (canUndo && onUndo) {
      drawingAudio.playUndoClick();
      onUndo();
    }
  };

  const handleRedo = () => {
    if (canRedo && onRedo) {
      drawingAudio.playUndoClick();
      onRedo();
    }
  };

  const handleClear = () => {
    if (onClear) {
      drawingAudio.playTone(280, 80);
      onClear();
    }
  };

  const handleSave = () => {
    if (onSave) {
      drawingAudio.playSuccessChime();
      onSave();
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Action Row: Undo, Redo, Eraser, Clear, Save */}
      <View style={styles.actionRow}>
        <View style={styles.leftActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Undo last stroke"
            disabled={!canUndo}
            onPress={handleUndo}
            style={[styles.toolBtn, !canUndo && styles.toolBtnDisabled]}>
            <Text style={styles.toolIcon}>↩️</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Redo stroke"
            disabled={!canRedo}
            onPress={handleRedo}
            style={[styles.toolBtn, !canRedo && styles.toolBtnDisabled]}>
            <Text style={styles.toolIcon}>↪️</Text>
          </Pressable>

          {onToggleEraser && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Eraser tool"
              onPress={handleToggleEraser}
              style={[styles.toolBtn, isEraser && styles.toolBtnActive]}>
              <Text style={styles.toolIcon}>🧽</Text>
            </Pressable>
          )}

          {onClear && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear canvas"
              onPress={handleClear}
              style={styles.toolBtn}>
              <Text style={styles.toolIcon}>🗑️</Text>
            </Pressable>
          )}
        </View>

        {/* Stroke Width Selector */}
        {showStrokeWidths && onSelectWidth && (
          <View style={styles.widthsRow}>
            {[4, 8, 16].map(w => (
              <Pressable
                key={w}
                accessibilityRole="button"
                accessibilityLabel={`Brush size ${w}`}
                onPress={() => onSelectWidth(w)}
                style={[
                  styles.widthBtn,
                  selectedWidth === w && !isEraser && styles.widthBtnActive,
                ]}>
                <View
                  style={[
                    styles.widthDot,
                    {
                      width: w === 4 ? 6 : w === 8 ? 10 : 16,
                      height: w === 4 ? 6 : w === 8 ? 10 : 16,
                      borderRadius: w === 4 ? 3 : w === 8 ? 5 : 8,
                      backgroundColor:
                        selectedWidth === w ? selectedColor : '#6B7280',
                    },
                  ]}
                />
              </Pressable>
            ))}
          </View>
        )}

        {onSave && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save artwork"
            onPress={handleSave}
            style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>💾 Save</Text>
          </Pressable>
        )}
      </View>

      {/* Color Palette Swatches */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.paletteScroll}>
        {PALETTE_COLORS.map(color => {
          const isSelected = selectedColor === color && !isEraser;
          return (
            <Pressable
              key={color}
              accessibilityRole="button"
              accessibilityLabel={`Select color ${color}`}
              onPress={() => handlePickColor(color)}
              style={[
                styles.colorSwatch,
                {backgroundColor: color},
                isSelected && styles.colorSwatchActive,
              ]}>
              {isSelected && <Text style={styles.selectedIndicator}>✓</Text>}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    padding: 10,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 3,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toolBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolBtnActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  toolBtnDisabled: {
    opacity: 0.35,
  },
  toolIcon: {
    fontSize: 16,
  },
  widthsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 2,
    gap: 4,
  },
  widthBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  widthBtnActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  widthDot: {
    backgroundColor: '#6B7280',
  },
  saveBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  paletteScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  colorSwatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchActive: {
    borderColor: '#1F2937',
    borderWidth: 3,
    transform: [{scale: 1.12}],
  },
  selectedIndicator: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '900',
    textShadowColor: '#FFFFFF',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
});

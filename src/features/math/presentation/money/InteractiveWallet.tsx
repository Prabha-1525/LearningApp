import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {CoinView} from './CoinView';
import {NoteView} from './NoteView';
import type {
  CoinDenomination,
  NoteDenomination,
} from '../../domain/money/types';

interface InteractiveWalletProps {
  currentTotal: number;
  targetPrice?: number;
  selectedCoins: readonly CoinDenomination[];
  selectedNotes: readonly NoteDenomination[];
  onAddCoin: (coin: CoinDenomination) => void;
  onAddNote?: (note: NoteDenomination) => void;
  onRemoveCoin: (index: number) => void;
  onRemoveNote?: (index: number) => void;
  onClear: () => void;
  availableCoins?: readonly CoinDenomination[];
  availableNotes?: readonly NoteDenomination[];
  showNotes?: boolean;
}

export function InteractiveWallet({
  currentTotal,
  targetPrice,
  selectedCoins,
  selectedNotes,
  onAddCoin,
  onAddNote,
  onRemoveCoin,
  onRemoveNote,
  onClear,
  availableCoins = [1, 2, 5, 10, 20],
  availableNotes = [10, 20, 50],
  showNotes = true,
}: InteractiveWalletProps) {
  const isMatch = targetPrice !== undefined && currentTotal === targetPrice;
  const isOver = targetPrice !== undefined && currentTotal > targetPrice;

  return (
    <View style={styles.container}>
      {/* Payment Plate / Register */}
      <View
        style={[
          styles.plateContainer,
          isMatch && styles.plateMatch,
          isOver && styles.plateOver,
        ]}>
        <View style={styles.plateHeader}>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeLabel}>Total Selected</Text>
            <Text style={styles.totalBadgeValue}>₹{currentTotal}</Text>
          </View>

          {targetPrice !== undefined && (
            <View style={styles.targetBadge}>
              <Text style={styles.targetBadgeLabel}>Target Price</Text>
              <Text style={styles.targetBadgeValue}>₹{targetPrice}</Text>
            </View>
          )}

          <Pressable
            accessibilityRole="button"
            onPress={onClear}
            disabled={selectedCoins.length === 0 && selectedNotes.length === 0}
            style={[
              styles.clearBtn,
              selectedCoins.length === 0 &&
                selectedNotes.length === 0 &&
                styles.clearBtnDisabled,
            ]}>
            <Text style={styles.clearBtnText}>↺ Reset</Text>
          </Pressable>
        </View>

        {/* Selected Money Items on Plate */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.plateItemsScroll}>
          {selectedCoins.length === 0 && selectedNotes.length === 0 ? (
            <View style={styles.emptyPlate}>
              <Text style={styles.emptyPlateText}>
                👉 Tap coins or notes below to add money!
              </Text>
            </View>
          ) : (
            <View style={styles.itemsRow}>
              {selectedNotes.map((note, idx) => (
                <View key={`note-${idx}`} style={styles.plateItemWrap}>
                  <NoteView
                    value={note}
                    width={110}
                    onPress={() => onRemoveNote?.(idx)}
                  />
                  <Text style={styles.tapToRemoveHint}>Tap to remove</Text>
                </View>
              ))}
              {selectedCoins.map((coin, idx) => (
                <View key={`coin-${idx}`} style={styles.plateItemWrap}>
                  <CoinView
                    value={coin}
                    size={52}
                    onPress={() => onRemoveCoin(idx)}
                  />
                  <Text style={styles.tapToRemoveHint}>Tap to remove</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>

      {/* Available Coins Tray */}
      <View style={styles.traySection}>
        <Text style={styles.trayTitle}>🪙 Coins in Wallet (Tap to add)</Text>
        <View style={styles.coinsRow}>
          {availableCoins.map(coin => (
            <View key={coin} style={styles.coinOption}>
              <CoinView
                value={coin}
                size={58}
                showLabel
                onPress={() => onAddCoin(coin)}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Available Notes Tray */}
      {showNotes && availableNotes.length > 0 && (
        <View style={styles.traySection}>
          <Text style={styles.trayTitle}>💵 Notes in Wallet (Tap to add)</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.notesRow}>
            {availableNotes.map(note => (
              <View key={note} style={styles.noteOption}>
                <NoteView
                  value={note}
                  width={125}
                  onPress={() => onAddNote?.(note)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  plateContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  plateMatch: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  plateOver: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  plateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  totalBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  totalBadgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#D1FAE5',
  },
  totalBadgeValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  targetBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  targetBadgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DBEAFE',
  },
  targetBadgeValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  clearBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  clearBtnDisabled: {
    opacity: 0.4,
  },
  clearBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
  },
  plateItemsScroll: {
    minHeight: 70,
    alignItems: 'center',
    paddingVertical: 6,
  },
  emptyPlate: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  emptyPlateText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  plateItemWrap: {
    alignItems: 'center',
    gap: 4,
  },
  tapToRemoveHint: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
  },
  traySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  trayTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  coinsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  coinOption: {
    paddingBottom: 8,
  },
  notesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  noteOption: {
    paddingVertical: 2,
  },
});

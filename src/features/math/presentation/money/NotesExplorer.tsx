import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {NoteView} from './NoteView';
import {INDIAN_NOTES} from '../../domain/money/moneyData';
import type {NoteInfo} from '../../domain/money/types';

interface NotesExplorerProps {
  onSuccess?: () => void;
}

export function NotesExplorer({onSuccess}: NotesExplorerProps) {
  const {t} = useTranslation();
  const [selectedNote, setSelectedNote] = useState<NoteInfo>(INDIAN_NOTES[0]!); // ₹10 default
  const [targetNoteValue, setTargetNoteValue] = useState<number>(50);
  const [noteSolved, setNoteSolved] = useState<boolean | null>(null);

  const handlePickNote = (val: number) => {
    if (val === targetNoteValue) {
      setNoteSolved(true);
      onSuccess?.();
    } else {
      setNoteSolved(false);
    }
  };

  const handleNextTargetNote = () => {
    const noteVals = [10, 20, 50, 100];
    const nextIdx = (noteVals.indexOf(targetNoteValue) + 1) % noteVals.length;
    setTargetNoteValue(noteVals[nextIdx] ?? 50);
    setNoteSolved(null);
  };

  return (
    <View style={styles.container}>
      {/* Notes Showcase & Selector */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          💵 Indian Currency Notes (Tap to inspect)
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.notesScroll}>
          {INDIAN_NOTES.map(note => (
            <View key={note.value} style={styles.noteItem}>
              <NoteView
                value={note.value}
                width={selectedNote.value === note.value ? 145 : 125}
                isSelected={selectedNote.value === note.value}
                onPress={() => setSelectedNote(note)}
              />
              <Text style={styles.noteLabel}>₹{note.value}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Selected Note Details Banner */}
        <View
          style={[styles.detailsCard, {borderColor: selectedNote.baseColor}]}>
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsTitle}>
              {t(selectedNote.nameKey, `₹${selectedNote.value} Banknote`)}
            </Text>
            <View
              style={[styles.pill, {backgroundColor: selectedNote.baseColor}]}>
              <Text style={styles.pillText}>
                {t(selectedNote.colorNameKey, 'Indian Currency')}
              </Text>
            </View>
          </View>
          <Text style={styles.detailsFact}>
            🏛️ Motif / Landmark:{' '}
            <Text style={styles.boldText}>
              {t(selectedNote.motifKey, 'Indian Heritage Landmark')}
            </Text>
          </Text>
          <Text style={styles.detailsFact}>
            💡 Each note has a distinctive color so we can recognize its value
            easily!
          </Text>
        </View>
      </View>

      {/* Recognition Game: Which note is ₹50? */}
      <View style={styles.gameCard}>
        <Text style={styles.gameTitle}>
          🎯 Challenge: Which note is ₹{targetNoteValue}?
        </Text>
        <Text style={styles.gameSubtitle}>
          Tap the note that shows ₹{targetNoteValue}:
        </Text>

        <View style={styles.choicesRow}>
          {[10, 20, 50, 100].map(val => (
            <NoteView
              key={`note-recog-${val}`}
              value={val as any}
              width={140}
              onPress={() => handlePickNote(val)}
            />
          ))}
        </View>

        {noteSolved === true && (
          <View style={styles.successBanner}>
            <Text style={styles.successBannerText}>
              🎉 Great job! You identified the ₹{targetNoteValue} note!
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleNextTargetNote}
              style={styles.nextNoteBtn}>
              <Text style={styles.nextNoteBtnText}>Next Note Challenge ❯</Text>
            </Pressable>
          </View>
        )}
        {noteSolved === false && (
          <View style={styles.tryAgainBanner}>
            <Text style={styles.tryAgainBannerText}>
              ❌ Look carefully at the big numbers printed on each note.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
  },
  notesScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  noteItem: {
    alignItems: 'center',
    gap: 6,
  },
  noteLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  detailsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    gap: 6,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  detailsFact: {
    fontSize: 13,
    lineHeight: 18,
    color: '#334155',
    fontWeight: '600',
  },
  boldText: {
    fontWeight: '800',
    color: '#0F172A',
  },
  gameCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  gameTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  gameSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  choicesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 10,
    paddingVertical: 6,
  },
  successBanner: {
    backgroundColor: '#DCFCE7',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  successBannerText: {
    color: '#166534',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  tryAgainBanner: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  tryAgainBannerText: {
    color: '#991B1B',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  nextNoteBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 6,
    alignSelf: 'center',
  },
  nextNoteBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});

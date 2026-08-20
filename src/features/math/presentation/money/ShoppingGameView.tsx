import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {InteractiveWallet} from './InteractiveWallet';
import {SHOPPING_ITEMS} from '../../domain/money/moneyData';
import type {
  CoinDenomination,
  NoteDenomination,
  ShoppingItem,
} from '../../domain/money/types';

interface ShoppingGameViewProps {
  onPurchaseSuccess?: () => void;
}

export function ShoppingGameView({onPurchaseSuccess}: ShoppingGameViewProps) {
  const {t} = useTranslation();
  const [basket, setBasket] = useState<ShoppingItem[]>([SHOPPING_ITEMS[0]!]); // Apple default
  const [selectedCoins, setSelectedCoins] = useState<CoinDenomination[]>([]);
  const [selectedNotes, setSelectedNotes] = useState<NoteDenomination[]>([]);
  const [purchaseComplete, setPurchaseComplete] = useState<boolean>(false);

  const totalBasketPrice = basket.reduce((sum, item) => sum + item.price, 0);
  const totalPaid =
    selectedCoins.reduce((sum, c) => sum + c, 0) +
    selectedNotes.reduce((sum, n) => sum + n, 0);

  const isExactPayment = totalPaid === totalBasketPrice && totalBasketPrice > 0;
  const isOverPayment = totalPaid > totalBasketPrice && totalBasketPrice > 0;

  const handleToggleItem = (item: ShoppingItem) => {
    setPurchaseComplete(false);
    if (basket.some(b => b.id === item.id)) {
      setBasket(prev => prev.filter(b => b.id !== item.id));
    } else {
      setBasket(prev => [...prev, item]);
    }
  };

  const handleAddCoin = (coin: CoinDenomination) => {
    setSelectedCoins(prev => [...prev, coin]);
  };

  const handleAddNote = (note: NoteDenomination) => {
    setSelectedNotes(prev => [...prev, note]);
  };

  const handleRemoveCoin = (idx: number) => {
    setSelectedCoins(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveNote = (idx: number) => {
    setSelectedNotes(prev => prev.filter((_, i) => i !== idx));
  };

  const handleClear = () => {
    setSelectedCoins([]);
    setSelectedNotes([]);
  };

  const handleCheckout = () => {
    if (isExactPayment || isOverPayment) {
      setPurchaseComplete(true);
      onPurchaseSuccess?.();
    }
  };

  const handleResetShop = () => {
    setBasket([SHOPPING_ITEMS[1]!]); // Select next item (banana/pencil)
    setSelectedCoins([]);
    setSelectedNotes([]);
    setPurchaseComplete(false);
  };

  return (
    <View style={styles.container}>
      {/* Shop Shelves Header */}
      <View style={styles.card}>
        <View style={styles.shopHeader}>
          <Text style={styles.shopTitle}>🏪 Kids Supermarket</Text>
          <View style={styles.cartPill}>
            <Text style={styles.cartPillText}>
              🛒 {basket.length} {basket.length === 1 ? 'item' : 'items'} (₹
              {totalBasketPrice})
            </Text>
          </View>
        </View>
        <Text style={styles.shopSubtitle}>
          Tap items to add or remove them from your shopping basket:
        </Text>

        {/* Market Items Grid */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.itemsRow}>
          {SHOPPING_ITEMS.map(item => {
            const inBasket = basket.some(b => b.id === item.id);
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                onPress={() => handleToggleItem(item)}
                style={[styles.itemCard, inBasket && styles.itemCardActive]}>
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                <Text style={styles.itemName} numberOfLines={1}>
                  {t(item.nameKey, item.defaultName)}
                </Text>
                <View
                  style={[styles.priceTag, inBasket && styles.priceTagActive]}>
                  <Text style={styles.priceTagText}>₹{item.price}</Text>
                </View>
                {inBasket && (
                  <Text style={styles.inBasketBadge}>✓ in cart</Text>
                )}
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Shopping Basket Summary */}
      <View style={styles.basketCard}>
        <View style={styles.basketHeader}>
          <Text style={styles.basketTitle}>🛒 Your Basket</Text>
          <Text style={styles.basketPriceTotal}>
            Total:{' '}
            <Text style={styles.basketTotalNumber}>₹{totalBasketPrice}</Text>
          </Text>
        </View>

        {basket.length === 0 ? (
          <Text style={styles.emptyBasketText}>
            Your basket is empty! Tap items above to shop.
          </Text>
        ) : (
          <View style={styles.basketItemsList}>
            {basket.map(b => (
              <View key={`b-${b.id}`} style={styles.basketChip}>
                <Text style={styles.basketChipText}>
                  {b.emoji} {t(b.nameKey, b.defaultName)} (₹{b.price})
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Interactive Wallet for Paying */}
      {basket.length > 0 && !purchaseComplete && (
        <InteractiveWallet
          currentTotal={totalPaid}
          targetPrice={totalBasketPrice}
          selectedCoins={selectedCoins}
          selectedNotes={selectedNotes}
          onAddCoin={handleAddCoin}
          onAddNote={handleAddNote}
          onRemoveCoin={handleRemoveCoin}
          onRemoveNote={handleRemoveNote}
          onClear={handleClear}
          availableCoins={[1, 2, 5, 10, 20]}
          availableNotes={[10, 20, 50]}
        />
      )}

      {/* Pay Checkout Button */}
      {basket.length > 0 && !purchaseComplete && (
        <Pressable
          accessibilityRole="button"
          disabled={totalPaid < totalBasketPrice}
          onPress={handleCheckout}
          style={[
            styles.checkoutBtn,
            totalPaid < totalBasketPrice && styles.checkoutBtnDisabled,
          ]}>
          <Text style={styles.checkoutBtnText}>
            {totalPaid === totalBasketPrice
              ? '💳 Pay Exact Amount (₹' + totalPaid + ')'
              : totalPaid > totalBasketPrice
              ? '💵 Pay ₹' + totalPaid + ' & Get Change'
              : '👉 Need ₹' + (totalBasketPrice - totalPaid) + ' more to pay'}
          </Text>
        </Pressable>
      )}

      {/* Purchase Success Animation / Receipt */}
      {purchaseComplete && (
        <View style={styles.receiptCard}>
          <Text style={styles.receiptEmoji}>🛍️ 🎉</Text>
          <Text style={styles.receiptTitle}>Purchase Successful!</Text>
          <Text style={styles.receiptSummary}>
            You bought {basket.map(b => b.emoji).join(' ')} for ₹
            {totalBasketPrice}!
          </Text>
          {totalPaid > totalBasketPrice && (
            <View style={styles.changeBanner}>
              <Text style={styles.changeBannerText}>
                🪙 Your Change: ₹{totalPaid - totalBasketPrice}
              </Text>
            </View>
          )}
          <Pressable
            accessibilityRole="button"
            onPress={handleResetShop}
            style={styles.shopMoreBtn}>
            <Text style={styles.shopMoreBtnText}>Shop More Items 🛒</Text>
          </Pressable>
        </View>
      )}
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
    gap: 10,
  },
  shopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shopTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  cartPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cartPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  shopSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  itemsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 8,
  },
  itemCard: {
    width: 96,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  itemCardActive: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  itemEmoji: {
    fontSize: 32,
  },
  itemName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  priceTag: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priceTagActive: {
    backgroundColor: '#10B981',
  },
  priceTagText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },
  inBasketBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#059669',
  },
  basketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  basketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  basketTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  basketPriceTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  basketTotalNumber: {
    fontSize: 17,
    fontWeight: '900',
    color: '#10B981',
  },
  emptyBasketText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 8,
  },
  basketItemsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  basketChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  basketChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  checkoutBtn: {
    backgroundColor: '#10B981',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  checkoutBtnDisabled: {
    backgroundColor: '#CBD5E1',
    shadowOpacity: 0,
    elevation: 0,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  receiptCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 22,
    padding: 20,
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    gap: 8,
  },
  receiptEmoji: {
    fontSize: 42,
  },
  receiptTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#065F46',
  },
  receiptSummary: {
    fontSize: 14,
    fontWeight: '700',
    color: '#047857',
    textAlign: 'center',
  },
  changeBanner: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 4,
  },
  changeBannerText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#92400E',
  },
  shopMoreBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 8,
  },
  shopMoreBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

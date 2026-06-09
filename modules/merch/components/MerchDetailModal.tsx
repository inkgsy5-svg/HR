import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MerchProduct } from '../data/products';

const { height } = Dimensions.get('window');
const WHATSAPP_NUMBER = '521XXXXXXXXXX'; // ← tu número

type Props = {
  product: MerchProduct | null;
  onClose: () => void;
};

export default function MerchDetailModal({ product, onClose }: Props) {
  if (!product) return null;

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(product.whatsappMessage)}`;
    Linking.openURL(url);
  };

  const hasDiscount = !!product.originalPrice;

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeX}>✕</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Image source={product.image} style={styles.image} resizeMode="cover" />

            <View style={styles.body}>
              {/* Badge descuento */}
              {hasDiscount && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{product.discountLabel}</Text>
                </View>
              )}

              <Text style={styles.name}>{product.name}</Text>

              {/* Precio */}
              <View style={styles.priceRow}>
                <Text style={styles.price}>${product.price} MXN</Text>
                {hasDiscount && (
                  <Text style={styles.originalPrice}>${product.originalPrice} MXN</Text>
                )}
              </View>

              <Text style={styles.description}>{product.description}</Text>

              {/* Tallas */}
              <Text style={styles.sectionLabel}>Tallas</Text>
              <View style={styles.chips}>
                {product.sizes.map(s => (
                  <View key={s} style={styles.chip}>
                    <Text style={styles.chipText}>{s}</Text>
                  </View>
                ))}
              </View>

              {/* Colores */}
              <Text style={styles.sectionLabel}>Colores disponibles</Text>
              <View style={styles.chips}>
                {product.colors.map(c => (
                  <View key={c} style={styles.chip}>
                    <Text style={styles.chipText}>{c}</Text>
                  </View>
                ))}
              </View>

              {/* Incluye (solo conjuntos) */}
              {product.isOutfit && product.outfitIncludes && (
                <>
                  <Text style={styles.sectionLabel}>Este conjunto incluye</Text>
                  {product.outfitIncludes.map(item => (
                    <Text key={item} style={styles.outfitItem}>
                      • {item}
                    </Text>
                  ))}
                </>
              )}

              {/* CTA WhatsApp */}
              <TouchableOpacity style={styles.waBtn} onPress={openWhatsApp} activeOpacity={0.85}>
                <Text style={styles.waBtnText}>💬 Pedir por WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#141414',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.9,
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: '#2A2A2A',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeX: { color: '#fff', fontSize: 16 },
  image: { width: '100%', height: 300 },
  body: { padding: 20 },
  discountBadge: {
    backgroundColor: '#C9A84C',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  discountText: { color: '#000', fontWeight: '700', fontSize: 12 },
  name: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  price: { color: '#C9A84C', fontSize: 20, fontWeight: '700' },
  originalPrice: { color: '#666', fontSize: 15, textDecorationLine: 'line-through' },
  description: { color: '#aaa', fontSize: 14, lineHeight: 22, marginBottom: 16 },
  sectionLabel: { color: '#fff', fontSize: 13, fontWeight: '600', marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { color: '#ccc', fontSize: 13 },
  outfitItem: { color: '#aaa', fontSize: 14, marginBottom: 4, marginLeft: 4 },
  waBtn: {
    backgroundColor: '#25D366',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  waBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

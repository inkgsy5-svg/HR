import React, { useRef, useEffect, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  FlatList,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  PanGestureHandler,
  TapGestureHandler,
  State,
  GestureEvent,
  HandlerStateChangeEvent,
  PinchGestureHandlerEventPayload,
  PanGestureHandlerEventPayload,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  images: (number | { uri: string })[];
  initialIndex: number;
  onClose: () => void;
}

function ZoomableImage({
  source,
  onZoomChange,
}: {
  source: number | { uri: string };
  onZoomChange: (zoomed: boolean) => void;
}) {
  const pinchRef = useRef<PinchGestureHandler>(null);
  const panRef = useRef<PanGestureHandler>(null);
  const tapRef = useRef<TapGestureHandler>(null);

  const [baseScale] = useState(() => new Animated.Value(1));
  const [pinchScale] = useState(() => new Animated.Value(1));
  const scale = useState(() => Animated.multiply(baseScale, pinchScale))[0];
  const lastScale = useRef(1);

  const [translateX] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(0));
  const lastOffset = useRef({ x: 0, y: 0 });

  const [isZoomed, setIsZoomed] = useState(false);

  function resetZoom() {
    Animated.parallel([
      Animated.spring(baseScale, { toValue: 1, useNativeDriver: true }),
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
    ]).start();
    pinchScale.setValue(1);
    lastScale.current = 1;
    lastOffset.current = { x: 0, y: 0 };
    translateX.setOffset(0);
    translateY.setOffset(0);
    setIsZoomed(false);
    onZoomChange(false);
  }

  const onPinchEvent = Animated.event<GestureEvent<PinchGestureHandlerEventPayload>>(
    [{ nativeEvent: { scale: pinchScale } }],
    { useNativeDriver: true },
  );

  const onPinchStateChange = (event: HandlerStateChangeEvent<PinchGestureHandlerEventPayload>) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const newScale = lastScale.current * event.nativeEvent.scale;
      if (newScale <= 1) {
        resetZoom();
      } else {
        const clamped = Math.min(newScale, 6);
        lastScale.current = clamped;
        baseScale.setValue(clamped);
        pinchScale.setValue(1);
        setIsZoomed(true);
        onZoomChange(true);
      }
    }
  };

  const onPanEvent = Animated.event<GestureEvent<PanGestureHandlerEventPayload>>(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: true },
  );

  const onPanStateChange = (event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastOffset.current.x += event.nativeEvent.translationX;
      lastOffset.current.y += event.nativeEvent.translationY;
      translateX.setOffset(lastOffset.current.x);
      translateX.setValue(0);
      translateY.setOffset(lastOffset.current.y);
      translateY.setValue(0);
    }
  };

  const onDoubleTap = (event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      resetZoom();
    }
  };

  return (
    <TapGestureHandler
      ref={tapRef}
      numberOfTaps={2}
      onHandlerStateChange={onDoubleTap}
      waitFor={pinchRef}
    >
      <Animated.View style={styles.page}>
        <PanGestureHandler
          ref={panRef}
          enabled={isZoomed}
          simultaneousHandlers={pinchRef}
          onGestureEvent={onPanEvent}
          onHandlerStateChange={onPanStateChange}
        >
          <Animated.View style={styles.page}>
            <PinchGestureHandler
              ref={pinchRef}
              simultaneousHandlers={panRef}
              onGestureEvent={onPinchEvent}
              onHandlerStateChange={onPinchStateChange}
            >
              <Animated.Image
                source={source}
                style={[styles.image, { transform: [{ scale }, { translateX }, { translateY }] }]}
                resizeMode="contain"
              />
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </TapGestureHandler>
  );
}

export default function ImageLightbox({ visible, images, initialIndex, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (visible && listRef.current) {
      listRef.current.scrollToIndex({ index: initialIndex, animated: false });
      setCurrentIndex(initialIndex);
    }
  }, [visible, initialIndex]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
      onDismiss={() => setIsZoomed(false)}
    >
      <StatusBar hidden />
      <GestureHandlerRootView style={styles.container}>
        {/* Botón cerrar */}
        <TouchableOpacity
          style={[styles.closeBtn, { top: insets.top + 12 }]}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <View style={styles.closeBtnInner}>
            <View style={[styles.closeLine, styles.closeLineLeft]} />
            <View style={[styles.closeLine, styles.closeLineRight]} />
          </View>
        </TouchableOpacity>

        <FlatList
          ref={listRef}
          data={images}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          scrollEnabled={!isZoomed}
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
          onMomentumScrollEnd={e => {
            setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
          }}
          renderItem={({ item }) => (
            <ZoomableImage key={String(visible)} source={item} onZoomChange={setIsZoomed} />
          )}
        />

        {/* Contador */}
        {images.length > 1 && (
          <View style={[styles.counter, { bottom: insets.bottom + 20 }]}>
            <Text style={styles.counterText}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
        )}
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  closeBtnInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLine: {
    position: 'absolute',
    width: 18,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  closeLineLeft: { transform: [{ rotate: '45deg' }] },
  closeLineRight: { transform: [{ rotate: '-45deg' }] },
  page: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width,
    height: height * 0.85,
  },
  counter: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  counterText: {
    color: '#fff',
    fontSize: 13,
  },
});

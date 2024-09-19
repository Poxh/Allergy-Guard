import React, { useState } from 'react';
import { Modal, Button, StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import TestData from '@/components/TestData';
import Legend from '@/components/Legend';
import { useColorScheme } from '@/components/useColorScheme';
import QrCodeScanner from '@/components/QrCodeScanner';
import { CameraView } from 'expo-camera';

export default function PopupInfoModal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const colorScheme = useColorScheme();

  const buttonBackgroundColor = colorScheme === 'dark' ? '#fff' : '#000';
  const buttonTextColor = colorScheme === 'dark' ? '#000' : '#fff';
  const modalbackground = colorScheme === 'dark' ? '#18191A' : '#fff';

  const handleCloseModal = () => {
    setModalVisible(false);
    setIsScanned(false);
  };

  return (
    <View style={styles.centeredView}>
      <QrCodeScanner
        onScanned={(data) => {
          setModalVisible(true);
          // Pass the scanned data to the modal or perform any other necessary actions
        }}
        isScanned={isScanned}
        setIsScanned={setIsScanned}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalView, { backgroundColor: modalbackground }]}>
          <TestData path="app/(tabs)/index.tsx" />
          <Legend path="app/(tabs)/index.tsx" />

          <Pressable
            onPress={handleCloseModal}
            style={({ pressed }) => [
              styles.termContainer,
              {
                backgroundColor: buttonBackgroundColor,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Text style={[styles.termText, { color: buttonTextColor }]}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    marginTop: 100,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  termContainer: {
    borderRadius: 10,
    margin: 5,
    marginTop: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  termText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
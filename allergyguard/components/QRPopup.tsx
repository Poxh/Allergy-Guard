import React, { useState } from 'react';
import { Modal, StyleSheet, View, Text, Pressable } from 'react-native';
import TestData from '@/components/TestData';
import Legend from '@/components/Legend';
import { useColorScheme } from '@/components/useColorScheme';
import QrCodeScanner from "@/components/QRCodeScanner";

export default function PopupInfoModal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const colorScheme = useColorScheme();

  const buttonBackgroundColor = colorScheme === 'dark' ? '#fff' : '#000';
  const buttonTextColor = colorScheme === 'dark' ? '#000' : '#fff';
  const modalbackground = colorScheme === 'dark' ? '#18191A' : '#fff';
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';

  const handleCloseModal = () => {
    setModalVisible(false);
    setIsScanned(false);
  };

  return (
    <View style={styles.centeredView}>
      {!isScanned && (
        <>
          <Text style={[styles.description, { color: textColor }]}>
            Scannen Sie den QR-Code des Gerichts
          </Text>
          <QrCodeScanner
            onScanned={(data) => {
              setModalVisible(true);
              setIsScanned(true);
              // Process the scanned data here
            }}
            isScanned={isScanned}
            setIsScanned={setIsScanned}
          />
          <Text style={[styles.description, { color: textColor }]}>
            Wir überprüfen, ob das Gericht basierend auf Ihren Allergien sicher ist
          </Text>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
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
            <Text style={[styles.termText, { color: buttonTextColor }]}>Schließen</Text>
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
    padding: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
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
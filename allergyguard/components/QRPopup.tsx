import React, { useState } from 'react';
import { Modal, Button, StyleSheet, View, Text, Pressable } from 'react-native';
import TestData from '@/components/TestData';
import Legend from '@/components/Legend';
import QRCodeScanner from '@/components/QRCodeScanner';
import { useColorScheme } from '@/components/useColorScheme'; // Verwende das gleiche Schema wie in _layout.tsx

export default function PopupInfoModal() {
    const [modalVisible, setModalVisible] = useState(false);
    const colorScheme = useColorScheme(); // Use device Color-Scheme

    // Bachground- and Textcolor depending on colorscheme 
    const buttonBackgroundColor = colorScheme === 'dark' ? '#fff' : '#000'; 
    const buttonTextColor = colorScheme === 'dark' ? '#000' : '#fff'; 
    const modalbackground = colorScheme === 'dark' ? '#18191A' : '#fff';

    return (
        <View style={styles.centeredView}>
            {/* Button */}

            <QRCodeScanner onScanned={function (data: string): void {
                console.log(data);
                
            } }></QRCodeScanner>

            <QRCodeScanner onScanned={function (data: string): void {
                setModalVisible(true)
            } } />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >

                <View style={[styles.modalView, { backgroundColor: modalbackground }]}>
                    <TestData path="app/(tabs)/index.tsx" />
                    <Legend path="app/(tabs)/index.tsx" />
                    
                    {/* Close button */}
                    <Pressable 
                        onPress={() => setModalVisible(false)}
                        style={({ pressed }) => [
                            styles.termContainer,
                            {
                                backgroundColor: buttonBackgroundColor,
                                opacity: pressed ? 0.7 : 1
                            }
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
        borderRadius: 10,  // Abgerundete Ecken
        margin: 5,  // Abstand um den Button
        marginTop: 25,
        paddingVertical: 10,  // Vertikales Padding
        paddingHorizontal: 20,  // Horizontales Padding
        alignItems: 'center',  // Text in der Mitte des Buttons
    },
    termText: {
        fontSize: 16,  // Gleiche Schriftgröße wie bei den Allergien
        textAlign: 'center',  // Zentrierter Text
    },
});

import {Modal, TouchableOpacity, Image, StyleSheet, TextInput, Alert} from 'react-native';
import {useState} from 'react';
import {Text, View} from '@/components/Themed';
import AllergenList from '@/components/AllergenList'; // Importiere die neue AllergenList-Komponente
import {getFirestore, collection, addDoc, deleteDoc, getDocs} from 'firebase/firestore'; // Importiere Firebase-Datenbankfunktionen

// Hole die Firestore-Datenbankinstanz
import {db} from '@/app/_layout'; // db ist in _layout.tsx definiert und exportiert

export default function TabTwoScreen() {
    const [newAllergen, setNewAllergen] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedAllergenes, setSelectedAllergenes] = useState<string[]>([]);

    const handleAddAllergen = async () => {
        if (!newAllergen.trim()) {
            Alert.alert('Fehler', 'Bitte ein gültiges Allergen eingeben.');
            return;
        }

        try {
            // Füge ein neues Allergen in die "allergene"-Sammlung ein
            await addDoc(collection(db, 'allergene'), { name: newAllergen });
            Alert.alert('Erfolg', 'Allergen erfolgreich hinzugefügt!');
            setNewAllergen('');
            setShowInput(false);
            setRefreshKey(prevKey => prevKey + 1); // Aktualisiere die Liste nach Hinzufügen
        } catch (error) {
            console.error('Fehler beim Hinzufügen des Allergens:', error);
            Alert.alert('Fehler', 'Es ist ein Fehler beim Hinzufügen aufgetreten.');
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedAllergenes.length === 0) {
            Alert.alert('Hinweis', 'Es wurden keine Allergene ausgewählt.');
            return;
        }

        try {
            const allergenCollection = collection(db, 'allergene');
            const querySnapshot = await getDocs(allergenCollection);

            const deletePromises = querySnapshot.docs
                .filter(doc => selectedAllergenes.includes(doc.data().name))
                .map(doc => deleteDoc(doc.ref));

            await Promise.all(deletePromises);

            Alert.alert('Erfolg', 'Ausgewählte Allergene wurden gelöscht!');
            setRefreshKey(prevKey => prevKey + 1); // Aktualisiere die Liste nach Löschen
            setSelectedAllergenes([]); // Auswahl zurücksetzen
        } catch (error) {
            console.error('Fehler beim Löschen der Allergene:', error);
            Alert.alert('Fehler', 'Es ist ein Fehler beim Löschen aufgetreten.');
        }
    };

    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={require('../../assets/images/profile_picture.png')}
            />
            <Text style={styles.name}>Sarah Schmidt</Text>

            <Text style={styles.jobTitle} lightColor="#626262" darkColor="#f3f3f3">
                Marketing-Managerin
            </Text>
            <Text style={styles.locationTitle} lightColor="#494949" darkColor="#bbbbbb">
                Berlin, Deutschland
            </Text>

            {/* Allergenauswahl */}
            <Text style={styles.allergenTitle}>Liste der Allergene</Text>

            {/* AllergenList-Komponente mit Daten */}
            <AllergenList refreshKey={refreshKey} onSelectionChange={setSelectedAllergenes} />

            {/* Button zum hinzufügen von Allergenen */}
            <TouchableOpacity style={styles.addButton} onPress={() => setShowInput(true)}>
                <Text style={styles.addButtonText}>+ Neues Allergen hinzufügen</Text>
            </TouchableOpacity>

            {/* Button zum Löschen der ausgewählten Allergene */}
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteSelected}>
                <Text style={styles.deleteButtonText}>Ausgewählte Allergene entfernen</Text>
            </TouchableOpacity>

            <Modal visible={showInput} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setShowInput(false)}>
                            <Text style={styles.closeButtonText}>×</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Neues Allergen eingeben</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Allergen eingeben"
                            value={newAllergen}
                            onChangeText={(text) => setNewAllergen(text)}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleAddAllergen}>
                            <Text style={styles.saveButtonText}>Speichern</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
    },
    image: {
        height: 125,
        width: 125,
        marginTop: 35,
        borderRadius: 100,
    },
    name: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
    jobTitle: {
        marginTop: 10,
        fontSize: 16,
    },
    locationTitle: {
        fontSize: 16,
        marginBottom: 20,
    },
    allergenTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
        width: '100%',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 15,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    deleteButton: {
        backgroundColor: '#FF4136',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 15,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1,
    },
    closeButtonText: {
        fontSize: 24,
        color: '#000',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    saveButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

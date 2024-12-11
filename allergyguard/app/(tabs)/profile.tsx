import {Button, Modal, TouchableOpacity, Image, StyleSheet, TextInput, Alert, useColorScheme} from 'react-native';
import { useState, useEffect } from 'react';
import {Text, View} from '@/components/Themed';
import allergenData from '@/assets/terms/ingredients.json'; // Importiere die JSON-Datei
import AllergenList from '@/components/AllergenList'; // Importiere die neue AllergenList-Komponente
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {getFirestore, collection, addDoc, deleteDoc, getDocs} from 'firebase/firestore'; // Importiere Firebase-Datenbankfunktionen

// Hole die Firestore-Datenbankinstanz
import {db} from '@/app/_layout'; // db ist in _layout.tsx definiert und exportiert


export default function TabTwoScreen() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth();
    const colorScheme = useColorScheme();

    const [newAllergen, setNewAllergen] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedAllergenes, setSelectedAllergenes] = useState<string[]>([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handleSignIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            let errorMessage = 'Ein Fehler ist aufgetreten';

            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Ungültige E-Mail-Adresse';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'Benutzer nicht gefunden';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Falsches Passwort';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Zu viele Anmeldeversuche. Bitte später erneut versuchen';
                    break;
            }

            Alert.alert('Fehler', errorMessage);
        }
    };

    if (!user) {
        return (
            <View style={styles.loginContainer}>
                <View style={styles.formContainer}>
                    <Text style={[styles.loginTitle, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>
                        Willkommen
                    </Text>
                    <TextInput
                        style={[styles.input, {
                            color: colorScheme === 'dark' ? '#fff' : '#000',
                            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5'
                        }]}
                        placeholder="E-Mail"
                        placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={[styles.input, {
                            color: colorScheme === 'dark' ? '#fff' : '#000',
                            backgroundColor: colorScheme === 'dark' ? '#333' : '#f5f5f5'
                        }]}
                        placeholder="Passwort"
                        placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <View style={styles.buttonContainer}>
                        <Button title="Anmelden" onPress={handleSignIn} />
                    </View>
                </View>
            </View>
        );
    }

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
                source={{ uri: 'https://ui-avatars.com/api/?name=User&background=random' }}
            />
            <Text style={styles.welcomeText}>Hallo Nutzer</Text>
            <Text style={styles.allergenTitle}>Liste der Allergene</Text>
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
                            style={styles.input2}
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
        padding: 20,
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loginTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 10,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },

    allergenTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    input2: {
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

import { Button, Image, StyleSheet, TextInput, Alert, useColorScheme } from 'react-native';
import { Text, View } from '@/components/Themed';
import allergenData from '@/assets/terms/ingredients.json';
import AllergenList from '@/components/AllergenList';
import { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function TabTwoScreen() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const auth = getAuth();
    const colorScheme = useColorScheme();

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

    return (
        <View style={styles.container}>
            <Image 
                style={styles.image} 
                source={{ uri: 'https://ui-avatars.com/api/?name=User&background=random' }}
            />
            <Text style={styles.welcomeText}>Hallo Nutzer</Text>
            <Text style={styles.allergenTitle}>Liste der Allergene</Text>
            <AllergenList allergenes={allergenData} />
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
    }
});

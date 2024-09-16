import {Button, Image, StyleSheet} from 'react-native';

import {Text, View} from '@/components/Themed';
import allergenData from '@/assets/terms/ingredients.json'; // Importiere die JSON-Datei
import AllergenList from '@/components/AllergenList'; // Importiere die neue AllergenList-Komponente

export default function TabTwoScreen() {
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../../assets/images/profile_picture.png")}></Image>
            <Text style={styles.name}>Sarah Schmidt</Text>

            <Text style={styles.jobTitle} lightColor={"#626262"} darkColor={"#f3f3f3"}>Marketing-Managerin</Text>
            <Text style={styles.locationTitle} lightColor={"#494949"} darkColor={"#bbbbbb"}>Berlin, Deutschland</Text>

             {/* Allergenauswahl */}
             <Text style={styles.allergenTitle}>Liste der Allergene</Text>
            
            {/* AllergenList-Komponente mit Daten */}
            <AllergenList allergenes={allergenData} />
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
});

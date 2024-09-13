import { View, Text } from "./Themed";
import { Button, StyleSheet } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';
import TestData from "./TestData";

export default function Legend({ path }: { path: string }) {
    const colorScheme = useColorScheme(); // Nutze das Color-Scheme des Geräts
    const modalbackground = colorScheme === 'dark' ? '#18191A' : '#fff';

    return (
        <View style={[styles.popup, { backgroundColor: modalbackground }]}>
            <View style={[styles.bulletContainer, { backgroundColor: modalbackground }]}>
                <Text style={[styles.bullet, { color: '#FF0000' }]}>•</Text>
                <Text style={styles.legend}>Enthalten</Text>
            </View>
            <View style={[styles.bulletContainer, { backgroundColor: modalbackground }]}>
                <Text style={[styles.bullet, { color: 'gold' }]}>•</Text>
                <Text style={styles.legend}>Spuren enthalten</Text>
            </View>
            <View style={[styles.bulletContainer, { backgroundColor: modalbackground }]}>
                <Text style={[styles.bullet, { color: 'limegreen' }]}>•</Text>
                <Text style={styles.legend}>Nicht enthalten</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    popup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    bulletContainer: {
        flexDirection: 'row', // Punkt und Text nebeneinander
        alignItems: 'center',
        marginHorizontal: 5,
    },
    bullet: {
        fontSize: 35,
        fontWeight: 'bold',
        lineHeight: '38',
    },
    legend: {
        fontSize: 11,
        lineHeight: 24,
        fontStyle: 'italic',
    },
});
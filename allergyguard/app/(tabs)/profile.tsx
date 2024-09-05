import {Button, Image, StyleSheet} from 'react-native';

import {Text, View} from '@/components/Themed';

export default function TabTwoScreen() {
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../../assets/images/profile_picture.png")}></Image>
            <Text style={styles.name}>Sarah Schmidt</Text>

            <Text style={styles.jobTitle}>Marketing-Managerin</Text>
            <Text style={styles.locationTitle}>Berlin, Deutschland</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
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
        color: '#f3f3f3',
    },
    locationTitle: {
        fontSize: 16,
        color: '#bbbbbb',
    }
});

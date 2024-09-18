import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View } from './Themed';
import ingredients from '@/assets/terms/ingredients.json'
import { useColorScheme } from '@/components/useColorScheme';

type Allergy = string;
type AllergiesArray = Allergy[];

const allergyStatus: { [key: string]: string } = {
  "Tomate": '#FF0000',  // Enthalten
  "Zwiebel": '#FF0000',  // Enthalten
  "Fleisch": '#FF0000',  // Enthalten
  "Milch": '#FF0000',
  "Weizen":'#FF0000',
  "Eier": '#FF0000',
  "Pfeffer": 'gold', // Kann Spuren enthalten
};

// get allergy color
const getBackgroundColor = (allergy: string) => {
  return allergyStatus[allergy] || 'limegreen'; // Default color if allergy is not set e.g. not included
};

export default function TestData({ path }: { path: string }) {
  const allergyList: AllergiesArray = ingredients as AllergiesArray;
  const colorScheme = useColorScheme();
  const modalbackground = colorScheme === 'dark' ? '#18191A' : '#fff';

  return (
      <View style={[styles.popup, { backgroundColor: modalbackground }]}>
        <Text
          style={styles.title}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Spaghetti Bolognese
        </Text>

        <Image style={styles.image} source={require("../assets/images/example_meal.jpg")}></Image>

        <Text
          style={styles.description}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)">
          Deine Allergene sind je nach bedenklichkeit farblich markiert.
        </Text>

        <View style={[styles.row, { backgroundColor: modalbackground }]}>
          {allergyList.map((allergy, index) => (
            <View 
              key={index} 
              style={[styles.termContainer, { backgroundColor: getBackgroundColor(allergy) }]}
            >
              <Text style={styles.termText}>{allergy}</Text>
            </View>
          ))}
        </View>

      </View>
  );
}

const styles = StyleSheet.create({
  popup: {
    fontStyle: 'italic',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    lineHeight: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  image: {
    height: 125,
    width: 225,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 20,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
    marginTop: 20,
  },
  description: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  termContainer: {
    borderRadius: 10,
    margin: 5,
    padding: 10,
    alignItems: 'center',
  },
  termText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
});

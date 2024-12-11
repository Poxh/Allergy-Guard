import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet, Dimensions } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/_layout'; // db ist in _layout.tsx definiert und exportiert

// Die Allergendaten können als Prop übergeben werden
interface AllergenListProps {
  refreshKey?: number; // Ein Schlüssel, um die Liste zu aktualisieren
  onSelectionChange: (selectedAllergenes: string[]) => void; // Callback für die Auswahländerung
}

const AllergenList: React.FC<AllergenListProps> = ({ refreshKey, onSelectionChange }) => {
  const [allergenes, setAllergenes] = useState<string[]>([]);
  const [selectedAllergenes, setSelectedAllergenes] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllergenes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'allergene'));
        const allergenList: string[] = [];
        querySnapshot.forEach((doc) => {
          const allergenData = doc.data();
          if (allergenData && allergenData.name) {
            allergenList.push(allergenData.name);
          }
        });
        setAllergenes(allergenList);
      } catch (error) {
        console.error('Fehler beim Abrufen der Allergene:', error);
      }
    };

    fetchAllergenes();
  }, [refreshKey]); // Aktualisiere die Liste, wenn refreshKey sich ändert

  const toggleAllergen = (allergen: string) => {
    let updatedSelection;
    if (selectedAllergenes.includes(allergen)) {
      updatedSelection = selectedAllergenes.filter(item => item !== allergen);
    } else {
      updatedSelection = [...selectedAllergenes, allergen];
    }
    setSelectedAllergenes(updatedSelection);
    onSelectionChange(updatedSelection);
  };

  // Berechnung der Höhe: 1/4 der Bildschirmhöhe
  const screenHeight = Dimensions.get('window').height;
  const allergenContainerHeight = screenHeight * 0.25;

  return (
      <View style={[styles.allergenContainer, { height: allergenContainerHeight }]}>
        <ScrollView contentContainerStyle={styles.allergenList}>
          {allergenes.map((allergen, index) => (
              <TouchableOpacity
                  key={index}
                  style={[
                    styles.allergenButton,
                    selectedAllergenes.includes(allergen) ? styles.selectedAllergen : null
                  ]}
                  onPress={() => toggleAllergen(allergen)}
              >
                <Text
                    style={[
                      styles.allergenText,
                      selectedAllergenes.includes(allergen) ? { color: '#fff' } : { color: '#000' }
                    ]}
                >
                  {allergen}
                </Text>
              </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
  );
};

const styles = StyleSheet.create({
  allergenContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 8,
  },
  allergenList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  allergenButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 30,
    margin: 10,
    backgroundColor: 'transparent',
  },
  selectedAllergen: {
    backgroundColor: '#000000',
  },
  allergenText: {
    fontSize: 16,
    color: '#000',
  },
});

export default AllergenList;
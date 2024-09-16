import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet, Dimensions } from 'react-native';

// Die Allergendaten können als Prop übergeben werden
interface AllergenListProps {
  allergenes: string[];
}

const AllergenList: React.FC<AllergenListProps> = ({ allergenes }) => {
  const [selectedAllergenes, setSelectedAllergenes] = useState<string[]>([]);

  const toggleAllergen = (allergen: string) => {
    if (selectedAllergenes.includes(allergen)) {
      setSelectedAllergenes(selectedAllergenes.filter(item => item !== allergen));
    } else {
      setSelectedAllergenes([...selectedAllergenes, allergen]);
    }
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

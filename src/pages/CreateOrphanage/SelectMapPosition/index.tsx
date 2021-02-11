import React, { useEffect, useState } from 'react';
import { View, Dimensions } from 'react-native';
import MapView, { Marker, MapEvent } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

import { NextButton, NextButtonText } from './styles';

import mapMarker from '../../../images/map-marker.png';

export default function SelectMapPosition() {
  const navigation = useNavigation();

  const [currentPosition, setCurrentPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      setCurrentPosition({
        latitude,
        longitude,
      });
    });
  }, []);

  if (currentPosition.latitude === 0) {
    return null;
  }

  function handleNextStep() {
    navigation.navigate('OrphanageData', { position });
  }

  function handleSelectMapPosition(event: MapEvent) {
    setPosition(event.nativeEvent.coordinate);
  }

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <MapView
        initialRegion={{
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
        onPress={handleSelectMapPosition}
      >
        { position.latitude !== 0 && (
          <Marker
            icon={mapMarker}
            coordinate={{
              latitude: position.latitude,
              longitude: position.longitude
            }}
          />
        ) }
      </MapView>

      { position.latitude !== 0 && (
        <NextButton onPress={handleNextStep}>
          <NextButtonText>Próximo</NextButtonText>
        </NextButton>
      ) }
    </View>
  );
}

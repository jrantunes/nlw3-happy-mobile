import React, { useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import { View, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import api from '../../services/api';

import {
  CalloutContainer,
  CalloutText,
  Footer,
  FooterText,
  CreateOrphanageButton
} from './styles';

import mapMarker from '../../images/map-marker.png';

interface Orphanage {
  id: string;
  name: string,
  latitude: number;
  longitude: number;
}

export default function App() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
  const [currentPosition, setCurrentPosition] = useState({
    latitude: 0,
    longitude: 0,
  });

  const navigation = useNavigation();

  useFocusEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      setCurrentPosition({
        latitude,
        longitude,
      });
    });

    api.get('orphanages').then(response => {
      setOrphanages(response.data);
    });
  });

  function handleNavigateToOrphanageDetails(id: string) {
    navigation.navigate('OrphanageDetails', { id });
  }

  function handleNavigateToCreateOrphanage() {
    navigation.navigate('SelectMapPosition');
  }

  if (currentPosition.latitude === 0) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
        initialRegion={{
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
         }}
      >
        {orphanages.map(orphanage => (
          <Marker
            key={orphanage.id}
            icon={mapMarker}
            calloutAnchor={{
              x: 2.7,
              y: 0.8,
            }}
            coordinate={{
              latitude: orphanage.latitude,
              longitude: orphanage.longitude,
            }}
          >
            <Callout tooltip onPress={() => handleNavigateToOrphanageDetails(orphanage.id)} >
              <CalloutContainer>
                <CalloutText>{orphanage.name}</CalloutText>
              </CalloutContainer>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <Footer style={{ elevation: 3 }}>
        <FooterText>{orphanages.length} orfanatos encontrados</FooterText>

        <CreateOrphanageButton onPress={handleNavigateToCreateOrphanage}>
          <Feather name="plus" size={20} color="#fff"/>
        </CreateOrphanageButton>
      </Footer>

    </View>
  );
}

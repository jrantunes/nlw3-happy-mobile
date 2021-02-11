import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

import api from '../../services/api';

import {
  Image,
  Title,
  Description,
  MapContainer,
  RoutesContainer,
  RoutesText,
  Separator,
  ScheduleContainer,
  ScheduleItem,
  ScheduleText,
  ContactButton,
  ContactButtonText,
} from './styles';

import mapMarker from '../../images/map-marker.png';

interface OrphanageDetailsRouteParams {
  id: string;
}

interface Orphanage {
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images: Array<{
    id: string;
    url: string;
  }>;
}

export default function OrphanageDetails() {
  const route = useRoute();
  const [orphanage, setOrphanage] = useState<Orphanage>();

  const params = route.params as OrphanageDetailsRouteParams;

  useEffect(() => {
    api.get(`orphanages/${params.id}`).then(response => {
      setOrphanage(response.data);
    });

  }, [params.id]);

  if (!orphanage) {
    return null;
  }

  function handleOpenGoogleMapsRoutes() {
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${orphanage?.latitude},${orphanage?.longitude}`);
  }

  return (
    <ScrollView style={{ flex: 1 }} >
      <View style={{ height: 240 }}>
        <ScrollView horizontal pagingEnabled>
          {orphanage.images.map(image => (
            <Image
              key={image.id}
              style={{ resizeMode: 'cover' }}
              source={{ uri: image.url }}
            />
          ))}
        </ScrollView>
      </View>

      <View style={{ padding: 24 }}>
        <Title>{orphanage.name}</Title>
        <Description>{orphanage.about}</Description>

        <MapContainer>
          <MapView
            initialRegion={{
              latitude: orphanage.latitude,
              longitude: orphanage.longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
            zoomEnabled={false}
            pitchEnabled={false}
            scrollEnabled={false}
            rotateEnabled={false}
            style={{ width: '100%', height: 150 }}
          >
            <Marker
              icon={mapMarker}
              coordinate={{
                latitude: orphanage.latitude,
                longitude: orphanage.longitude,
              }}
            />
          </MapView>

          <RoutesContainer onPress={handleOpenGoogleMapsRoutes}>
            <RoutesText>Ver rotas no Google Maps</RoutesText>
          </RoutesContainer>
        </MapContainer>

        <Separator/>

        <Title>Instruções para visita</Title>
        <Description>{orphanage.instructions}</Description>

        <ScheduleContainer>
          <ScheduleItem style={styles.scheduleItemBlue}>
            <Feather name="clock" size={40} color="#2ab5d1" />
            <ScheduleText style={styles.scheduleTextBlue}>Segunda à Sexta {orphanage.opening_hours}</ScheduleText>
          </ScheduleItem>

          {orphanage.open_on_weekends ? (
            <ScheduleItem style={styles.scheduleItemGreen}>
              <Feather name="info" size={40} color="#39cc83" />
              <ScheduleText style={styles.scheduleTextGreen}>Atendemos fim de semana</ScheduleText>
            </ScheduleItem>
          ) : (
            <ScheduleItem style={styles.scheduleItemRed}>
              <Feather name="info" size={40} color="#ff669d" />
              <ScheduleText style={styles.scheduleTextRed}>Não atendemos fim de semana</ScheduleText>
            </ScheduleItem>
          )}
        </ScheduleContainer>

        {/* <ContactButton onPress={() => {}}>
          <FontAwesome name="whatsapp" size={24} color="#fff" />
          <ContactButtonText>Entrar em contato</ContactButtonText>
        </ContactButton> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scheduleItemBlue: {
    backgroundColor: '#e6f7fb',
    borderWidth: 1,
    borderColor: '#b3dae2',
    borderRadius: 20,
  },

  scheduleItemGreen: {
    backgroundColor: '#edfff6',
    borderWidth: 1,
    borderColor: '#a1e9c5',
    borderRadius: 20,
  },

  scheduleItemRed: {
    backgroundColor: '#fef6f9',
    borderWidth: 1,
    borderColor: '#ffbcd4',
    borderRadius: 20,
  },

  scheduleTextBlue: {
    color: '#5c8599',
  },

  scheduleTextGreen: {
    color: '#37c77f',
  },

  scheduleTextRed: {
    color: '#ff669d',
  },
});

import React, { useState } from 'react';
import { ScrollView, Switch, View } from 'react-native';
import { Feather } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

import api from '../../../services/api';

import {
  Title,
  Label,
  Input,
  UploadedImage,
  ImagesInput,
  SwitchContainer,
  NextButton,
  NextButtonText
} from './styles';

interface OrphanageDataRouteParams {
  position: {
    latitude: number;
    longitude: number;
  }
}

export default function OrphanageData() {
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [opening_hours, setOpeningHours] = useState('');
  const [open_on_weekends, setOpenOnWeekends] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as OrphanageDataRouteParams;

  async function handleCreateOrphanage() {
    const { latitude, longitude } = params.position;

    const data = new FormData();

    data.append('name', name);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('about', about);
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));

    images.forEach((image, index) => {
      data.append('images', {
        name: `image_${index}.jpg`,
        type: 'image/jpg',
        uri: image,
      } as any)
    });

    await api.post('orphanages', data);

    navigation.navigate('OrphanagesMap');
  }

  async function handleSelectImages() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      alert('Precisamos de acesso às suas fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1, // 0 a 1
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // apenas imagens
    });

    if (result.cancelled) {
      return;
    }

    const { uri } = result;

    setImages([...images, uri]);
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
      <Title>Dados</Title>

      <Label>Nome</Label>
      <Input
        value={name}
        // onChangeText={text => setName(text)}
        onChangeText={setName}
      />

      <Label>Sobre</Label>
      <Input
        style={{ height: 110 }}
        multiline
        value={about}
        onChangeText={setAbout}
      />

      {/* <Label>Whatsapp</Label>
      <Input/> */}

      <Label>Fotos</Label>

      <View style={{ flexDirection: 'row', maxWidth: '100%' }}>
        {images.map(image => (
          <UploadedImage
            key={image}
            source={{ uri: image }}
          />
        ))}
      </View>

      <ImagesInput onPress={handleSelectImages}>
        <Feather name="plus" size={24} color="#15b6d6" />
      </ImagesInput>

      <Title>Visitação</Title>

      <Label>Instruções</Label>
      <Input
        style={{ height: 110 }}
        multiline
        value={instructions}
        onChangeText={setInstructions}
      />

      <Label>Horário de visitas</Label>
      <Input
        value={opening_hours}
        onChangeText={setOpeningHours}
      />

      <SwitchContainer>
        <Label>Atende final de semana?</Label>
        <Switch
          style={{  marginBottom: 4 }}
          thumbColor="#fff"
          trackColor={{ false: '#ccc', true: '#39cc83' }}
          value={open_on_weekends}
          onValueChange={setOpenOnWeekends}
        />
      </SwitchContainer>

      <NextButton onPress={handleCreateOrphanage}>
        <NextButtonText>Cadastrar</NextButtonText>
      </NextButton>

    </ScrollView>
  );
}

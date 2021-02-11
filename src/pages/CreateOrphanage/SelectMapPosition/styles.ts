import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export const NextButton = styled(RectButton)`
  background-color: #15c3d6;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  height: 56px;

  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 40px;
`;

export const NextButtonText = styled.Text`
  font-family: Nunito_800ExtraBold;
  font-size: 16px;
  color: #fff;
`;

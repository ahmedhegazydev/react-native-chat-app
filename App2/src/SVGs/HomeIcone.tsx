import React from 'react';
import CustomIcon from '../Utils/CustomSvg';
import {Path} from 'react-native-svg';

interface HomeIconProps {
  width: string | number;
  height: string | number;
}

const HomeIcon: React.FC<HomeIconProps> = ({width, height}) => (
  <CustomIcon width={width} height={height} viewBox="0 0 20 20">
    <Path
      fill="#4C3D8F"
      d="M19.268 7.544L12.946 1.22a4.171 4.171 0 00-5.893 0L.733 7.544A2.484 2.484 0 000 9.313v8.185A2.5 2.5 0 002.5 20h15a2.5 2.5 0 002.5-2.502V9.313a2.484 2.484 0 00-.732-1.769zM12.5 18.332h-5v-3.28a2.5 2.5 0 115 0v3.28zm5.833-.833c0 .46-.373.834-.833.834h-3.333v-3.281A4.168 4.168 0 0010 10.882a4.168 4.168 0 00-4.167 4.17v3.28H2.5a.833.833 0 01-.833-.833V9.313c0-.221.088-.433.244-.59L8.23 2.4a2.506 2.506 0 013.537 0l6.321 6.326a.842.842 0 01.244.587v8.185z"
    />
  </CustomIcon>
);

export default HomeIcon;

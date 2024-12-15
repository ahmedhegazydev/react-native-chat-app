import React, {ReactNode} from 'react';
import SvgXml, {Path, Svg, SvgProps} from 'react-native-svg';

export interface CustomIconProps extends SvgProps {
  width?: number;
  height?: number;
  fillSvg?: string;
  viewBox?: string;
  children?: ReactNode;
}

const CustomIcon: React.FC<CustomIconProps> = ({
  width = 20,
  height = 20,
  fillSvg = 'none',
  viewBox = '0 0 24 24',
  children,
}) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill={fillSvg}
      viewBox={viewBox}>
      {children}
    </Svg>
  );
};

export default CustomIcon;

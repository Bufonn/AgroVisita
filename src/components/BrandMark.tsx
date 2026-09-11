import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme';

interface BrandMarkProps {
  size?: number;
  color?: string;
}

export default function BrandMark({ size = 28, color = colors.verdeBroto }: BrandMarkProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C12 2 8.5 5.5 8.5 10C8.5 12.5 10 14.5 12 16C14 14.5 15.5 12.5 15.5 10C15.5 5.5 12 2 12 2Z"
        fill={color}
      />
      <Path
        d="M12 4V16"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <Path
        d="M12 7L10.5 9"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
      <Path
        d="M12 10L13.5 12"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
      <Path
        d="M12 16C12 16 11 18 11 19.5C11 20.3 11.4 21 12 21C12.6 21 13 20.3 13 19.5C13 18 12 16 12 16Z"
        fill={color}
      />
    </Svg>
  );
}

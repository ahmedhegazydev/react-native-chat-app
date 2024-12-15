import {ms} from 'react-native-size-matters';

type FontStyle = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  fontWeight: string;
};

const createFontStyle = (
  size: number,
  weight: 'Bold' | 'Semi Bold' | 'Medium' | 'Regular',
): FontStyle => ({
  fontFamily: `IBM Plex Sans Arabic ${weight}`,
  fontSize: ms(size),
  lineHeight: ms(size * 1.2),
  fontWeight:
    weight === 'Regular'
      ? '400'
      : weight === 'Medium'
        ? '500'
        : weight === 'Semi Bold'
          ? '600'
          : '700',
});

export const fonts = {
  titleBold28: createFontStyle(28, 'Bold'),
  titleSemiBold28: createFontStyle(28, 'Semi Bold'),
  titleMedium28: createFontStyle(28, 'Medium'),
  titleRegular28: createFontStyle(28, 'Regular'),

  subTitleBold20: createFontStyle(20, 'Bold'),
  subTitleSemiBold20: createFontStyle(20, 'Semi Bold'),
  subTitleMedium20: createFontStyle(20, 'Medium'),
  subTitleRegular20: createFontStyle(20, 'Regular'),

  contentBold16: createFontStyle(16, 'Bold'),
  contentSemiBold16: createFontStyle(16, 'Semi Bold'),
  contentMedium16: createFontStyle(16, 'Medium'),
  contentRegular16: createFontStyle(16, 'Regular'),

  smallBold12: createFontStyle(12, 'Bold'),
  smallSemiBold12: createFontStyle(12, 'Semi Bold'),
  smallMedium12: createFontStyle(12, 'Medium'),
  smallRegular12: createFontStyle(12, 'Regular'),
};

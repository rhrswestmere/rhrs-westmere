import { Font } from '@react-pdf/renderer'

export const registerFonts = () => {
  Font.register({
    family: 'NotoDeva',
    fonts: [
      { src: '/fonts/NotoSansDevanagari-Regular.ttf', fontWeight: 400 },
      { src: '/fonts/NotoSansDevanagari-Bold.ttf', fontWeight: 700 },
    ],
  })
  // Inter Black — used for the ID card's dynamic values so they read heavier
  // than the artwork's own headings.
  Font.register({
    family: 'CardValue',
    fonts: [{ src: '/fonts/Inter-Black.ttf', fontWeight: 900 }],
  })
}

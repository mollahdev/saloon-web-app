import { createTheme, MantineColorsTuple } from '@mantine/core';

// This color array provides all the shades Mantine needs (light, primary, hover, dark, etc.)
// You can use a tool like https://mantine.dev/colors-generator/ to generate these arrays
const myPrimaryColor: MantineColorsTuple = [
    '#e7f1ff',
    '#cfdeff',
    '#9dbafd',
    '#6894fb',
    '#3d74f9',
    '#2360f9',
    '#1355fa',
    '#0446de',
    '#003ec8',
    '#0035b1',
];

export const theme = createTheme({
    colors: {
        primary: myPrimaryColor,
    },
    primaryColor: 'primary',
    primaryShade: 6, // 6 is the default shade used for filled buttons and backgrounds. 7 is automatically used for hover.
});

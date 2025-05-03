// src/styles/styled.d.ts
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      primaryLight: string;
      primaryDark: string;
      secondary: string;
      text: {
        primary: string;
        secondary: string;
        light: string;
      };
      background: {
        main: string;
        card: string;
      };
      border: string;
      success: string;
      error: string;
      warning: string;
    };
    fonts: {
      main: string;
    };
    fontSizes: {
      small: string;
      normal: string;
      medium: string;
      large: string;
      xlarge: string;
    };
    spacing: {
      xs: string;
      s: string;
      m: string;
      l: string;
      xl: string;
    };
    borderRadius: {
      small: string;
      medium: string;
      large: string;
      round: string;
    };
    shadows: {
      small: string;
      medium: string;
      large: string;
    };
    transitions: {
      default: string;
    };
  }
}
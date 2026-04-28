export interface ThemeColors {
  bg: string;

  fg: string;

  cursor: string;

  prompt: string;

  accent: string;

  success: string;

  error: string;

  warning: string;

  info: string;

  muted: string;

  selection: string;

  border: string;
}

export interface ThemeFont {
  family: string;

  size: string;

  lineHeight: string;
}

export interface Theme {
  name: string;

  label: string;

  mode: 'light' | 'dark';

  colors: ThemeColors;

  font: ThemeFont;

  experimental?: boolean;
}

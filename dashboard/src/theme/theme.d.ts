import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    primaryContainer: string;
    onPrimaryContainer: string;
  }

  interface PaletteOptions {
    primaryContainer?: string;
    onPrimaryContainer?: string;
  }
}

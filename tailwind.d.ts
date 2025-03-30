declare module '@tailwindcss/postcss' {
  export interface Config {
    content: string[];
    theme: {
      extend?: {
        colors?: Record<string, string>;
      };
    };
  }
}
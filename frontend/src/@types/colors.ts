import { FontFamily } from 'src/@types/typography';

export const createTypographyColors = (textColors: {
  primary: string;
  secondary: string;
  disabled: string;
}): TypographyColors => ({
  displayLarge: textColors.primary,
  displayMedium: textColors.primary,
  displaySmall: textColors.primary,
  headlineLarge: textColors.primary,
  headlineMedium: textColors.primary,
  headlineSmall: textColors.primary,
  titleLarge: textColors.primary,
  titleMedium: textColors.primary,
  titleSmall: textColors.primary,
  bodyLarge: textColors.primary,
  bodyMedium: textColors.primary,
  bodySmall: textColors.secondary,
  labelLarge: textColors.secondary,
  labelMedium: textColors.secondary,
  labelSmall: textColors.disabled,
  button: textColors.primary,
});

export const darkWaveTheme: WaveTheme = {
  background: '#3f055ac7',
  wave1: '#000000b7',
  wave2: '#3c0653e1',
  wave3: '#270438bb',
  circleGradient: {
    start: '#5f2183ff',
    end: '#4d0879ff',
    startOpacity: 0.45,
    endOpacity: 0.05
  }
}

export const lightWaveTheme: WaveTheme = {
  background: '#911bc0ff',
  wave1: '#ffffffff',
  wave2: '#5c1d8fff',
  wave3: '#3f086dff',
  circleGradient: {
    start: '#b07ad6',
    end: '#e6d3f2',
    startOpacity: 0.4,
    endOpacity: 0.1
  }
}

export const deuteranopiaWaveTheme: WaveTheme = {
  background: '#1b1b3a',
  wave1: '#2c2c6c80',
  wave2: '#3f3fa3ff',
  wave3: '#1f1f4dff',
  circleGradient: {
    start: '#5a5add',
    end: '#8f8ff0',
    startOpacity: 0.45,
    endOpacity: 0.08
  }
}

export const protanopiaWaveTheme: WaveTheme = {
  background: '#102a43',
  wave1: '#1c3d5a80',
  wave2: '#2a6f97ff',
  wave3: '#16425bff',
  circleGradient: {
    start: '#3a86ff',
    end: '#8ecae6',
    startOpacity: 0.45,
    endOpacity: 0.1
  }
}

export const tritanopiaWaveTheme: WaveTheme = {
  background: '#2a0f3c',
  wave1: '#4b1d6b80',
  wave2: '#7b2cbfff',
  wave3: '#3c096cff',
  circleGradient: {
    start: '#c77dff',
    end: '#e0aaff',
    startOpacity: 0.45,
    endOpacity: 0.1
  }
}

export type TextColors = {
  primary: string
  secondary: string
  link: string
  placeholder: string
  disabled: string
}

export type InputColors = {
  border: string
  text: string
  placeholder: string
  icon: string
}

export interface TypographyStyle {
  fontFamily: FontFamily;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
}

export interface TypographyColors {
  displayLarge?: string;
  displayMedium?: string;
  displaySmall?: string;
  headlineLarge?: string;
  headlineMedium?: string;
  headlineSmall?: string;
  titleLarge?: string;
  titleMedium?: string;
  titleSmall?: string;
  bodyLarge?: string;
  bodyMedium?: string;
  bodySmall?: string;
  labelLarge?: string;
  labelMedium?: string;
  labelSmall?: string;
  button?: string;
}

export type WaveTheme = {
  background: string
  wave1: string
  wave2: string
  wave3: string
  circleGradient: {
    start: string
    end: string
    startOpacity: number
    endOpacity: number
  }
}

export type AppTheme = {
  background: string
  waves: WaveTheme
  text: {
    primary: string
    secondary: string
    link: string
    placeholder: string
    disabled: string
  }
  input: {
    border: string
    text: string
    placeholder: string
    icon: string
  }
  social: {
    google: SocialColors
    facebook: SocialColors
    instagram: SocialColors
  };
  typography?: TypographyColors;
  success: string
  error: string
  warning: string
  info: string
  onPrimary?: string 

  states: {
    focus: string
    hover: string
    active: string
  }
}

export const darkTheme: AppTheme = {
  background: '#260635ff',
  waves: darkWaveTheme,
  text: {
    primary: '#ffffff',
    secondary: '#ffffffcc',
    link: '#335eebff',
    placeholder: '#ffffff88',
    disabled: '#ffffff55',
  },
  input: {
    border: '#ffffff55',
    text: '#ffffff',
    placeholder: '#ffffff88',
    icon: '#ffffff',
  },
  social: {
    google: {
      background: '#ffffff',
      border: '#ffffff',
      iconBackground: '#ffffff',
    },
    facebook: {
      background: '#1877f2',
      border: '#1877f2',
      iconBackground: '#ffffff',
    },
    instagram: {
      background: '#2a0f3c',
      border: '#d6249f',
      iconBackground: '#ffffff',
    },
  },
  typography: createTypographyColors({
    primary: '#ffffff',
    secondary: '#ffffffcc',
    disabled: '#ffffff55',
  }),
  success: '#4CAF50', 
  error: '#F44336',   
  warning: '#FF9800', 
  info: '#2196F3',    
  onPrimary: '#ffffff' ,
  states: {
    focus: '#4CAF50',
    hover: '#3F51B5',
    active: '#2196F3'
  }
};

export const lightTheme: AppTheme = {
  background: '#f3e9f7',
  waves: lightWaveTheme,
  text: {
    primary: '#2a0f3c',
    secondary: '#ffffffff',
    link: '#335eebff',
    placeholder: '#6b5a75',
    disabled: '#a8a1ad',
  },
  input: {
    border: '#bfa6cf',
    text: '#2a0f3c',
    placeholder: '#6b5a75',
    icon: '#4a2c5a',
  },
  social: {
    google: {
      background: '#ffffff',
      border: '#dadce0',
      iconBackground: '#ffffff',
    },
    facebook: {
      background: '#ffffffff',
      border: '#616060ff',
      iconBackground: '#ffffff',
    },
    instagram: {
      background: '#ffffff',
      border: '#d6249f',
      iconBackground: '#ffffff',
    },
    
  },
  typography: createTypographyColors({
    primary: '#2a0f3c',
    secondary: '#4a2c5a',
    disabled: '#a8a1ad',
  }),
  success: '#388E3C', 
  error: '#D32F2F',   
  warning: '#F57C00', 
  info: '#1976D2',    
  onPrimary: '#ffffff' ,
  states: {
    focus: '#4CAF50',
    hover: '#3F51B5',
    active: '#2196F3'
  }
};

export const deuteranopiaTheme: AppTheme = {
  background: '#1b1b3a',
  waves: deuteranopiaWaveTheme,
  text: {
    primary: '#ffffff',
    secondary: '#d6d6ff',
    link: '#9fa8ff',
    placeholder: '#b3b3ff',
    disabled: '#8a8ab3',
  },
  input: {
    border: '#6c6cff',
    text: '#ffffff',
    placeholder: '#b3b3ff',
    icon: '#9fa8ff',
  },
  social: {
    google: {
      background: '#ffffff',
      border: '#ffffff',
      iconBackground: '#ffffff',
    },
    facebook: {
      background: '#1877f2',
      border: '#1877f2',
      iconBackground: '#ffffff',
    },
    instagram: {
      background: '#2a0f3c',
      border: '#d6249f',
      iconBackground: '#ffffff',
    },
  },
  success: '#66BB6A', 
  error: '#EF5350',   
  warning: '#FFA726', 
  info: '#42A5F5',    
  onPrimary: '#ffffff',
  states: {
    focus: '#4CAF50',
    hover: '#3F51B5',
    active: '#2196F3'
  }
};

export const protanopiaTheme: AppTheme = {
  background: '#102a43',
  waves: protanopiaWaveTheme,
  text: {
    primary: '#ffffff',
    secondary: '#cce4f6',
    link: '#4dabf7',
    placeholder: '#a5c9e3',
    disabled: '#7fa7c4',
  },
  input: {
    border: '#4dabf7',
    text: '#ffffff',
    placeholder: '#a5c9e3',
    icon: '#4dabf7',
  },
  social: {
    google: {
      background: '#ffffff',
      border: '#ffffff',
      iconBackground: '#ffffff',
    },
    facebook: {
      background: '#1877f2',
      border: '#1877f2',
      iconBackground: '#ffffff',
    },
    instagram: {
      background: '#2a0f3c',
      border: '#d6249f',
      iconBackground: '#ffffff',
    },
  },
  success: '#4DB6AC', 
  error: '#E57373',   
  warning: '#FFB74D', 
  info: '#64B5F6',    
  onPrimary: '#ffffff',
  states: {
    focus: '#4CAF50',
    hover: '#3F51B5',
    active: '#2196F3'
  }
};

export const tritanopiaTheme: AppTheme = {
  background: '#2a0f3c',
  waves: tritanopiaWaveTheme,
  text: {
    primary: '#ffffff',
    secondary: '#f0d9ff',
    link: '#d48cff',
    placeholder: '#e0b3ff',
    disabled: '#b58fd1',
  },
  input: {
    border: '#d48cff',
    text: '#ffffff',
    placeholder: '#e0b3ff',
    icon: '#d48cff',
  },
  social: {
    google: {
      background: '#ffffff',
      border: '#ffffff',
      iconBackground: '#ffffff',
    },
    facebook: {
      background: '#1877f2',
      border: '#1877f2',
      iconBackground: '#ffffff',
    },
    instagram: {
      background: '#2a0f3c',
      border: '#d6249f',
      iconBackground: '#ffffff',
    },
  },
  success: '#81C784', 
  error: '#E57373',   
  warning: '#FFD54F', 
  info: '#7986CB',    
  onPrimary: '#ffffff',
  states: {
    focus: '#4CAF50',
    hover: '#3F51B5',
    active: '#2196F3'
  }
};



export type SocialColors = {
  background: string
  border: string
  iconBackground: string
}
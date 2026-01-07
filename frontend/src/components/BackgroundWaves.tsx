import React from 'react'
import Svg, { Path, Rect, Circle, Defs, LinearGradient, Stop } from 'react-native-svg'
import { StyleSheet } from 'react-native'
import { darkWaveTheme, WaveTheme } from 'src/@types/colors'

type Props = {
  theme?: WaveTheme
}

export default function BackgroundWaves({ theme = darkWaveTheme }: Props) {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFillObject}
    >
      <Defs>
        <LinearGradient id="circleGradient" x1="100%" y1="0%" x2="0%" y2="0%">
          <Stop
            offset="0%"
            stopColor={theme.circleGradient.start}
            stopOpacity={theme.circleGradient.startOpacity}
          />
          <Stop
            offset="100%"
            stopColor={theme.circleGradient.end}
            stopOpacity={theme.circleGradient.endOpacity}
          />
        </LinearGradient>
      </Defs>

      <Rect width="100%" height="100%" fill={theme.background} />

      <Circle cx="106" cy="-20" r="52" fill="url(#circleGradient)" />

      <Path
        d="M0 20 C10 16, 30 5, 109 38 L100 100 L0 100 Z"
        fill={theme.wave1}
      />
      <Path
        d="M0 73 C48 80, 50 60, 100 71 L100 100 L0 100 Z"
        fill={theme.wave2}
      />
      <Path
        d="M0 83 C60 75, 60 105, 100 85 L106 100 L0 100 Z"
        fill={theme.wave3}
      />
    </Svg>
  )
}

import React from 'react'
import Svg, { Path, Rect, Circle, Defs, LinearGradient, Stop } from 'react-native-svg'
import { StyleSheet } from 'react-native'

export default function BackgroundWaves() {
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
          <Stop offset="0%" stopColor="#6a1b9a" stopOpacity="0.45" />
          <Stop offset="100%" stopColor="#6a1b9a" stopOpacity="0.05" />
        </LinearGradient>
      </Defs>

      <Rect width="100%" height="100%" fill="#42005D" />

      <Circle
        cx="110"
        cy="-15"
        r="55"
        fill="url(#circleGradient)"
      />

      <Path
        d="M0 30 C10 22, 40 18, 100 38 L100 100 L0 100 Z"
        fill="#231827"
      />
      <Path
        d="M0 60 C40 80, 40 56, 100 64 L100 100 L0 100 Z"
        fill="#3B0055"
      />
      <Path
        d="M0 80 C45 75, 60 100, 100 85 L100 100 L0 100 Z"
        fill="#29003B"
      />
    </Svg>
    )
}

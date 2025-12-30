import React from 'react'
import { Dimensions } from 'react-native'
import Svg, {
    Path,
    Rect,
    Circle,
    Defs,
    LinearGradient,
    Stop
} from 'react-native-svg'
const { width, height } = Dimensions.get('window')

export default function BackgroundWaves() {
    return (
        <Svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            style={{ position: 'absolute', top: 0 }}
        >
            <Defs>
                <LinearGradient
                    id="circleGradient"
                    x1="1"
                    y1="0"
                    x2="0"
                    y2="0"
                >
                    <Stop offset="0%" stopColor="#260041ff" stopOpacity="0.95" />
                    <Stop offset="80%" stopColor="#cabdd3ff" stopOpacity="0.1" />
                </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="#42005D" />
            <Circle
                cx={width * 1.05}
                cy={height * 0.02}
                r={width * 0.49}
                fill="url(#circleGradient)"
                opacity={0.34}
            />
            <Path
                d={`
          M 0 ${height * 0.25}
          C ${width * 0.1} ${height * 0.18},
            ${width * 0.4} ${height * 0.1},
            ${width} ${height * 0.37}
          L ${width} ${height}
          L 0 ${height}
          Z
        `}
                fill="#231827"
            />
            <Path
                d={`
          M 0 ${height * 0.6}
          C ${width * 0.4} ${height * 0.8},
            ${width * 0.4} ${height * 0.56},
            ${width} ${height * 0.64}
          L ${width} ${height}
          L 0 ${height}
          Z
        `}
                fill="#3B0055"
            />
            <Path
                d={`
          M 0 ${height * 0.8}
          C ${width * 0.45} ${height * 0.75},
          ${width * 0.6} ${height * 0.999},
            ${width} ${height * 0.85}
          L ${width} ${height}
          L 0 ${height}
          Z
        `}
                fill="#29003B"
            />

        </Svg>
    )
}

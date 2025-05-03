// src/components/common/RadialGauge.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Types
interface RadialGaugeProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  size?: number;
  thickness?: number;
  color?: string;
  backgroundColor?: string;
  labelSize?: number;
  valueSize?: number;
  animate?: boolean;
  animationDuration?: number;
}

// Styled components
const GaugeContainer = styled.div<{ size: number }>`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => Math.floor(props.size * 0.6)}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
`;

const SvgContainer = styled.div<{ size: number }>`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => Math.floor(props.size * 0.55)}px;
  overflow: visible;
`;

const GaugeLabel = styled.div<{ labelSize: number }>`
  font-size: ${props => props.labelSize}px;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary || '#333'};
  margin-top: 5px;
  text-align: center;
`;

const DigitalDisplay = styled.div<{ 
  size: number;
  valueSize: number;
}>`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: ${props => props.valueSize}px;
  font-weight: bold;
  color: ${props => props.theme.colors.text.primary || '#333'};
  text-align: center;
`;

// Function to get color based on value
const getColorForValue = (value: number): string => {
  if (value < 33) {
    return '#e53935'; // Red for low values
  } else if (value < 66) {
    return '#ffb300'; // Yellow for medium values
  } else {
    return '#4caf50'; // Green for high values
  }
};

/**
 * RadialGauge Component
 * 
 * A modern semi-circular gauge with digital display value
 */
const RadialGauge: React.FC<RadialGaugeProps> = ({
  value,
  min = 0,
  max = 100,
  label = '',
  size = 120,
  thickness = 12, // Increased thickness
  color = '#38a3a5',
  backgroundColor = '#e0e0e0',
  labelSize = 14,
  valueSize = 18,
  animate = true,
  animationDuration = 1000
}) => {
  const [currentValue, setCurrentValue] = useState(min);
  
  // Animation effect
  useEffect(() => {
    if (!animate) {
      setCurrentValue(value);
      return;
    }
    
    // Initial state - start from min
    setCurrentValue(min);
    
    // Animate to the target value
    const startTime = Date.now();
    const startValue = min;
    const valueRange = value - min;
    
    const animateValue = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);
      
      // Ease out cubic: progress = 1 - Math.pow(1 - progress, 3)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const newValue = startValue + valueRange * easedProgress;
      
      setCurrentValue(newValue);
      
      if (progress < 1) {
        requestAnimationFrame(animateValue);
      }
    };
    
    requestAnimationFrame(animateValue);
  }, [value, min, animate, animationDuration]);
  
  // Calculate the range and angle
  const range = max - min;
  const normalizedValue = (currentValue - min) / range;
  const angle = normalizedValue * 180; // 180 degrees for semi-circle
  
  // Center and radius
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size / 2) - (thickness / 2);
  
  // Calculate start and end points on arc
  const startAngle = -180; // Start from left bottom
  const endAngle = startAngle + angle;
  
  // Convert angle to radians and calculate x,y
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  
  const startX = centerX + radius * Math.cos(startRad);
  const startY = centerY + radius * Math.sin(startRad);
  const endX = centerX + radius * Math.cos(endRad);
  const endY = centerY + radius * Math.sin(endRad);
  
  // Arc flag is always 0 for less than 180 degrees
  const largeArcFlag = angle > 180 ? 1 : 0;
  
  // Create gradient stops based on value
  const getGradientStops = () => {
    if (value < 33) {
      return (
        <>
          <stop offset="0%" stopColor="#f44336" />
          <stop offset="100%" stopColor="#ff9800" />
        </>
      );
    } else if (value < 66) {
      return (
        <>
          <stop offset="0%" stopColor="#ff9800" />
          <stop offset="100%" stopColor="#ffeb3b" />
        </>
      );
    } else {
      return (
        <>
          <stop offset="0%" stopColor="#ffeb3b" />
          <stop offset="100%" stopColor="#4caf50" />
        </>
      );
    }
  };
  
  // Calculate needle position
  const needleAngleRad = ((startAngle + angle) * Math.PI) / 180;
  const needleLength = radius;
  const needleX = centerX + needleLength * Math.cos(needleAngleRad);
  const needleY = centerY + needleLength * Math.sin(needleAngleRad);
  
  return (
    <GaugeContainer size={size}>
      <SvgContainer size={size}>
        <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} overflow="visible">
          {/* Define gradient */}
          <defs>
            <linearGradient id={`gauge-gradient-${value}`} x1="0%" y1="0%" x2="100%" y2="0%">
              {getGradientStops()}
            </linearGradient>
          </defs>
          
          {/* Background Arc */}
          <path
            d={`M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${size} ${centerY}`}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={thickness}
            strokeLinecap="round"
          />
          
          {/* Value Arc with gradient */}
          <path
            d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`}
            fill="none"
            stroke={`url(#gauge-gradient-${value})`}
            strokeWidth={thickness}
            strokeLinecap="round"
          />
          
          {/* Needle */}
          <line
            x1={centerX}
            y1={centerY}
            x2={needleX}
            y2={needleY}
            stroke="#333"
            strokeWidth={3}
            strokeLinecap="round"
          />
          
          {/* Needle Center */}
          <circle
            cx={centerX}
            cy={centerY}
            r={thickness / 2}
            fill="#333"
          />
          
          {/* Tick marks - Red (0-33) */}
          <path
            d={`M ${centerX - radius - thickness/2} ${centerY} A ${radius + thickness/2} ${radius + thickness/2} 0 0 1 ${centerX - (radius + thickness/2) * Math.cos(120 * Math.PI / 180)} ${centerY - (radius + thickness/2) * Math.sin(120 * Math.PI / 180)}`}
            fill="none"
            stroke="#f44336"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="2 15"
          />
          
          {/* Tick marks - Yellow (33-66) */}
          <path
            d={`M ${centerX - (radius + thickness/2) * Math.cos(120 * Math.PI / 180)} ${centerY - (radius + thickness/2) * Math.sin(120 * Math.PI / 180)} A ${radius + thickness/2} ${radius + thickness/2} 0 0 1 ${centerX + (radius + thickness/2) * Math.cos(120 * Math.PI / 180)} ${centerY - (radius + thickness/2) * Math.sin(120 * Math.PI / 180)}`}
            fill="none"
            stroke="#ffb300"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="2 15"
          />
          
          {/* Tick marks - Green (66-100) */}
          <path
            d={`M ${centerX + (radius + thickness/2) * Math.cos(120 * Math.PI / 180)} ${centerY - (radius + thickness/2) * Math.sin(120 * Math.PI / 180)} A ${radius + thickness/2} ${radius + thickness/2} 0 0 1 ${centerX + radius + thickness/2} ${centerY}`}
            fill="none"
            stroke="#4caf50"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="2 15"
          />
        </svg>
      </SvgContainer>
      
      <DigitalDisplay size={size} valueSize={valueSize}>
        {Math.round(currentValue)}
      </DigitalDisplay>
      
      {label && <GaugeLabel labelSize={labelSize}>{label}</GaugeLabel>}
    </GaugeContainer>
  );
};

export default RadialGauge;
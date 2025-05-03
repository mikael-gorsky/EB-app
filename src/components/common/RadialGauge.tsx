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
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 5px;
  backdrop-filter: blur(2px);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

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
  thickness = 10,
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
  
  // Calculate tick marks
  const ticks = [];
  const tickCount = 10; // Number of ticks
  
  for (let i = 0; i <= tickCount; i++) {
    const tickAngle = startAngle + (i / tickCount) * 180;
    const tickRad = (tickAngle * Math.PI) / 180;
    
    const innerRadius = radius - thickness / 2;
    const outerRadius = radius + thickness / 2 + (i % 5 === 0 ? 4 : 2); // Longer ticks for major marks
    
    const innerX = centerX + innerRadius * Math.cos(tickRad);
    const innerY = centerY + innerRadius * Math.sin(tickRad);
    const outerX = centerX + outerRadius * Math.cos(tickRad);
    const outerY = centerY + outerRadius * Math.sin(tickRad);
    
    ticks.push({ innerX, innerY, outerX, outerY });
  }
  
  // Determine color based on value (gradient from red to green)
  const getColor = () => {
    if (normalizedValue <= 0.33) {
      return '#e53935'; // Red for low values
    } else if (normalizedValue <= 0.66) {
      return '#ffb300'; // Yellow for medium values
    } else {
      return color; // Theme color for high values
    }
  };
  
  const gaugeColor = getColor();
  
  // Calculate needle position
  const needleAngleRad = ((startAngle + angle) * Math.PI) / 180;
  const needleLength = radius - 5;
  const needleX = centerX + needleLength * Math.cos(needleAngleRad);
  const needleY = centerY + needleLength * Math.sin(needleAngleRad);
  
  return (
    <GaugeContainer size={size}>
      <SvgContainer size={size}>
        <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} overflow="visible">
          {/* Background Arc */}
          <path
            d={`M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${size} ${centerY}`}
            fill="none"
            stroke={backgroundColor}
            strokeWidth={thickness}
            strokeLinecap="round"
          />
          
          {/* Value Arc */}
          <path
            d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`}
            fill="none"
            stroke={gaugeColor}
            strokeWidth={thickness}
            strokeLinecap="round"
          />
          
          {/* Tick Marks */}
          {ticks.map((tick, index) => (
            <line
              key={index}
              x1={tick.innerX}
              y1={tick.innerY}
              x2={tick.outerX}
              y2={tick.outerY}
              stroke="#888"
              strokeWidth={index % 5 === 0 ? 2 : 1}
              opacity={0.6}
            />
          ))}
          
          {/* Needle */}
          <line
            x1={centerX}
            y1={centerY}
            x2={needleX}
            y2={needleY}
            stroke="#333"
            strokeWidth={2}
            strokeLinecap="round"
          />
          
          {/* Needle Center */}
          <circle
            cx={centerX}
            cy={centerY}
            r={5}
            fill="#333"
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
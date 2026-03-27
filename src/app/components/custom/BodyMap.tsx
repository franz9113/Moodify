import React from 'react';

// Precise percentage-based coordinates for the realistic silhouette
const BODY_ZONES = [
  { id: 'head', label: 'Head', top: '2%', left: '42%', width: '16%', height: '14%' },
  { id: 'chest', label: 'Chest', top: '21%', left: '38%', width: '24%', height: '15%' },
  { id: 'stomach', label: 'Stomach', top: '37%', left: '40%', width: '20%', height: '12%' },
  { id: 'left-arm-upper', label: 'L Upper Arm', top: '22%', left: '28%', width: '9%', height: '18%' },
  { id: 'right-arm-upper', label: 'R Upper Arm', top: '22%', left: '63%', width: '9%', height: '18%' },
  { id: 'left-forearm', label: 'L Forearm', top: '41%', left: '23%', width: '8%', height: '15%' },
  { id: 'right-forearm', label: 'R Forearm', top: '41%', left: '69%', width: '8%', height: '15%' },
  { id: 'left-hand', label: 'L Hand', top: '57%', left: '19%', width: '10%', height: '10%' },
  { id: 'right-hand', label: 'R Hand', top: '57%', left: '71%', width: '10%', height: '10%' },
  { id: 'left-leg-upper', label: 'L Thigh', top: '55%', left: '36%', width: '13%', height: '20%' },
  { id: 'right-leg-upper', label: 'R Thigh', top: '55%', left: '51%', width: '13%', height: '20%' },
  { id: 'left-foot', label: 'L Foot', top: '90%', left: '37%', width: '10%', height: '8%' },
  { id: 'right-foot', label: 'R Foot', top: '90%', left: '53%', width: '10%', height: '8%' },
];

interface BodyMapProps {
  onSelect: (part: string) => void;
  selectedParts: string[];
}

export default function BodyMap({ onSelect, selectedParts }: BodyMapProps) {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-[2/3] bg-transparent">
      {/* 1. The Realistic Base Image */}
      <img 
        src="/body-silhouette.jpg" 
        alt="Realistic Body Map" 
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      />

      {/* 2. Transparent Interaction Layer */}
      <div className="absolute inset-0">
        {BODY_ZONES.map((zone) => {
          const isSelected = selectedParts.includes(zone.id);
          return (
            <button
              key={zone.id}
              onClick={() => onSelect(zone.id)}
              title={zone.label}
              className={`absolute transition-all duration-200 rounded-sm ${
                isSelected 
                  ? 'bg-blue-500/30 border-2 border-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]' 
                  : 'bg-transparent hover:bg-white/10'
              }`}
              style={{
                top: zone.top,
                left: zone.left,
                width: zone.width,
                height: zone.height,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
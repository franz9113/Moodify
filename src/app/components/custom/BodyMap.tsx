import React from 'react';

// Refined SVG paths for soft, organic curves (based on your input image shape)
const BODY_ZONES = [
  // HEAD (Updated for curved jaw and skull)
  // 'd' defines a rounded skull (arc 12,12) and tapering jawline (C commands)
  { id: 'head', label: 'Head', d: 'M50,2c-6.6,0-12,5.4-12,12c0,3.3,1.3,6.3,3.5,8.5l0.5,0.5c0.6,0.6,1.4,1,2.3,1.3l2,0.8l0.7,2.2h6l0.7-2.2l2-0.8c0.9-0.3,1.7-0.7,2.3-1.3l0.5-0.5c2.2-2.2,3.5-5.2,3.5-8.5C62,7.4,56.6,2,50,2z' },
  // NECK
  { id: 'neck', label: 'Neck', d: 'M46,24h8l1,3h-10z' },
  // TORSO
  { id: 'chest', label: 'Chest', d: 'M35,28h30l2,10l-5,5H38l-5-5L35,28z' },
  { id: 'stomach', label: 'Stomach', d: 'M37,44h26l-3,10H40L37,44z' },
  // ARMS & HANDS (Aligned & separated)
  { id: 'l_arm', label: 'L Arm', d: 'M33,29l-8,2l-5,20l5,2l8-18z' },
  { id: 'r_arm', label: 'R Arm', d: 'M67,29l8,2l5,20l-5,2l-8-18z' },
  { id: 'l_hand', label: 'L Hand', d: 'M20,49l-3,8l5,2l4-8z' }, 
  { id: 'r_hand', label: 'R Hand', d: 'M80,49l3,8l-5,2l-4-8z' },
  // LEGS & FEET (Aligned and curved)
  { id: 'l_quad', label: 'L Quad', d: 'M38,56h11v20h-8L38,56z' },
  { id: 'r_quad', label: 'R Quad', d: 'M51,56h11l-2,20h-9V56z' },
  { id: 'l_calf', label: 'L Calf', d: 'M40,77h8v15h-8V77z' },
  { id: 'r_calf', label: 'R Calf', d: 'M52,77h8v15h-8V77z' },
  { id: 'l_foot', label: 'L Foot', d: 'M39,94h10l1,5h-11z' },
  { id: 'r_foot', label: 'R Foot', d: 'M51,94h10l-1,5h-11z' },
];

interface BodyMapProps {
  onSelect: (partId: string) => void;
  selectedParts: string[];
}

export default function BodyMap({ onSelect, selectedParts }: BodyMapProps) {
  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      {/* 1. The SVG Silhouette Container */}
      <div className="relative w-full aspect-[3/4] rounded-3xl p-6 shadow-xl border border-neutral-100 overflow-hidden">
        
        {/* 2. Interactive SVG Paths */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full drop-shadow-sm"
        >
          {BODY_ZONES.map((zone) => {
            const isSelected = selectedParts.includes(zone.id);
            
            return (
              <path
                key={zone.id}
                d={zone.d}
                onClick={() => onSelect(zone.id)}
                className={`transition-all duration-300 cursor-pointer stroke-[0.5]
                  ${isSelected 
                    ? 'fill-yellow-400 stroke-yellow-600 shadow-md' // Selected: Yellow/Gold glow
                    : 'fill-neutral-50 stroke-neutral-200 hover:fill-neutral-100' // Smooth gray hover
                  }`}
              >
                {/* Visual tooltip on hover */}
                <title>{zone.label}</title>
              </path>
            );
          })}
        </svg>

        {/* Selected Counter Overlay (Optional but professional) */}
        {selectedParts.length > 0 && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-[10px] font-bold px-2 py-1 rounded-full text-yellow-900 animate-fade-in shadow-md">
            {selectedParts.length}
          </div>
        )}
      </div>
      
      {/* Action Text */}
      <p className="mt-4 text-[12px] text-neutral-400 italic">
        {selectedParts.length > 0 ? "Selection Updated" : "Tap body parts to record sensations"}
      </p>
    </div>
  );
}
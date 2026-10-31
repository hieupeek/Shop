import React from 'react';

type IconProps = {
  className?: string;
};

// 1. Váy / Đầm (Sweetheart neckline, straps, flared skirt exactly like reference image)
export function DressIcon({ className = 'w-16 h-16' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Straps */}
      <rect x="36" y="16" width="3.5" height="15" rx="1" />
      <rect x="60.5" y="16" width="3.5" height="15" rx="1" />
      
      {/* Dress body: sweetheart bust -> fitted waist -> flared skirt with scalloped hem */}
      <path d="
        M 34 30
        C 37 32, 42 34, 46 32
        C 48 31, 50 28, 50 28
        C 50 28, 52 31, 54 32
        C 58 34, 63 32, 66 30
        C 68 36, 68 44, 62 53
        C 60 56, 59 58, 59 60
        L 77 86
        C 74 88, 68 89, 62 88
        C 57 87, 53 87, 50 88
        C 47 87, 43 87, 38 88
        C 32 89, 26 88, 23 86
        L 41 60
        C 41 58, 40 56, 38 53
        C 32 44, 32 36, 34 30
        Z
      " />
    </svg>
  );
}

// 2. Áo (Classic Crewneck T-Shirt silhouette matching reference)
export function TshirtIcon({ className = 'w-16 h-16' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Body & Sleeves */}
      <path d="
        M 38 22
        C 42 27, 58 27, 62 22
        L 83 31
        C 86 32, 87 36, 85 39
        L 76 53
        C 74 56, 70 56, 67 53
        L 66 48
        L 66 82
        C 66 84, 64 86, 62 86
        L 38 86
        C 36 86, 34 84, 34 82
        L 34 48
        L 33 53
        C 30 56, 26 56, 24 53
        L 15 39
        C 13 36, 14 32, 17 31
        Z
      " />
      {/* Inner collar arc for depth */}
      <path d="M 40 22 C 44 26, 56 26, 60 22" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// 3. Chân váy (Flared skater / pleated mini skirt with waistband matching reference)
export function SkirtIcon({ className = 'w-16 h-16' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Waistband */}
      <rect x="36" y="32" width="28" height="6" rx="1.5" />
      
      {/* Flared skirt with wave hem */}
      <path d="
        M 38 41
        L 24 74
        C 28 77, 34 78, 40 76
        C 45 74, 48 77, 50 77
        C 52 77, 55 74, 60 76
        C 66 78, 72 77, 76 74
        L 62 41
        Z
      " />
    </svg>
  );
}

// 4. Quần (Slim / straight trousers silhouette matching reference)
export function PantsIcon({ className = 'w-16 h-16' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="
        M 35 22
        L 65 22
        C 67 22, 68 23, 68 25
        L 69 36
        C 69 44, 68 54, 67 68
        L 65 88
        C 65 90, 64 91, 62 91
        L 54 91
        C 52 91, 51 90, 51 88
        L 52 50
        C 52 48, 48 48, 48 50
        L 49 88
        C 49 90, 48 91, 46 91
        L 38 91
        C 36 91, 35 90, 35 88
        L 33 68
        C 32 54, 31 44, 31 36
        L 32 25
        C 32 23, 33 22, 35 22
        Z
      " />
    </svg>
  );
}

// 5. Đồ lót / Đồ ngủ (Bandeau top + bottom brief set matching reference)
export function LingerieIcon({ className = 'w-16 h-16' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Strapless bandeau / sweetheart bra */}
      <path d="
        M 30 30
        C 32 25, 40 24, 46 29
        C 48 31, 50 32, 50 32
        C 50 32, 52 31, 54 29
        C 60 24, 68 25, 70 30
        L 70 41
        C 65 44, 57 44, 50 40
        C 43 44, 35 44, 30 41
        Z
      " />
      
      {/* Bottom bikini / sleepwear shorts */}
      <path d="
        M 31 56
        L 69 56
        C 69 57, 68 62, 64 68
        C 60 73, 56 75, 55 76
        L 45 76
        C 44 75, 40 73, 36 68
        C 32 62, 31 57, 31 56
        Z
      " />
    </svg>
  );
}

// 6. Áo Polo Nam (Polo shirt with collar & placket)
export function PoloIcon({ className = 'w-16 h-16' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Body & Sleeves */}
      <path d="
        M 38 23
        L 62 23
        L 83 31
        C 86 32, 87 36, 85 39
        L 76 53
        C 74 56, 70 56, 67 53
        L 66 48
        L 66 82
        C 66 84, 64 86, 62 86
        L 38 86
        C 36 86, 34 84, 34 82
        L 34 48
        L 33 53
        C 30 56, 26 56, 24 53
        L 15 39
        C 13 36, 14 32, 17 31
        Z
      " />
      {/* Polo Collar */}
      <polygon points="36,23 45,36 50,28 38,23" fill="white" />
      <polygon points="64,23 55,36 50,28 62,23" fill="white" />
      <path d="M 50 28 L 50 44" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 7. Áo Sơ Mi Nam (Dress Shirt with collar and button line)
export function ShirtIcon({ className = 'w-16 h-16' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="
        M 38 22
        L 62 22
        L 83 31
        C 86 32, 87 36, 85 39
        L 76 53
        C 74 56, 70 56, 67 53
        L 66 48
        L 66 82
        C 66 84, 64 86, 62 86
        L 38 86
        C 36 86, 34 84, 34 82
        L 34 48
        L 33 53
        C 30 56, 26 56, 24 53
        L 15 39
        C 13 36, 14 32, 17 31
        Z
      " />
      {/* Sharp shirt collar */}
      <polygon points="36,22 46,34 50,26 38,22" fill="white" />
      <polygon points="64,22 54,34 50,26 62,22" fill="white" />
      {/* Placket and buttons */}
      <line x1="50" y1="26" x2="50" y2="82" stroke="white" strokeWidth="1.5" />
      <circle cx="50" cy="40" r="1.5" fill="black" />
      <circle cx="50" cy="52" r="1.5" fill="black" />
      <circle cx="50" cy="64" r="1.5" fill="black" />
    </svg>
  );
}

// 8. Quần Shorts Nam (Casual shorts)
export function ShortsIcon({ className = 'w-16 h-16' }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="
        M 31 30
        L 69 30
        C 71 30, 72 31, 72 33
        L 71 45
        L 69 70
        C 69 72, 67 74, 65 74
        L 54 74
        C 52 74, 51 73, 51 71
        L 52 46
        C 52 44, 48 44, 48 46
        L 49 71
        C 49 73, 48 74, 46 74
        L 35 74
        C 33 74, 31 72, 31 70
        L 29 45
        L 28 33
        C 28 31, 29 30, 31 30
        Z
      " />
      {/* Waistband line */}
      <line x1="30" y1="36" x2="70" y2="36" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}

// Helper selector based on slug or name
export function CategoryFashionIcon({ slug, className }: { slug: string; className?: string }) {
  switch (slug) {
    case 'dam-vay':
    case 'vay':
      return <DressIcon className={className} />;
    
    case 'ao-nu':
    case 'ao':
      return <TshirtIcon className={className} />;
    
    case 'chan-vay':
      return <SkirtIcon className={className} />;
      
    case 'quan-nu':
    case 'quan':
    case 'quan-nam':
      return <PantsIcon className={className} />;
      
    case 'set-do-nu':
    case 'do-ngu':
    case 'do-lot':
      return <LingerieIcon className={className} />;
      
    case 'ao-polo-nam':
      return <PoloIcon className={className} />;
      
    case 'ao-so-mi-nam':
      return <ShirtIcon className={className} />;
      
    case 'ao-thun-nam':
      return <TshirtIcon className={className} />;
      
    case 'quan-short-nam':
      return <ShortsIcon className={className} />;
      
    default:
      return <TshirtIcon className={className} />;
  }
}


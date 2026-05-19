export function Icon({ d, size = 22, stroke = 'currentColor', sw = 1.75, fill = 'none' }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke={stroke} strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round"
    >
      {typeof d === 'string' ? <path d={d} /> : d}
    </svg>
  )
}

export const ICONS = {
  search:  <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
  heart:   <path d="M19 14c1.5-1.5 3-3.4 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .7-4.5 2-1.5-1.3-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.1 1.5 4 3 5.5l7 7Z"/>,
  bell:    <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
  pin:     <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>,
  check:   <path d="M5 13l4 4L19 7"/>,
  star:    <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>,
  user:    <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></>,
  home:    <path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2v-9z"/>,
  compass: <><circle cx="12" cy="12" r="10"/><path d="m16 8-2 6-6 2 2-6 6-2z"/></>,
  ticket:  <><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V9z"/><path d="M9 7v10"/></>,
  trophy:  <><path d="M6 9H4a2 2 0 0 1-2-2V5h4M18 9h2a2 2 0 0 0 2-2V5h-4M6 5h12v6a6 6 0 0 1-12 0V5zM12 17v3M9 21h6"/></>,
  chevR:   <path d="m9 6 6 6-6 6"/>,
  chevL:   <path d="m15 6-6 6 6 6"/>,
  share:   <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></>,
  close:   <path d="M18 6 6 18M6 6l12 12"/>,
}

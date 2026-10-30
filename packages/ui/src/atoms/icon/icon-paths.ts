/*
 * Glyph descriptors for the closed system icon set (data only; not exported from the package).
 *
 * Provenance:
 * - The 25 Foundation glyphs (github … chevron-down) are copied verbatim from EGDEV Foundation
 *   `components/Icon/preview.html`, the Lucide-family paths used by egdev.es.
 * - The 20 added glyphs (calendar … info) are copied verbatim from Lucide (ISC), lucide-react
 *   1.55.0, with the mapping grip → grip-vertical, flask → flask-conical, trash → trash-2; the
 *   rest are same-named. Lucide marks several of them as derived from Feather (MIT). See
 *   THIRD_PARTY_NOTICES.md for both notices.
 *
 * All glyphs share the 24×24 viewBox; stroke width, caps and joins come from the Icon root.
 */
import type { IconName } from './types';

export type IconGlyphElement = 'path' | 'circle' | 'rect' | 'line' | 'polyline' | 'polygon';
export type IconGlyph = readonly (readonly [IconGlyphElement, Readonly<Record<string, string>>])[];

export const iconPaths: Readonly<Record<IconName, IconGlyph>> = {
  github: [
    [
      'path',
      {
        d: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4'
      }
    ],
    ['path', { d: 'M9 18c-4.51 2-5-2-7-2' }]
  ],
  youtube: [
    [
      'path',
      {
        d: 'M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17'
      }
    ],
    ['path', { d: 'm10 15 5-3-5-3z' }]
  ],
  twitch: [['path', { d: 'M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7' }]],
  x: [
    ['path', { d: 'M4 4l11.7 16H20L8.3 4z' }],
    ['path', { d: 'M4 20l6.8-6.8' }],
    ['path', { d: 'M13.2 10.8 20 4' }]
  ],
  linkedin: [
    ['path', { d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' }],
    ['rect', { width: '4', height: '12', x: '2', y: '9' }],
    ['circle', { cx: '4', cy: '4', r: '2' }]
  ],
  instagram: [
    ['rect', { width: '20', height: '20', x: '2', y: '2', rx: '5', ry: '5' }],
    ['path', { d: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z' }],
    ['line', { x1: '17.5', x2: '17.51', y1: '6.5', y2: '6.5' }]
  ],
  search: [
    ['circle', { cx: '11', cy: '11', r: '8' }],
    ['path', { d: 'm21 21-4.3-4.3' }]
  ],
  'arrow-right': [
    ['path', { d: 'M5 12h14' }],
    ['path', { d: 'm12 5 7 7-7 7' }]
  ],
  'arrow-up-right': [
    ['path', { d: 'M7 7h10v10' }],
    ['path', { d: 'M7 17 17 7' }]
  ],
  'arrow-down': [
    ['path', { d: 'M12 5v14' }],
    ['path', { d: 'm19 12-7 7-7-7' }]
  ],
  play: [['polygon', { points: '6 3 20 12 6 21 6 3' }]],
  users: [
    ['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }],
    ['circle', { cx: '9', cy: '7', r: '4' }],
    ['path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }],
    ['path', { d: 'M16 3.13a4 4 0 0 1 0 7.75' }]
  ],
  menu: [
    ['path', { d: 'M4 6h16' }],
    ['path', { d: 'M4 12h16' }],
    ['path', { d: 'M4 18h16' }]
  ],
  radio: [
    ['path', { d: 'M4.9 19.1C1 15.2 1 8.8 4.9 4.9' }],
    ['path', { d: 'M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5' }],
    ['circle', { cx: '12', cy: '12', r: '2' }],
    ['path', { d: 'M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5' }],
    ['path', { d: 'M19.1 4.9C23 8.8 23 15.1 19.1 19' }]
  ],
  terminal: [
    ['path', { d: 'm4 17 6-6-6-6' }],
    ['path', { d: 'M12 19h8' }]
  ],
  hammer: [
    ['path', { d: 'm15 12-8.373 8.373a1 1 0 1 1-3-3L12 9' }],
    ['path', { d: 'm18 15 4-4' }],
    [
      'path',
      {
        d: 'm21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5'
      }
    ]
  ],
  compass: [
    ['circle', { cx: '12', cy: '12', r: '10' }],
    ['path', { d: 'm16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z' }]
  ],
  alert: [
    ['path', { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3' }],
    ['path', { d: 'M12 9v4' }],
    ['path', { d: 'M12 17h.01' }]
  ],
  close: [
    ['path', { d: 'M18 6 6 18' }],
    ['path', { d: 'm6 6 12 12' }]
  ],
  user: [
    ['path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' }],
    ['circle', { cx: '12', cy: '7', r: '4' }]
  ],
  bookmark: [['path', { d: 'm19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z' }]],
  bell: [
    ['path', { d: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' }],
    ['path', { d: 'M10.3 21a1.94 1.94 0 0 0 3.4 0' }]
  ],
  settings: [
    [
      'path',
      {
        d: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z'
      }
    ],
    ['circle', { cx: '12', cy: '12', r: '3' }]
  ],
  'log-out': [
    ['path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }],
    ['polyline', { points: '16 17 21 12 16 7' }],
    ['line', { x1: '21', x2: '9', y1: '12', y2: '12' }]
  ],
  'chevron-down': [['path', { d: 'm6 9 6 6 6-6' }]],
  calendar: [
    ['path', { d: 'M8 2v3' }],
    ['path', { d: 'M16 2v3' }],
    ['rect', { x: '3', y: '3', width: '18', height: '18', rx: '2' }],
    ['path', { d: 'M3 9h18' }]
  ],
  inbox: [
    ['polyline', { points: '22 12 16 12 14 15 10 15 8 12 2 12' }],
    [
      'path',
      {
        d: 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z'
      }
    ]
  ],
  lightbulb: [
    [
      'path',
      { d: 'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5' }
    ],
    ['path', { d: 'M9 18h6' }],
    ['path', { d: 'M10 22h4' }]
  ],
  shuffle: [
    ['path', { d: 'm18 14 4 4-4 4' }],
    ['path', { d: 'm18 2 4 4-4 4' }],
    ['path', { d: 'M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22' }],
    ['path', { d: 'M2 6h1.972a4 4 0 0 1 3.6 2.2' }],
    ['path', { d: 'M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45' }]
  ],
  pause: [
    ['rect', { x: '14', y: '3', width: '5', height: '18', rx: '1' }],
    ['rect', { x: '5', y: '3', width: '5', height: '18', rx: '1' }]
  ],
  pencil: [
    [
      'path',
      {
        d: 'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z'
      }
    ],
    ['path', { d: 'm15 5 4 4' }]
  ],
  send: [
    [
      'path',
      {
        d: 'M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z'
      }
    ],
    ['path', { d: 'm21.854 2.147-10.94 10.939' }]
  ],
  grip: [
    ['circle', { cx: '9', cy: '12', r: '1' }],
    ['circle', { cx: '9', cy: '5', r: '1' }],
    ['circle', { cx: '9', cy: '19', r: '1' }],
    ['circle', { cx: '15', cy: '12', r: '1' }],
    ['circle', { cx: '15', cy: '5', r: '1' }],
    ['circle', { cx: '15', cy: '19', r: '1' }]
  ],
  upload: [
    ['path', { d: 'M12 3v12' }],
    ['path', { d: 'm17 8-5-5-5 5' }],
    ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }]
  ],
  flask: [
    [
      'path',
      { d: 'M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2' }
    ],
    ['path', { d: 'M6.453 15h11.094' }],
    ['path', { d: 'M8.5 2h7' }]
  ],
  plug: [
    ['path', { d: 'M12 22v-5' }],
    ['path', { d: 'M15 8V2' }],
    ['path', { d: 'M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z' }],
    ['path', { d: 'M9 8V2' }]
  ],
  bot: [
    ['path', { d: 'M12 8V4H8' }],
    ['rect', { width: '16', height: '12', x: '4', y: '8', rx: '2' }],
    ['path', { d: 'M2 14h2' }],
    ['path', { d: 'M20 14h2' }],
    ['path', { d: 'M15 13v2' }],
    ['path', { d: 'M9 13v2' }]
  ],
  trash: [
    ['path', { d: 'M10 11v6' }],
    ['path', { d: 'M14 11v6' }],
    ['path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' }],
    ['path', { d: 'M3 6h18' }],
    ['path', { d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }]
  ],
  copy: [
    ['rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' }],
    ['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' }]
  ],
  check: [['path', { d: 'M20 6 9 17l-5-5' }]],
  minus: [['path', { d: 'M5 12h14' }]],
  plus: [
    ['path', { d: 'M5 12h14' }],
    ['path', { d: 'M12 5v14' }]
  ],
  'circle-alert': [
    ['circle', { cx: '12', cy: '12', r: '10' }],
    ['line', { x1: '12', x2: '12', y1: '8', y2: '12' }],
    ['line', { x1: '12', x2: '12.01', y1: '16', y2: '16' }]
  ],
  'circle-check': [
    ['circle', { cx: '12', cy: '12', r: '10' }],
    ['path', { d: 'm16 9-5.5 5.5L8 12' }]
  ],
  info: [
    ['circle', { cx: '12', cy: '12', r: '10' }],
    ['path', { d: 'M12 16v-4' }],
    ['path', { d: 'M12 8h.01' }]
  ]
};

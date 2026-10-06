// Single source for design tokens (docs/design-tokens.md). tailwind.config.js reads this;
// JS-only props (tab bar, SVG, StatusBar) import it directly.
module.exports = {
  colors: {
    bg: '#1F1F1F',
    surface: '#2A2A2A',
    'surface-2': '#343434',
    line: '#3D3D3D',
    outline: '#5A5A5A',
    text: '#F2F2F2',
    muted: '#A6A6A6',
    faint: '#8C8C8C',
    ink: '#1F1F1F',
    ok: '#A8E39A',
    bad: '#F08A80',
    prev: '#5C5C5C',
  },
};

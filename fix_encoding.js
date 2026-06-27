const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Fix corrupted UTF-8 sequences (mojibake)
  content = content.replace(/â€“/g, '—');
  content = content.replace(/â€”/g, '—');
  content = content.replace(/â€"/g, '—');
  content = content.replace(/â€œ/g, '“');
  content = content.replace(/â€/g, '”');
  content = content.replace(/â€™/g, '’');
  content = content.replace(/360Â°/g, '360°');
  content = content.replace(/Â·/g, '·');
  content = content.replace(/âœ¦/g, '✦');
  content = content.replace(/â­ /g, '⭐');
  content = content.replace(/ðŸ †/g, '🏆');
  content = content.replace(/Ã©/g, 'é');
  content = content.replace(/â€¢/g, '•');
  
  // Also fix any other common ones
  content = content.replace(/The BauphilonÃ©/g, 'The Bauphiloné');
  
  fs.writeFileSync(f, content, 'utf8');
});
console.log('Encoding fixed.');

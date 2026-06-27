const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Fix emails
  content = content.replace(/reservations@royalhorizon\.com/g, 'reservations@TheBauphiloné.com');
  content = content.replace(/concierge@royalhorizon\.com/g, 'concierge@TheBauphiloné.com');
  
  // Fix corrupted characters from previous PowerShell script
  content = content.replace(/âœ¦/g, '✦');
  content = content.replace(/â­ /g, '⭐');
  content = content.replace(/ðŸ †/g, '🏆');
  content = content.replace(/Â·/g, '·');
  content = content.replace(/Ã©/g, 'é');
  content = content.replace(/â€¢/g, '•'); // bullets in password placeholder
  content = content.replace(/â€"/g, '—'); // em dash
  content = content.replace(/The BauphilonÃ©/g, 'The Bauphiloné');
  
  fs.writeFileSync(f, content, 'utf8');
});
console.log('Done');

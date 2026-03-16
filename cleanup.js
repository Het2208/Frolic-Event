const fs = require('fs');
const path = require('path');
const cssDir = './frolic/src/CSS';

const filesToClean = [
  'AdminDashboard.css',
  'InstituteListPage.css',
  'DepartmentListPage.css',
  'EventListPage.css',
  'ParticipantListPage.css',
  'GroupListPage.css',
  'WinnerDisplaypage.css'
];

filesToClean.forEach(file => {
  const filePath = path.join(cssDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove blocks
    // This simple regex won't handle nested braces like media queries
    // But these files likely just have flat definitions for these classes.
    const patterns = [
        /\.sidebar\s*\{[^}]+\}/g,
        /\.sidebar\.collapsed\s*\{[^}]+\}/g,
        /\.sidebar-header\s*\{[^}]+\}/g,
        /\.navbar-brand-text\s*\{[^}]+\}/g,
        /\.main-content\s*\{[^}]+\}/g,
        /\.main-content\.expanded\s*\{[^}]+\}/g,
        /\.user-profile\s*\{[^}]+\}/g,
        /\.profile-container\s*\{[^}]+\}/g,
        /\.nav-link\s*\{[^}]+\}/g,
        /\.nav-link:hover\s*\{[^}]+\}/g,
        /\.nav-link\.active\s*\{[^}]+\}/g,
        /\[data-theme=[\"']?dark[\"']?\]\s*\{[^}]+\}/g,
        /\.theme-switch-wrapper\s*\{[^}]+\}/g,
        /\.theme-switch\s*\{[^}]+\}/g,
        /\.theme-switch input\s*\{[^}]+\}/g,
        /\.slider\s*\{[^}]+\}/g,
        /\.slider:before\s*\{[^}]+\}/g,
        /input:checked \+ \.slider\s*\{[^}]+\}/g,
        /input:checked \+ \.slider:before\s*\{[^}]+\}/g,
        /\.mode-icon\s*\{[^}]+\}/g
    ];

    patterns.forEach(regex => {
        content = content.replace(regex, '');
    });
    
    // Replace overflow: hidden to overflow: visible globally to fix scrolling issues
    content = content.replace(/overflow:\s*hidden;?/g, 'overflow: visible;');
    // Also height: 100vh -> min-height: 100vh to fix scroll clipping if any
    content = content.replace(/height:\s*100vh;?/g, 'min-height: 100vh;');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Cleaned:', file);
  } else {
    console.log('Not found:', file);
  }
});

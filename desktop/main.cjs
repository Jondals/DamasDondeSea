const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  const win = new BrowserWindow({ width: 1280, height: 800, minWidth: 800, minHeight: 600, title: 'Damas Donde Sea', icon: path.join(__dirname, '..', 'build', 'icon.png'), autoHideMenuBar: true });
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  win.webContents.on('before-input-event', (_, i) => {
    if (i.type === 'keyDown' && i.key === 'F11') win.setFullScreen(!win.isFullScreen());
  });
});
app.on('window-all-closed', () => app.quit());

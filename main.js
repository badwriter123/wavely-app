// const { app, BrowserWindow, globalShortcut } = require('electron');
// const path = require('path');
// const moveStep = 100; // pixels per arrow key press

// let win;
// let isVisible = true;



// function createWindow() {
//     win = new BrowserWindow({
//         width: 600,
//         height: 800,
//         transparent: true,
//         frame: false,
//         alwaysOnTop: true,
//         vibrancy: 'ultra-dark',
//         webPreferences: {
//           preload: path.join(__dirname, 'preload.js'),
//           contextIsolation: true,
//           nodeIntegration: false
//         }
//       });
// }

// app.whenReady().then(() => {
//   createWindow();

//   globalShortcut.register('CommandOrControl+\\', () => {
//     isVisible = !isVisible;
//     if (isVisible) {
//       win.show();
//     } else {
//       win.hide();
//     }
//   });
  

//   // 🔁 Cmd + \ to toggle visibility
//   globalShortcut.register('CommandOrControl+Up', () => {
//     const { x, y } = win.getBounds();
//     win.setBounds({ x, y: y - moveStep, width: 600, height: 800 });
//   });
  
//   globalShortcut.register('CommandOrControl+Down', () => {
//     const { x, y } = win.getBounds();
//     win.setBounds({ x, y: y + moveStep, width: 600, height: 800 });
//   });
  
//   globalShortcut.register('CommandOrControl+Left', () => {
//     const { x, y } = win.getBounds();
//     win.setBounds({ x: x - moveStep, y, width: 600, height: 800 });
//   });
  
//   globalShortcut.register('CommandOrControl+Right', () => {
//     const { x, y } = win.getBounds();
//     win.setBounds({ x: x + moveStep, y, width: 600, height: 800 });
//   });
  
// });


const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
const moveStep = 100; // pixels per arrow key press

let win;
let isVisible = true;

function createWindow() {
  console.log("📦 Creating Electron window...");

  win = new BrowserWindow({
    width: 600,
    height: 500,
    x: 100, // ensure it's on screen
    y: 100,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    vibrancy: 'ultra-dark',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');

  win.once('ready-to-show', () => {
    win.show();
  });

//   win.webContents.openDevTools(); // You can remove this once stable
}

app.whenReady().then(() => {
  console.log("⚡ Electron app is ready.");
  createWindow();

  // Toggle visibility
  globalShortcut.register('CommandOrControl+\\', () => {
    isVisible = !isVisible;
    if (isVisible) {
      win.show();
    } else {
      win.hide();
    }
  });

  // Movement hotkeys
  // Arrow key movement
globalShortcut.register('CommandOrControl+Up', () => {
    const { x, y, width, height } = win.getBounds();
    win.setBounds({ x, y: y - moveStep, width, height });
  });
  
  globalShortcut.register('CommandOrControl+Down', () => {
    const { x, y, width, height } = win.getBounds();
    win.setBounds({ x, y: y + moveStep, width, height });
  });
  
  globalShortcut.register('CommandOrControl+Left', () => {
    const { x, y, width, height } = win.getBounds();
    win.setBounds({ x: x - moveStep, y, width, height });
  });
  
  globalShortcut.register('CommandOrControl+Right', () => {
    const { x, y, width, height } = win.getBounds();
    win.setBounds({ x: x + moveStep, y, width, height });
  });
  
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

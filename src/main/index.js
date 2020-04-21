import { app, BrowserWindow, Menu, shell } from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer';
import { format } from 'url';
const path = require('path');

const { NODE_ENV, ELECTRON_WEBPACK_WDS_PORT } = process.env;

const basePath =
  NODE_ENV !== 'production'
    ? path.join(path.resolve(__dirname), '../..')
    : app.getAppPath();

// debug
require('electron-debug')({ showDevTools: true, enabled: true });
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

let window;

const mainMenuTemplate = [
  {
    label: 'Dev',
    submenu: [
      {
        label: 'DevTools',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
        accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I'
      },
      {
        label: 'Restart',
        role: 'reload'
      }
    ]
  }
];

app.on('ready', () => {
  installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log(`Added Extension:  ${name}`))
    .catch(err => console.log('An error occurred: ', err));

  window = new BrowserWindow({
    minWidth: 640,
    minHeight: 480,
    title: 'React Dropzone Test',
    webPreferences: { nodeIntegration: true }
  });

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  const emptyMenu = Menu.buildFromTemplate([]);

  if (NODE_ENV !== 'production') {
    window.loadURL(`http://localhost:${ELECTRON_WEBPACK_WDS_PORT}`);
    window.setMenu(mainMenu);
    Menu.setApplicationMenu(mainMenu);
  } else {
    window.loadURL(
      format({
        pathname: path.join(basePath, 'index.html'),
        protocol: 'file',
        slashes: true
      })
    );
    window.setMenu(null);
    if (process.platform === 'darwin') Menu.setApplicationMenu(emptyMenu);
  }
  //debug
  // window.webContents.openDevTools();

  window.once('ready-to-show', window.show);
  window.maximize();

  window.on('closed', app.quit);

  window.webContents.on('new-window', (e, url) => {
    e.preventDefault();
    shell.openExternal(url);
  });
});

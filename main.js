const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const createStore = require('./store')

let win

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'icons', 'icon.png'),
    webPreferences: {
      preload: path.join(app.getAppPath(), 'preload.js'), // Use the preload script
      contextIsolation: true, // Ensure contextIsolation is enabled
      enableRemoteModule: false, // Disable remote module
    },
  })

  win.loadFile('index.html')
}

ipcMain.handle('get-passwords', async () => {
  const store = await createStore()
  return store.get('passwords')
})

ipcMain.on('save-password', async (event, password) => {
  const store = await createStore()
  let passwords = store.get('passwords')

  // Add the new password and maintain a maximum of 10 passwords
  passwords.unshift(password)
  if (passwords.length > 10) {
    passwords = passwords.slice(0, 10)
  }

  store.set('passwords', passwords)
})

ipcMain.on('clear-passwords', async () => {
  const store = await createStore()
  store.set('passwords', [])
})

app.on('ready', () => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

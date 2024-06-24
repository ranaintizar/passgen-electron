const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getPasswords: () => ipcRenderer.invoke('get-passwords'),
  savePassword: password => ipcRenderer.send('save-password', password),
  clearPasswords: () => ipcRenderer.send('clear-passwords'),
})

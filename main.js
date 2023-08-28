const { app, BrowserWindow } = require("electron");
const path = require("path");

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "icons", "icon.png"),
  });

  win.loadFile("index.html");
};

app.whenReady().then(createWindow);

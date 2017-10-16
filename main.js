const { app, BrowserWindow, ipcMain, Tray, nativeImage } = require("electron");
const path = require("path");

const assetsDir = path.join(__dirname, "assets");

let tray = undefined;
let window = undefined;

app.on("ready", () => {
  tray = new Tray("Toggl-logo-16.png");

  tray.on("click", function(event) {
    toggleWindow();
  });

  window = new BrowserWindow({
    width: 625,
    height: 500,
    show: false,
    frame: false,
    resizable: false,
  });

  window.loadURL(`file://${__dirname}/index.html`);

  window.on("blur", () => {
    window.hide();
  });
});

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
};

const showWindow = () => {
  const trayPos = tray.getBounds();
  const windowPos = window.getBounds();
  let x,
    y = 0;
  if (process.platform == "darwin") {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
    y = Math.round(trayPos.y + trayPos.height);
  } else {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
    y = Math.round(trayPos.y + trayPos.height * 10);
  }

  window.setPosition(x, y, false);
  window.show();
  window.focus();
};

ipcMain.on("show-window", () => {
  showWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

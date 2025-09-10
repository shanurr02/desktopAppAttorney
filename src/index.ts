import { app, BrowserWindow, Menu } from "electron";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let mainWindow: BrowserWindow | null = null;

// ✅ Strongest fix for green/black screen
app.disableHardwareAcceleration();
app.commandLine.appendSwitch("disable-gpu");
app.commandLine.appendSwitch("disable-gpu-compositing");

// // ✅ Fix for CSP and network issues in development
// if (process.env.NODE_ENV === 'development') {
//   app.commandLine.appendSwitch("disable-web-security");
//   app.commandLine.appendSwitch("disable-features", "VizDisplayCompositor");
//   app.commandLine.appendSwitch("disable-site-isolation-trials");
//   app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
//   app.commandLine.appendSwitch("disable-features", "CrossSiteDocumentBlockingAlways");
//   app.commandLine.appendSwitch("disable-features", "CrossSiteDocumentBlockingIfIsolating");
//   app.commandLine.appendSwitch("disable-features", "CrossOriginEmbedderPolicy");
//   app.commandLine.appendSwitch("disable-features", "CrossOriginOpenerPolicy");
//   app.commandLine.appendSwitch("disable-features", "CrossOriginEmbedderPolicyCredentialless");
// }

// Squirrel installer shortcut handling (Windows only)
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Case Funders",
    backgroundColor: "#1d1f1f", // ✅ prevents green screen flash
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#1d1f1f",
      symbolColor: "#ffffff",
      height: 42,
    },
    frame: false,
    autoHideMenuBar: true,
    // show: false, // wait until ready
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: process.env.NODE_ENV === 'development' ? false : true,
      allowRunningInsecureContent: process.env.NODE_ENV === 'development',
      experimentalFeatures: process.env.NODE_ENV === 'development',
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // only show when content is ready
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
};

app.on("ready", () => {
  Menu.setApplicationMenu(null);
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

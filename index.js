/*jshint esversion: 6*/

(function() {
  "use strict";

  // Declare imports
  const electron = require('electron');
  const fs = require('fs');
  const {ipcMain, app, BrowserWindow} = electron;
  let settings = {}; 

  // Try to load settings file if one has been created
  try {
    settings = require('./settings.json');
  } catch(err) {
    // Probably no settings file, ignore any errors
  }

  // Dev helper to refresh Electron on changes
  if (process.env.ENVMODE !== "PROD") require('electron-reload')(__dirname);

  // Create the main view of the app
  let mainWindow = null;
  function createWindow() {

    // Create window dimensions, based on saved settings or create a 800x600 window
    // if there are no saved window dimensions
    let winConfig = 
    (settings && 'win' in settings) ? 
    Object.assign(settings.win, { frame: false, show: false }) : 
    { width: 800, height: 600, frame: false, show: false };

    mainWindow = new BrowserWindow(winConfig);
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    // Once window has fully loaded, show window and set its position to the last open 
    // x, y coordinates, if none are saved, open in the middle of the monitor
    mainWindow.once('ready-to-show', () => {
      if ('win' in settings && 'x' in settings.win) {
        mainWindow.setPositon(settings.win.x, settings.win.y);
      }
      mainWindow.show();
    });

    // If window is resized, save new dimensions into settings
    let winResizeTimer;
    mainWindow.on('resize', (event, cmd) => {
        clearTimeout(winResizeTimer);
        winResizeTimer = setTimeout(() => {
            let winSize = mainWindow.getSize();
            settings.win = {
               height: winSize[1],
               width: winSize[0] 
            };
            saveSettings();
        }, 1000);
    });

    // If window moves, save new position into settings
    let winMoveTimer;
    mainWindow.on('move', (event, cmd) => {
        clearTimeout(winMoveTimer);
        winMoveTimer = setTimeout(function() {
            let winPos = mainWindow.getPosition();
            settings.win = Object.assign({}, settings.win, {x: winPos[0], y: winPos[1] });
            saveSettings();
        }, 1000);
    });

    // Dereference the mainWindow if it is closed
    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }

  // Create display once app is loaded
  app.on('ready', createWindow);

  // Quit the application when the windows are closed
  app.on('window-all-closed', () => {
    // Only quit the application on OS X if the user hits CMD+Q
    if (process.platform !== 'darwin') app.quit();
  });

  // If windows are closed and app is still running, reopen main window
  app.on('activate', () => {
    if (mainWindow === null) createWindow();
  });


  // Save settings helper to write to the settings.json file
  function saveSettings() {
    let setString = JSON.stringify(settings, null, 4);
    fs.writeFile('settings.json', setString, (err) => {
        if (err) console.log("ERR: Error saving settings " + err);
    });
  }

}());
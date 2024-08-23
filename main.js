const { exec } = require('child_process');
const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;
let serverProcess = null; // To store the server process

// Function to stop the existing server process
function stopServer() {
    return new Promise((resolve, reject) => {
        if (serverProcess) {
            // For Windows: use taskkill to stop the server and its child processes
            const killCommand = process.platform === 'win32'
                ? `taskkill /pid ${serverProcess.pid} /T /F`
                : `kill -9 ${serverProcess.pid}`;

            exec(killCommand, (err, stdout, stderr) => {
                if (err) {
                    console.error(`Error stopping server: ${stderr}`);
                    return reject(err);
                }
                console.log(`Server stopped successfully. ${stdout}`);
                serverProcess = null;
                resolve();
            });
        } else {
            resolve(); // No server process to stop
        }
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    mainWindow.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
    // Start the Express server
    serverProcess = exec('node xml-fixer-backend/server.js', (err, stdout, stderr) => {
        if (err) {
            console.error(`Error starting server: ${stderr}`);
            return;
        }
        console.log(stdout);
    });

    // Create the Electron window
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Handle app quit and clean up
app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin') {
        // Stop the server process before quitting the app
        await stopServer();
        app.quit();
    }
});

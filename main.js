require('dotenv').config();

const { exec } = require('child_process');
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let serverProcess = null; // To store the server process
const isDebug = process.env.NODE_ENV === 'development';

// Function to load environment variables from env.json
function loadEnvFromFile() {
    const envFilePath = path.resolve(process.resourcesPath, 'env.json');
    if (fs.existsSync(envFilePath)) {
        const envContent = fs.readFileSync(envFilePath, 'utf8');
        try {
            const envVars = JSON.parse(envContent);
            Object.assign(process.env, envVars);
        } catch (error) {
            console.error('Error parsing env.json:', error);
        }
    } else {
        console.warn('env.json file not found.');
    }
}

// Function to stop the existing server process
function stopServer() {
    return new Promise((resolve, reject) => {
        if (serverProcess) {
            // For Windows: use taskkill to stop the server and its child processes
            const killCommand =
                process.platform === 'win32'
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
    // Load environment variables from env.json if not in debug mode
    if (!isDebug) {
        loadEnvFromFile();
    }

    // Start the Express server
    const serverPath = isDebug ? __dirname : process.resourcesPath;
    const serverScript = path.join(serverPath, 'xml-fixer-backend', 'server.js');

    serverProcess = exec(
        `node ${serverScript}`,
        { env: { ...process.env } },
        (err, stdout, stderr) => {
            if (err) {
                console.error(`Error starting server: ${stderr}`);
                return;
            }
            console.log(stdout);
        }
    );

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

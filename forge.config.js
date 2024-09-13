const { FusesPlugin } = require("@electron-forge/plugin-fuses");
const { FuseV1Options, FuseVersion } = require("@electron/fuses");

module.exports = {
  packagerConfig: {
    asar: true,
    extraResource: [
      "xml-fixer-backend", // This folder will be placed inside the resources directory
      "xml-fixer-frontend", // This folder will be placed inside the resources directory
      "env.json", // Add the env.json file located in the root directory
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin", "linux"],
      config: {
        name: "xml-fixer",
        options: {
          icon: "./vv-logo.png",
        },
      },
    },
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "xml-fixer",
        options: {
          icon: "./vv-logo.png",
        },
      },
    },
    {
      name: "@electron-forge/maker-deb",
      config: {
        name: "xml-fixer",
        options: {
          icon: "./vv-logo.png",
          categories: ["Utility"],
        },
      },
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

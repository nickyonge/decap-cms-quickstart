# Decap CMS Quickstart
Quickly add [Decap CMS](https://decapcms.org/) to a Webpack project

> [!IMPORTANT]
> This quickstart assumes you have a Webpack site set up and ready to go. If not, the [Webpack Template](https://github.com/nickyonge/webpack-template) could be helpful.

This guide speedruns steps 1 ([installation](https://decapcms.org/docs/install-decap-cms/)) and 2 ([backend config](https://decapcms.org/docs/choosing-a-backend/)) of Decap's [Basic Steps](https://decapcms.org/docs/basic-steps/) guide.

## Instructions 

### 1) Copy CMS files

In your project's `src` folder, import the CMS folder and all its files found in this repo's [src](src).

The [cms.zip](cms.zip) file also contains that directory, for quick download.

### 2) Install NPM packages

Install the following NPM packages as dev dependencies:

1. **CopyWebpackPlugin** - [Package](https://www.npmjs.com/package/copy-webpack-plugin), [repo](https://github.com/webpack/copy-webpack-plugin), [docs](https://webpack.js.org/plugins/copy-webpack-plugin/) \
   Copies source files to output folder, eg from `./src/cms` to `./dist` \
   `npm i copy-webpack-plugin --save-dev`

2. **npm-run-all2** - [Package](https://www.npmjs.com/package/npm-run-all2), [repo](https://github.com/bcomnes/npm-run-all2) \
   Allows executing multiple NPM commands at once (see [Step 4](#4-update-packagejson)) \
   `npm i npm-run-all2 --save-dev`

### 3) Update your webpack.config.js

If your webpack.config is based off of the [Webpack Template](https://github.com/nickyonge/webpack-template) (or [webpack.config.cjs Gist](https://gist.github.com/nickyonge/bb9fe46458c16e1cd560bce505e4af39)), follow [Step 3A](#3a-using-the-webpack-template). If not, follow [Step 3B](#3b-modifying-webpackconfig-directly).

#### 3A) Using the Webpack Template 

Update the `webpack.config.cjs` file like so: 

1. At the end of `#region Config`, [line 149](https://gist.github.com/nickyonge/bb9fe46458c16e1cd560bce505e4af39#file-webpack-config-cjs-L149), add: 
   ```
   /** Name of the folder, in both source and dist output, for the CMS. */
   const CMS_FOLDER = 'cms';
   ```
2. At the end of the plugin declarations, [line 169](https://gist.github.com/nickyonge/bb9fe46458c16e1cd560bce505e4af39#file-webpack-config-cjs-L169), add:
   ```
   /** A Webpack plugin to copy existing individual files or entire directories into the build directory.
    * @see https://webpack.js.org/plugins/copy-webpack-plugin/ */
   const CopyWebpackPlugin = require("copy-webpack-plugin");
   
   /** Full path of the CMS subfolder. Ignored in module rules, used by {@linkcode CopyWebpackPlugin. @type {string} */
   const CMS_FULL_PATH = path.resolve(__dirname, `${SRC_FOLDER}/${CMS_FOLDER}`);
   ```
3. In the `plugins` array of your `module.exports` return function, [line 204](https://gist.github.com/nickyonge/bb9fe46458c16e1cd560bce505e4af39#file-webpack-config-cjs-L204), append:
   ```
   new CopyWebpackPlugin({
       patterns: [
           {
               from: CMS_FULL_PATH,
               to: CMS_FOLDER,
               noErrorOnMissing: true,
           },
       ],
   }),
   ```
4. Replace `devServer`, [line 225](https://gist.github.com/nickyonge/bb9fe46458c16e1cd560bce505e4af39#file-webpack-config-cjs-L225), with:
   ```
   devServer: {
       static: [
           OUTPUT_FOLDER,
           { directory: CMS_FULL_PATH, publicPath: `"/${CMS_FOLDER}` },
       ],
       watchFiles: [`${SRC_FOLDER}/${CMS_FOLDER}/**/*`],
   },
   ```
5. In the CSS loading module, exclude the CMS filepath by adding the following exclusion between the `test` and `use` properties, [line 247](https://gist.github.com/nickyonge/bb9fe46458c16e1cd560bce505e4af39#file-webpack-config-cjs-L247):
   ```
   exclude: CMS_FULL_PATH,
   ```

#### 3B) Modifying webpack.config directly

This assumes you're using a typical webpack.config.js file, such as the [barebones example](example/webpack.config.js) in this repo.

1. Import the `copy-webpack-plugin` at the top of your config file, alongside where `path` is imported.
   ```
   const CopyWebpackPlugin = require("copy-webpack-plugin");
   ```
2. In the `plugins` array of your `module.exports` return function, create a new CopyWebpackPlugin with the following parameters:
   ```
   new CopyWebpackPlugin({
       patterns: [
           {
               from: path.resolve(__dirname, `src/cms`, // your working CMS folder, typically in /src
               to: 'cms', // desired name of the CMS subdirectory in your dist/build folder
               noErrorOnMissing: true,
           },
       ],
   }),
   ```
   The `noErrorOnMissing` pattern is [optional](https://webpack.js.org/plugins/copy-webpack-plugin/#noerroronmissing).

### 3) Update package.json

This is useful if you want to simply execute `npm start` and have your development CMS enabled, instead of having to execute `npm start` to launch Webpack, and _then_ execute `npx decap-server` to launch your local Decap server.

> [!NOTE]
> The `run-p` [command](https://github.com/bcomnes/npm-run-all2/blob/master/docs/run-p.md) runs multiple commands in parallel. This is why we installed `npm-run-all2` in [Step 2](#2-install-npm-packages).

In your `package.json` file's `scripts`, add the following.
```
"start": "run-p start:byconfig server",
"start:byconfig": "webpack serve --open",
"start:dev": "webpack serve --mode=development --open && npx http-server dist",
"start:prod": "webpack serve --mode=production --open",
"server": "npx decap-server",
```
Whether or not you're using the Webpack Template, this will replace the `"start"` command. If you _are_ using the template, this will also replace the `"start:dev"` and `"start:prod"` commands. In either case, the `"start:byconfig"` and `"server"` commands are new.

### 4) Launch and test your CMS

Now when you test your site via `npm start` in VS Code, it should also start your local Decap server. When your browser opens to `localhost:8080` (or whatever your local test URL may be), add `/cms` to it and test out your new CMS!

Next up, time to [configure the CMS](https://decapcms.org/docs/configure-decap-cms/) to your specific project. Have fun 💖

### 5) Optional: Customization, config.yml, and index.html

#### Icon

- Change `icon.png` to whatever you like. It's synced to be both the site icon and CMS header icon. I can't imagine why you'd want anything besides a duck, though. Ducks are great.

#### config.yml

You'll spend a lot of time in `config.yml` as you set up your CMS. Below are a couple quick notes on modifying it for now. 

- Update the production backend URLs. Eventually you'll want to use the production backend when your project goes live. By default, those URLs point to this quickstart repo. You should point them towards your own site. All URL lines are marked with a `# <----- REPLACE URL` comment.
- If you've changed the icon name, update `logo: src: MyNewIcon.png`. If you want it to appear on the start page but not in the CMS itself, set `show_in_header` to `false`. If you want it gone altogether, delete the entire `logo` block.
- The `media_folder` and `public_folder` are where your content lives. Customize them as needed, per [Decap's Media/Public Folder documentation](https://decapcms.org/docs/configuration-options/#media-and-public-folders).
- Collections are where you'll begin to set up your CMS structure. Customize it as needed, per [Decap's Collections documentation](https://decapcms.org/docs/configuration-options/#collections).

#### index.html

Updating `index.html` isn't at all necessary, but offers some customization.

- Change the `<title>` element to whatever you want your CMS to be called, if you find "Decap CMS" uninspiring
- If you've changed the icon, change the '<link rel="icon">`'s `href` value to your new icon. This way you can specify a different icon between the webpage and the CMS header.
- By default, Decap is loaded from [UNPKG](https://unpkg.com/), and it loads v3.0.0
  - If you want to load from its [jsDelivr](https://www.jsdelivr.com/) mirror, comment the `unpkg` script line, and uncomment the `jsDelivr` script line.
  - If you want to load another version, change the `^3.0.0` to whichever version you'd like, or remove it altogether for the latest version. Eg, at the time of writing this, directly loading [unpkg.com/decap-cms](https://unpkg.com/decap-cms) (or [cdn.jsdelivr.net/npm/decap-cms](https://cdn.jsdelivr.net/npm/decap-cms)) loads v3.10.0
 - Comment out the `decapServerWarning` script if you want to skip it. It simply waits for the CMS to connect, and if connection fails, reminds you to check `config.yml` and ensures that you launched the server correctly from terminal. Upon successful connection, it automatically disables itself.

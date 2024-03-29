#  React SSR Loadable Components Boilerplate

I thought of putting this code in a repo because of the struggles I had to face while trying to build a similar solution for a project in my company. For someone that may find themselves in a similar situation, I hope this project helps them to bootstrap [React using SSR](https://reactjs.org/docs/code-splitting.html#reactlazy) with [Loadable Components](https://loadable-components.com/) in little to no time :grinning:.

## Motivation
Implement **Code Splitting** in **React** using **Loadable Components** specially when you are doing **Server Side Rendering**.

## Challenges
While the official documentation of Loadable Components try to make it **sound easy** to implement code splitting using their library after you follow the steps given at https://loadable-components.com/docs/server-side-rendering/, the reality could be a little different :disappointed_relieved:. There are a lot of nuances that you'll come across once you start implementing the steps specially coming to terms with some of the keywords like **node stats**, **web stats** and which one is really needed over the other. Some of the terms are obviously not clear and **[one very important step](#config-overridesjs)**(the most crucial one tbh and one which I didn't find nowhere :sob: and had to discover after a lot of experimentation), is **missing** in their documentation or rather they should have done a better job of calling it out because what Loadable Components does for you is great otherwise.

## What this repo can do for you
- Save you from days worth of time figuring out some missing but obvious things while trying to implement **Code Splitting** using [Loadable Components](https://loadable-components.com/docs/server-side-rendering/) and **SSR**.
- Provide you with some crucial code that you can plugin **AS IS** in your existing app to make it work.

## Prerequisites

### The following 3 libraries are ABSOLUTE ESSENTIALS for this solution to work,
1. [Loadable Components](https://loadable-components.com/)
2. [Customize CRA](https://github.com/arackaf/customize-cra)
3. [Webpack](https://webpack.js.org/)

## App Structure
<img width="296" alt="Screen Shot 2021-08-29 at 7 49 36 PM" src="https://user-images.githubusercontent.com/34688999/131269371-b843e4ed-0ef6-41ef-8f5a-3f74a4ccd525.png">

## Important Files
| File Name  | Description |
| ------------- | ------------- |
| src/index.tsx  | Renders/Hydrates the app on the browser  |
| src/App.tsx  | Uses React Router to load and match 2 routes; **/** matching to `home-page.tsx` and **/loadable-page** matching to `loadable-page.tsx` respectively while **dynamically importing** them both  |
| config-overrides.js  | Used by **customize-cra** to apply your custom webpack configuration before react-script's configuration takes over. **customize-cra** works with **react-app-rewired** to run most of react scripts  |
| webpack-config.js  | Custom webpack configuration to bundle the code before it can be used server side with Express.  |
| server/index.js  | Entry Point for the custom webpack configuration above to start the Express Instance and serve React App Server Side.  |

## Important Code Blocks

### [config-overrides.js](/config-overrides.js)

#### Configure React Scripts to use the Loadable Babel and Webpack Plugins which enables naming the chunks and enabling Code Splitting respectively
```
const { override, addWebpackPlugin, addBabelPlugin } = require("customize-cra");
const LoadablePlugin = require("@loadable/webpack-plugin");

module.exports = override(
  addBabelPlugin("@loadable/babel-plugin"),
  addWebpackPlugin(new LoadablePlugin())
);
```

### [webpack.config.js](/webpack.config.js)

#### [Line 20](https://github.com/dherenj84/react-ssr-loadable/blob/e14763119430ae0c385e49aa43aead33e9942b26/webpack.config.js#L20); Configure Loadable Babel Plugin which enables naming the chunks by a logical name
```
plugins: ["@loadable/babel-plugin"],
```

#### [Line 50](https://github.com/dherenj84/react-ssr-loadable/blob/e14763119430ae0c385e49aa43aead33e9942b26/webpack.config.js#L50); Configure Loadable Webpack Plugin so that Code Splitting can work
```
plugins: [new LoadablePlugin()],
```

### [server/index.js](/server/index.js)

#### When you'll run `npm run build` which looks like this `"build": "rimraf build && react-app-rewired build && npx webpack"`, because of the config-overrides, the `react-scripts` are going to generate a file called `loadable-stats.json` right under the build folder and `webpack` command is going to generate a similar file but under build/server directory. As my comments in the following code also emphasize, use the file under build folder which is also referred to as the **web stats** during the chunk extraction process.
```
// This is the stats file generated by webpack loadable plugin.
  // It's very important that you use the web stats instead of node stats,
  // so use /build/loadable-stats.json instead of /build/server/loadable-stats.json
  const statsFile = path.resolve("./build/loadable-stats.json");

  // We create an extractor from the statsFile
  const extractor = new ChunkExtractor({ statsFile });

  // Wrap your application using "collectChunks"
  const jsx = extractor.collectChunks(
    <StaticRouter location={req.url}>
      <App />
    </StaticRouter>
  );

  // Render your application
  const html = ReactDOMServer.renderToString(jsx);

  // You can also collect your "preload/prefetch" links
  const linkTags = extractor.getLinkTags(); // or extractor.getLinkElements();
  // console.log(linkTags);

  // And you can even collect your style tags (if you use "mini-css-extract-plugin")
  const styleTags = extractor.getStyleTags(); // or extractor.getStyleElements();
  // console.log(styleTags);

  // You can now collect your script tags
  // I removed async from script tags as it wasn't working as expected when the scripts were loaded asynchronously
  const scriptTags = extractor.getScriptTags().replace(/async /g, ""); // or extractor.getScriptElements();
    const indexFile = path.resolve("./build/index.html");

  fs.readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      console.error("Something went wrong:", err);
      return res.status(500).send("Oops, better luck next time!");
    }
    return res.send(
      data
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
        .replace(
          '<script>console.log("loadable tags placeholder")</script>',
          `${linkTags}\n${styleTags}\n${scriptTags}`
        )
    );
  });
```

## How to run
1. Run `npm run build` and then `npm run start-ssr` if you prefer to build and run the app separately.
2. Or, just run `npm run start-ssr-watch` which runs both of the above commands for you and also watches for any changes and rebuilds and restarts the server upon changes.

## What you should expect to see

### build directory with the following code
<img width="324" alt="Screen Shot 2021-08-29 at 8 44 32 PM" src="https://user-images.githubusercontent.com/34688999/131271167-806ca9ff-7370-4477-94f4-494bdf29e389.png">

### customize-cra/react-app-rewired generating the following named chunks for you
<img width="612" alt="Screen Shot 2021-08-29 at 8 44 57 PM" src="https://user-images.githubusercontent.com/34688999/131271171-4c2cabb0-6617-4a6d-96a2-5ab8f1f10406.png">

### webpack cli generating the following chunks; you can see that internally it maps the numbered chunks to logical names on the right
<img width="525" alt="Screen Shot 2021-08-29 at 8 45 31 PM" src="https://user-images.githubusercontent.com/34688999/131271173-2955bccc-0fc7-4751-83e5-b772488fc3f7.png">

Checkout how the chunks will be loaded on demand while SSR would still work if you reload a route. **Happy Coding** :v:

## References
1. [React](https://reactjs.org/docs/code-splitting.html#reactlazy)
2. [React Router](https://reactrouter.com/web/guides/quick-start)
3. [Loadable Components](https://loadable-components.com/)
4. [Customize CRA](https://github.com/arackaf/customize-cra)
5. [Express](https://expressjs.com/)
6. [Webpack](https://webpack.js.org/)


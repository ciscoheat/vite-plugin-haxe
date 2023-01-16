# vite-plugin-haxe

Lets you run [Haxe](https://haxe.org/) code in your [Vite](https://vitejs.dev/) project. Supports client-side javascript currently.

## Installation

```bash
(p)npm i -D vite-plugin-haxe
```

**vite.config.js**

```js
import { defineConfig } from "vite";
import haxe from "vite-plugin-haxe";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [haxe()],
});
```

## Usage

**index.html**

```html
<!-- Included in Vite already -->
<script type="module" src="/main.js"></script>
```

**main.js**

```js
import "client.hxml";
```

**client.hxml**

```bash
-cp src
-main Main

# -js isn't needed, but helpful for IDE's.
-js app.js

-D source-map-content
-debug
```

Start having fun with `npm run dev`.

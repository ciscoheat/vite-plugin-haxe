# vite-plugin-haxe

Lets you run [Haxe](https://haxe.org/) code in your [Vite](https://vitejs.dev/) project. Supports client-side javascript currently.

## Installation & Configuration

Prerequisites: [Haxe](https://haxe.org/) and [Node.js](https://nodejs.org/).
`npm` is gladly substituted for [pnpm](https://pnpm.io/).

Open a terminal in your project folder and execute this:

```bash
npm create vite@latest my-haxe-app --template vanilla
cd my-haxe-app
npm install
npm install -D vite-plugin-haxe
```

Add a **vite.config.js**:

```js
import { defineConfig } from "vite";
import haxe from "vite-plugin-haxe";

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [haxe()],
});
```

Add/edit the following files:

**main.js**

```js
import "./style.css";
import "./main.hxml";
```

**main.hxml**

```bash
-cp src
-main Main
-dce full

# -js isn't needed, but helpful for IDE's.
-js main.js

-D source-map-content
-debug
```

**src/Main.hx**

```haxe
package;

import js.Browser.document;
import js.html.ButtonElement;

class Main {
  static function main() {
    document.getElementById('app')
      .innerHTML = '
    <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://haxe.org/" target="_blank">
      <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Haxe_logo.svg" class="logo vanilla" alt="Haxe logo" />
    </a>
    <h1>Vite + Haxe</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and Haxe logos to learn more
    </p>
  </div>
  ';

    Counter.setupCounter(cast(document.querySelector('#counter'), ButtonElement));
  }
}

class Counter {
  public static function setupCounter(element:ButtonElement) {
    var counter = 0;
    final setCounter = (count:Int) -> {
      counter = count;
      element.innerHTML = 'count is $counter';
    }
    element.addEventListener('click', () -> setCounter(counter + 1));
    setCounter(0);
  }
}
```

Start the fun with `npm run dev`.

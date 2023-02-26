
---

> ⚠️ This project is a proof of concept to show how an Electron like experience can be achieved using Deno.

---

# Deuteron

Electron has had a large impact on the development of desktop application.
Allowing for both backend and frontend to be written in javascript.

While Electron uses node, there has not been a similar alternative that uses Deno.
This is what `Deuteron` aims to solve, however instead of using chromium it uses webview.

There has been a discussion for a standard GUI, and in my eyes something like this would be perfect. Hopefully this project can be an inspiration to implement something similar into Deno officially.

## How does it work

This project is mainly a wrapper around the `compile` command of Deno with some modifications.
The modified Deno binary comes from [this fork](https://github.com/JasperVanEsveld/deno), which adds webview support using [WRY](https://github.com/tauri-apps/wry).

# Install and compile

Compile a Deno project, for example `your_backend.ts`
```
deno run --allow-read --allow-write --allow-net --allow-run https://deno.land/x/deuteron@1.0/mod.ts ./your_backend.ts
```

Or first install deuteron
```
deno install --allow-read --allow-write --allow-net --allow-run -n deuteron https://deno.land/x/deuteron@1.0/mod.ts
```
And compile using
```
deuteron ./your_backend.ts
```

# Options

Deuteron is basically a wrapper around the `compile` command from Deno, check [here](https://deno.land/manual@v1.31.1/tools/compiler) for it's documentation.

Deuteron adds a few more flags:

- `--title`: The title of the application (default: Webview)
- `--webview-url`: The path to a html file, can be relative, absolute or remote (default: ./index.html)
- `--dev-tools`: Allows users to open the dev-tools window (F12 on windows)
- `--transparent`: Allows for applications to have transparent backgrounds
- `--no-decorations`: Disables the default OS decorations (titlebar, minimize, maximize, close, etc)*

*`--no-decorations` requires your own titlebar, see `example/index-titlebar.html` how this can be implemented

# Example

The `example` directory includes a small project that sends a webview message to deno and back.

To compile it into an executable, run:
```
deuteron --title "Hello Deuteron!" --webview-url ./example/index.html ./example/backend.ts 
```
Or the try out the version with a custom titlebar using:
```
deuteron --title "Hello Deuteron!" --no-decorations --webview-url ./example/index-titlebar.html ./example/backend.ts 
```
![image](https://user-images.githubusercontent.com/9715316/221430491-ec1cd5df-b966-46d5-a093-d87f20a8cc9f.png)


# IPC

The example exchanges messages between webview and deno.
This can be done using the following functions:

In deno
```js
// Send message to webview
window.webview.send("Some string");

// Listen to messages from webview
window.webview.onMessage((message) => console.log(`Received: ${message}`)); 
```

In webview
```js
// Send message to deno
window.deno.send("Some string");

// Listen to messages from deno
window.deno.onMessage((message) => console.log(`Received: ${message}`)); 
```

# Webview Functions

To support things like a custom titlebar there are some additional functions to control the window.
```js
// Creates a new window with a certain title and url
window.webview.create(url, title);

// Toggles fullscreen
window.webview.fullscreen();
// Current state:
// window.webview.isFullscreen;

// Minimizes the window
window.webview.minimize();

// Maximizes the window
window.webview.maximize();

// Closes the window (exits when window count reaches 0)
window.webview.close();
```

To allow the user to drag your window, give an element the class `drag-region`

# OS Support

As this is just a proof of concept there are some limitations.
The biggest being that it (currently) only works on windows. Though Linux should be possible, just haven't compiled to it yet.

On Mac webview is not allowed to run on a separate thread, which is the case here. Maybe that can be changed by running Deno on a separate thread instead, though I haven't tested this.

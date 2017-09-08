# vr-ui
Simple &amp; flexible 3D user interface.

<p align="center">
  <img width="700" src="preview.gif">
</p>

**VRUI** is a highly customizable GUI, working in *VR* and *non-VR*. It is based upon Three.js, and makes use of the scene-graph to create its hierarchy.

**VRUI** is greatly influenced by [dat.gui](https://github.com/dataarts/dat.gui), and [dat.guiVR](https://github.com/dataarts/dat.guiVR).

## How it works

**VRUI** works on the same principle as the [Android Layout System](https://developer.android.com/guide/topics/ui/declaring-layout.html), allowing to create a very large number of different interfaces. You can use *layouts* (grid, linear, ...) in which you insert *views* (slider, checkbox, button, ...).

Every views added to the GUI is scaled and positionned relative to its parent. Example:
<p align="center">
  <img width="350" src="layout-example.jpg">
</p>

To get more information, you can consult the [wiki](), or the multiple [examples](https://github.com/artflow-vr/vr-ui/tree/master/examples).

## Build

You can use either [npm](https://www.npmjs.com/) or [yarn](https://www.npmjs.com/):

### Build a development version
```sh
yarn install
yarn build
```

### Build a production version
Change the file `.env`, by assigning the `WEBPACK_CONFIG` variable the value `build`.
Then, you can build normally:
```sh
yarn install
yarn build
```

## Contributing

I am currently working on my master's degree and I do not have a lot of free time at this moment. Contributions are highly appreciated. Having the chance to have contributors bring their ideas to improve the library, by adding new features or by changing the **API** would be great!

In a nutshell, do not hesitate!

## TODO

* [ ] Add helper to create in few lines a datgui like UI.
* [ ] Add option to keep element aspect ratio
* [ ] Add animation

* [X] Add slider view
* [X] Fix GridLayout not spacing items as expected
* [X] Add text
* [X] Prevent z-fighting by adding a small offset in z to the hierarchy
* [X] Add clone methods to duplicate element with same style and properties

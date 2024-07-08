// ==UserScript==
// @name        Grid Sort Script
// @namespace   Violentmonkey Scripts
// @match       https://playcanvas.com/editor/scene/*
// @grant       none
// @version     1.2
// @author      -
// @description 20/10/2021, 11:40:21
// ==/UserScript==

(function () {
  function init() {
    renderContainer();
  }

  function sortEntityObject(mapWidth, mapHeight, mapType) {
    var selectedEntities = editor.selection.items;

    if (selectedEntities.length === 0) {
      console.log("No entity selected");
      return;
    }

    var mapHolder = selectedEntities[0];
    var children = mapHolder.children;

    var tileSize = 1;

    if (children.length === 0) {
      console.log("No children to sort");
      return;
    }

    editor.call("entities:history:startBatch", "Sort Children");

    if (mapType == "Grid") {
      gridSort(children , mapWidth, mapHeight, tileSize)
    } else {
      hexSort(children, mapWidth, mapHeight, tileSize);
    }

    editor.call("entities:history:endBatch");

    console.log("Children sorted and changes saved");

    markSceneDirtyAndSave();
  }

  function hexSort(children, mapWidth, mapHeight, tileSize) {
    var i = 0;
    for (var y = 0; y < mapHeight; y++) {
      for (var x = 0; x < mapWidth; x++) {
        if (i >= children.length) {
          break;
        }

        var offset = y % 2 === 0 ? 0 : tileSize * 1;
        var posX = x * tileSize * 2 + offset;
        var posY = y * tileSize * Math.sqrt(3);
        var pos = [posX, 0, posY];

        var child = children[i];
        child.set("position", pos);

        editor.call("entities:insert", child);
        i++;
      }
      if (i >= children.length) {
        break;
      }
    }
  }

  function gridSort(children , mapWidth, mapHeight, tileSize) {
    var i = 0;
    for (var y = 0; y < mapHeight; y++) {
      for (var x = 0; x < mapWidth; x++) {
        if (i >= children.length) {
          break;
        }

        var posX = x * tileSize;
        var posY = y * tileSize;
        var pos = [posX, 0, posY];

        var child = children[i];
        child.set("position", pos);

        editor.call("entities:insert", child);

        i++;
      }
      if (i >= children.length) {
        break;
      }
    }
  }

  function markSceneDirtyAndSave() {
    editor.call("scene:dirty");

    setTimeout(() => {
      editor.call("scene:save");
      console.log("Scene saved");
    }, 1000);
  }

  function createPCUIElement(type, properties, styles, children = []) {
    const element = new pcui[type](properties);

    if (styles) {
      for (let [key, value] of Object.entries(styles)) {
        element.style[key] = value;
      }
    }

    children.forEach((child) => element.append(child));

    return element;
  }

  function createLabeledContainer(labelText, children = []) {
    return createPCUIElement(
      "LabelGroup",
      { text: labelText },
      { fontSize: "12px" },
      children
    );
  }

  function selectionContainer(labelText, options, defaultValue, id) {
    const selectInput = createPCUIElement("SelectInput", {
      options: options,
      defaultValue: defaultValue,
      id: id,
    });

    const labeledContainer = createLabeledContainer(labelText, [selectInput]);

    return labeledContainer;
  }

  function numericInputContainer(labelText, id) {
    const selectInput = createPCUIElement("NumericInput", {
      min: 1,
      id: id,
    });

    const labeledContainer = createLabeledContainer(labelText, [selectInput]);

    return labeledContainer;
  }

  const mainContainer = createPCUIElement(
    "Container",
    {},
    {
      position: "absolute",
      background: "#364346",
      bottom: "15px",
      right: "15px",
      width: "200px",
    }
  );

  const sortButton = createPCUIElement("Button", { text: "Sort Entities" });

  sortButton.on("click", () => {
    const mapType = document.querySelector(
      "#map-type .pcui-select-input-value"
    )?.innerText;
    const mapWidth = document.querySelector("#map-width input")?.value;
    const mapHeight = document.querySelector("#map-height input")?.value;

    if (mapHeight && mapType && mapWidth) {
      sortEntityObject(mapWidth, mapHeight, mapType);
    }
  });

  function renderContainer() {
    mainContainer.append(
      selectionContainer(
        "Map Type",
        [
          { t: "Hex", v: "Hex" },
          { t: "Grid", v: "Grid" },
        ],
        "Grid",
        "map-type"
      )
    );
    mainContainer.append(numericInputContainer("Map Width", "map-width"));
    mainContainer.append(numericInputContainer("Map Height", "map-height"));
    mainContainer.append(sortButton);

    editor.call("layout.viewport").append(mainContainer);
  }

  editor.once("load", () => init());
})();

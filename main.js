// ==UserScript==
// @name        Grid Sort Script
// @namespace   Violentmonkey Scripts
// @match       https://playcanvas.com/editor/scene/*
// @grant       none
// @version     1.0
// @author      -
// @description 20/10/2021, 11:40:21
// ==/UserScript==

(function () {
    function init() {
        createButton();
    }

    function sortEntityObject() {
        var selectedEntities = editor.selection.items;

        if (selectedEntities.length === 0) {
            console.log("No entity selected");
            return;
        }

        var entity = selectedEntities[0];

        var children = entity.children;
        var spacing = 1;
        var currentPosition = new pc.Vec3(0, 0, 0);

        editor.call('entities:history:startBatch', 'Sort Children'); 

        for (const child of children) {
            child.viewportEntity.setLocalPosition(currentPosition);
            currentPosition.x += spacing;

            editor.call('entities:insert', child); 
        }

        editor.call('entities:history:endBatch'); 

        console.log("Children sorted and changes saved");
    }

    function createButton() {
        const btn = new pcui.Button({ text: "Generate Boxes" });
        btn.style.position = "absolute";
        btn.style.bottom = "10px";
        btn.style.right = "10px";
        editor.call("layout.viewport").append(btn);

        btn.on("click", () => {
            sortEntityObject();
        });
    }

    editor.once("load", () => init());
})();
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
        createButton();
    }

    function sortEntityObject() {
        var selectedEntities = editor.selection.items;
    
        if (selectedEntities.length === 0) {
            console.log("No entity selected");
            return;
        }
    
        var mapHolder = selectedEntities[0];
        var children = mapHolder.children;
    
        var mapWidth = 10; 
        var mapHeight = 10; 
        var tileSize = 1; 
    
        if (children.length === 0) {
            console.log("No children to sort");
            return;
        }
    
        editor.call('entities:history:startBatch', 'Sort Children');
    
        var i = 0;
        for (var y = 0; y < mapHeight; y++) {
            for (var x = 0; x < mapWidth; x++) {
                if (i >= children.length) {
                    break;
                }
    
                var offset = (y % 2 === 0) ? 0 : tileSize * 1;
                var posX = x * tileSize * 2 + offset;
                var posY = y * tileSize * Math.sqrt(3);
                var pos = [posX, 0, posY];
    
                var child = children[i];
                child.set('position', pos);
    
                editor.call('entities:insert', child);
    
                i++;
            }
            if (i >= children.length) {
                break;
            }
        }
    
        editor.call('entities:history:endBatch');
    
        console.log("Children sorted and changes saved");
    
        markSceneDirtyAndSave();
    }

    function markSceneDirtyAndSave() {
        editor.call('scene:dirty');

        setTimeout(() => {
            editor.call('scene:save');
            console.log("Scene saved");
        }, 1000);
    }

    function createButton() {
        const btn = new pcui.Button({ text: "Generate Hex Grid" });
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
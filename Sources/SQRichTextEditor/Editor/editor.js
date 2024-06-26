"use strict";
const container = document.getElementById("editor"),
    editor = new Squire(container, {
        blockTag: "div",
        tagAttributes: {
            a: {
                target: "_blank"
            }
        }
    }),
    tagName = {
        bold: "b",
        italic: "i",
        strikethrough: "del",
        underline: "u",
        link: "a"
    };
var lastFontInfo = {},
    newFontInfo = {},
    lastFormat = {
        bold: !1,
        italic: !1,
        strikethrough: !1,
        underline: !1,
        link: !1
    },
    newFormat = clone(lastFormat),
    lastHeight = 0,
    newHeight = 0,
    isFocused = !1;

function detectCursorPosition() {
    let t = editor.getCursorPosition();
    postCursorPosition({
        top: t.top,
        right: t.right,
        bottom: t.bottom,
        left: t.left,
        width: t.width,
        height: t.height,
        x: t.x,
        y: t.y
    })
}

function detectFontInfoChnaged() {
    let t = editor.getFontInfo().size;
    null != t && (t = t.replace("px", "")), newFontInfo = {
        color: rgbToHex(editor.getFontInfo().color),
        backgroundColor: rgbToHex(editor.getFontInfo().backgroundColor),
        family: editor.getFontInfo().family,
        size: t
    }, isEquivalent(lastFontInfo, newFontInfo) || postFontInfo(lastFontInfo = clone(newFontInfo))
}

function detectFormatChnaged() {
    let t = Object.getOwnPropertyNames(lastFormat);
    for (let e = 0; e < t.length; e++) {
        let o = t[e],
            n = tagName[o];
        newFormat[o] = editor.hasFormat(n)
    }
    isEquivalent(lastFormat, newFormat) || postFormat(lastFormat = clone(newFormat))
}

function isEquivalent(t, e) {
    let o = Object.getOwnPropertyNames(t),
        n = Object.getOwnPropertyNames(e);
    if (o.length != n.length) return !1;
    for (let n = 0; n < o.length; n++) {
        var r = o[n];
        if (t[r] !== e[r]) return !1
    }
    return !0
}

function clone(t) {
    if (null == t || "object" != typeof t) return t;
    var e = new t.constructor;
    for (var o in t) e[o] = clone(t[o]);
    return e
}

function rgbToHex(t) {
    if (null == t) return null;
    let e = t.match(/\d+/g).map((function(t) {
        return parseInt(t)
    }));
    return o = e[0], n = e[1], r = e[2], "#" + ((1 << 24) + (o << 16) + (n << 8) + r).toString(16).slice(1);
    var o, n, r
}

function focusEditor(t) {
    t ? editor.focus() : editor.blur()
}

function setFormat(t) {
    let e = tagName[t];
    "undefined" !== e && editor.changeFormat({
        tag: e
    })
}

function removeFormat(t) {
    let e = tagName[t];
    "undefined" !== e && editor.changeFormat(null, {
        tag: e
    })
}

function setFontSize(t) {
    editor.setFontSize(t + "px")
}

function setTextColor(t) {
    editor.setTextColour(t)
}

function insertImage(t) {
    editor.insertImage(t)
}

function insertHTML(t) {
    editor.insertHTML(t)
}

function getHTML() {
    return editor.getHTML()
}

function clear() {
    editor.setHTML("<div><br></div>"), editor.moveCursorToStart()
}

function makeLink(t) {
    editor.makeLink(t)
}

function removeLink() {
    editor.removeLink()
}

function setTextSelection(t, e, o, n) {
    let r = Array.prototype.find.call(document.getElementById(t).childNodes, (function(t) {
            return t.nodeType == Node.TEXT_NODE
        })),
        i = Array.prototype.find.call(document.getElementById(o).childNodes, (function(t) {
            return t.nodeType == Node.TEXT_NODE
        })),
        s = editor.createRange(r, e, i, n);
    editor.setSelection(s)
}

function getSelectedText() {
    return editor.getSelectedText()
}

function setTextBackgroundColor(t) {
    editor.setHighlightColour(t)
}

function getEditorHeight() {
    return container.clientHeight
}

function postFontInfo(t) {
    window.webkit.messageHandlers.fontInfo.postMessage(t)
}

function postFormat(t) {
    window.webkit.messageHandlers.format.postMessage(t)
}

function postFocusStatus(t) {
    window.webkit.messageHandlers.isFocused.postMessage(t)
}

function postCursorPosition(t) {
    window.webkit.messageHandlers.cursorPosition.postMessage(t)
}

function postContentChanged(t) {
    window.webkit.messageHandlers.contentChanged.postMessage(t)
}
document.getElementById("outer-container").onclick = function(t) {
    t.target === this && (isFocused || editor.focus())
}, editor.addEventListener("focus", (function() {
    postFocusStatus(isFocused = !0)
}), !1), editor.addEventListener("blur", (function() {
    postFocusStatus(isFocused = !1)
}), !1), editor.addEventListener("input", (function() {
    detectFontInfoChnaged(), detectFormatChnaged()
    postContentChanged(editor.getHTML())
}), !1), editor.addEventListener("select", (function() {
    detectFontInfoChnaged(), detectFormatChnaged()
}), !1), editor.addEventListener("cursor", (function() {
    detectFontInfoChnaged(), detectFormatChnaged(), detectCursorPosition()
}), !1);

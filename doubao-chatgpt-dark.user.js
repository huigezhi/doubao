// ==UserScript==
// @name         Doubao ChatGPT Dark Mode
// @namespace    https://github.com/openai/doubao-dark-mode
// @version      1.0.0
// @description  为 https://www.doubao.com/chat/ 提供类似 ChatGPT 的深色模式外观。
// @author       OpenAI
// @match        https://www.doubao.com/chat/*
// @match        https://www.doubao.com/chat
// @match        https://*.doubao.com/chat/*
// @match        https://*.doubao.com/chat
// @icon         https://www.doubao.com/favicon.ico
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const STYLE_ID = 'doubao-chatgpt-dark-mode-style';
  const ROOT_CLASS = 'doubao-chatgpt-dark-mode';

  const css = `
:root.${ROOT_CLASS},
.${ROOT_CLASS} {
  color-scheme: dark !important;
  --db-cg-bg: #212121;
  --db-cg-bg-rgb: 33, 33, 33;
  --db-cg-surface: #2f2f2f;
  --db-cg-surface-rgb: 47, 47, 47;
  --db-cg-surface-hover: #3a3a3a;
  --db-cg-surface-active: #424242;
  --db-cg-sidebar: #171717;
  --db-cg-sidebar-rgb: 23, 23, 23;
  --db-cg-sidebar-hover: #2a2a2a;
  --db-cg-border: rgba(255, 255, 255, 0.1);
  --db-cg-border-strong: rgba(255, 255, 255, 0.18);
  --db-cg-text: #ececec;
  --db-cg-text-soft: #c5c5c5;
  --db-cg-text-muted: #8f8f8f;
  --db-cg-accent: #10a37f;
  --db-cg-accent-hover: #0d8f70;
  --db-cg-user: #303030;
  --db-cg-code: #0d0d0d;
  --db-cg-shadow: rgba(0, 0, 0, 0.35);
}

html.${ROOT_CLASS},
html.${ROOT_CLASS} body,
html.${ROOT_CLASS} #root,
html.${ROOT_CLASS} #app,
html.${ROOT_CLASS} [class*="app" i],
html.${ROOT_CLASS} [class*="layout" i] {
  background: var(--db-cg-bg) !important;
  color: var(--db-cg-text) !important;
}

html.${ROOT_CLASS} body {
  scrollbar-color: #565656 transparent !important;
}

html.${ROOT_CLASS} *,
html.${ROOT_CLASS} *::before,
html.${ROOT_CLASS} *::after {
  border-color: var(--db-cg-border) !important;
}

/* ChatGPT-like app background and main conversation canvas. */
html.${ROOT_CLASS} main,
html.${ROOT_CLASS} section,
html.${ROOT_CLASS} article,
html.${ROOT_CLASS} [role="main"],
html.${ROOT_CLASS} [class*="chat" i],
html.${ROOT_CLASS} [class*="conversation" i],
html.${ROOT_CLASS} [class*="message-list" i] {
  background-color: var(--db-cg-bg) !important;
  color: var(--db-cg-text) !important;
}

/* Sidebar/navigation areas. */
html.${ROOT_CLASS} aside,
html.${ROOT_CLASS} nav,
html.${ROOT_CLASS} [class*="side" i],
html.${ROOT_CLASS} [class*="sider" i],
html.${ROOT_CLASS} [class*="sidebar" i],
html.${ROOT_CLASS} [class*="navigation" i],
html.${ROOT_CLASS} [class*="history" i] {
  background-color: var(--db-cg-sidebar) !important;
  color: var(--db-cg-text) !important;
}

html.${ROOT_CLASS} [class*="side" i] a,
html.${ROOT_CLASS} [class*="side" i] button,
html.${ROOT_CLASS} nav a,
html.${ROOT_CLASS} nav button,
html.${ROOT_CLASS} aside a,
html.${ROOT_CLASS} aside button {
  color: var(--db-cg-text-soft) !important;
}

html.${ROOT_CLASS} [class*="side" i] a:hover,
html.${ROOT_CLASS} [class*="side" i] button:hover,
html.${ROOT_CLASS} nav a:hover,
html.${ROOT_CLASS} nav button:hover,
html.${ROOT_CLASS} aside a:hover,
html.${ROOT_CLASS} aside button:hover,
html.${ROOT_CLASS} [class*="history" i] [role="button"]:hover {
  background-color: var(--db-cg-sidebar-hover) !important;
  color: var(--db-cg-text) !important;
}

/* Header/top bars should blend into the dark surface without bright strips. */
html.${ROOT_CLASS} header,
html.${ROOT_CLASS} [class*="header" i],
html.${ROOT_CLASS} [class*="topbar" i],
html.${ROOT_CLASS} [class*="toolbar" i] {
  background-color: rgba(var(--db-cg-bg-rgb), 0.92) !important;
  color: var(--db-cg-text) !important;
  border-color: var(--db-cg-border) !important;
  box-shadow: none !important;
  backdrop-filter: blur(8px);
}

/* Chat bubbles and card-like answer blocks. */
html.${ROOT_CLASS} [class*="bubble" i],
html.${ROOT_CLASS} [class*="message" i],
html.${ROOT_CLASS} [class*="answer" i],
html.${ROOT_CLASS} [class*="assistant" i],
html.${ROOT_CLASS} [class*="markdown" i],
html.${ROOT_CLASS} [data-testid*="message" i] {
  color: var(--db-cg-text) !important;
}

html.${ROOT_CLASS} [class*="user" i][class*="message" i],
html.${ROOT_CLASS} [class*="user" i] [class*="bubble" i],
html.${ROOT_CLASS} [class*="question" i],
html.${ROOT_CLASS} [class*="human" i] {
  background-color: var(--db-cg-user) !important;
  color: var(--db-cg-text) !important;
  border-color: transparent !important;
}

html.${ROOT_CLASS} [class*="card" i],
html.${ROOT_CLASS} [class*="panel" i],
html.${ROOT_CLASS} [class*="popover" i],
html.${ROOT_CLASS} [class*="dropdown" i],
html.${ROOT_CLASS} [class*="menu" i],
html.${ROOT_CLASS} [role="dialog"],
html.${ROOT_CLASS} [role="menu"],
html.${ROOT_CLASS} [role="listbox"] {
  background-color: var(--db-cg-surface) !important;
  color: var(--db-cg-text) !important;
  border-color: var(--db-cg-border) !important;
  box-shadow: 0 14px 42px var(--db-cg-shadow) !important;
}

/* Composer/input area: rounded #2f2f2f like ChatGPT. */
html.${ROOT_CLASS} form,
html.${ROOT_CLASS} textarea,
html.${ROOT_CLASS} input,
html.${ROOT_CLASS} [contenteditable="true"],
html.${ROOT_CLASS} [class*="input" i],
html.${ROOT_CLASS} [class*="editor" i],
html.${ROOT_CLASS} [class*="composer" i],
html.${ROOT_CLASS} [class*="textarea" i],
html.${ROOT_CLASS} [class*="prompt" i] {
  background-color: var(--db-cg-surface) !important;
  color: var(--db-cg-text) !important;
  caret-color: var(--db-cg-text) !important;
  border-color: var(--db-cg-border-strong) !important;
  box-shadow: none !important;
}

html.${ROOT_CLASS} textarea,
html.${ROOT_CLASS} input,
html.${ROOT_CLASS} [contenteditable="true"] {
  border-radius: 24px !important;
}

html.${ROOT_CLASS} textarea::placeholder,
html.${ROOT_CLASS} input::placeholder,
html.${ROOT_CLASS} [contenteditable="true"]:empty::before {
  color: var(--db-cg-text-muted) !important;
}

/* Buttons and controls. */
html.${ROOT_CLASS} button,
html.${ROOT_CLASS} [role="button"],
html.${ROOT_CLASS} [class*="button" i] {
  color: var(--db-cg-text) !important;
  border-color: var(--db-cg-border) !important;
}

html.${ROOT_CLASS} button:hover,
html.${ROOT_CLASS} [role="button"]:hover,
html.${ROOT_CLASS} [class*="button" i]:hover {
  background-color: var(--db-cg-surface-hover) !important;
}

html.${ROOT_CLASS} button:active,
html.${ROOT_CLASS} [role="button"]:active,
html.${ROOT_CLASS} [class*="button" i]:active {
  background-color: var(--db-cg-surface-active) !important;
}

html.${ROOT_CLASS} button[type="submit"],
html.${ROOT_CLASS} [class*="send" i],
html.${ROOT_CLASS} [aria-label*="发送"],
html.${ROOT_CLASS} [aria-label*="send" i] {
  background-color: var(--db-cg-accent) !important;
  color: #ffffff !important;
  border-color: transparent !important;
}

html.${ROOT_CLASS} button[type="submit"]:hover,
html.${ROOT_CLASS} [class*="send" i]:hover,
html.${ROOT_CLASS} [aria-label*="发送"]:hover,
html.${ROOT_CLASS} [aria-label*="send" i]:hover {
  background-color: var(--db-cg-accent-hover) !important;
}

/* Text, links and common rich response elements. */
html.${ROOT_CLASS} h1,
html.${ROOT_CLASS} h2,
html.${ROOT_CLASS} h3,
html.${ROOT_CLASS} h4,
html.${ROOT_CLASS} h5,
html.${ROOT_CLASS} h6,
html.${ROOT_CLASS} p,
html.${ROOT_CLASS} li,
html.${ROOT_CLASS} label,
html.${ROOT_CLASS} span,
html.${ROOT_CLASS} div {
  color: inherit;
}

html.${ROOT_CLASS} a {
  color: #8ab4f8 !important;
}

html.${ROOT_CLASS} pre,
html.${ROOT_CLASS} code,
html.${ROOT_CLASS} kbd,
html.${ROOT_CLASS} samp,
html.${ROOT_CLASS} [class*="code" i] {
  background-color: var(--db-cg-code) !important;
  color: #f8f8f2 !important;
  border-color: var(--db-cg-border) !important;
}

html.${ROOT_CLASS} blockquote {
  background-color: rgba(255, 255, 255, 0.04) !important;
  border-left-color: var(--db-cg-border-strong) !important;
  color: var(--db-cg-text-soft) !important;
}

html.${ROOT_CLASS} table,
html.${ROOT_CLASS} th,
html.${ROOT_CLASS} td {
  background-color: transparent !important;
  color: var(--db-cg-text) !important;
  border-color: var(--db-cg-border) !important;
}

/* Keep media natural, but darken bright SVG/icon fills that use currentColor. */
html.${ROOT_CLASS} img,
html.${ROOT_CLASS} video,
html.${ROOT_CLASS} canvas,
html.${ROOT_CLASS} picture {
  filter: none !important;
}

html.${ROOT_CLASS} svg,
html.${ROOT_CLASS} svg * {
  color: currentColor;
}

/* Neutralize common white utility classes and inline light backgrounds from Doubao bundles. */
html.${ROOT_CLASS} [style*="background: rgb(255, 255, 255)"],
html.${ROOT_CLASS} [style*="background-color: rgb(255, 255, 255)"],
html.${ROOT_CLASS} [style*="background:#fff"],
html.${ROOT_CLASS} [style*="background: #fff"],
html.${ROOT_CLASS} [style*="background-color:#fff"],
html.${ROOT_CLASS} [style*="background-color: #fff"],
html.${ROOT_CLASS} [class*="white" i] {
  background-color: var(--db-cg-surface) !important;
  color: var(--db-cg-text) !important;
}

html.${ROOT_CLASS} [style*="color: rgb(0, 0, 0)"],
html.${ROOT_CLASS} [style*="color:#000"],
html.${ROOT_CLASS} [style*="color: #000"] {
  color: var(--db-cg-text) !important;
}

/* Selection and scrollbars. */
html.${ROOT_CLASS} ::selection {
  background: rgba(16, 163, 127, 0.45) !important;
  color: #ffffff !important;
}

html.${ROOT_CLASS} ::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

html.${ROOT_CLASS} ::-webkit-scrollbar-track {
  background: transparent;
}

html.${ROOT_CLASS} ::-webkit-scrollbar-thumb {
  background: #565656;
  border: 2px solid transparent;
  border-radius: 999px;
  background-clip: content-box;
}

html.${ROOT_CLASS} ::-webkit-scrollbar-thumb:hover {
  background: #6b6b6b;
  border: 2px solid transparent;
  background-clip: content-box;
}

/* Avoid white flashes from lazy-mounted full-screen containers. */
html.${ROOT_CLASS} body > div,
html.${ROOT_CLASS} [data-radix-portal],
html.${ROOT_CLASS} [class*="portal" i] {
  background-color: transparent;
  color: var(--db-cg-text) !important;
}
`;

  function applyRootClass() {
    document.documentElement.classList.add(ROOT_CLASS);
    if (document.body) {
      document.body.classList.add(ROOT_CLASS);
    }
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    if (typeof GM_addStyle === 'function') {
      const node = GM_addStyle(css);
      if (node) {
        node.id = STYLE_ID;
      }
      return;
    }

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  function markDynamicSurfaces() {
    const nodes = document.querySelectorAll('[style*="255, 255, 255"], [style*="#fff"], [style*="#FFF"]');
    nodes.forEach((node) => {
      if (node instanceof HTMLElement && node.dataset.doubaoDarkFixed !== 'true') {
        node.dataset.doubaoDarkFixed = 'true';
        node.style.setProperty('background-color', 'var(--db-cg-surface)', 'important');
        node.style.setProperty('color', 'var(--db-cg-text)', 'important');
      }
    });
  }

  function boot() {
    applyRootClass();
    injectStyle();
    markDynamicSurfaces();
  }

  boot();

  let scheduled = false;
  const scheduleBoot = () => {
    if (scheduled) {
      return;
    }

    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      applyRootClass();
      markDynamicSurfaces();
    });
  };

  const observer = new MutationObserver(scheduleBoot);

  if (document.documentElement) {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
  }

  window.addEventListener('DOMContentLoaded', boot, { once: true });
})();

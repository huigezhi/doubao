// ==UserScript==
// @name         豆包黑暗模式
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  为豆包(doubao.com)强制启用黑暗模式
// @author       You
// @match        https://www.doubao.com/*
// @match        https://doubao.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // md-box-root 内联style中需要覆盖的暗色变量映射
    const MD_BOX_DARK_VARS = {
        '--md-box-color-fg': 'rgba(255, 255, 255, 0.85)',
        '--md-box-color-fg-muted': 'rgba(255, 255, 255, 0.55)',
        '--md-box-color-bg': 'transparent',
        '--md-box-color-border': 'rgba(255, 255, 255, 0.12)',
        '--md-box-color-accent': '#547cff',
        '--md-box-color-accent-hover': '#4769d9',
        '--md-box-color-surface-muted': 'rgba(255, 255, 255, 0.08)',
        '--md-box-color-surface-subtle': 'rgba(255, 255, 255, 0.04)',
        '--md-box-color-border-emphasis': 'rgba(255, 255, 255, 0.3)',
        '--md-box-color-syntax-text': 'rgba(255, 255, 255, 0.85)',
        '--md-box-color-syntax-doc': 'rgba(255, 255, 255, 0.45)',
        '--md-box-color-syntax-link': '#547cff',
        '--md-box-color-syntax-number': '#f48cca',
        '--md-box-color-syntax-keyword': '#b38cff',
        '--md-box-color-syntax-function': '#f29d79',
        '--md-box-color-syntax-variable': '#80bbff',
        '--md-box-color-syntax-parameter': '#82d99f',
        '--md-box-color-syntax-selection-bg': 'rgba(84, 124, 255, 0.4)',
        '--md-box-color-syntax-selector': '#36b2ab',
        '--md-box-color-syntax-property': '#c99100',
        '--md-box-color-syntax-property-access': '#cc7700',
        '--md-box-color-syntax-inserted': '#70c632',
        '--md-box-color-syntax-url': '#79c0ff',
        '--md-box-color-syntax-atrule': '#a5d6ff',
    };

    // 修复单个 md-box-root 元素的内联style
    function fixMdBoxInlineStyle(el) {
        if (!el || el._darkModeFixed) return;
        el._darkModeFixed = true;
        const style = el.getAttribute('style') || '';
        let newStyle = style;
        for (const [varName, darkValue] of Object.entries(MD_BOX_DARK_VARS)) {
            // 替换内联style中的变量值
            const regex = new RegExp(varName.replace(/([()-])/g, '\\$1') + '\\s*:\\s*[^;]+', 'g');
            newStyle = newStyle.replace(regex, varName + ': ' + darkValue);
        }
        if (newStyle !== style) {
            el.setAttribute('style', newStyle);
        }
    }

    // 扫描并修复所有已有的 md-box-root 元素
    function fixAllMdBoxElements() {
        const mdBoxes = document.querySelectorAll('.md-box-root');
        mdBoxes.forEach(fixMdBoxInlineStyle);
    }

    // 等待 documentElement 可用后再执行
    function initDarkMode() {
        if (!document.documentElement) {
            requestAnimationFrame(initDarkMode);
            return;
        }

        // 设置暗色模式属性
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.setAttribute('data-theme-mode', 'dark');
        document.documentElement.setAttribute('theme-mode', 'dark');
        document.documentElement.style.colorScheme = 'dark';

        // 定义暗色模式CSS变量覆盖
        const darkModeCSS = `
            :root, :root[data-theme="light"], :root[data-theme-mode="light"] {
                /* === s-color 系列变量 === */
                --s-color-text-primary: #fff !important;
                --s-color-text-primary-raw: 255,255,255 !important;
                --s-color-text-secondary: rgba(255,255,255,0.85) !important;
                --s-color-text-tertiary: rgba(255,255,255,0.55) !important;
                --s-color-text-quaternary: rgba(255,255,255,0.35) !important;
                --s-color-text-disable: rgba(255,255,255,0.15) !important;

                --s-color-text-invert-primary: #000 !important;
                --s-color-text-invert-primary-raw: 0,0,0 !important;
                --s-color-text-invert-secondary: rgba(0,0,0,0.85) !important;
                --s-color-text-invert-tertiary: rgba(0,0,0,0.55) !important;
                --s-color-text-invert-quaternary: rgba(0,0,0,0.35) !important;

                --s-color-bg-primary: #232629 !important;
                --s-color-bg-primary-raw: 35,38,41 !important;
                --s-color-bg-secondary: #191c1f !important;
                --s-color-bg-secondary-raw: 25,28,31 !important;
                --s-color-bg-tertiary: #121317 !important;
                --s-color-bg-tertiary-raw: 18,19,23 !important;
                --s-color-bg-quaternary: #0c0c0e !important;
                --s-color-bg-quaternary-raw: 12,12,14 !important;
                --s-color-bg-base: #121317 !important;
                --s-color-bg-base-raw: 18,19,23 !important;
                --s-color-bg-body: #191c1f !important;
                --s-color-bg-body-raw: 25,28,31 !important;
                --s-color-bg-content-base: #1e2123 !important;
                --s-color-bg-content-base-raw: 30,33,35 !important;
                --s-color-bg-float: #232528 !important;
                --s-color-bg-float-raw: 35,37,40 !important;
                --s-color-bg-disable: #444749 !important;
                --s-color-bg-disable-raw: 68,71,73 !important;

                --s-color-bg-invert-primary: #232629 !important;
                --s-color-bg-invert-primary-raw: 35,38,41 !important;
                --s-color-bg-invert-secondary: #191c1f !important;
                --s-color-bg-invert-secondary-raw: 25,28,31 !important;
                --s-color-bg-invert-tertiary: #121317 !important;
                --s-color-bg-invert-tertiary-raw: 18,19,23 !important;
                --s-color-bg-invert-quaternary: #0c0c0e !important;
                --s-color-bg-invert-quaternary-raw: 12,12,14 !important;

                --s-color-bg-dm-fill: hsla(0,0%,100%,0.06) !important;
                --s-color-bg-dm-fill-raw: 255,255,255 !important;
                --s-color-bg-trans: hsla(0,0%,100%,0.06) !important;
                --s-color-bg-trans-raw: 255,255,255 !important;
                --s-color-bg-trans-primary: hsla(0,0%,100%,0.1) !important;
                --s-color-bg-trans-primary-raw: 255,255,255 !important;
                --s-color-bg-trans-secondary: hsla(0,0%,100%,0.15) !important;
                --s-color-bg-trans-secondary-raw: 255,255,255 !important;
                --s-color-bg-trans-tertiary: hsla(0,0%,100%,0.2) !important;
                --s-color-bg-trans-tertiary-raw: 255,255,255 !important;

                --s-color-bg-dialogs: #191c1f !important;
                --s-color-bg-dialogs-raw: 25,28,31 !important;
                --s-color-bg-native-dialog: #2e2e2e !important;
                --s-color-bg-native-dialog-raw: 46,46,46 !important;
                --s-color-bg-tip: #444749 !important;
                --s-color-bg-tip-raw: 68,71,73 !important;
                --s-color-bg-outlined-btn: transparent !important;
                --s-color-bg-outlined-btn-raw: 0,0,0 !important;
                --s-color-bg-outlined-btn-hover: hsla(0,0%,100%,0.06) !important;
                --s-color-bg-outlined-btn-hover-raw: 255,255,255 !important;

                --s-color-border-primary: hsla(0,0%,100%,0.24) !important;
                --s-color-border-primary-raw: 255,255,255 !important;
                --s-color-border-secondary: hsla(0,0%,100%,0.16) !important;
                --s-color-border-secondary-raw: 255,255,255 !important;
                --s-color-border-tertiary: hsla(0,0%,100%,0.12) !important;
                --s-color-border-tertiary-raw: 255,255,255 !important;
                --s-color-border-quaternary: hsla(0,0%,100%,0.08) !important;
                --s-color-border-quaternary-raw: 255,255,255 !important;
                --s-color-border-card: #35373a !important;
                --s-color-border-card-raw: 53,55,58 !important;

                --s-color-brand-primary-default: #547cff !important;
                --s-color-brand-primary-default-raw: 84,124,255 !important;
                --s-color-brand-primary-hover: #4769d9 !important;
                --s-color-brand-primary-hover-raw: 71,105,217 !important;
                --s-color-brand-primary-pressed: #3b57b3 !important;
                --s-color-brand-primary-pressed-raw: 59,87,179 !important;
                --s-color-brand-primary-transparent-1: rgba(84,124,255,0.12) !important;
                --s-color-brand-primary-transparent-2: rgba(84,124,255,0.16) !important;
                --s-color-brand-primary-transparent-3: rgba(84,124,255,0.2) !important;

                --s-color-accents-blue: #547cff !important;
                --s-color-accents-blue-raw: 84,124,255 !important;
                --s-color-accents-green: #35a04f !important;
                --s-color-accents-green-raw: 53,160,79 !important;
                --s-color-accents-yellow: #efb627 !important;
                --s-color-accents-yellow-raw: 239,182,39 !important;
                --s-color-accents-red: #b34444 !important;
                --s-color-accents-red-raw: 179,68,68 !important;
                --s-color-accents-purple: #9246e0 !important;
                --s-color-accents-purple-raw: 146,70,224 !important;
                --s-color-accents-orange: #ff9f0a !important;
                --s-color-accents-orange-raw: 255,159,10 !important;

                --s-color-system-success: #35a04f !important;
                --s-color-system-success-raw: 53,160,79 !important;
                --s-color-system-success-lighten: #092610 !important;
                --s-color-system-success-lighten-raw: 9,38,16 !important;
                --s-color-system-success-darken: #6ee18b !important;
                --s-color-system-success-darken-raw: 110,225,139 !important;
                --s-color-system-alert-lighten: #310b09 !important;
                --s-color-system-alert-lighten-raw: 49,11,9 !important;
                --s-color-system-alert-darken: #ff7067 !important;
                --s-color-system-alert-darken-raw: 255,112,103 !important;
                --s-color-system-warning-lighten: #331e00 !important;
                --s-color-system-warning-lighten-raw: 51,30,0 !important;
                --s-color-system-warning-darken: #fab95d !important;
                --s-color-system-warning-darken-raw: 250,185,93 !important;
                --s-color-system-info: #547cff !important;
                --s-color-system-info-raw: 84,124,255 !important;
                --s-color-system-info-lighten: #111933 !important;
                --s-color-system-info-lighten-raw: 17,25,51 !important;
                --s-color-system-info-darken: #7998ff !important;
                --s-color-system-info-darken-raw: 121,152,255 !important;
                --s-color-alert: #ff453a !important;
                --s-color-alert-raw: 255,69,58 !important;
                --s-color-warning: #ff9f0a !important;
                --s-color-warning-raw: 255,159,10 !important;
                --s-color-element-comment: rgba(239,182,39,0.2) !important;
                --s-color-element-comment-raw: 239,182,39 !important;
                --s-color-suggest: #4d6eda !important;
                --s-color-suggest-raw: 77,110,218 !important;

                /* === dbx 系列变量 === */
                --dbx-text-primary: #ffffffd9 !important;
                --dbx-text-secondary: #ffffff80 !important;
                --dbx-text-tertiary: #ffffff59 !important;
                --dbx-text-disable: #fff3 !important;
                --dbx-text-markdown: #ffffffd9 !important;
                --dbx-text-n00-primary: #000 !important;
                --dbx-text-n00-secondary: #000c !important;
                --dbx-text-n00-tertiary: #0009 !important;
                --dbx-text-n00-disable: #0000004d !important;
                --dbx-text-static-white-primary: #fff !important;
                --dbx-text-static-white-secondary: #fffc !important;
                --dbx-text-static-white-tertiary: #ffffffa6 !important;
                --dbx-text-static-white-disable: #ffffff4d !important;
                --dbx-text-highlight: #77b0ff !important;
                --dbx-text-highlight-secondary: #77b0ff99 !important;
                --dbx-text-highlight-hover: #378dff !important;
                --dbx-text-highlight-disable: #77b0ff4d !important;

                --dbx-bg-base-web: #1f1f1f !important;
                --dbx-bg-base-2: #1a1a1a !important;
                --dbx-bg-body-web: #212121 !important;
                --dbx-bg-body-overlay-web: #ffffff0d !important;
                --dbx-bg-float: #363636 !important;
                --dbx-bg-body-launcher: #2c2c2ccc !important;
                --dbx-bg-body-overlay-launcher: #2c2c2c73 !important;
                --dbx-bg-float-launcher: #2c2c2c99 !important;
                --dbx-bg-body-mac: #212121d9 !important;
                --dbx-bg-base-mac: #00000014 !important;
                --dbx-bg-body-white: #212121 !important;
                --dbx-bg-body-overlay-mac: #ffffff0d !important;
                --dbx-bg-body-overlay-white: #ffffff0d !important;
                --dbx-bg-browser-mac: #303030b3 !important;
                --dbx-bg-browser-win: #303030 !important;
                --dbx-bg-base-3-enterprisebubble: #ffffff0d !important;
                --dbx-bg-base-4-action: #fff !important;
                --dbx-bg-base-5: #1a1a1a !important;
                --dbx-bg-mask: #0009 !important;

                --dbx-fill-trans-10: #ffffff0a !important;
                --dbx-fill-trans-10-hover: #ffffff14 !important;
                --dbx-fill-trans-10-disable: #ffffff0a !important;
                --dbx-fill-trans-20: #ffffff14 !important;
                --dbx-fill-trans-20-hover: #ffffff1f !important;
                --dbx-fill-trans-20-disable: #ffffff14 !important;
                --dbx-fill-trans-30: #ffffff1a !important;
                --dbx-fill-trans-30-hover: #ffffff24 !important;
                --dbx-fill-trans-30-disable: #ffffff1a !important;
                --dbx-fill-static-white: #fff !important;
                --dbx-fill-static-white-hover: #ffffffd9 !important;
                --dbx-fill-static-white-disable: #fff3 !important;
                --dbx-fill-static-white-20-disable: #fff3 !important;
                --dbx-fill-highlight-trans-10: #ffffff12 !important;
                --dbx-fill-highlight: #378dff !important;
                --dbx-fill-highlight-hover: #006ce0 !important;
                --dbx-fill-highlight-disable: #378dff66 !important;
                --dbx-fill-banner: #575757 !important;
                --dbx-fill-highlight-trans-10-blank: #fff0 !important;
                --dbx-fill-primary-50: #0a84ff !important;
                --dbx-fill-primary-60: #0970d9 !important;
                --dbx-fill-primary-transparent-1: #66a4ff1f !important;

                --dbx-line-divider-5: #ffffff0d !important;
                --dbx-line-divider-10: #ffffff1a !important;
                --dbx-line-10: #ffffff1a !important;
                --dbx-line-15: #ffffff26 !important;
                --dbx-line-20-hover: #ffffff4d !important;
                --dbx-line-highlight: #77b0ff80 !important;
                --dbx-line-7: #ffffff1a !important;

                --dbx-brand-default: #06f !important;
                --dbx-function-danger: #ff3b30 !important;
                --dbx-function-danger-hover: #f96961 !important;
                --dbx-function-danger-disable: #ff3b304d !important;
                --dbx-function-warning: #ff9500 !important;
                --dbx-function-success: #34c759 !important;
                --dbx-function-info: #378dff !important;
                --dbx-function-info-hover: #006ce0 !important;
                --dbx-function-info-disable: #378dff66 !important;

                --dbx-static-white: #fff !important;
                --dbx-static-black: #000 !important;
                --dbx-neutral-00: #000 !important;
                --dbx-neutral-50: #0d0d0d !important;
                --dbx-neutral-100: #1a1a1a !important;
                --dbx-neutral-200: #333 !important;
                --dbx-neutral-300: #4d4d4d !important;
                --dbx-neutral-400: #666 !important;
                --dbx-neutral-500: gray !important;
                --dbx-neutral-600: #999 !important;
                --dbx-neutral-700: #b2b2b2 !important;
                --dbx-neutral-800: #ccc !important;
                --dbx-neutral-900: #e5e5e5 !important;
                --dbx-neutral-1000: #fff !important;

                --dbx-code-text: #ffffffd9 !important;
                --dbx-code-doc: #ffffff80 !important;
                --dbx-code-link: #77b0ff !important;
                --dbx-code-number: #f48cca !important;
                --dbx-code-keycontrol: #b38cff !important;
                --dbx-code-function: #f29d79 !important;
                --dbx-code-variable: #80bbff !important;
                --dbx-code-parameter: #82d99f !important;
                --dbx-code-attributes: #ded47e !important;
                --dbx-code-tag: #f2858c !important;

                --dbx-color-yellow-800: #ffeab0 !important;
                --dbx-color-yellow-700: #ffe08b !important;
                --dbx-color-yellow-600: #ffd65f !important;
                --dbx-color-yellow-500: #fc0 !important;
                --dbx-color-yellow-400: #e2b500 !important;
                --dbx-color-yellow-300: #c89f00 !important;
                --dbx-color-yellow-200: #a38200 !important;
                --dbx-color-yellow-100: #846800 !important;
                --dbx-color-red-800: #ffd6d0 !important;
                --dbx-color-red-700: #ffb0a5 !important;
                --dbx-color-red-600: #ff7f70 !important;
                --dbx-color-red-500: #ff4f42 !important;
                --dbx-color-red-400: #f0000e !important;
                --dbx-color-red-300: #c10009 !important;
                --dbx-color-red-200: #990005 !important;
                --dbx-color-red-100: #730003 !important;
                --dbx-color-orange-800: #ffdebd !important;
                --dbx-color-orange-700: #ffc281 !important;
                --dbx-color-orange-600: #ffaf53 !important;
                --dbx-color-orange-500: #ff9f0a !important;
                --dbx-color-orange-400: #ed9300 !important;
                --dbx-color-orange-300: #d88600 !important;
                --dbx-color-orange-200: #bc7300 !important;
                --dbx-color-orange-100: #a06100 !important;
                --dbx-color-green-800: #cdfecd !important;
                --dbx-color-green-700: #89fd8f !important;
                --dbx-color-green-600: #38f556 !important;
                --dbx-color-green-500: #32df4d !important;
                --dbx-color-green-400: #2dcc46 !important;
                --dbx-color-green-300: #27b63e !important;
                --dbx-color-green-200: #219d34 !important;
                --dbx-color-green-100: #1a852b !important;
                --dbx-color-blue-800: #d6e6ff !important;
                --dbx-color-blue-700: #afd0ff !important;
                --dbx-color-blue-600: #77b0ff !important;
                --dbx-color-blue-500: #378dff !important;
                --dbx-color-blue-400: #006ce0 !important;
                --dbx-color-blue-300: #0054b0 !important;
                --dbx-color-blue-200: #003a7e !important;
                --dbx-color-blue-130: #003a7e !important;
                --dbx-color-blue-100: #002658 !important;
                --dbx-color-purple-800: #ecd3fb !important;
                --dbx-color-purple-700: #d9a6f7 !important;
                --dbx-color-purple-600: #cb7ef5 !important;
                --dbx-color-purple-500: #c160f3 !important;
                --dbx-color-purple-400: #b736f1 !important;
                --dbx-color-purple-300: #a42dd8 !important;
                --dbx-color-purple-200: #8824b5 !important;
                --dbx-color-purple-100: #721c98 !important;
                --dbx-color-red-tag: #ff442b !important;

                /* === md-box 系列变量 === */
                --md-box-samantha-normal-text-color: rgba(255,255,255,0.85) !important;
                --md-box-global-text-color: rgba(255,255,255,0.85) !important;
                --md-box-body-color: rgba(255,255,255,0.85) !important;
                --md-box-heading-color: #fff !important;
                --md-box-heading-strong-color: #fff !important;
                --md-box-blockquote-border-color: hsla(0,0%,100%,0.24) !important;
                --md-box-blockquote-text-color: rgba(255,255,255,0.7) !important;
                --md-box-code-bg-color: #121317 !important;
                --md-box-code-text-color: #fff !important;
                --md-box-link-color: #547cff !important;
                --md-box-link-hover-color: #7998ff !important;
                --md-box-table-border-color: hsla(0,0%,100%,0.16) !important;
                --md-box-table-stripe-bg-color: hsla(0,0%,100%,0.04) !important;
                --md-box-hr-border-color: hsla(0,0%,100%,0.16) !important;
                --md-box-mark-bg-color: rgba(84,124,255,0.3) !important;
                --md-box-mark-text-color: #fff !important;
                --md-box-img-bg-color: #121317 !important;
                --md-box-checkbox-bg-color: #232528 !important;
                --md-box-checkbox-border-color: hsla(0,0%,100%,0.24) !important;
                --md-box-kbd-bg-color: #232528 !important;
                --md-box-kbd-border-color: hsla(0,0%,100%,0.24) !important;
                --md-box-kbd-text-color: rgba(255,255,255,0.85) !important;

                /* === GitHub Primer CSS 变量 === */
                --color-text-primary: #c9d1d9 !important;
                --color-text-secondary: #8b949e !important;
                --color-text-tertiary: #8b949e !important;
                --color-text-link: #539bf5 !important;
                --color-fg-default: #c9d1d9 !important;
                --color-fg-muted: #8b949e !important;
                --color-fg-subtle: #6e7681 !important;
                --color-fg-on-emphasis: #fff !important;
                --color-canvas-default: #0d1117 !important;
                --color-canvas-subtle: #161b22 !important;
                --color-canvas-inset: #010409 !important;
                --color-border-default: #30363d !important;
                --color-border-muted: #21262d !important;
                --color-neutral-muted: rgba(110,118,129,0.4) !important;
                --color-accent-fg: #539bf5 !important;
                --color-success-fg: #3fb950 !important;
                --color-warning-fg: #d29922 !important;
                --color-danger-fg: #f85149 !important;
                --color-prettylights-syntax-comment: #8b949e !important;
                --color-prettylights-syntax-constant: #79c0ff !important;
                --color-prettylights-syntax-string: #a5d6ff !important;
                --color-prettylights-syntax-keyword: #ff7b72 !important;
                --color-prettylights-syntax-entity: #d2a8ff !important;
                --color-prettylights-syntax-variable: #ffa657 !important;
                --color-prettylights-syntax-markup-heading: #1f6feb !important;
                --color-prettylights-syntax-markup-list: #f2cc60 !important;
            }

            html, body {
                background-color: #191c1f !important;
                color: #fff !important;
            }

            input, textarea, [contenteditable] {
                background-color: #232528 !important;
                color: #fff !important;
                border-color: hsla(0,0%,100%,0.12) !important;
            }

            ::selection {
                background-color: rgba(84,124,255,0.3) !important;
                color: #fff !important;
            }

            a {
                color: #547cff !important;
            }
            a:hover {
                color: #7998ff !important;
            }

            pre, code {
                background-color: #121317 !important;
            }

            [class*="mask"], [class*="overlay"] {
                background-color: rgba(0,0,0,0.7) !important;
            }

            img:not([src*="logo"]):not([src*="icon"]) {
                filter: brightness(0.9);
            }

            [class*="skeleton"] {
                background: linear-gradient(90deg, #232528 25%, #2a2d30 50%, #232528 75%) !important;
                background-size: 200% 100% !important;
            }

            /* === md-box-root AI回复内容强制暗色 === */
            /* 注意：不用 .md-box-root * 通配符，避免覆盖代码语法高亮span */
            .md-box-root,
            .md-box-root p,
            .md-box-root li,
            .md-box-root td,
            .md-box-root th,
            .md-box-root div:not(pre):not(code),
            .md-box-root blockquote,
            .md-box-root strong,
            .md-box-root em,
            .md-box-root h1,
            .md-box-root h2,
            .md-box-root h3,
            .md-box-root h4,
            .md-box-root h5,
            .md-box-root h6,
            .md-box-root label,
            .md-box-root summary,
            .md-box-root details,
            .md-box-root figcaption,
            .md-box-root dt,
            .md-box-root dd,
            .md-box-root ul,
            .md-box-root ol,
            /* span只在非代码块内强制白色，代码块内的span保留语法高亮 */
            .md-box-root > div > span,
            .md-box-root > div > p > span,
            .md-box-root > div > li > span,
            .md-box-root > div > blockquote > span,
            .md-box-root > div > strong > span,
            .md-box-root > div > em > span,
            .md-box-root > div > h1 > span,
            .md-box-root > div > h2 > span,
            .md-box-root > div > h3 > span,
            .md-box-root > div > h4 > span,
            .md-box-root > div > h5 > span,
            .md-box-root > div > h6 > span,
            .md-box-root > div > td > span,
            .md-box-root > div > th > span,
            .md-box-root > div > dd > span,
            .md-box-root > div > dt > span,
            .md-box-root > div > details > span,
            .md-box-root > div > summary > span,
            .md-box-root > div > figcaption > span,
            .md-box-root > div > label > span {
                color: rgba(255,255,255,0.85) !important;
            }

            .md-box-root h1, .md-box-root h2, .md-box-root h3,
            .md-box-root h4, .md-box-root h5, .md-box-root h6 {
                color: #fff !important;
                border-bottom-color: hsla(0,0%,100%,0.16) !important;
            }

            .md-box-root a {
                color: #547cff !important;
            }
            .md-box-root a:hover {
                color: #7998ff !important;
            }

            .md-box-root pre,
            .md-box-root code {
                background-color: #121317 !important;
                border-color: hsla(0,0%,100%,0.16) !important;
            }

            /* 代码块外层容器 */
            .md-box-root [class*="code-block-element"],
            .md-box-root [class*="custom-code-block-container"] {
                background-color: #121317 !important;
                border-color: hsla(0,0%,100%,0.12) !important;
            }

            /* 代码块区域容器（真正设置亮色背景的层） */
            .md-box-root [class*="code-block-element"] [class*="code-area"],
            .md-box-root [class*="custom-code-block-container"] [class*="code-area"] {
                background-color: #121317 !important;
                border-color: hsla(0,0%,100%,0.12) !important;
                border-radius: 6px !important;
            }

            /* 代码块头部外层 */
            .md-box-root [class*="code-block-element"] [class*="header-wrapper"],
            .md-box-root [class*="custom-code-block-container"] [class*="header-wrapper"] {
                background-color: #1a1d21 !important;
            }

            /* 代码块头部内层（真正设置亮色背景的层） */
            .md-box-root [class*="code-block-element"] [class*="header-"],
            .md-box-root [class*="custom-code-block-container"] [class*="header-"] {
                background-color: #1a1d21 !important;
                border-bottom-color: hsla(0,0%,100%,0.08) !important;
                color: rgba(255,255,255,0.6) !important;
            }

            /* 代码块语言标签 */
            .md-box-root [class*="code-block-element"] [class*="title-"][class*="clickable"],
            .md-box-root [class*="custom-code-block-container"] [class*="title-"][class*="clickable"],
            .md-box-root [class*="code-block-element"] [class*="text-OkYU"],
            .md-box-root [class*="custom-code-block-container"] [class*="text-OkYU"] {
                color: rgba(255,255,255,0.6) !important;
            }

            /* 代码块内容区域（真正设置亮色背景的层） */
            .md-box-root [class*="code-block-element"] [class*="content-"][class*="code-content"],
            .md-box-root [class*="custom-code-block-container"] [class*="content-"][class*="code-content"] {
                background-color: #121317 !important;
                border-color: hsla(0,0%,100%,0.08) !important;
            }

            /* === 代码块语法高亮暗色变量覆盖 === */
            /* 覆盖 .container-S2LAkl 的 --code-*_v3 亮色变量为暗色值 */
            .container-S2LAkl {
                --code-text_v3: #ffffffd9 !important;
                --code-doc_v3: #ffffff80 !important;
                --code-Link_v3: #709cf2 !important;
                --code-number_v3: #d389cb !important;
                --code-keycontrol_v3: #9d89eb !important;
                --code-function_v3: #f29d79 !important;
                --code-variable_v3: #ffffffd9 !important;
                --code-parameter_v3: #69bd8b !important;
                --code-attributes_v3: #ded47e !important;
                --code-selection-bg-color: #315779 !important;
            }

            /* 覆盖 .container-LGLIst 的 --md-box-color-syntax-* 变量 */
            .container-LGLIst {
                --md-box-color-syntax-text: rgba(255,255,255,0.85) !important;
                --md-box-color-syntax-doc: rgba(255,255,255,0.5) !important;
                --md-box-color-syntax-link: #709cf2 !important;
                --md-box-color-syntax-number: #d389cb !important;
                --md-box-color-syntax-keyword: #b57edc !important;
                --md-box-color-syntax-function: #f29d79 !important;
                --md-box-color-syntax-variable: rgba(255,255,255,0.85) !important;
                --md-box-color-syntax-parameter: #69bd8b !important;
                --md-box-color-syntax-selection-bg: rgba(49,87,121,0.8) !important;
                --md-box-color-syntax-selector: #36b2ab !important;
                --md-box-color-syntax-property: #c99100 !important;
                --md-box-color-syntax-property-access: #cc7700 !important;
                --md-box-color-syntax-inserted: #70c632 !important;
                --md-box-color-syntax-url: #79c0ff !important;
                --md-box-color-syntax-atrule: #a5d6ff !important;
            }

            /* 覆盖硬编码 rgb() 值的 token 规则（这些不使用CSS变量） */
            .container-S2LAkl code[class*="language-"] .token.instruction {
                color: #b57edc !important;
            }
            .container-S2LAkl code[class*="language-"] .token.selector {
                color: #36b2ab !important;
            }
            .container-S2LAkl code[class*="language-"] .token.attr-name,
            .container-S2LAkl code[class*="language-"] .token.property {
                color: #c99100 !important;
            }
            .container-S2LAkl code[class*="language-"] .token.char,
            .container-S2LAkl code[class*="language-"] .token.inserted {
                color: #70c632 !important;
            }
            .container-S2LAkl code[class*="language-"] .token.property-access {
                color: #cc7700 !important;
            }
            .container-S2LAkl code[class*="language-"] .token.builtin,
            .container-S2LAkl code[class*="language-"] .token.function {
                color: #f29d79 !important;
            }
            .container-S2LAkl code[class*="language-"] .language-css .token.string,
            .container-S2LAkl code[class*="language-"] .style,
            .container-S2LAkl code[class*="language-"] .token.url {
                color: #79c0ff !important;
            }
            .container-S2LAkl code[class*="language-"] .token.atrule {
                color: #a5d6ff !important;
            }
            /* 修复暗色模式下看不清的token（使用硬编码黑色值的token） */
            .container-S2LAkl code[class*="language-"] .token.comment,
            .container-S2LAkl code[class*="language-"] .token.prolog,
            .container-S2LAkl code[class*="language-"] .token.doctype,
            .container-S2LAkl code[class*="language-"] .token.cdata {
                color: rgba(255,255,255,0.5) !important;
            }
            .container-S2LAkl code[class*="language-"] .token.operator,
            .container-S2LAkl code[class*="language-"] .token.punctuation,
            .container-S2LAkl code[class*="language-"] .token.entity,
            .container-S2LAkl code[class*="language-"] .token.url {
                color: rgba(255,255,255,0.7) !important;
            }
            .container-S2LAkl code[class*="language-"] .token.tag,
            .container-S2LAkl code[class*="language-"] .token.class-name {
                color: #569cd6 !important;
            }
            .container-S2LAkl code[class*="language-"] .token.variable,
            .container-S2LAkl code[class*="language-"] .token.constant,
            .container-S2LAkl code[class*="language-"] .token.symbol,
            .container-S2LAkl code[class*="language-"] .token.deleted {
                color: #fff !important;
            }

            .md-box-root blockquote {
                border-left-color: hsla(0,0%,100%,0.24) !important;
            }

            .md-box-root table {
                border-color: hsla(0,0%,100%,0.16) !important;
            }
            .md-box-root th {
                background-color: hsla(0,0%,100%,0.06) !important;
                border-color: hsla(0,0%,100%,0.16) !important;
            }
            .md-box-root td {
                border-color: hsla(0,0%,100%,0.16) !important;
            }

            .md-box-root hr {
                border-color: hsla(0,0%,100%,0.16) !important;
            }

            .md-box-root mark {
                background-color: rgba(84,124,255,0.3) !important;
                color: #fff !important;
            }

            /* 覆盖 thinking-box（思考过程）的文字颜色 */
            .thinking-box,
            .thinking-box *,
            [class*="thinking"],
            [class*="thinking"] * {
                color: rgba(255,255,255,0.7) !important;
            }

            /* 覆盖 code-canvas 代码块主题 */
            [class*="code-canvas"][data-theme="dark"],
            [class*="code-canvas"][data-theme="dark"] * {
                color: #c9d1d9 !important;
            }

            /* flow-markdown-body 兼容（部分页面可能使用） */
            .flow-markdown-body,
            .flow-markdown-body p,
            .flow-markdown-body li,
            .flow-markdown-body td,
            .flow-markdown-body th,
            .flow-markdown-body div:not(pre):not(code),
            .flow-markdown-body blockquote,
            .flow-markdown-body strong,
            .flow-markdown-body em,
            .flow-markdown-body h1,
            .flow-markdown-body h2,
            .flow-markdown-body h3,
            .flow-markdown-body h4,
            .flow-markdown-body h5,
            .flow-markdown-body h6,
            .flow-markdown-body ul,
            .flow-markdown-body ol {
                color: rgba(255,255,255,0.85) !important;
            }
            .flow-markdown-body a {
                color: #547cff !important;
            }
            .flow-markdown-body pre,
            .flow-markdown-body code {
                background-color: #121317 !important;
                border-color: hsla(0,0%,100%,0.16) !important;
            }

            /* flow-markdown-body 代码块外层容器 */
            .flow-markdown-body [class*="code-block-element"],
            .flow-markdown-body [class*="custom-code-block-container"] {
                background-color: #121317 !important;
                border-color: hsla(0,0%,100%,0.12) !important;
            }

            /* flow-markdown-body 代码块区域容器 */
            .flow-markdown-body [class*="code-block-element"] [class*="code-area"],
            .flow-markdown-body [class*="custom-code-block-container"] [class*="code-area"] {
                background-color: #121317 !important;
                border-color: hsla(0,0%,100%,0.12) !important;
            }

            /* flow-markdown-body 代码块头部 */
            .flow-markdown-body [class*="code-block-element"] [class*="header-wrapper"],
            .flow-markdown-body [class*="custom-code-block-container"] [class*="header-wrapper"],
            .flow-markdown-body [class*="code-block-element"] [class*="header-"],
            .flow-markdown-body [class*="custom-code-block-container"] [class*="header-"] {
                background-color: #1a1d21 !important;
                border-bottom-color: hsla(0,0%,100%,0.08) !important;
                color: rgba(255,255,255,0.6) !important;
            }

            /* flow-markdown-body 代码块内容区域 */
            .flow-markdown-body [class*="code-block-element"] [class*="content-"][class*="code-content"],
            .flow-markdown-body [class*="custom-code-block-container"] [class*="content-"][class*="code-content"] {
                background-color: #121317 !important;
            }

            /* 通用代码块容器暗色覆盖（兜底方案） */
            div[class*="code"] pre,
            div[class*="Code"] pre,
            div[class*="mdx-marker"] pre,
            div[class*="mdx-marker"] code {
                background-color: #121317 !important;
            }

            /* 针对豆包特有代码块组件 */
            [class*="code-card"],
            [class*="codeCard"] {
                background-color: #121317 !important;
                border-color: hsla(0,0%,100%,0.12) !important;
            }

            /* 代码块内按钮（复制、展开、运行等）—— 豆包使用div而非button */
            .md-box-root [class*="code-block-element"] [class*="action-"] [class*="hoverable"],
            .md-box-root [class*="custom-code-block-container"] [class*="action-"] [class*="hoverable"],
            .md-box-root [class*="code-block-element"] [class*="code-area"] [class*="hoverable"],
            .md-box-root [class*="custom-code-block-container"] [class*="code-area"] [class*="hoverable"],
            .flow-markdown-body [class*="code-block-element"] [class*="action-"] [class*="hoverable"],
            .flow-markdown-body [class*="custom-code-block-container"] [class*="action-"] [class*="hoverable"],
            .flow-markdown-body [class*="code-block-element"] [class*="code-area"] [class*="hoverable"],
            .flow-markdown-body [class*="custom-code-block-container"] [class*="code-area"] [class*="hoverable"] {
                background-color: transparent !important;
                color: rgba(255,255,255,0.6) !important;
                border-color: hsla(0,0%,100%,0.12) !important;
            }
            .md-box-root [class*="code-block-element"] [class*="action-"] [class*="hoverable"]:hover,
            .md-box-root [class*="custom-code-block-container"] [class*="action-"] [class*="hoverable"]:hover,
            .md-box-root [class*="code-block-element"] [class*="code-area"] [class*="hoverable"]:hover,
            .md-box-root [class*="custom-code-block-container"] [class*="code-area"] [class*="hoverable"]:hover,
            .flow-markdown-body [class*="code-block-element"] [class*="action-"] [class*="hoverable"]:hover,
            .flow-markdown-body [class*="custom-code-block-container"] [class*="action-"] [class*="hoverable"]:hover,
            .flow-markdown-body [class*="code-block-element"] [class*="code-area"] [class*="hoverable"]:hover,
            .flow-markdown-body [class*="custom-code-block-container"] [class*="code-area"] [class*="hoverable"]:hover {
                background-color: hsla(0,0%,100%,0.08) !important;
                color: #fff !important;
            }
        `;

        // 添加样式到页面
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(darkModeCSS);
        } else {
            const style = document.createElement('style');
            style.textContent = darkModeCSS;
            if (document.head) {
                document.head.appendChild(style);
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    document.head.appendChild(style);
                });
            }
        }

        // 监听 data-theme 和 data-theme-mode 属性变化
        const themeObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes') {
                    const attr = mutation.attributeName;
                    if (attr === 'data-theme' || attr === 'data-theme-mode' || attr === 'theme-mode') {
                        const el = document.documentElement;
                        if (el.getAttribute('data-theme') !== 'dark') {
                            el.setAttribute('data-theme', 'dark');
                        }
                        if (el.getAttribute('data-theme-mode') !== 'dark') {
                            el.setAttribute('data-theme-mode', 'dark');
                        }
                        if (el.getAttribute('theme-mode') !== 'dark') {
                            el.setAttribute('theme-mode', 'dark');
                        }
                    }
                }
            }
        });

        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme', 'data-theme-mode', 'theme-mode']
        });

        // 监听 DOM 变化，修复新出现的 md-box-root 元素的内联style
        const mdBoxObserver = new MutationObserver((mutations) => {
            let needFix = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    needFix = true;
                    break;
                }
            }
            if (needFix) {
                fixAllMdBoxElements();
            }
        });

        // 初始修复 + 启动观察
        fixAllMdBoxElements();

        if (document.body) {
            mdBoxObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                mdBoxObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                fixAllMdBoxElements();
            });
        }

        console.log('[豆包黑暗模式] 已启用 v1.7 - 基于实际DOM结构修复代码块暗色模式');
    }

    // 启动初始化
    initDarkMode();
})();

# Doubao Dark Mode

一个适配 [豆包网页版聊天页](https://www.doubao.com/chat/) 的油猴 / Tampermonkey 深色模式脚本：深灰页面背景、黑色侧边栏、圆角输入框、柔和边框和绿色发送按钮。

## 安装

1. 安装浏览器扩展 [Tampermonkey](https://www.tampermonkey.net/) 或其他兼容 UserScript 的管理器。
2. 打开本仓库中的 `doubao-chatgpt-dark.user.js`。
3. 将脚本内容复制到 Tampermonkey 的新建脚本中并保存。
4. 访问 `https://www.doubao.com/chat/`，脚本会自动启用。

## 功能

- 自动匹配 `https://www.doubao.com/chat/` 及其子路径。
- 使用接近 ChatGPT 的深色配色：`#212121` 主背景、`#171717` 侧边栏、`#2f2f2f` 输入区。
- 覆盖常见的豆包聊天页区域：侧边栏、顶部栏、聊天消息、输入框、弹窗、菜单、代码块和滚动条。
- 通过 `MutationObserver` 处理页面动态加载和内联浅色背景，减少切换会话或打开弹窗时出现白块。
- 不反转图片、视频和画布，避免媒体内容失真。


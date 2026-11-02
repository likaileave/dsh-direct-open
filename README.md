<p align="center">
  <img src="https://gcore.jsdelivr.net/gh/likaileave/dsh-direct-open@main/icon.svg" width="72" height="72" alt="dsh-direct-open icon">
</p>

<h1 align="center">dsh-direct-open</h1>

<p align="center">让 DSH 的文件入口左键直接用系统默认程序打开，并提供可配置的右键菜单。</p>

<p align="center">
  <a href="https://github.com/likaileave/dsh-direct-open/releases"><img alt="GitHub release" src="https://img.shields.io/github/v/release/likaileave/dsh-direct-open"></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/github/license/likaileave/dsh-direct-open"></a>
  <a href="https://github.com/topics/dsh-plugin"><img alt="DeepSeek Harness plugin" src="https://img.shields.io/badge/DeepSeek%20Harness-dsh--plugin-4D6BFE"></a>
</p>

<p align="center">
  <a href="#中文">中文</a> · <a href="#english">English</a> · <a href="CHANGELOG.md">Changelog</a>
</p>

> **AI 生成声明**：本项目的代码、文档和图标由 AI 辅助生成，并经人工审核、修改和测试；发布者对最终发布内容负责。
>
> **AI-generated notice**: The code, documentation, and icon in this project were generated with AI assistance, then reviewed, modified, and tested by a human; the publisher is responsible for the released content.

## 中文

`dsh-direct-open` 是一个纯客户端 DSH 插件：它接管回复里的文件入口，把左键从「只进 DSH 侧边栏」改成用系统默认程序打开，并为这些入口提供一个独立的右键菜单。插件不启动额外进程，也不修改 DSH 的 Host 配置。

### 功能

- **左键直接打开**：交付文件卡片、改动卡片里的文件行、正文中的文件提及，点击后用系统默认程序打开对应路径。
- **三种左键动作**：可以改成「在文件管理器中定位」或「在 DSH 侧边栏中查看」；默认仍保留 DSH 原有的侧边栏行为作为可选项。
- **修饰键放行**：默认按住 `Shift` 时不接管左键，交给 DSH 原来的点击逻辑；可在设置里改成 `Ctrl`、`Alt` 或完全不放行。
- **五项右键菜单**：用默认程序打开、在文件管理器中定位、在 DSH 侧边栏中查看、复制绝对路径、复制相对路径。菜单支持键盘方向键、`Enter` 和 `Escape`。
- **悬停提示跟随动作**：不按放行修饰键时显示当前左键动作，按住放行修饰键时恢复原来的「在侧边栏预览」；交付卡片上的可见文案也会同步切换。
- **按入口开关**：交付卡、改动卡、文件提及可以分别启用或停用，左键和右键各自独立设置。
- **设置页**：位于「设置 → 打开方式」，包含总开关、可用性状态、入口开关、左键动作、放行修饰键、右键菜单项目、诊断选项，以及设置导入 / 导出和恢复默认。
- **快捷键**：桌面端默认 `Ctrl/Cmd + Alt + Shift + O` 暂停或恢复直接打开；Web 端不设置默认键。

### 支持的入口

| 入口 | 位置 | 说明 |
|---|---|---|
| 交付文件卡片 | 回复末尾的 `data-presented-file` 卡片 | 点击卡片里的预览按钮；卡片内其它按钮不接管 |
| 改动卡片（单文件） | 单个文件的标题行 | 接管标题行按钮，路径来自 DSH 的隐藏描述节点 |
| 改动卡片（多文件） | 多文件列表的每一行 | 只接管文件行，不接管「已编辑 N 个文件」卡片头 |
| 正文文件提及 | 回复正文里的行内文件引用 | 同时覆盖行内代码提及和显式文件链接 |

以下入口**不会**被接管：多文件卡片的整体标题行、review 页面、普通行内代码（不是文件提及的代码片段）。

### 左键行为

默认左键动作为「用系统默认程序打开」。

| 设置 | 行为 |
|---|---|
| 用系统默认程序打开 | 调用 DSH 的 `remote.session.openWorkspacePath({ path })` |
| 在文件管理器中定位 | 调用 `openWorkspacePath({ path, action: "reveal" })` |
| 在 DSH 侧边栏中查看 | 把点击交回 DSH，触发入口原本的侧边栏预览 |
| 按住放行修饰键 | 不接管本次点击，交给 DSH 原有行为 |

放行修饰键默认是 `Shift`。例如左键动作设为「用默认程序打开」后，直接点击会打开文件，按住 `Shift` 点击则仍然进入 DSH 侧边栏。

### 右键菜单

启用自定义菜单后，右键点击上述入口会打开插件菜单：

| 菜单项 | 行为 |
|---|---|
| 用默认程序打开 | 用系统默认程序打开文件 |
| 在文件管理器中定位 | 在资源管理器 / Finder 中选中文件 |
| 在 DSH 侧边栏中查看 | 触发入口原本的侧边栏预览 |
| 复制绝对路径 | 复制解析后的绝对路径 |
| 复制相对路径 | 相对当前会话工作目录复制路径；无法相对化时复制绝对路径 |

菜单项可以逐项关闭；关闭「启用自定义右键菜单」后，右键完全交回 DSH 页面处理。菜单打开时会自动避开视口边缘，点击菜单外、按 `Escape`、滚动页面、调整窗口大小或窗口失焦都会关闭。

### 设置

设置页位于 **设置 → 打开方式**，修改后立即生效，并在同一浏览器的多个标签页之间同步。

| 设置组 | 内容 |
|---|---|
| 总开关 | 暂停 / 恢复所有接管；关闭后所有入口恢复 DSH 默认行为，设置仍保留 |
| 可用性 | 只读状态：当前环境是否提供系统打开能力 |
| 左键 | 三个入口的开关、左键动作、放行修饰键 |
| 右键菜单 | 菜单总开关、三个入口的菜单开关、五个菜单项开关 |
| 诊断 | 打开失败提示、复制成功提示、调试日志 |
| 设置管理 | 恢复默认、导出 JSON、导入 JSON |

设置保存在浏览器 `localStorage` 的 `dsh-direct-open:settings:v1` 键中。换浏览器、换 profile 或清除站点数据后不会自动迁移；可以用设置页的导出 / 导入搬家。

### 快捷键

| 平台 | 默认快捷键 |
|---|---|
| Windows / macOS / Linux 桌面端 | `Ctrl/Cmd + Alt + Shift + O` |
| Web 端 | 不设置默认键 |

快捷键用于暂停 / 恢复直接打开，可以在 DSH 的快捷键设置里修改。若与其它插件冲突，DSH 会按快捷键注册规则处理。

### 安装

需要 DSH `0.2.0-rc.2` 或更高版本，并且运行在提供 `remote.session.openWorkspacePath` 的桌面端。

**npm**

```sh
dsh plugin --profile desktop add dsh-direct-open
```

**从 dsh-market 安装**

在 dsh-market 中搜索 `dsh-direct-open` 安装。

**从 GitHub Release 手动安装**

1. 从 [Releases](https://github.com/likaileave/dsh-direct-open/releases) 下载 `dsh-direct-open.tgz`。
2. 执行：

```sh
dsh plugin --profile desktop add ./dsh-direct-open.tgz
```

**从源码安装**

```sh
git clone https://github.com/likaileave/dsh-direct-open.git
dsh plugin --profile desktop add ./dsh-direct-open
```

把 `desktop` 换成你实际使用的 profile。安装或更新后刷新 Web 页面；设置页在「打开方式」。

### 数据位置

设置只保存在浏览器本地：

```text
localStorage["dsh-direct-open:settings:v1"]
```

插件不写 Host 配置文件，不上传路径，也不发送遥测。复制的路径只会在你主动点击「复制绝对路径 / 复制相对路径」时进入系统剪贴板。

### 已知限制

- **依赖 DSH 的 DOM 结构**：插件通过 `data-presented-file`、`data-changed-files`、`fileMention` 等标记识别入口。DSH 大版本改动这些标记时，需要同步更新插件。
- **仅桌面端可用**：Web 端没有 `remote.session` 的系统打开能力。检测不到能力时，左键和右键都不接管，设置页会显示不可用。
- **相对路径依赖会话工作目录**：正文提及可能是相对路径，插件会用当前会话的 `cwd` 拼接；没有活动会话或 cwd 时不会接管点击，并在控制台记录原因。
- **不接管多文件卡片头**：多文件卡片的「已编辑 N 个文件」标题行和展开 / 收起按钮保持 DSH 原行为，只接管每个文件行。
- **侧边栏动作是回放原点击**：选择「在 DSH 侧边栏中查看」时，插件会触发入口元素原本的 click；如果 DSH 以后改掉这个入口的内部实现，侧边栏动作可能失效。
- **右键不再弹原生菜单**：启用自定义菜单后，右键由插件接管，包括按住修饰键时；需要原生菜单时可在设置里关闭「启用自定义右键菜单」。
- **不支持指定应用**：只有系统默认程序打开和文件管理器定位，不提供「用某个指定应用打开」。
- **悬停提示的刷新时机**：交付卡片的可见文案会立即切换；原生 `title` 提示在部分平台上需要先把鼠标移出再移入，才能看到新文字。
- **设置不跨设备同步**：设置存在浏览器 `localStorage`，不会跟随 DSH 账号或 Host 配置同步。

### 常见问题

**左键还是进入侧边栏？**

先确认设置里的总开关和对应入口已开启，当前环境显示「系统打开能力可用」，并且点击时没有按住放行修饰键。修改后刷新页面再试。

**右键没有自定义菜单？**

确认「启用自定义右键菜单」和对应入口的菜单开关已开启；Web 端或没有系统打开能力时不会接管右键。

**提示「路径无法解析」或没有反应？**

正文提及可能是相对路径，需要活动会话的 cwd。确认当前会话已经加载，或改用绝对路径的文件卡片。

**设置丢了？**

设置保存在当前浏览器的 `localStorage`。清除站点数据、换端口 / 换 profile 或换浏览器后可能读不到旧设置；用导出 / 导入迁移。

### 开发

插件是纯客户端 Cordis bundle，没有运行时 npm 依赖。

| 文件 | 作用 |
|---|---|
| `lib/index.js` | Host 入口，只声明插件名，无额外 Host 逻辑 |
| `lib/client.js` | 客户端实现：入口识别、左键接管、右键菜单、设置页、快捷键、样式 |
| `cordis.patch.yml` | bundle 插入条目 |
| `locale/zh.json`、`locale/en.json` | 插件管理页的标题与描述 |
| `icon.svg` | 插件图标 |

```sh
npm run check
# 等价于
node --check lib/index.js
node --check lib/client.js
```

### 发布渠道

npm 包和 GitHub Release 使用相同版本号，两个渠道分别发布：

- npm：<https://www.npmjs.com/package/dsh-direct-open>
- GitHub Releases：<https://github.com/likaileave/dsh-direct-open/releases>
- dsh-market：搜索 `dsh-direct-open`

两个渠道是并列的发布渠道，不承诺自动同步。上架 dsh-market 时 Release 只保留固定名 `dsh-direct-open.tgz`，供市场固定链接下载。

### License

[MIT](LICENSE) © 2026 likaileave

---

## English

`dsh-direct-open` is a client-only DSH plugin that takes over file entries in replies: a left click opens the file in the system default application instead of only previewing it in the DSH sidebar, and a dedicated context menu exposes the other actions. It starts no extra process and does not modify DSH host configuration.

### Features

- **Direct left-click opening** for delivered-file cards, changed-file rows, and inline file mentions.
- **Three left-click actions**: open with the system default app, reveal in the file manager, or keep the original DSH sidebar preview.
- **Modifier passthrough**: hold `Shift` by default to skip takeover and use DSH's original click behavior; configurable to `Ctrl`, `Alt`, or no passthrough.
- **Five-item context menu**: open, reveal, open in DSH sidebar, copy absolute path, copy relative path. Arrow keys, `Enter`, and `Escape` work.
- **Hover text follows the action**: the current action is shown normally, and the original "preview in sidebar" text returns while the passthrough modifier is held. The visible hint on delivered-file cards switches too.
- **Per-surface switches** for delivered cards, changed files, and mentions, with independent left-click and context-menu settings.
- **Settings page** under Settings → Open With: master switch, availability, surfaces, left action, passthrough modifier, menu items, diagnostics, reset, export, and import.
- **Shortcut**: `Ctrl/Cmd + Alt + Shift + O` on desktop toggles takeover; no default shortcut on the web.

### Supported surfaces

| Surface | Location | Notes |
|---|---|---|
| Delivered-file card | `data-presented-file` card at the end of a reply | The card preview button is handled; other buttons inside the card are left alone |
| Changed-file card (single) | Header row of a single changed file | The path comes from DSH's hidden description node |
| Changed-file card (multiple) | Each row in the multi-file list | Rows only; the "N files changed" card header is not handled |
| Inline file mention | File references in reply text | Covers inline-code mentions and explicit file links |

Not handled: the multi-file card header, the review page, and ordinary inline code that is not a file mention.

### Left-click behavior

The default action is **open with the system default application**.

| Setting | Behavior |
|---|---|
| Open with default app | Calls `remote.session.openWorkspacePath({ path })` |
| Reveal in file manager | Calls `openWorkspacePath({ path, action: "reveal" })` |
| Open in DSH sidebar | Replays the entry's original click |
| Hold passthrough modifier | Leaves the click to DSH |

The default passthrough modifier is `Shift`. For example, with the default action, a plain click opens the file and `Shift`-click still opens the DSH sidebar preview.

### Context menu

When enabled, right-clicking a supported entry opens:

| Item | Behavior |
|---|---|
| Open with default app | Opens the file in the system default application |
| Reveal in file manager | Selects the file in Explorer / Finder |
| Open in DSH sidebar | Triggers the entry's original sidebar preview |
| Copy absolute path | Copies the resolved absolute path |
| Copy relative path | Copies a path relative to the current session cwd; falls back to absolute when it cannot be relativized |

Items can be disabled individually. Turning off "Enable custom context menu" returns right-click to the DSH page. The menu clamps itself to the viewport and closes on outside click, `Escape`, scroll, resize, or window blur.

### Settings

Settings live under **Settings → Open With** and apply immediately; they also sync across tabs in the same browser.

| Group | Contents |
|---|---|
| Master switch | Pause / resume all takeover; settings are kept |
| Availability | Read-only system-open capability status |
| Left click | Per-surface switches, left action, passthrough modifier |
| Context menu | Menu master switch, per-surface menu switches, five item switches |
| Diagnostics | Failure toast, copy toast, debug logging |
| Settings management | Reset, export JSON, import JSON |

Settings are stored in `localStorage` under `dsh-direct-open:settings:v1`. They do not follow you across browsers, profiles, or cleared site data; use export / import to move them.

### Shortcut

| Platform | Default |
|---|---|
| Windows / macOS / Linux desktop | `Ctrl/Cmd + Alt + Shift + O` |
| Web | No default |

The shortcut toggles direct opening and can be changed in DSH's shortcut settings.

### Install

Requires DSH `0.2.0-rc.2` or newer and a desktop runtime that provides `remote.session.openWorkspacePath`.

**npm**

```sh
dsh plugin --profile desktop add dsh-direct-open
```

**From dsh-market**

Search for `dsh-direct-open` in dsh-market.

**From a GitHub Release**

Download `dsh-direct-open.tgz` from [Releases](https://github.com/likaileave/dsh-direct-open/releases), then:

```sh
dsh plugin --profile desktop add ./dsh-direct-open.tgz
```

**From a checkout**

```sh
git clone https://github.com/likaileave/dsh-direct-open.git
dsh plugin --profile desktop add ./dsh-direct-open
```

Replace `desktop` with your profile. Refresh the Web page after installing or updating; the settings section is named "Open With".

### Data

Settings stay in the browser:

```text
localStorage["dsh-direct-open:settings:v1"]
```

The plugin writes no host configuration, uploads no paths, and sends no telemetry. A path reaches the clipboard only when you explicitly choose a copy action.

### Limitations

- **DSH DOM coupling**: entries are recognized through `data-presented-file`, `data-changed-files`, and `fileMention` markers. A major DSH UI change may require a plugin update.
- **Desktop only**: the web build has no `remote.session` system-open capability. When unavailable, neither left click nor the context menu takes over, and Settings shows the unavailable state.
- **Relative paths need a session cwd**: inline mentions may be relative and are resolved against the active session's cwd. Without an active session or cwd, the click is not taken over and the reason is logged.
- **Multi-file card header is not handled**: the "N files changed" header and its expand / collapse button keep their original behavior; only file rows are handled.
- **Sidebar action replays the original click**, so a future DSH change to that entry's internals could break it.
- **No native context menu passthrough**: when the custom menu is enabled it handles right-click, including with modifiers. Disable "Enable custom context menu" to get the page's native menu back.
- **No "open with" app picker**: only the system default application and file-manager reveal are provided.
- **Native tooltip timing**: the visible hint on delivered-file cards updates immediately; on some platforms the native `title` tooltip needs the pointer to leave and re-enter before it shows the new text.
- **Settings do not sync across devices**: they live in browser `localStorage`, not in the DSH account or host configuration.

### FAQ

**Left click still opens the sidebar?**

Check the master switch, the relevant surface switch, the availability line, and whether a passthrough modifier is held. Refresh the page after changing settings.

**No custom context menu?**

Check the menu master switch and the per-surface menu switch. The web build and environments without system-open capability do not take over right-click.

**Nothing happens, or a path cannot be resolved?**

Inline mentions may be relative and need the active session cwd. Make sure the session is loaded, or use an absolute-path file card.

**Settings disappeared?**

They live in the current browser's `localStorage`. Clearing site data, changing the port / profile, or switching browsers can lose them; use export / import.

### Development

This is a client-only Cordis bundle with no runtime npm dependencies.

| File | Purpose |
|---|---|
| `lib/index.js` | Host entry; declares the plugin name only, no host logic |
| `lib/client.js` | Client implementation: surface detection, left-click takeover, context menu, settings, shortcut, styles |
| `cordis.patch.yml` | Bundle insert entry |
| `locale/zh.json`, `locale/en.json` | Plugin-manager title and description |
| `icon.svg` | Plugin icon |

```sh
npm run check
# equivalent to
node --check lib/index.js
node --check lib/client.js
```

### Release channels

The npm package and GitHub Release share the same version and are published separately:

- npm: <https://www.npmjs.com/package/dsh-direct-open>
- GitHub Releases: <https://github.com/likaileave/dsh-direct-open/releases>
- dsh-market: search for `dsh-direct-open`

They are parallel channels, not an automatic mirror. For dsh-market, the Release keeps a single fixed-name asset, `dsh-direct-open.tgz`, because the market links to `releases/latest/download/dsh-direct-open.tgz`.

### License

[MIT](LICENSE) © 2026 likaileave

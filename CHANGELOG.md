# Changelog

## [0.2.0] - 2026-11-05

### 变更

- 右键改为三档接管方式：接管所有右键菜单、只接管没有原生右键菜单的右键（默认）、不接管任何右键；三种方式可在设置页切换，并可为交付卡片、改动卡片、文件提及分别开关。
- 设置页重整：总开关、左键各入口开关、右键接管方式、右键各入口开关、菜单项开关分组展示；选择「不接管任何右键」时，入口与菜单项开关一并停用。
- 旧版设置自动迁移，不需要重新配置。
- 悬停提示改为在入口上即时显示当前左键动作：交付卡片和改动卡片里的提示文字就地切换，文件提及与多文件改动行使用跟随提示；按住放行修饰键立即恢复「在侧边栏预览」，松开立即切回。
- 统一文案为「以系统默认程序打开」。

### 新增

- 支持 DSH 0.2.2 的原生文件右键菜单：默认让原生菜单优先，只在原生没有菜单的入口显示插件菜单；需要覆盖原生菜单时可切换接管方式。

### Changed

- Right-click takeover now has three modes: take over all right-click menus, take over only where DSH has no native menu (default), or never take over. Each mode can be selected in Settings and switched per surface (delivered cards, changed-file cards, file mentions).
- The settings page is regrouped: master switch, left-click surface switches, right-click takeover mode, right-click surface switches, and menu items. Choosing "never take over" disables the surface and item switches.
- Existing settings migrate automatically; no reconfiguration is needed.
- Hover hints now show the current left-click action immediately on the entry: delivered cards and changed-file headers update their in-card hint in place, while file mentions and multi-file rows use a following hint. Holding the passthrough modifier restores "preview in sidebar" immediately, and releasing it switches back at once.
- Wording is unified as "Open with the system default application".

### Added

- Supports the DSH 0.2.2 native file context menu: native menus win by default, and the plugin menu appears only where DSH has none. Switch the takeover mode if you want to override the native menu.

## [0.1.0] - 2026-11-03

### 新增

- 左键直接用系统默认程序打开 DSH 的交付文件卡片、改动文件行和正文文件提及；可在设置中改为在文件管理器中定位，或保留 DSH 侧边栏行为。
- 右键菜单提供打开、定位、在 DSH 侧边栏中查看、复制绝对路径和复制相对路径；菜单项可逐项开关。
- 悬停提示随当前左键动作切换；按住放行修饰键时恢复 DSH 原来的「在侧边栏预览」，交付卡片上的可见文案同步切换。
- 设置页提供入口开关、左键修饰键放行、菜单项开关、失败与复制通知、调试日志、设置导入导出和恢复默认。
- 桌面端快捷键 `Ctrl/Cmd + Alt + Shift + O` 可暂停或恢复直接打开；Web 端不设置默认快捷键。

### Added

- Left-click opens DSH delivered-file cards, changed-file rows, and inline file mentions in the system default application. Settings can switch to reveal-in-file-manager or keep the DSH sidebar behavior.
- The right-click menu offers open, reveal, show in the DSH sidebar, copy absolute path, and copy relative path, with per-item toggles.
- Hover text follows the current left-click action; holding the passthrough modifier restores DSH's original “preview in sidebar”, and the visible label on delivered-file cards switches with it.
- The settings page provides surface toggles, left-click modifier passthrough, menu-item switches, failure and copy notifications, debug logging, settings import/export, and reset.
- The desktop shortcut `Ctrl/Cmd + Alt + Shift + O` pauses or resumes direct opening. No default shortcut is assigned on the web.

window.__ModuleLoader__.load({
  id: 'dsh-direct-open',
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const { useEffect, useRef, useState, useSyncExternalStore } = React

    const NS = 'direct-open'
    const SETTINGS_KEY = 'dsh-direct-open:settings:v1'
    const MENU_ID = 'direct-open-menu'
    const TOAST_ID = 'direct-open-toast'
    const STYLE_MARKER = 'data-dsh-direct-open'
    const SURFACES = ['presented', 'changes', 'mentions']
    const ACTIONS = ['open', 'reveal', 'sidebar']
    const PASSTHROUGH = ['none', 'shift', 'ctrl', 'alt']
    const MENU_ITEMS = ['open', 'reveal', 'sidebar', 'copyAbs', 'copyRel']

    const DEFAULT_SETTINGS = {
      enabled: true,
      surfaces: { presented: true, changes: true, mentions: true },
      leftAction: 'open',
      passthrough: 'shift',
      menu: {
        enabled: true,
        surfaces: { presented: true, changes: true, mentions: true },
        items: { open: true, reveal: true, sidebar: true, copyAbs: true, copyRel: true },
      },
      notifyFailures: false,
      notifyCopied: false,
      debug: false,
    }

    const zh = {
      nav: '打开方式',
      title: '直接打开',
      description: '让交付卡、改动卡和文件提及按你的方式打开；右键另有完整菜单。',
      'enabled.label': '启用直接打开',
      'enabled.desc': '关闭后所有入口恢复 DSH 默认行为。',
      'enabled.offHint': '已暂停接管；设置会保留，重新开启后立即生效。',
      'availability.checking': '正在检查系统打开能力…',
      'availability.yes': '系统打开能力可用：左键会用默认程序打开文件，右键会显示自定义菜单。',
      'availability.no': '当前环境没有可用的系统打开能力；左键会保持 DSH 默认行为，只显示状态，不接管点击。',
      'left.title': '左键行为',
      'left.desc': '只接管下面勾选的文件入口；Shift / Ctrl / Alt 可临时放行。',
      'left.action': '左键动作',
      'left.action.desc': '选择左键点击文件入口时执行什么。',
      'left.action.open': '用系统默认程序打开',
      'left.action.reveal': '在文件管理器中定位',
      'left.action.sidebar': '在 DSH 侧边栏中查看',
      'tooltip.open': '用系统默认程序打开',
      'tooltip.reveal': '在文件管理器中显示',
      'tooltip.sidebar': '在侧边栏预览',
      'left.passthrough': '放行修饰键',
      'left.passthrough.desc': '按住该键点击时不接管，交给 DSH 原有行为。',
      'surface.presented': '交付卡片',
      'surface.presented.desc': '回复末尾的“交付文件”卡片。',
      'surface.changes': '改动卡片',
      'surface.changes.desc': '单个文件标题行，以及多文件列表中的每一行。',
      'surface.mentions': '文件提及',
      'surface.mentions.desc': '回复正文里的行内文件引用。',
      'passthrough.none': '不放行',
      'passthrough.shift': 'Shift',
      'passthrough.ctrl': 'Ctrl',
      'passthrough.alt': 'Alt',
      'menu.title': '右键菜单',
      'menu.desc': '接管右键后，菜单里的动作可逐项开关。',
      'menu.enable': '启用自定义右键菜单',
      'menu.enable.desc': '关闭后右键不再由本插件接管，交回页面自身处理。',
      'menu.surfaces.title': '在哪些入口显示',
      'menu.items.title': '菜单项目',
      'item.open': '用默认程序打开',
      'item.reveal': '在文件管理器中定位',
      'item.sidebar': '在 DSH 侧边栏中查看',
      'item.copyAbs': '复制绝对路径',
      'item.copyRel': '复制相对路径',
      'menu.label': '文件操作',
      'diag.title': '诊断',
      'diag.desc': '这些选项只影响提示与日志。',
      'diag.failures': '打开失败时提示',
      'diag.failures.desc': '系统拒绝打开或路径无效时显示提示。',
      'diag.copied': '复制成功时提示',
      'diag.copied.desc': '复制路径后显示短暂提示。',
      'diag.debug': '调试日志',
      'diag.debug.desc': '在开发者工具中输出路径解析与菜单打开过程。',
      'reset': '恢复默认',
      'export': '导出设置',
      'import': '导入设置',
      'settings.importFailed': '导入失败：请选择有效的 JSON 设置文件。',
      'settings.importDone': '设置已导入',
      'settings.resetDone': '已恢复默认设置',
      'shortcut.toggle': '启用 / 暂停直接打开',
      'toast.openFailed': '无法用系统默认程序打开该文件。',
      'toast.revealFailed': '无法在文件管理器中定位该文件。',
      'toast.copyFailed': '复制路径失败。',
      'toast.copied': '路径已复制',
      'toast.noDesktop': '当前环境没有系统打开能力。',
    }

    const en = {
      nav: 'Open with',
      title: 'Direct Open',
      description: 'Choose how delivered files, changed-file rows, and file mentions open. Right-click for the full menu.',
      'enabled.label': 'Enable Direct Open',
      'enabled.desc': 'Turning this off restores the default DSH behavior everywhere.',
      'enabled.offHint': 'Takeover is paused. Your settings stay here and apply again when re-enabled.',
      'availability.checking': 'Checking desktop opening support…',
      'availability.yes': 'Desktop opening is available: left-click opens in the default app, and right-click shows the custom menu.',
      'availability.no': 'No desktop opening support in this environment. Left-click keeps the DSH default; the status is shown but clicks are not taken over.',
      'left.title': 'Left-click behavior',
      'left.desc': 'Only the selected file surfaces are taken over. Hold Shift / Ctrl / Alt to pass through.',
      'left.action': 'Left-click action',
      'left.action.desc': 'What a left-click on a file surface should do.',
      'left.action.open': 'Open in the default app',
      'left.action.reveal': 'Reveal in the file manager',
      'left.action.sidebar': 'View in the DSH sidebar',
      'tooltip.open': 'Open in the default app',
      'tooltip.reveal': 'Show in the file manager',
      'tooltip.sidebar': 'Preview in the sidebar',
      'left.passthrough': 'Pass-through modifier',
      'left.passthrough.desc': 'Clicking with this key held keeps the original DSH behavior.',
      'surface.presented': 'Delivered file cards',
      'surface.presented.desc': 'The delivery cards at the end of a reply.',
      'surface.changes': 'Changed-file cards',
      'surface.changes.desc': 'The single-file header and each row in the multi-file list.',
      'surface.mentions': 'File mentions',
      'surface.mentions.desc': 'Inline file references in reply text.',
      'passthrough.none': 'None',
      'passthrough.shift': 'Shift',
      'passthrough.ctrl': 'Ctrl',
      'passthrough.alt': 'Alt',
      'menu.title': 'Right-click menu',
      'menu.desc': 'Take over right-click and enable the actions you want.',
      'menu.enable': 'Enable the custom right-click menu',
      'menu.enable.desc': 'Turning this off leaves right-click to the page.',
      'menu.surfaces.title': 'Show on',
      'menu.items.title': 'Menu items',
      'item.open': 'Open in default app',
      'item.reveal': 'Reveal in file manager',
      'item.sidebar': 'View in DSH sidebar',
      'item.copyAbs': 'Copy absolute path',
      'item.copyRel': 'Copy relative path',
      'menu.label': 'File actions',
      'diag.title': 'Diagnostics',
      'diag.desc': 'These options only affect feedback and logging.',
      'diag.failures': 'Warn when opening fails',
      'diag.failures.desc': 'Show a toast when the system refuses to open or the path is invalid.',
      'diag.copied': 'Confirm copies',
      'diag.copied.desc': 'Show a brief toast after copying a path.',
      'diag.debug': 'Debug logging',
      'diag.debug.desc': 'Log path resolution and menu opening in the developer console.',
      'reset': 'Restore defaults',
      'export': 'Export settings',
      'import': 'Import settings',
      'settings.importFailed': 'Import failed: choose a valid JSON settings file.',
      'settings.importDone': 'Settings imported',
      'settings.resetDone': 'Defaults restored',
      'shortcut.toggle': 'Toggle Direct Open',
      'toast.openFailed': 'Could not open this file in the default app.',
      'toast.revealFailed': 'Could not reveal this file in the file manager.',
      'toast.copyFailed': 'Could not copy the path.',
      'toast.copied': 'Path copied',
      'toast.noDesktop': 'Desktop opening is not available in this environment.',
    }

    const CSS = `
      #direct-open-menu {
        position: fixed;
        z-index: 2147483000;
        min-width: 196px;
        max-width: 320px;
        padding: 5px;
        --ddo-border: #d0d7de;
        --ddo-sep: rgba(0, 0, 0, .08);
        --ddo-menu-solid: #ffffff;
        border: 1px solid var(--dsw-alias-border-l2, var(--ddo-border));
        border-radius: 10px;
        background-color: var(--ddo-menu-solid);
        background-image: linear-gradient(
          var(--dsw-alias-bg-layer-2, transparent),
          var(--dsw-alias-bg-layer-2, transparent)
        );
        color: var(--dsw-alias-label-primary, #1f2328);
        box-shadow: 0 14px 42px rgba(0, 0, 0, .42);
        font: 13px/1.4 var(--ds-font-family, system-ui, -apple-system, "Segoe UI", sans-serif);
        user-select: none;
        box-sizing: border-box;
      }
      body[data-ds-dark-theme] #direct-open-menu {
        --ddo-border: #3a3a3d;
        --ddo-sep: rgba(255, 255, 255, .09);
        --ddo-menu-solid: #26262a;
        color: var(--dsw-alias-label-primary, #e8e8ea);
      }
      #direct-open-menu .ddo-menu-item {
        display: flex;
        align-items: center;
        width: 100%;
        min-height: 30px;
        padding: 6px 10px;
        border: 0;
        border-radius: 6px;
        background: transparent;
        color: inherit;
        font: inherit;
        text-align: left;
        cursor: default;
        box-sizing: border-box;
      }
      #direct-open-menu .ddo-menu-item[data-active="true"],
      #direct-open-menu .ddo-menu-item:hover {
        background: var(--dsw-alias-interactive-bg-hover, rgba(0, 0, 0, .06));
      }
      body[data-ds-dark-theme] #direct-open-menu .ddo-menu-item[data-active="true"],
      body[data-ds-dark-theme] #direct-open-menu .ddo-menu-item:hover {
        background: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, .08));
      }
      #direct-open-menu .ddo-menu-item:disabled {
        opacity: .42;
      }
      #direct-open-menu .ddo-menu-item:focus-visible {
        outline: 1px solid var(--dsw-alias-brand-primary, #4c8dff);
        outline-offset: -1px;
      }
      #direct-open-menu .ddo-menu-sep {
        height: 1px;
        margin: 5px 7px;
        background: var(--dsw-alias-border-l1, var(--ddo-sep));
      }
      #direct-open-toast {
        position: fixed;
        left: 50%;
        bottom: 28px;
        z-index: 2147483001;
        max-width: min(420px, calc(100vw - 32px));
        padding: 9px 14px;
        border: 1px solid var(--dsw-alias-border-l2, #3a3a3d);
        border-radius: 9px;
        background: var(--dsw-alias-bg-overlay, #303034);
        color: var(--dsw-alias-label-primary, #f0f0f2);
        box-shadow: 0 10px 30px rgba(0, 0, 0, .35);
        font: 12px/1.45 var(--ds-font-family, system-ui, -apple-system, "Segoe UI", sans-serif);
        transform: translateX(-50%);
        pointer-events: none;
        box-sizing: border-box;
      }
      .ddo-page {
        max-width: 780px;
        padding: 6px 2px 48px;
        color: var(--dsw-alias-label-primary, #e8e8ea);
        font: 13px/1.5 var(--ds-font-family, system-ui, -apple-system, "Segoe UI", sans-serif);
      }
      .ddo-hero {
        display: flex;
        align-items: flex-start;
        gap: 14px;
        margin: 0 0 18px;
      }
      .ddo-mark {
        flex: none;
        display: grid;
        place-items: center;
        width: 42px;
        height: 42px;
        border-radius: 11px;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: #fff;
        font-size: 21px;
        font-weight: 600;
      }
      .ddo-hero h2 {
        margin: 0 0 4px;
        font-size: 20px;
        line-height: 1.25;
        font-weight: 650;
      }
      .ddo-hero p {
        margin: 0;
        color: var(--dsw-alias-label-secondary, #a5a5ad);
        font-size: 12.5px;
      }
      .ddo-master {
        display: flex;
        align-items: center;
        gap: 18px;
        padding: 15px 16px;
        border: 1px solid var(--dsw-alias-border-l2, #3a3a3d);
        border-radius: 12px;
        background: var(--dsw-alias-bg-layer-1, #202024);
      }
      .ddo-master--off {
        opacity: .82;
      }
      .ddo-master-copy {
        flex: 1;
        min-width: 0;
      }
      .ddo-master-title {
        font-size: 14px;
        font-weight: 600;
      }
      .ddo-master-desc {
        margin-top: 2px;
        color: var(--dsw-alias-label-secondary, #a5a5ad);
        font-size: 12px;
      }
      .ddo-offhint {
        margin: 8px 2px 0;
        color: var(--dsw-alias-state-warn-primary, #d29922);
        font-size: 12px;
      }
      .ddo-availability {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin: 9px 2px 0;
        color: var(--dsw-alias-label-secondary, #a5a5ad);
        font-size: 12px;
      }
      .ddo-dot {
        flex: none;
        width: 7px;
        height: 7px;
        margin-top: 5px;
        border-radius: 50%;
        background: var(--dsw-alias-state-idle-primary, #8b949e);
      }
      .ddo-availability[data-state="ok"] .ddo-dot {
        background: var(--dsw-alias-state-success-primary, #3fb950);
      }
      .ddo-availability[data-state="no"] .ddo-dot {
        background: var(--dsw-alias-state-error-primary, #f85149);
      }
      .ddo-group {
        margin-top: 18px;
        border: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, .1));
        border-radius: 12px;
        background: var(--dsw-alias-bg-layer-1, #202024);
        overflow: hidden;
      }
      .ddo-group-head {
        padding: 13px 16px 11px;
        border-bottom: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, .08));
      }
      .ddo-group-head h3 {
        margin: 0;
        font-size: 13.5px;
        font-weight: 600;
      }
      .ddo-group-head p {
        margin: 3px 0 0;
        color: var(--dsw-alias-label-secondary, #a5a5ad);
        font-size: 12px;
      }
      .ddo-group-body {
        padding: 0 16px;
      }
      .ddo-row {
        display: flex;
        align-items: center;
        gap: 18px;
        min-height: 52px;
        padding: 10px 0;
        border-top: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, .07));
      }
      .ddo-row:first-child {
        border-top: 0;
      }
      .ddo-row.is-disabled {
        opacity: .48;
      }
      .ddo-row-copy {
        flex: 1;
        min-width: 0;
      }
      .ddo-row-label {
        font-size: 12.8px;
        font-weight: 500;
      }
      .ddo-row-desc {
        margin-top: 2px;
        color: var(--dsw-alias-label-secondary, #a5a5ad);
        font-size: 11.5px;
      }
      .ddo-row-control {
        flex: none;
        display: flex;
        align-items: center;
      }
      .ddo-subhead {
        padding: 12px 0 2px;
        color: var(--dsw-alias-label-secondary, #a5a5ad);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: .04em;
        text-transform: uppercase;
        border-top: 1px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, .07));
      }
      .ddo-subhead:first-child {
        border-top: 0;
      }
      .ddo-select {
        max-width: 230px;
        height: 28px;
        padding: 0 28px 0 9px;
        border: 1px solid var(--dsw-alias-border-l2, #3a3a3d);
        border-radius: 7px;
        background: var(--dsw-alias-bg-layer-2, #26262a);
        color: var(--dsw-alias-label-primary, #e8e8ea);
        font: inherit;
        font-size: 12px;
        cursor: pointer;
      }
      .ddo-select:disabled {
        cursor: not-allowed;
      }
      .ddo-switch {
        position: relative;
        width: 38px;
        height: 22px;
        padding: 0;
        border: 1px solid var(--dsw-alias-border-l2, #3a3a3d);
        border-radius: 999px;
        background: var(--dsw-alias-bg-layer-2, #26262a);
        cursor: pointer;
        transition: background .14s ease, border-color .14s ease;
        box-sizing: border-box;
      }
      .ddo-switch::after {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
        transition: transform .14s ease;
      }
      .ddo-switch[aria-checked="true"] {
        border-color: transparent;
        background: var(--dsw-alias-brand-primary, #3b82f6);
      }
      .ddo-switch[aria-checked="true"]::after {
        transform: translateX(16px);
      }
      .ddo-switch:disabled {
        opacity: .38;
        cursor: not-allowed;
      }
      .ddo-switch:focus-visible,
      .ddo-btn:focus-visible,
      .ddo-select:focus-visible {
        outline: 2px solid var(--dsw-alias-brand-primary, #3b82f6);
        outline-offset: 2px;
      }
      .ddo-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 18px;
      }
      .ddo-btn {
        height: 30px;
        padding: 0 11px;
        border: 1px solid var(--dsw-alias-border-l2, #3a3a3d);
        border-radius: 7px;
        background: var(--dsw-alias-bg-layer-1, #202024);
        color: var(--dsw-alias-label-primary, #e8e8ea);
        font: inherit;
        font-size: 12px;
        cursor: pointer;
      }
      .ddo-btn:hover {
        background: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, .07));
      }
      .ddo-error {
        margin: 10px 0 0;
        color: var(--dsw-alias-state-error-primary, #f85149);
        font-size: 12px;
      }
      .ddo-file {
        display: none;
      }
    `

    function isPlainObject(value) {
      return value !== null && typeof value === 'object' && !Array.isArray(value)
    }

    function clone(value) {
      return JSON.parse(JSON.stringify(value))
    }

    function bool(value, fallback) {
      return typeof value === 'boolean' ? value : fallback
    }

    function oneOf(value, allowed, fallback) {
      return allowed.includes(value) ? value : fallback
    }

    function normalizeSettings(raw) {
      const input = isPlainObject(raw) ? raw : {}
      const surfaces = isPlainObject(input.surfaces) ? input.surfaces : {}
      const menu = isPlainObject(input.menu) ? input.menu : {}
      const menuSurfaces = isPlainObject(menu.surfaces) ? menu.surfaces : {}
      const items = isPlainObject(menu.items) ? menu.items : {}
      return {
        enabled: bool(input.enabled, true),
        surfaces: {
          presented: bool(surfaces.presented, true),
          changes: bool(surfaces.changes, true),
          mentions: bool(surfaces.mentions, true),
        },
        leftAction: oneOf(input.leftAction, ACTIONS, 'open'),
        passthrough: oneOf(input.passthrough, PASSTHROUGH, 'shift'),
        menu: {
          enabled: bool(menu.enabled, true),
          surfaces: {
            presented: bool(menuSurfaces.presented, true),
            changes: bool(menuSurfaces.changes, true),
            mentions: bool(menuSurfaces.mentions, true),
          },
          items: {
            open: bool(items.open, true),
            reveal: bool(items.reveal, true),
            sidebar: bool(items.sidebar, true),
            copyAbs: bool(items.copyAbs, true),
            copyRel: bool(items.copyRel, true),
          },
        },
        notifyFailures: bool(input.notifyFailures, false),
        notifyCopied: bool(input.notifyCopied, false),
        debug: bool(input.debug, false),
      }
    }

    function readStoredSettings() {
      try {
        const raw = window.localStorage.getItem(SETTINGS_KEY)
        return raw ? normalizeSettings(JSON.parse(raw)) : normalizeSettings(null)
      } catch (_error) {
        return normalizeSettings(null)
      }
    }

    let currentSettings = readStoredSettings()
    const storeListeners = new Set()

    function persistSettings() {
      try {
        window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(currentSettings))
      } catch (_error) {
        // Storage can be unavailable in private windows; settings still work in memory.
      }
    }

    function emitSettings() {
      for (const listener of [...storeListeners]) listener()
    }

    const store = {
      subscribe(listener) {
        storeListeners.add(listener)
        return () => storeListeners.delete(listener)
      },
      getSnapshot() {
        return currentSettings
      },
      update(mutator) {
        const draft = clone(currentSettings)
        mutator(draft)
        currentSettings = normalizeSettings(draft)
        persistSettings()
        emitSettings()
      },
      replace(value) {
        currentSettings = normalizeSettings(value)
        persistSettings()
        emitSettings()
      },
      adopt(value) {
        currentSettings = normalizeSettings(value)
        emitSettings()
      },
      reset() {
        currentSettings = normalizeSettings(null)
        persistSettings()
        emitSettings()
      },
    }

    let desktopValue = null
    const desktopListeners = new Set()
    const desktop = {
      subscribe(listener) {
        desktopListeners.add(listener)
        return () => desktopListeners.delete(listener)
      },
      getSnapshot() {
        return desktopValue
      },
      set(value) {
        if (desktopValue === value) return
        desktopValue = value
        for (const listener of [...desktopListeners]) listener()
      },
    }

    let localeService = null
    const EMPTY_LOCALE = { active: 'en', locales: [], revision: 0 }

    function subscribeLocale(listener) {
      return localeService ? localeService.subscribe(listener) : () => {}
    }

    function getLocaleSnapshot() {
      return localeService ? localeService.getSnapshot() : EMPTY_LOCALE
    }

    function currentT() {
      return localeService ? localeService.bind(NS) : (key) => key
    }

    let toastNode = null
    let toastTimer = 0

    function clearToast() {
      if (toastTimer) {
        clearTimeout(toastTimer)
        toastTimer = 0
      }
      if (toastNode !== null) {
        toastNode.remove()
        toastNode = null
      }
    }

    function showToast(text) {
      if (!text || typeof document === 'undefined') return
      if (toastNode === null) {
        toastNode = document.createElement('div')
        toastNode.id = TOAST_ID
        toastNode.setAttribute('role', 'status')
        toastNode.setAttribute('aria-live', 'polite')
        document.body.appendChild(toastNode)
      }
      toastNode.textContent = text
      if (toastTimer) clearTimeout(toastTimer)
      toastTimer = setTimeout(clearToast, 1900)
    }

    function normalizePath(raw, cwd) {
      if (typeof raw !== 'string') return null
      const value = raw.trim()
      if (!value) return null
      const unc = value.match(/^[\\/]{2}([^\\/]+)[\\/]+([^\\/]+)(.*)$/)
      if (unc) {
        const tail = unc[3] ? unc[3].replace(/\//g, '\\') : ''
        return '\\\\' + unc[1] + '\\' + unc[2] + tail
      }
      if (/^[A-Za-z]:[\\/]/.test(value)) {
        return value[0].toUpperCase() + ':' + value.slice(2).replace(/\//g, '\\')
      }
      if (value[0] === '/') return value
      if (!cwd) return null
      const base = String(cwd).trim()
      if (!base) return null
      if (/^[A-Za-z]:[\\/]/.test(base)) {
        const normalizedBase = base[0].toUpperCase() + ':' + base.slice(2).replace(/\//g, '\\').replace(/\\+$/, '')
        return normalizedBase + '\\' + value.replace(/\//g, '\\').replace(/^\\+/, '')
      }
      if (base[0] === '/') {
        return base.replace(/\/+$/, '') + '/' + value.replace(/^\/+/, '')
      }
      return null
    }

    function relativePath(absolute, cwd) {
      if (!cwd) return absolute
      if (absolute.startsWith('\\\\') && cwd.startsWith('\\\\')) {
        const base = cwd.replace(/\/+/g, '\\').replace(/\\+$/, '')
        const lowerAbsolute = absolute.toLowerCase()
        const lowerBase = base.toLowerCase()
        if (lowerAbsolute === lowerBase) return '.'
        if (lowerAbsolute.startsWith(lowerBase + '\\')) return absolute.slice(base.length + 1)
        return absolute
      }
      if (/^[A-Za-z]:[\\/]/.test(absolute)) {
        const base = cwd.replace(/\//g, '\\').replace(/\\+$/, '')
        if (absolute.toLowerCase().startsWith(base.toLowerCase() + '\\')) {
          return absolute.slice(base.length + 1)
        }
        return absolute
      }
      if (absolute[0] === '/') {
        const base = cwd.replace(/\/+$/, '')
        if (absolute === base) return '.'
        if (absolute.startsWith(base + '/')) return absolute.slice(base.length + 1)
      }
      return absolute
    }

    function hasModifier(event, setting) {
      if (setting === 'shift') return event.shiftKey === true
      if (setting === 'ctrl') return event.ctrlKey === true
      if (setting === 'alt') return event.altKey === true
      return false
    }

    function elementOf(target) {
      if (target instanceof Element) return target
      return target && target.parentElement instanceof Element ? target.parentElement : null
    }

    function describedPath(row) {
      const value = row.getAttribute('aria-describedby')
      if (!value) return ''
      for (const id of value.split(/\s+/)) {
        if (!id) continue
        const node = document.getElementById(id)
        const text = node && node.textContent ? node.textContent.trim() : ''
        if (text) return text
      }
      return ''
    }

    function absoluteTitle(node) {
      const title = (node.getAttribute('title') || '').trim()
      return /^(?:[A-Za-z]:[\\/]|\\\\|\/)/.test(title) ? title : ''
    }

    function isPathLike(value) {
      const text = typeof value === 'string' ? value.trim() : ''
      if (!text) return false
      if (/^(?:[A-Za-z]:[\\/]|\\\\|\/)/.test(text)) return true
      if (/[\u3400-\u9fff]/.test(text)) return false
      if (/\s/.test(text)) return false
      if (/[\\/]/.test(text)) return true
      return /\.[A-Za-z0-9]{1,12}$/.test(text)
    }

    function pathFromText(value) {
      const text = typeof value === 'string' ? value.trim() : ''
      if (!text) return ''
      if (isPathLike(text)) return text
      const quoted = text.match(/[`"'「]([^`"'」]+)[`"'」]/)
      if (quoted !== null && isPathLike(quoted[1])) return quoted[1].trim()
      const tokens = text.split(/[\s：:，,、]+/).filter(Boolean)
      for (let index = tokens.length - 1; index >= 0; index -= 1) {
        if (isPathLike(tokens[index])) return tokens[index]
      }
      const absolute = text.match(/[A-Za-z]:[\\/][^\r\n]+/)
      return absolute === null ? '' : absolute[0].trim()
    }

    function resolveSurfaceTarget(target) {
      const element = elementOf(target)
      if (element === null) return null

      const mention = element.closest('button[class*="fileMention"]')
      if (mention !== null) {
        const cached = (mention.getAttribute('data-ddo-path') || '').trim()
        const label = (mention.getAttribute('aria-label') || '').trim()
        const title = (mention.getAttribute('title') || '').trim()
        const path = cached || pathFromText(title) || pathFromText(label)
        if (path) return { kind: 'mentions', element: mention, rawPath: path }
        return null
      }

      const card = element.closest('[data-presented-file]')
      if (card !== null) {
        const preview = card.querySelector('button[class*="cardPreview"]')
        const clicked = element.closest('button')
        if (preview === null) return null
        if (clicked !== preview) return null
        const path = (preview.getAttribute('data-ddo-path') || preview.getAttribute('title') || '').trim()
        if (path) return { kind: 'presented', element: preview, rawPath: path }
        return null
      }

      const row = element.closest('[data-changed-files] button[aria-describedby]')
      if (row !== null) {
        const changedCard = row.closest('[data-changed-files]')
        if (changedCard === null) return null
        const isRow = row.matches('ul > li > button')
        if (!changedCard.hasAttribute('data-single') && !isRow) return null
        const path = describedPath(row) || absoluteTitle(row)
        if (path) return { kind: 'changes', element: row, rawPath: path }
      }
      return null
    }

    function Switch(props) {
      return h('button', {
        type: 'button',
        role: 'switch',
        className: 'ddo-switch',
        'aria-checked': props.checked ? 'true' : 'false',
        'aria-label': props.label,
        disabled: props.disabled === true,
        onClick: () => props.onChange(!props.checked),
      })
    }

    function Row(props) {
      const disabled = props.disabled === true
      return h('div', { className: 'ddo-row' + (disabled ? ' is-disabled' : '') },
        h('div', { className: 'ddo-row-copy' },
          h('div', { className: 'ddo-row-label' }, props.label),
          props.description ? h('div', { className: 'ddo-row-desc' }, props.description) : null),
        h('div', { className: 'ddo-row-control' }, props.control || null))
    }

    function Group(props) {
      return h('section', { className: 'ddo-group' },
        h('header', { className: 'ddo-group-head' },
          h('h3', null, props.title),
          props.description ? h('p', null, props.description) : null),
        h('div', { className: 'ddo-group-body' }, props.children))
    }

    function SelectControl(props) {
      return h('select', {
        className: 'ddo-select',
        value: props.value,
        disabled: props.disabled === true,
        'aria-label': props.label,
        onChange: (event) => props.onChange(event.target.value),
      }, props.options.map((option) => h('option', { key: option.value, value: option.value }, option.label)))
    }

    function SettingsSection() {
      useSyncExternalStore(store.subscribe, store.getSnapshot)
      const available = useSyncExternalStore(desktop.subscribe, desktop.getSnapshot)
      useSyncExternalStore(subscribeLocale, getLocaleSnapshot, getLocaleSnapshot)
      const t = currentT()
      const settings = store.getSnapshot()
      const [importError, setImportError] = useState('')
      const fileInput = useRef(null)

      const disabled = !settings.enabled
      const menuDisabled = disabled || !settings.menu.enabled
      const passthroughOptions = PASSTHROUGH.map((value) => ({
        value,
        label: t('passthrough.' + value),
      }))
      const actionOptions = ACTIONS.map((value) => ({
        value,
        label: t('left.action.' + value),
      }))

      const setSurface = (key, value) => store.update((draft) => {
        draft.surfaces[key] = value
      })
      const setMenuSurface = (key, value) => store.update((draft) => {
        draft.menu.surfaces[key] = value
      })
      const setMenuItem = (key, value) => store.update((draft) => {
        draft.menu.items[key] = value
      })

      const availabilityState = available === null ? 'checking' : available ? 'ok' : 'no'
      const availabilityText = available === null
        ? t('availability.checking')
        : available ? t('availability.yes') : t('availability.no')

      function onExport() {
        const blob = new Blob([JSON.stringify(store.getSnapshot(), null, 2) + '\n'], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = 'direct-open-settings.json'
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }

      async function onImport(event) {
        const file = event.target.files && event.target.files[0]
        event.target.value = ''
        if (!file) return
        try {
          const parsed = JSON.parse(await file.text())
          if (!isPlainObject(parsed)) throw new Error('settings must be an object')
          store.replace(parsed)
          setImportError('')
          showToast(t('settings.importDone'))
        } catch (_error) {
          setImportError(t('settings.importFailed'))
        }
      }

      return h('div', { className: 'ddo-page' },
        h('header', { className: 'ddo-hero' },
          h('div', { className: 'ddo-mark', 'aria-hidden': 'true' }, '↗'),
          h('div', null,
            h('h2', null, t('title')),
            h('p', null, t('description')))),

        h('div', { className: 'ddo-master' + (settings.enabled ? '' : ' ddo-master--off') },
          h('div', { className: 'ddo-master-copy' },
            h('div', { className: 'ddo-master-title' }, t('enabled.label')),
            h('div', { className: 'ddo-master-desc' }, t('enabled.desc'))),
          h(Switch, {
            checked: settings.enabled,
            label: t('enabled.label'),
            onChange: (value) => store.update((draft) => { draft.enabled = value }),
          })),

        h('div', { className: 'ddo-availability', 'data-state': availabilityState },
          h('span', { className: 'ddo-dot', 'aria-hidden': 'true' }),
          h('span', null, availabilityText)),

        !settings.enabled ? h('p', { className: 'ddo-offhint' }, t('enabled.offHint')) : null,

        h(Group, { title: t('left.title'), description: t('left.desc') },
          SURFACES.map((key) => h(Row, {
            key,
            label: t('surface.' + key),
            description: t('surface.' + key + '.desc'),
            disabled,
            control: h(Switch, {
              checked: settings.surfaces[key],
              disabled,
              label: t('surface.' + key),
              onChange: (value) => setSurface(key, value),
            }),
          })),
          h(Row, {
            label: t('left.action'),
            description: t('left.action.desc'),
            disabled,
            control: h(SelectControl, {
              value: settings.leftAction,
              disabled,
              label: t('left.action'),
              options: actionOptions,
              onChange: (value) => store.update((draft) => { draft.leftAction = value }),
            }),
          }),
          h(Row, {
            label: t('left.passthrough'),
            description: t('left.passthrough.desc'),
            disabled,
            control: h(SelectControl, {
              value: settings.passthrough,
              disabled,
              label: t('left.passthrough'),
              options: passthroughOptions,
              onChange: (value) => store.update((draft) => { draft.passthrough = value }),
            }),
          })),

        h(Group, { title: t('menu.title'), description: t('menu.desc') },
          h(Row, {
            label: t('menu.enable'),
            description: t('menu.enable.desc'),
            disabled,
            control: h(Switch, {
              checked: settings.menu.enabled,
              disabled,
              label: t('menu.enable'),
              onChange: (value) => store.update((draft) => { draft.menu.enabled = value }),
            }),
          }),
          h('div', { className: 'ddo-subhead' }, t('menu.surfaces.title')),
          SURFACES.map((key) => h(Row, {
            key,
            label: t('surface.' + key),
            disabled: menuDisabled,
            control: h(Switch, {
              checked: settings.menu.surfaces[key],
              disabled: menuDisabled,
              label: t('surface.' + key),
              onChange: (value) => setMenuSurface(key, value),
            }),
          })),
          h('div', { className: 'ddo-subhead' }, t('menu.items.title')),
          MENU_ITEMS.map((key) => h(Row, {
            key,
            label: t('item.' + key),
            disabled: menuDisabled,
            control: h(Switch, {
              checked: settings.menu.items[key],
              disabled: menuDisabled,
              label: t('item.' + key),
              onChange: (value) => setMenuItem(key, value),
            }),
          }))),

        h(Group, { title: t('diag.title'), description: t('diag.desc') },
          h(Row, {
            label: t('diag.failures'),
            description: t('diag.failures.desc'),
            control: h(Switch, {
              checked: settings.notifyFailures,
              label: t('diag.failures'),
              onChange: (value) => store.update((draft) => { draft.notifyFailures = value }),
            }),
          }),
          h(Row, {
            label: t('diag.copied'),
            description: t('diag.copied.desc'),
            control: h(Switch, {
              checked: settings.notifyCopied,
              label: t('diag.copied'),
              onChange: (value) => store.update((draft) => { draft.notifyCopied = value }),
            }),
          }),
          h(Row, {
            label: t('diag.debug'),
            description: t('diag.debug.desc'),
            control: h(Switch, {
              checked: settings.debug,
              label: t('diag.debug'),
              onChange: (value) => store.update((draft) => { draft.debug = value }),
            }),
          })),

        h('div', { className: 'ddo-actions' },
          h('button', {
            type: 'button',
            className: 'ddo-btn',
            onClick: () => {
              store.reset()
              setImportError('')
              showToast(t('settings.resetDone'))
            },
          }, t('reset')),
          h('button', { type: 'button', className: 'ddo-btn', onClick: onExport }, t('export')),
          h('button', {
            type: 'button',
            className: 'ddo-btn',
            onClick: () => fileInput.current && fileInput.current.click(),
          }, t('import')),
          h('input', {
            ref: fileInput,
            type: 'file',
            className: 'ddo-file',
            accept: 'application/json,.json',
            onChange: onImport,
          })),
        importError ? h('p', { className: 'ddo-error', role: 'alert' }, importError) : null)
    }

    return {
      name: 'direct-open',
      inject: ['sessions', 'slots', 'locale', 'remote', 'remote.session', 'shortcuts'],
      apply(ctx) {
        localeService = ctx.locale
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'direct-open: dictionaries')
        const t = ctx.locale.bind(NS)

        let bypass = null
        let menuElement = null
        let menuActions = []
        let menuActive = -1
        let menuRect = null
        let suppressUntil = 0
        let suppressRect = null
        let rightGesture = null
        let fallbackTimer = 0
        let hoverElement = null
        let hoverTitle = null
        let hoverKind = null

        const debug = (...args) => {
          if (store.getSnapshot().debug) console.info('[direct-open]', ...args)
        }

        const available = () => desktop.getSnapshot() === true

        function getCwd() {
          try {
            const snapshot = ctx.sessions.list.getSnapshot()
            const byId = snapshot && snapshot.byId ? snapshot.byId : {}
            let row = snapshot && typeof snapshot.current === 'string' ? byId[snapshot.current] : null
            if (!row || !row.cwd) {
              row = Object.values(byId).find((entry) => entry && entry.cwd && entry.retainedBy && entry.retainedBy.mainView > 0)
            }
            if (!row || !row.cwd) {
              row = Object.values(byId).find((entry) => entry && entry.cwd)
            }
            return row && row.cwd ? row.cwd : null
          } catch (_error) {
            return null
          }
        }

        function canPass(event, modifier) {
          return hasModifier(event, modifier)
        }

        function notifyFailure(kind, error) {
          const label = kind === 'copy' ? 'copy' : kind
          console.warn('[direct-open] ' + label + ' failed', error)
          if (store.getSnapshot().notifyFailures) showToast(t('toast.' + label + 'Failed'))
        }

        function resultOk(result) {
          if (typeof result === 'boolean') return result
          return result !== null && typeof result === 'object' && result.ok === true
        }

        async function performOpen(resolved, action) {
          const cwd = getCwd()
          const path = normalizePath(resolved.rawPath, cwd)
          if (!path) {
            notifyFailure(action, new Error('path is not absolute and has no session cwd'))
            return
          }
          debug(action, path)
          try {
            const request = action === 'reveal' ? { path, action: 'reveal' } : { path }
            const result = await ctx.remote.session.openWorkspacePath(request)
            if (!resultOk(result)) notifyFailure(action, result)
          } catch (error) {
            notifyFailure(action, error)
          }
        }

        function legacyCopy(text) {
          const area = document.createElement('textarea')
          area.value = text
          area.setAttribute('readonly', '')
          area.style.position = 'fixed'
          area.style.opacity = '0'
          area.style.pointerEvents = 'none'
          document.body.appendChild(area)
          area.select()
          let ok = false
          try {
            ok = document.execCommand('copy')
          } finally {
            area.remove()
          }
          if (!ok) throw new Error('copy command failed')
        }

        async function copyText(text) {
          try {
            if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
              try {
                await navigator.clipboard.writeText(text)
              } catch (_error) {
                legacyCopy(text)
              }
            } else {
              legacyCopy(text)
            }
            if (store.getSnapshot().notifyCopied) showToast(t('toast.copied'))
          } catch (error) {
            notifyFailure('copy', error)
          }
        }

        function copyPath(resolved, relative) {
          const cwd = getCwd()
          const path = normalizePath(resolved.rawPath, cwd)
          if (!path) {
            notifyFailure('copy', new Error('path is not absolute and has no session cwd'))
            return
          }
          void copyText(relative ? relativePath(path, cwd) : path)
        }

        function openInSidebar(element) {
          const previous = bypass
          bypass = 'sidebar'
          try {
            if (typeof element.click === 'function') {
              element.click()
            } else {
              element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
            }
          } catch (error) {
            console.warn('[direct-open] sidebar click failed', error)
          } finally {
            bypass = previous
          }
        }

        function menuEntries(resolved) {
          const settings = store.getSnapshot()
          const groups = [[], [], []]
          const canOpen = available()

          if (settings.menu.items.open) {
            groups[0].push({
              key: 'open',
              label: t('item.open'),
              disabled: !canOpen,
              run: () => { void performOpen(resolved, 'open') },
            })
          }
          if (settings.menu.items.reveal) {
            groups[0].push({
              key: 'reveal',
              label: t('item.reveal'),
              disabled: !canOpen,
              run: () => { void performOpen(resolved, 'reveal') },
            })
          }
          if (settings.menu.items.sidebar) {
            groups[1].push({
              key: 'sidebar',
              label: t('item.sidebar'),
              run: () => openInSidebar(resolved.element),
            })
          }
          if (settings.menu.items.copyAbs) {
            groups[2].push({
              key: 'copyAbs',
              label: t('item.copyAbs'),
              run: () => copyPath(resolved, false),
            })
          }
          if (settings.menu.items.copyRel) {
            groups[2].push({
              key: 'copyRel',
              label: t('item.copyRel'),
              run: () => copyPath(resolved, true),
            })
          }

          const entries = []
          for (const group of groups) {
            if (group.length === 0) continue
            if (entries.length > 0) entries.push({ separator: true })
            entries.push(...group)
          }
          return entries
        }

        function setMenuActive(index) {
          if (menuElement === null) return
          menuActive = index
          for (const button of menuElement.querySelectorAll('button[data-direct-open-index]')) {
            const active = Number(button.getAttribute('data-direct-open-index')) === index
            button.setAttribute('data-active', active ? 'true' : 'false')
          }
        }

        function moveMenuActive(direction) {
          if (menuElement === null) return
          const buttons = [...menuElement.querySelectorAll('button[data-direct-open-index]:not(:disabled)')]
          if (buttons.length === 0) return
          const current = buttons.findIndex((button) => Number(button.getAttribute('data-direct-open-index')) === menuActive)
          const next = current < 0
            ? (direction > 0 ? 0 : buttons.length - 1)
            : (current + direction + buttons.length) % buttons.length
          setMenuActive(Number(buttons[next].getAttribute('data-direct-open-index')))
        }

        function closeMenu(suppress) {
          if (menuElement === null) return
          const rect = menuElement.getBoundingClientRect()
          if (suppress) {
            suppressRect = rect
            suppressUntil = performance.now() + 600
          }
          menuElement.remove()
          menuElement = null
          menuActions = []
          menuActive = -1
        }

        function activateMenu(index) {
          const action = menuActions[index]
          if (!action || action.disabled) return
          closeMenu(true)
          try {
            action.run()
          } catch (error) {
            console.warn('[direct-open] menu action failed', error)
          }
        }

        function openMenu(resolved, entries, x, y) {
          closeMenu(false)
          const menu = document.createElement('div')
          menu.id = MENU_ID
          menu.className = 'dsh-do-menu'
          menu.setAttribute('role', 'menu')
          menu.setAttribute('aria-label', t('menu.label'))
          menu.style.visibility = 'hidden'
          menu.style.left = '0px'
          menu.style.top = '0px'

          menuActions = []
          for (const entry of entries) {
            if (entry.separator) {
              const separator = document.createElement('div')
              separator.className = 'ddo-menu-sep'
              separator.setAttribute('role', 'separator')
              menu.appendChild(separator)
              continue
            }
            const index = menuActions.length
            menuActions.push(entry)
            const button = document.createElement('button')
            button.type = 'button'
            button.className = 'ddo-menu-item'
            button.setAttribute('role', 'menuitem')
            button.setAttribute('data-direct-open-index', String(index))
            button.setAttribute('data-active', 'false')
            button.tabIndex = -1
            button.textContent = entry.label
            if (entry.disabled) {
              button.disabled = true
              button.setAttribute('aria-disabled', 'true')
            }
            menu.appendChild(button)
          }

          menu.addEventListener('mouseover', (event) => {
            const button = event.target instanceof Element ? event.target.closest('button[data-direct-open-index]') : null
            if (button !== null && !button.disabled) {
              setMenuActive(Number(button.getAttribute('data-direct-open-index')))
            }
          })

          document.body.appendChild(menu)
          menuElement = menu
          const rect = menu.getBoundingClientRect()
          const width = rect.width
          const height = rect.height
          const left = Math.max(8, Math.min(x, window.innerWidth - width - 8))
          const top = Math.max(8, Math.min(y, window.innerHeight - height - 8))
          menu.style.left = left + 'px'
          menu.style.top = top + 'px'
          menu.style.visibility = ''
          menuRect = menu.getBoundingClientRect()
          const first = menuActions.findIndex((action) => !action.disabled)
          setMenuActive(first)
          debug('menu opened', resolved.kind, menuRect)
        }

        function openMenuAtPoint(target, x, y) {
          const resolved = resolveSurfaceTarget(target)
          if (resolved === null) return false
          const settings = store.getSnapshot()
          if (!settings.enabled || !settings.menu.enabled || !settings.menu.surfaces[resolved.kind] || !available()) return false
          const entries = menuEntries(resolved)
          if (entries.length === 0) return false
          openMenu(resolved, entries, x, y)
          return true
        }

        function onPointerDown(event) {
          if (event.button === 2) {
            rightGesture = {
              at: performance.now(),
              x: event.clientX,
              y: event.clientY,
              target: event.target,
              handled: false,
              shiftKey: event.shiftKey === true,
              ctrlKey: event.ctrlKey === true,
              altKey: event.altKey === true,
            }
          } else if (event.button === 0 && menuElement !== null) {
            if (menuElement.contains(event.target)) {
              const button = event.target instanceof Element ? event.target.closest('button[data-direct-open-index]') : null
              if (button !== null && !button.disabled) {
                event.preventDefault()
                event.stopPropagation()
                suppressRect = menuRect
                suppressUntil = performance.now() + 600
                activateMenu(Number(button.getAttribute('data-direct-open-index')))
              }
              return
            }
            closeMenu(false)
          }
        }

        function onPointerUp(event) {
          if (event.button !== 2) return
          const gesture = rightGesture
          rightGesture = null
          if (!gesture || gesture.handled) return
          if (performance.now() - gesture.at > 2500) return
          if (fallbackTimer) clearTimeout(fallbackTimer)
          fallbackTimer = setTimeout(() => {
            fallbackTimer = 0
            if (menuElement !== null) return
            const target = document.elementFromPoint(gesture.x, gesture.y)
            openMenuAtPoint(target, gesture.x, gesture.y)
          }, 180)
        }

        function previewHint(element) {
          const card = element.closest('[data-presented-file]')
          const description = card === null ? null : card.querySelector('[data-presented-description]')
          return description === null ? null : description.querySelector('span[class*="previewHint"]')
        }

        function endHover() {
          if (hoverElement === null) return
          if (hoverTitle === null) hoverElement.removeAttribute('title')
          else hoverElement.setAttribute('title', hoverTitle)
          const hint = previewHint(hoverElement)
          if (hint !== null) {
            const originalHint = hint.getAttribute('data-ddo-original-hint')
            if (originalHint !== null) {
              hint.textContent = originalHint
              hint.removeAttribute('data-ddo-original-hint')
            }
          }
          hoverElement = null
          hoverTitle = null
          hoverKind = null
        }

        function applyHoverTooltip(event) {
          if (hoverElement === null) return
          const settings = store.getSnapshot()
          if (!settings.enabled || !settings.surfaces[hoverKind]) {
            endHover()
            return
          }
          const passing = canPass(event, settings.passthrough)
          const label = t('tooltip.' + settings.leftAction)
          const wantedTitle = passing ? t('tooltip.sidebar') : label
          if (wantedTitle === null) hoverElement.removeAttribute('title')
          else if (hoverElement.getAttribute('title') !== wantedTitle) {
            hoverElement.setAttribute('title', wantedTitle)
          }
          if (hoverKind === 'presented') {
            const hint = previewHint(hoverElement)
            if (hint !== null) {
              const originalHint = hint.getAttribute('data-ddo-original-hint')
              const wantedHint = passing ? (originalHint === null ? t('tooltip.sidebar') : originalHint) : label
              if (hint.textContent !== wantedHint) hint.textContent = wantedHint
            }
          }
        }

        function onPointerOver(event) {
          const resolved = resolveSurfaceTarget(event.target)
          if (resolved === null) return
          if (resolved.kind !== 'mentions' && resolved.kind !== 'presented') return
          const settings = store.getSnapshot()
          if (!settings.enabled || !settings.surfaces[resolved.kind]) {
            endHover()
            return
          }
          const element = resolved.element
          if (element !== hoverElement) {
            endHover()
            hoverElement = element
            hoverTitle = element.getAttribute('title')
            hoverKind = resolved.kind
            const hint = previewHint(element)
            if (hint !== null && !hint.hasAttribute('data-ddo-original-hint')) {
              hint.setAttribute('data-ddo-original-hint', hint.textContent || '')
            }
          }
          element.setAttribute('data-ddo-path', resolved.rawPath)
          applyHoverTooltip(event)
        }

        function onPointerOut(event) {
          if (hoverElement === null) return
          const scope = hoverElement.closest('[data-presented-file]') || hoverElement
          if (event.relatedTarget instanceof Element && scope.contains(event.relatedTarget)) return
          endHover()
        }

        function onPointerMove(event) {
          if (hoverElement !== null) applyHoverTooltip(event)
        }

        function onHoverKey(event) {
          if (event.key !== 'Shift' && event.key !== 'Control' && event.key !== 'Alt' && event.key !== 'Meta') return
          applyHoverTooltip(event)
        }

        function swallowMenuClick(event) {
          if (performance.now() > suppressUntil || suppressRect === null) return
          const x = event.clientX || 0
          const y = event.clientY || 0
          if (x < suppressRect.left || x > suppressRect.right || y < suppressRect.top || y > suppressRect.bottom) return
          event.preventDefault()
          event.stopPropagation()
          event.stopImmediatePropagation()
        }

        function onLeftClick(event) {
          if (!event.isTrusted || event.defaultPrevented || event.button !== 0) return
          if (bypass !== null) return
          const settings = store.getSnapshot()
          if (!settings.enabled || !available()) return
          const resolved = resolveSurfaceTarget(event.target)
          if (resolved === null) return
          if (!settings.surfaces[resolved.kind]) return
          if (canPass(event, settings.passthrough)) return

          if (settings.leftAction === 'sidebar') {
            event.preventDefault()
            event.stopPropagation()
            openInSidebar(resolved.element)
            return
          }

          const cwd = getCwd()
          const path = normalizePath(resolved.rawPath, cwd)
          if (!path) {
            debug('left-click path unresolved', resolved.rawPath, cwd)
            return
          }
          event.preventDefault()
          event.stopPropagation()
          void performOpen(resolved, settings.leftAction)
        }

        function onContextMenu(event) {
          if (menuElement !== null && menuElement.contains(event.target)) {
            event.preventDefault()
            event.stopImmediatePropagation()
            return
          }
          if (rightGesture !== null) rightGesture.handled = true
          const settings = store.getSnapshot()
          if (!settings.enabled || !settings.menu.enabled || !available()) return
          const resolved = resolveSurfaceTarget(event.target)
          if (resolved === null) return
          if (!settings.menu.surfaces[resolved.kind]) return
          const entries = menuEntries(resolved)
          if (entries.length === 0) return
          event.preventDefault()
          event.stopPropagation()
          event.stopImmediatePropagation()
          openMenu(resolved, entries, event.clientX, event.clientY)
        }

        function onKeyDown(event) {
          onHoverKey(event)
          if (menuElement === null) return
          if (event.key === 'Escape') {
            event.preventDefault()
            event.stopImmediatePropagation()
            closeMenu(false)
            return
          }
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            event.stopImmediatePropagation()
            moveMenuActive(event.key === 'ArrowDown' ? 1 : -1)
            return
          }
          if (event.key === 'Enter' || event.key === ' ') {
            if (menuActive < 0) return
            event.preventDefault()
            event.stopImmediatePropagation()
            activateMenu(menuActive)
          }
        }

        function onScroll() {
          if (menuElement !== null) closeMenu(false)
        }

        function onResize() {
          if (menuElement !== null) closeMenu(false)
        }

        function onBlur() {
          if (menuElement !== null) closeMenu(false)
        }

        function onStorage(event) {
          if (event.key !== SETTINGS_KEY || event.newValue === null) return
          try {
            store.adopt(JSON.parse(event.newValue))
          } catch (_error) {
            // Ignore a malformed value written by another tab.
          }
        }

        ctx.effect(() => store.subscribe(() => closeMenu(false)), 'direct-open: settings changes')

        ctx.effect(() => {
          const add = (target, type, listener, options) => target.addEventListener(type, listener, options)
          const remove = (target, type, listener, options) => target.removeEventListener(type, listener, options)
          add(document, 'pointerdown', onPointerDown, true)
          add(document, 'pointerup', onPointerUp, true)
          add(document, 'pointerover', onPointerOver, true)
          add(document, 'pointerout', onPointerOut, true)
          add(document, 'pointermove', onPointerMove, true)
          add(document, 'keyup', onHoverKey, true)
          add(document, 'click', swallowMenuClick, true)
          add(document, 'click', onLeftClick, true)
          add(document, 'contextmenu', onContextMenu, true)
          add(document, 'keydown', onKeyDown, true)
          add(document, 'scroll', onScroll, true)
          add(window, 'resize', onResize)
          add(window, 'blur', onBlur)
          return () => {
            remove(document, 'pointerdown', onPointerDown, true)
            remove(document, 'pointerup', onPointerUp, true)
            remove(document, 'pointerover', onPointerOver, true)
            remove(document, 'pointerout', onPointerOut, true)
            remove(document, 'pointermove', onPointerMove, true)
            remove(document, 'keyup', onHoverKey, true)
            remove(document, 'click', swallowMenuClick, true)
            remove(document, 'click', onLeftClick, true)
            remove(document, 'contextmenu', onContextMenu, true)
            remove(document, 'keydown', onKeyDown, true)
            remove(document, 'scroll', onScroll, true)
            remove(window, 'resize', onResize)
            remove(window, 'blur', onBlur)
            if (fallbackTimer) clearTimeout(fallbackTimer)
            closeMenu(false)
            clearToast()
          }
        }, 'direct-open: pointer listeners')

        ctx.effect(() => {
          window.addEventListener('storage', onStorage)
          return () => window.removeEventListener('storage', onStorage)
        }, 'direct-open: cross-tab settings')

        ctx.effect(() => ctx.shortcuts.register({
          id: 'direct-open.toggle',
          label: () => t('shortcut.toggle'),
          aliases: ['toggle direct open', 'direct open', '切换直接打开'],
          defaults: {
            'desktop:windows': { code: 'KeyO', modifiers: ['primary', 'alt', 'shift'] },
            'desktop:macos': { code: 'KeyO', modifiers: ['primary', 'alt', 'shift'] },
            'desktop:linux': { code: 'KeyO', modifiers: ['primary', 'alt', 'shift'] },
          },
          regions: ['page', 'editable'],
          modals: [],
          resolve: () => ({
            status: 'handled',
            run: () => {
              const next = !store.getSnapshot().enabled
              store.update((draft) => { draft.enabled = next })
              console.info('[direct-open] ' + (next ? 'enabled' : 'disabled'))
              if (next && !available()) showToast(t('toast.noDesktop'))
            },
          }),
        }), 'direct-open: toggle shortcut')

        ctx.effect(() => {
          if (typeof document === 'undefined') return
          const existing = document.head.querySelector('style[' + STYLE_MARKER + ']')
          if (existing !== null) existing.remove()
          const style = document.createElement('style')
          style.setAttribute(STYLE_MARKER, '')
          style.textContent = CSS
          document.head.appendChild(style)
          return () => style.remove()
        }, 'direct-open: styles')

        ctx.slots.inject('settings.section', () => ctx.slots.register({
          name: 'settings.section',
          id: 'direct-open',
          order: 50,
          label: () => t('nav'),
        }, SettingsSection))

        ctx.remote.session.canOpenWorkspacePath().then((result) => {
          if (typeof result === 'boolean') {
            desktop.set(result)
          } else {
            desktop.set(result !== null && typeof result === 'object' && result.ok === true && result.value === true)
          }
        }).catch((error) => {
          console.warn('[direct-open] cannot inspect desktop opening support', error)
          desktop.set(false)
        })
      },
    }
  },
})

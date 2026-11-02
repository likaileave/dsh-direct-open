# dsh-direct-open

一个纯客户端 Cordis 插件：让 DSH 的文件入口左键直接用系统默认程序打开，并提供可配置的右键菜单。

## 支持的入口

- 回复末尾的交付文件卡片
- 改动卡片的单文件标题行与多文件列表行
- 回复正文中的文件提及

左键默认打开文件，也可以改为定位文件、或保留 DSH 侧边栏行为。悬停提示会随左键动作切换：不按放行修饰键时显示当前左键动作，按住放行修饰键时显示原来的「在侧边栏预览」。交付卡片上的可见文案也会同步切换。右键菜单提供：

- 用默认程序打开
- 在文件管理器中定位
- 在 DSH 侧边栏中查看
- 复制绝对路径
- 复制相对路径

插件会在 **设置 → 打开方式** 中提供各入口开关、左键修饰键放行、菜单项目、诊断选项以及设置导入 / 导出。

## 快捷键

桌面端默认 `Ctrl/Cmd + Alt + Shift + O` 用于暂停 / 恢复直接打开。快捷键可在 DSH 快捷键设置中调整。Web 端不设置默认快捷键。

## 安装

需要 DSH `>=0.2.0-rc.2`。插件使用客户端 `remote.session` API 调用系统默认程序和文件管理器。

**npm**

```sh
dsh plugin --profile desktop add dsh-direct-open
```

**从 GitHub Release 手动安装**

1. 从 [Releases](https://github.com/likaileave/dsh-direct-open/releases) 下载 `dsh-direct-open.tgz`。
2. 执行：

```sh
dsh plugin --profile desktop add ./dsh-direct-open.tgz
```

**从 dsh-market 安装**

在 dsh-market 中搜索 `dsh-direct-open` 安装。

## 开发

- Host 入口：`lib/index.js`（无额外 Host 逻辑）
- 客户端入口：`lib/client.js`
- bundle patch：`cordis.patch.yml`
- 设置存储：`localStorage` 的 `dsh-direct-open:settings:v1`

```sh
node --check lib/index.js
node --check lib/client.js
```

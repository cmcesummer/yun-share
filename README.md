# 云享 yun-share

## 开发环境

### 开发脚本

```bash

# 1. 启动web服务
npm run start

# 2. 启动 electron 服务
npm run electron

```

## win 下打包

### 遇到的问题以及参考：

-   [常见错误以及解决方式参考](https://juejin.im/post/5bc53aade51d453df0447927)

-   [打包优化参考](https://imweb.io/topic/5b6817b5f6734fdf12b4b09c)

-   [打包目录结构参考](https://juejin.im/post/5b86b7fd6fb9a019c476fc06#heading-12)

### 打包脚本

```bash

npm run build:electron:win

```

### 打包最终输出

```
  • electron-builder  version=21.2.0 os=10.0.14393
  • loaded configuration  file=package.json ("build" field)
  • writing effective config  file=build\releases\builder-effective-config.yaml
  • packaging       platform=win32 arch=x64 electron=7.1.1 appOutDir=build\releases\win-unpacked
  • building        target=zip arch=x64 file=build\releases\yun-share-0.1.1-win.zip
  • building        target=nsis file=build\releases\yun-share Setup 0.1.1.exe archs=x64 oneClick=false perMachine=false
  • building block map  blockMapFile=build\releases\yun-share Setup 0.1.1.exe.blockmap
```

## feature list / todo list:

-   [x] 编辑器 ctrl + s 保存的时候
-   [x] 编辑器粘贴拦截
-   [x] code 编辑器拖拽上传图片
-   [x] md 导出为 html
-   添加总控制， 进可上传云端，退可作为本地开发工具
-   换肤

## BUG LIST

-   [x] 使用 `{ frame: false }` 时，先触发 `win.hide()`，再触发`win.show()`，主界面会有闪动的 bug、并且还没有边框阴影效果
    -   解决方案： `win` 下 需要设置 `{ transparent: false }` , 才不会有闪烁。 坑死了，浪费了一下午找这个 bug。

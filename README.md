# Bilisound 移动客户端

基于 React Native (Expo) 的 Bilisound 移动客户端。

<table>
<tbody>
<tr>
<td><img src=".github/assets/home.jpg" alt="首页"></td>
<td><img src=".github/assets/detail.jpg" alt="详情"></td>
<td><img src=".github/assets/playing.jpg" alt="正在播放"></td>
</tr>
<tr>
<td><img src=".github/assets/playlist-remote.jpg" alt="合集"></td>
<td><img src=".github/assets/playlist.jpg" alt="歌单"></td>
<td><img src=".github/assets/settings.jpg" alt="设置"></td>
</tr>
</tbody>
</table>

## 技术栈

| 名称                                                                    | 简介                                 |
|-----------------------------------------------------------------------|------------------------------------|
| [Expo](https://expo.dev/)                                             | 基于 React Native 的跨端框架              |
| [React Query](https://tanstack.com/query/latest)                      | 异步请求状态管理                           |
| [React Native Track Player](https://rntp.dev/)                        | 音乐播放器解决方案                          |
| [FFmpegKit for React Native](https://github.com/arthenica/ffmpeg-kit) | 音频提取和转码处理                          |
| [Zustand](https://zustand-demo.pmnd.rs/)                              | React 全局状态管理                       |
| [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)    | 持久化键值对存储                           |
| [react-native-fs](https://github.com/itinance/react-native-fs)        | 提供类似 Node.js 的 API，对 App 的数据目录进行操作 |
| [react-native-saf-x](https://github.com/jd1378/react-native-saf-x)    | 在 Android 通过 SAF 实现文件导出功能          |

## 开发模式

由于本项目引用了若干第三方库，因此不能使用 Expo Go。开发前，请根据 [这篇文档](https://docs.expo.dev/guides/local-app-development/) 的说明设置好开发环境。

### iOS

```bash
pnpm run ios
```

### Android

```bash
pnpm run android
```

### Web (Beta，不同于当前线上 Web 版)

```bash
pnpm run web
```

## 构建生产版本

构建生产版本以前，需要准备好 keystore 文件 (Android)……

### Android

```bash
pnpm run build:android
```

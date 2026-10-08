# 官网极简维护说明

只操作 geturinnkaisha-maker/tsukinowa-website。先切换或新建内容分支，提交 PR；不要直接改 main。

## GitHub 网页上传

1. 进入目标目录，点 **Add file > Upload files**。
2. 拖入文件，确认文件名和目录；点 **Commit changes**，提交到内容分支。
3. 在 **Pull requests > New pull request** 创建 PR，检查后由负责人决定合并。

## LINE 二维码

进入 `assets/images/line/` 上传真实二维码 `line-qr.png`，固定路径为 `assets/images/line/line-qr.png`，不可用网页截图替代。
打开 `assets/js/data.js` 点铅笔编辑：保留 `lineQrImage` 固定路径；确认文件已上传后将 `lineQrReady` 从 `false` 改为 `true`。未上传时保持 `false`，页面显示 `LINE QR準備中`，不请求缺失图片；加载失败也会回到占位。
只有取得真实 LINE URL 后才填写 `lineUrl`；空值继续显示准备中并引导到联系页，不填写示例链接。

## Before / After 图片

每个案例单独目录：`assets/images/works/real/<case-id>/before.webp` 和 `after.webp`。两个文件必须属于同一个真实案例。新目录可通过 **Add file > Create new file** 创建 `<case-id>/README.md`，再进入目录上传照片。
仅允许方向校正、等比例缩放、压缩、格式转换；禁止裁切、拉伸、AI 修图和生成 After。已有免费本地转换工具说明见 WORKS_UPDATE_GUIDE.md。

## 标题 / 分类 / 发布状态

编辑 `assets/js/works-data.js`，复制一条现有记录：`id` 必须唯一且与目录一致；`title` 填经确认标题，`category` 填分类，`description` 只写已确认内容。照片路径与上述目录一致，`imageType` 保持 `real`。
照片未配齐时 `published: false`；确认真实照片对、文案和路径后才改 `published: true`。`date` 填已确认施工年月，不知道则留空；`publishedAt` 填真实首次发布日。地区/物业未确认也留空。首页自动取最新4条，Works 自动生成分类筛选。
宠物墙面公开记录沿用 `wallpaper-restoration` 目录；不要再添加重复的 `pet-wall-repair` 记录。

未来只有取得真实 Google 评价或经客户许可的反馈后，再增加「お客様の声」。

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

当前仍使用 **GitHub Pages 静态官网，没有后台上传按钮**。网页上的照片预览不能保存施工案例；新增案例只通过 GitHub 上传文件和编辑数据，不启用 Workers / R2 / Firebase。

每个案例单独目录：`assets/images/works/real/<case-id>/before.webp` 和 `after.webp`。两个文件必须属于同一个真实案例。新目录可通过 **Add file > Create new file** 创建 `<case-id>/README.md`，再进入目录上传照片。
目录模板见 `assets/images/works/real/_template/README.md`，仅用于维护说明，没有图片，也不会被前台读取。案例 id 用小写英文字母、数字和连字符，保持唯一；一个真实案例一个目录，同类案例可继续新增目录。
仅允许方向校正、等比例缩放、压缩、格式转换；禁止裁切、拉伸、AI 修图和生成 After。已有免费本地转换工具说明见 WORKS_UPDATE_GUIDE.md。

## 标题 / 分类 / 发布状态

`assets/js/works-data.js` 是案例标题、分类、说明与发布状态的统一入口。文件顶部已预留以下分类候选：クロス張替え / 壁面補修 / 穴補修 / ドア補修 / CF・床施工 / 原状回復 / その他内装補修。这些仅是未来维护入口，不代表已有实绩，不生成空案例卡或空分类筛选。

编辑该文件，复制顶部注释中的“新規施工事例テンプレート”对象到 `WORKS_DATA` 数组内，保持 `published: false`。`id` 必须唯一且与目录一致；`title` 填经确认标题，`category` 选择对应分类，`description` 只写已确认内容。未上传时 `beforeImage` / `afterImage` 保持空字符串，不填写不存在的图片地址；`imageType` 保持 `real`。
照片未配齐时 `published: false`；确认真实照片对、文案和路径后才改 `published: true`。`date` 填已确认施工年月，不知道则留空；`publishedAt` 填真实首次发布日。地区/物业未确认也留空。首页自动取最新4条，Works 自动生成分类筛选。
宠物墙面公开记录沿用 `wallpaper-restoration` 目录；不要再添加重复的 `pet-wall-repair` 记录。

### 新增案例最短步骤

1. 在当前内容分支创建 `assets/images/works/real/<case-id>/README.md`，进入该案例目录，通过 **Add file > Upload files** 上传真实 `before.webp` 和 `after.webp`。保持真实内容，不裁切、不 AI 修改。
2. **上传前后图后再修改数据文件**：复制 `works-data.js` 的注释模板到数组内，填写 id、真实标题、分类、说明和两张图片的固定路径；未知年月、地区、物业类型留空，暂时保持 `published: false`。
3. 检查两张图片可打开、属于同一真实案例且文案正确，再填实际首次发布日，最后改为 `published: true`，提交到当前 PR 分支。

首页只显示最新4条完整、已发布的真实案例；Works 显示全部。未发布、空标题/分类、未配齐路径、图片不能加载的案例都不显示，也不显示“施工準備中”空案例卡。发布前必须确认两张文件实际存在，避免请求不存在的图片而产生404。开发检查可运行 `node --test tests/works-data.test.cjs`，会核查已发布图片文件。

此阶段只更新 PR #1，保留 noindex，不直接修改 main、不自动合并。以后由负责人审核合并后，GitHub Pages 才发布对应变更。

未来只有取得真实 Google 评价或经客户许可的反馈后，再增加「お客様の声」。

## 当前素材状态（2026-10-08）

真实 LINE 二维码已上传，lineQrReady=true，lineUrl仍为空。地毯、猫抓、網戸三组真实照片已配对，说明为空。狗咬新After缺失，既有wallpaper-restoration完整照片对暂时保留；补齐后更新该目录两张图，不新增重复案例、不混配新旧图片。

# 月輪合同会社 / GETURIN LLC 官网

HTML / CSS / JavaScript 静态官网，当前以 GitHub Pages 测试公开并保留全站 noindex。未来迁移到 XServer；没有 Firebase / Google Cloud SDK、登录、数据库、Storage、Cloud Functions 或按量计费运行依赖。内部 geruninn 完全独立，本仓库不涉及内部业务。

- `assets/js/data.js`：已确认电话、邮箱、价格、Logo 与 LINE 配置。正式 LINE URL 未提供时留空；QR 固定为 `assets/images/line/line-qr.png`，未上传前 `lineQrReady: false`；入口跳到联系页简洁占位，不生成假链接。二维码使用 `lineQrImage` 本地图片，手机正式直达按钮读取 `lineUrl`。
- `assets/js/works-data.js`：真实施工案例唯一数据入口。首页最新4条，Works 全部已发布案例与动态类别筛选。4组真实 Before/After 已接入；宠物墙面已按用户确认纠正文案，重复草稿已删除。维护方法见 [WORKS_UPDATE_GUIDE.md](WORKS_UPDATE_GUIDE.md)。
- `assets/js/services-data.js`：首页服务与表单服务选项共享配置。追加经确认的 title/description/image/alt/caption 即可，无需修改首页。无图服务也可显示文字；可未来追加内装デザイン、店舗内装、フロアタイル、原状回復一括対応等，不预先宣称已提供。
- `contact.html` / `assets/js/contact.js`：完整询价字段及端末内照片预览。送信禁用，不发送邮件、不上传、不保存个人信息、不显示假成功。未来 PHP 接入见 [XSERVER_MIGRATION_PLAN.md](XSERVER_MIGRATION_PLAN.md)。
- `assets/css/style.css`：保持现有品牌及响应式布局，手机底部 LINE / 电话 / お問い合わせ咨询栏保留。

Hero 与允许的服务说明使用氛围图，不显示 AI 来源提示，也不作为施工实绩。WORKS / Before-After 仅允许授权真实照片。真实施工图仅允许方向校正、等比例缩放、压缩、格式转换；禁止裁切、拉伸、AI 修图或生成内容。页面完整显示原图比例，Works 可点击在新标签查看完整源图。公司 Logo 使用用户提供原图，价格、地址、受付时间保持已确认内容。

## 本地验证

`npm ci` 后运行 `npm test` 与 `npm run test:browser`。浏览器检查需要 Playwright Chromium（`npx playwright install chromium`）。测试本地启动静态服务，检查案例/筛选/新增数据、联系方式、LINE占位、表单照片预览及不发送、各页面 noindex、资源加载与320/390/768/1440px布局。Python 图片准备工具为本地维护用途，不是官网运行依赖。

导出公开静态文件即可部署；不上传开发依赖、测试、工具、文档、Git历史或私密配置。当前 PR 不合并、不改 main。

极简维护说明见 [CONTENT_UPDATE_GUIDE.md](CONTENT_UPDATE_GUIDE.md)。未来取得真实 Google 评价或经客户许可的反馈后，再增加「お客様の声」；当前不增加评价模块。

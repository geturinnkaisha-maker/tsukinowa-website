# 真实施工案例目录模板（不公开读取）

这个目录只有说明，不放假图，不作为施工案例 id。前台只读取 `assets/js/works-data.js` 中完整、已发布的真实案例，不扫描目录。

未来可使用的分类：クロス張替え、壁面補修、穴補修、ドア補修、CF・床施工、原状回復、その他内装補修。同类可新增多个真实案例，不预填虚构标题、地区、年月或施工内容。

实际新增时，在本目录的同一级创建一个唯一的 `<case-id>` 目录（小写英文、数字、连字符）：

```text
assets/images/works/real/
  <case-id>/
    README.md     可选，仅记经确认内容，不写客户私人信息
    before.webp   同一真实案例的施工前照片
    after.webp    同一真实案例的施工后照片
```

通过 GitHub `Add file > Create new file` 创建 `<case-id>/README.md`，再进入对应目录，用 `Add file > Upload files` 上传两张真实 WebP。不得裁切、拉伸、AI 修改或生成施工图。

上传后再复制 `works-data.js` 顶部注释模板到数组内。保持 `published: false`，填实际 id、标题、分类、说明与图片路径；未确认年月、地区、物业留空。确认文件可打开后，最后改 `published: true`。

完整步骤见仓库根目录 `CONTENT_UPDATE_GUIDE.md`。没有后台上传按钮，无需修改 HTML。

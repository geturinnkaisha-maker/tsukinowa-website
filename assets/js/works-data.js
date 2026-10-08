// date: 確認済み施工年月 (YYYY-MM)。不明な場合は空欄。publishedAt: 初回公開日。
// 写真が揃っていないケースは published: false のままにしてください。
// 維持管理用の分類候補。公開フィルターは実際に掲載できる施工事例から生成します。
window.WORKS_CATEGORIES = [
  'クロス張替え', '壁面補修', '穴補修', 'ドア補修',
  'CF・床施工', '原状回復', 'その他内装補修'
];

// 新規施工事例テンプレート（コメントのままでは読み込まれません）。
// 下のオブジェクトを WORKS_DATA 配列内にコピーし、確認済み情報だけ入力します。
// 写真アップロード後に beforeImage / afterImage を固定パスで入力し、最後に公開。
// 未確認の年月・地区・物件種別は空欄。架空の事例や写真を追加しないでください。
/*
  {
    id: '',
    title: '',
    category: '', // 上記 WORKS_CATEGORIES から選択
    description: '',
    date: '',
    area: '',
    propertyType: '',
    publishedAt: '',
    beforeImage: '', // アップロード後: assets/images/works/real/<case-id>/before.webp
    afterImage: '',  // アップロード後: assets/images/works/real/<case-id>/after.webp
    imageType: 'real',
    published: false
  },
*/
window.WORKS_DATA = [
  {
    "id": "white-grain-door",
    "title": "白木目ドア補修",
    "category": "ドア補修",
    "date": "",
    "publishedAt": "2026-10-05",
    "area": "",
    "propertyType": "",
    "description": "室内ドアの表面破損を補修しました。",
    "beforeImage": "assets/images/works/real/white-grain-door/before.webp",
    "afterImage": "assets/images/works/real/white-grain-door/after.webp",
    "imageType": "real",
    "published": true
  },
  {
    "id": "switch-wall-repair",
    "title": "壁面補修（スイッチまわり）",
    "category": "壁面補修",
    "date": "",
    "publishedAt": "2026-10-05",
    "area": "",
    "propertyType": "",
    "description": "スイッチ周辺を含む壁面の傷みを補修しました。",
    "beforeImage": "assets/images/works/real/switch-wall-repair/before.webp",
    "afterImage": "assets/images/works/real/switch-wall-repair/after.webp",
    "imageType": "real",
    "published": true
  },
  {
    "id": "wallpaper-restoration",
    "title": "ペットによる壁面破損の補修",
    "category": "壁面補修",
    "date": "",
    "publishedAt": "2026-10-05",
    "area": "",
    "propertyType": "",
    "description": "",
    "beforeImage": "assets/images/works/real/wallpaper-restoration/before.webp",
    "afterImage": "assets/images/works/real/wallpaper-restoration/after.webp",
    "imageType": "real",
    "published": true,
    "homeFeatured": true,
    "homeOrder": 1
  },
  {
    "id": "wood-grain-door",
    "title": "木目ドア補修",
    "category": "ドア補修",
    "date": "",
    "publishedAt": "2026-10-05",
    "area": "",
    "propertyType": "",
    "description": "破損した木目ドアを補修しました。",
    "beforeImage": "assets/images/works/real/wood-grain-door/before.webp",
    "afterImage": "assets/images/works/real/wood-grain-door/after.webp",
    "imageType": "real",
    "published": true,
    "homeFeatured": true,
    "homeOrder": 2
  },
  {
    "id": "tile-carpet-replacement",
    "title": "タイルカーペット張替え",
    "category": "CF・床施工",
    "date": "",
    "publishedAt": "2026-10-08",
    "area": "",
    "propertyType": "",
    "description": "",
    "beforeImage": "assets/images/works/real/tile-carpet-replacement/before.webp",
    "afterImage": "assets/images/works/real/tile-carpet-replacement/after.webp",
    "imageType": "real",
    "published": true
  },
  {
    "id": "cat-scratch-wallpaper",
    "title": "猫の引っかき傷によるクロス張替え",
    "category": "クロス張替え",
    "date": "",
    "publishedAt": "2026-10-08",
    "area": "",
    "propertyType": "",
    "description": "",
    "beforeImage": "assets/images/works/real/cat-scratch-wallpaper/before.webp",
    "afterImage": "assets/images/works/real/cat-scratch-wallpaper/after.webp",
    "imageType": "real",
    "published": true,
    "homeFeatured": true,
    "homeOrder": 3
  },
  {
    "id": "screen-replacement",
    "title": "網戸張替え",
    "category": "その他内装補修",
    "date": "",
    "publishedAt": "2026-10-08",
    "area": "",
    "propertyType": "",
    "description": "",
    "beforeImage": "assets/images/works/real/screen-replacement/before.webp",
    "afterImage": "assets/images/works/real/screen-replacement/after.webp",
    "imageType": "real",
    "published": true,
    "homeFeatured": true,
    "homeOrder": 4
  }
];

# EAR 身體平衡工作坊 — 靜態網站

**尤慧群物理治療師 × 宜安筋膜工作坊**

---

## 🎨 設計版本紀錄

| 版本 | 設計風格 | 狀態 |
|------|----------|------|
| Request 1 | 大地色系（奶茶米白 + 有機植物浮水印） | 已完成 |
| Request 2 | 現代醫學科學（冷調石板藍 + 磚紅 Accent） | 已完成 |
| **Request 3** | **暖奶茶 × 深咖啡 × 金色（目前版本）** | ✅ **現行** |

---

## ✅ 已完成功能

### 頁面結構
- **Navbar**：頂部深咖啡細線 + 奶茶米白背景（`#F4EBE0`），左：品牌 LOGO，中：4 個帶圖標的導覽連結，右：IG/YT/LINE 彩色圓形圖標，手機版漢堡選單
- **Hero**：荷葉浮水印背景 + 金色頂部雙橫線 + 葉脈燈泡 SVG Logo + 「EAR 身體平衡」大標題 + 三大功能入口圖標（立即預約 / 方案價格 / 交通位置）
- **About**：三欄卡片：E.A.R. 核心理念 / 學歷臨床經歷 / 專業進修認證
- **Pricing**：三欄方案卡（到府服務 / 門市服務 / 墊上嬋柔），含結構化 `<table>` 價格表
- **Services**：六服務卡片網格（疼痛舒緩、姿勢矯正、筋膜放鬆、動作訓練、睡眠問題、自律神經）
- **Populations**：三族群卡（運動員 / 孕產婦 / 銀髮族）
- **Process**：四步驟流程說明（橫向追蹤線）
- **Videos**：三影片卡 + YouTube 連結按鈕
- **Contact**：聯絡資訊 + QR Code 展示
- **Footer**：品牌標誌 + 網站地圖 + 關鍵字 SEO 標籤

### 設計規格（Request 3）
- **色盤**：`#FAF5EE` 奶茶米白 / `#5f3d2e` 深咖啡 / `#c4973f` 金色
- **字型**：Noto Sans TC + Noto Serif TC（Google Fonts）
- **圓角**：`4px–8px` 微圓角（規矩幾何矩形）
- **分隔線**：極細 1px 實線（`#e4d4c0`）
- **圖標**：Font Awesome 6.4 + Bootstrap Icons 1.13（CDN）

### 動畫與互動
- `[data-ani="slide-up"]`：IntersectionObserver 滑動進入動畫（Spring easing）
- **Spring tilt**：滑鼠移過卡片時 3D perspective 彈簧傾斜效果（lerp 內插）
- **Portal click pulse**：點擊功能入口時彈簧縮放反彈效果
- **Active nav**：捲動時自動高亮當前 Section 對應連結
- **Back-to-top**：捲動 > 400px 顯示回頂按鈕

---

## 🔗 功能頁面路徑

| 路徑 | 說明 |
|------|------|
| `/` `#hero` | 首頁 Hero — Logo + 三大入口 |
| `#about` | 關於 / EAR 理念 / 學歷 |
| `#pricing` | 服務方案與收費（到府、門市、墊上嬋柔）|
| `#services` | 六大專業服務項目 |
| `#populations` | 服務族群（運動員、孕產婦、銀髮族）|
| `#process` | 服務流程四步驟 |
| `#videos` | 衛教影片 |
| `#contact` | 聯絡方式 / 預約資訊 |

---

## 📁 檔案結構

```
index.html          主頁面（完整 HTML5 語義標籤）
css/
  style.css         完整 CSS（CSS Custom Properties 設計 Token）
js/
  main.js           互動 JS（navbar / data-ani / spring tilt / back-to-top）
img/
  Eunicepic.png     治療師照片
  L_Line.png        LINE QR Code
README.md           本文件
```

---

## 📦 外部依賴（全部 CDN，無安裝）

| 資源 | 版本 | 用途 |
|------|------|------|
| Google Fonts | — | Noto Sans TC + Noto Serif TC |
| Font Awesome | 6.4.0 | 圖標 |
| Bootstrap Icons | 1.13.1 | 額外圖標 |

---

## 🗂️ 資料模型

本站為純靜態網站，**無後端資料庫**，所有內容直接寫入 HTML。

---

## ❌ 尚未實作

- [ ] 真實預約表單（需後端串接）
- [ ] 實際 YouTube embed 影片 ID 更換
- [ ] 實際 QR Code 圖片更換為正式 LINE QR
- [ ] OG Image 社群分享縮圖
- [ ] Google Analytics 追蹤碼

---

## 🚀 部署說明

請至 **Publish 頁籤** 一鍵發佈，系統將自動生成公開網址。

---

## 🛠️ 技術規格

- **HTML5** 語義標籤（`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`）
- **CSS3** Custom Properties + Flexbox + CSS Grid
- **Vanilla JS**（無框架，`'use strict'`）
- **Spring easing**：`cubic-bezier(0.22, 1, 0.36, 1)`
- **IntersectionObserver API**：scroll animation + active nav
- **SVG inline**：燈泡葉脈 Logo、三大入口圖標、荷葉浮水印、方案卡 Logo
- **`<table>`** 結構化價格資料（screen reader 友善）

---

*最後更新：Request 3 暖奶茶設計版 — 2026*

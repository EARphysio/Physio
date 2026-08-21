# EAR 聆芯身體平衡 — 官方網站

> 尤慧群｜EAR聆芯健康顧問有限公司｜同理傾聽・體態對齊・運動恢復

---

## 已完成功能

| 頁面區塊 | HTML id | 狀態 |
|---|---|---|
| 固定導覽列 (Navbar) | `#navbar` | ✅ |
| 英雄區 (Hero) — 左文右圖 | `#hero` | ✅ |
| 關於我 / EAR 核心理念 | `#about` | ✅ |
| 服務項目 (6 項) | `#services` | ✅ |
| 自我照護好物（花生球） | `#populations` | ✅ |
| 服務流程（4 步驟） | `#process` | ✅ |
| **FAQ 常見問答（含 Google AI 結構化資料）** | `#faq` | ✅ 新增 |
| 預約諮詢 + QR Code | `#contact` | ✅ |
| 頁尾 (Footer) | `#footer` | ✅ |

---

## 檔案結構

```
index.html          主頁面
architecture.html   網頁結構 × CSS 對應架構圖（開發參考用）
css/
  style.css         主樣式（設計 Token + 全域 + 各區塊）
  faq.css           FAQ 問答區塊專用樣式
js/
  main.js           互動 JS（Scroll動畫、漢堡選單、回頂按鈕）
img/
  EunicePic.png     創辦人照片
  peanut-ball.png   花生球產品圖
  L_Line.png        LINE QR Code
```

---

## FAQ 結構化資料說明

### 設計目標
將「衛教影片專區」升級為 **FAQ 結構化資料區塊**，大幅提高被 Google AI Overview 搜尋直接引用作為解答的機率。

### 技術實作
1. **`<script type="application/ld+json">` FAQPage Schema**（`index.html` head 區）
   - 8 組 Q&A，涵蓋肌筋膜放鬆、嬋柔運動、肩頸緊繃、預約方式、服務地點、姿勢調整、運動恢復、睡眠品質
   - 符合 [Google Rich Results FAQ 規範](https://developers.google.com/search/docs/appearance/structured-data/faqpage)

2. **HTML `<details>/<summary>` 原生折疊**
   - 無需 JavaScript，SEO 爬蟲可直接讀取全部 Q&A 文字
   - 搭配 CSS 動畫提供視覺回饋

3. **內容合規原則**（符合台灣衛生局法規）
   - 未使用「治療」「診斷」「疾病」等醫療用語
   - 所有描述使用「協助」「提供」「調整」「放鬆」等中性詞彙
   - 急性/持續症狀均建議「先就醫確認診斷」

### 8 題 FAQ 主題
| # | 問題主題 |
|---|---|
| Q1 | 肌筋膜放鬆是什麼 |
| Q2 | GYROKINESIS 嬋柔 vs 瑜伽 |
| Q3 | 肩頸緊繃諮詢 |
| Q4 | 如何預約服務 |
| Q5 | 到府 vs 門市服務 |
| Q6 | 骨盆前傾/駝背改善 |
| Q7 | 運動後肌肉痠痛 |
| Q8 | 睡眠品質與身體調整 |

---

## 架構圖

開啟 `architecture.html` 可查看：
- 所有 HTML 區塊 ↔ CSS 類別的完整對應表
- 設計 Token（顏色、間距、圓角、陰影）
- RWD 斷點（960px / 900px / 640px）說明表
- JavaScript 功能說明

---

## SEO 策略

- `<title>` 主關鍵字前置
- `<meta description>` ≤160 字，含主關鍵字
- LocalBusiness Schema.org JSON-LD
- FAQPage Schema.org JSON-LD（**新增**）
- Open Graph + Twitter Card
- Canonical URL
- Footer 隱藏 SEO 關鍵字清單

---

## 公開網址

- **GitHub Pages**：https://earphysio.github.io/Physio/
- **Instagram**：https://www.instagram.com/earphysio/
- **YouTube**：https://www.youtube.com/@euniceyu/shorts
- **LINE**：https://lin.ee/N2vnfpX

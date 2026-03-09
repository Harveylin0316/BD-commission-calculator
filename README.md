# BD 業績獎金計算器

業務員工每季獎金試算工具。

## 本地執行

```bash
# 方式一：直接開 index.html（或用 Live Server）
open index.html

# 方式二：本機伺服器（根路徑即為計算器）
python3 server.py
# 瀏覽器開啟 http://localhost:8080
```

## 部署至 Netlify

1. 登入 [Netlify](https://app.netlify.com)
2. **Add new site** → **Import an existing project**
3. 選擇 **GitHub**，授權後選 `Harveylin0316/BD-commission-calculator`
4. 設定：
   - **Branch:** main
   - **Build command:** 留空
   - **Publish directory:** `.`（或留空，由 `netlify.toml` 決定）
5. 點 **Deploy site** 即可

之後每次 push 到 `main` 會自動重新部署。

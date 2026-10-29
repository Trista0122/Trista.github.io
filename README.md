# Trista 的个人主页

一个用 [Astro](https://astro.build) 搭建的"成长型个人主页"：项目、学习笔记、此刻、书单、生活。中文为默认语言（`/`），英文在 `/en/`。通过 GitHub Actions 自动部署到 GitHub Pages。

- 全部内容用 Markdown / MDX 管理（Astro Content Collections）
- 浅色 / 深色模式（跟随系统，可手动切换并记住选择）
- 代码高亮（Shiki）与数学公式（KaTeX，字体随站点一起打包，不依赖外部 CDN）
- 无 Google Fonts、无外部 CDN；使用系统字体栈（中文优先 PingFang SC / Microsoft YaHei）
- 开启"减少动态效果"时，所有动画都会关闭

---

## 1. 修改昵称和联系方式

**只需要改一个文件：`src/site.config.ts`**

```ts
export const SITE = {
  nickname: 'Trista',            // 站名 / 昵称，导航栏、标题、页脚都会用到
  avatarLetter: '',              // 头像里的字母，留空则取昵称首字母
  email: 'hello@example.com',    // 联系邮箱
  github: 'https://github.com/Trista0122',
  githubHandle: 'Trista0122',
  tagline: { zh: '…', en: '…' }, // 首页一句话介绍
  description: { zh: '…', en: '…' },
};
```

其他可以改的地方：

| 想改什么 | 文件 |
| --- | --- |
| 首页"关于我"那段自我介绍 | `src/content/about/zh/index.md`、`src/content/about/en/index.md` |
| 导航栏 / 按钮等界面文字 | `src/i18n/ui.ts` |
| 主题色等全部颜色 | `src/styles/global.css` 顶部的 CSS 变量（`--purple`、`--purple-light`、`--purple-deep`、`--accent` 等） |
| 网站图标 | `public/favicon.svg` |

> 搜索 `TODO` 可以找到所有需要你补充的地方：`grep -rn TODO src/content`

---

## 2. 内容放在哪里

所有内容都在 `src/content/<栏目>/<语言>/` 下，**中英两版用同一个文件名**，这样点击语言切换按钮时会跳到对应的另一语言页面。

```
src/content/
├── about/      zh/index.md            en/index.md            → 首页自我介绍
├── now/        zh/2026-10.md          en/2026-10.md          → /now/（只显示 updated 最新的一条）
├── projects/   zh/<slug>.md           en/<slug>.md           → /projects/<slug>/
├── notes/      zh/<slug>.md           en/<slug>.md           → /notes/<slug>/
├── reading/    zh/<slug>.md           en/<slug>.md           → /reading/
└── life/       zh/<slug>.md           en/<slug>.md           → /life/
```

- 文件名就是网址（slug），建议用英文小写加连字符，例如 `aes-gf28.md`
- 以下划线开头的文件（如 `_draft.md`）会被忽略
- 也可以用 `.mdx`（可以在正文里写组件）；只写普通 Markdown 的话用 `.md` 更省心

### 新增一篇笔记

1. 新建 `src/content/notes/zh/my-note.md`（中文版）：

   ~~~md
   ---
   title: 笔记标题
   description: 一两句话摘要，显示在列表卡片上
   date: 2026-11-01
   tags: [密码学, Python]   # 用于笔记页的标签筛选
   # updated: 2026-11-05     # 可选：更新日期
   # draft: true             # 可选：草稿，正式部署时不显示
   ---

   正文。行内公式 $a^{-1} = a^{254}$，行间公式：

   $$
   m(x) = x^8 + x^4 + x^3 + x + 1
   $$

   ```python
   print("代码会自动高亮")
   ```
   ~~~

2. 新建 `src/content/notes/en/my-note.md`（英文版，**文件名相同**），frontmatter 字段一样，内容写英文。
3. 如果暂时只写了一种语言也可以：切换语言时会回到另一语言的笔记列表页。

### 新增一个项目

1. 新建 `src/content/projects/zh/my-project.md`：

   ```md
   ---
   title: 项目标题
   summary: 一句话摘要（显示在卡片上）
   date: 2026-11-01
   period: 2026 秋 · 课程项目      # 可选
   role: 独立完成                  # 可选
   status: 进行中                  # 可选，卡片右上角的小字
   tags: [Python, 数据分析]
   links:                          # 可选
     - label: 代码
       href: https://github.com/…
   order: 5                        # 可选，数字越小越靠前；不填按日期倒序
   ---

   ## 问题

   ## 方法

   ## 结果

   ## 我学到了什么
   ```

   详情页会自动给每个 `##` 标题加上 1、2、3、4 的编号徽标，所以请保持"问题 → 方法 → 结果 → 我学到了什么"四段结构。

2. 新建 `src/content/projects/en/my-project.md`，文件名相同，四个小标题用 `Problem / Approach / Result / What I learned`。

### 更新 Now / 书单 / 生活

- **Now**：每月新建一个文件，例如 `src/content/now/zh/2026-11.md` + `en/2026-11.md`，frontmatter 写 `updated: 2026-11-01`。页面只显示最新的一条，页面顶部会显示更新日期；旧文件可以留着当存档。
- **书单**：`src/content/reading/{zh,en}/<slug>.md`，frontmatter 包括 `title`、`creator`（作者 / 主播）、`type`（`book` 或 `podcast`）、`status`（`done` / `reading` / `want` / `listening`）、`date`、`tags`；正文写几句短评。
- **生活**：`src/content/life/{zh,en}/<slug>.md`，frontmatter 包括 `title`、`date`、`emoji`、`tags`。

字段写错时，构建会报错并指出是哪个文件的哪个字段，按提示修改即可（规则定义在 `src/content.config.ts`）。

---

## 3. 本地预览

需要 **Node.js 22.23.4 及以上**（推荐 24 LTS）。

```bash
npm install
```

```bash
npm run dev
```

然后打开终端里显示的地址（默认 <http://localhost:4321/>），修改内容后页面会自动刷新。

模拟正式环境（先构建再预览）：

```bash
npm run build
```

```bash
npm run preview
```

---

## 4. 部署

推送（或合并 PR）到 `main` 分支后，`.github/workflows/deploy.yml` 会自动构建并发布到 GitHub Pages；其他分支不会触发部署。也可以在仓库的 **Actions → Deploy to GitHub Pages → Run workflow** 手动触发。

第一次使用需要在仓库 **Settings → Pages → Build and deployment → Source** 里选择 **GitHub Actions**。

关于网址（`site` 与 `base`，见 `astro.config.mjs`）：
- 仓库 `Trista0122/Trista0122.github.io` 是"用户站点"，地址为 `https://trista0122.github.io/`，所以 `site = 'https://trista0122.github.io'`、`base = '/'`。
- 站内链接都通过 `src/i18n/utils.ts` 中的 `url()` / `localizedUrl()` 生成，Markdown 里的站内链接请用相对路径（如 `../notes/aes-gf28/`），这样即使以后改 base 也不会失效。
- 如果绑定自定义域名，把 `site` 改成新域名即可，`base` 保持 `/`。

---

## 5. 目录结构

```
├── astro.config.mjs          # Astro 配置（site/base、i18n、Markdown、KaTeX）
├── src/
│   ├── site.config.ts        # ★ 昵称、邮箱、GitHub 等个人信息
│   ├── content.config.ts     # 内容集合的字段定义
│   ├── content/              # ★ 所有 Markdown 内容
│   ├── i18n/                 # 界面文字与语言工具函数
│   ├── styles/global.css     # 颜色变量、排版、动画
│   ├── layouts/              # 页面骨架（头部、页脚、主题、View Transitions）
│   ├── components/           # 头像、卡片、导航栏等
│   ├── views/                # 每个页面的实际内容（中英共用）
│   └── pages/                # 路由：中文在根目录，英文在 en/
└── public/                   # 原样复制的静态文件（favicon 等）
```

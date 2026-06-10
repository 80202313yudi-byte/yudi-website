# Start Here For Next Codex

这是 FISHDI / 于迪个人网站项目。开始修改前，请先读本文件和 `AGENTS.md`。

## 当前项目位置

当前工作区：

```text
/Users/edy/.codex/worktrees/7257/个人网站
```

远程仓库：

```text
https://github.com/80202313yudi-byte/yudi-website.git
```

线上域名：

```text
https://于迪.com/
https://xn--6kq660n.com/
```

## 新电脑接手方式

如果是直接复制整个项目文件夹到新电脑：

```bash
cd 个人网站
npm install
npm run dev
```

打开：

```text
http://127.0.0.1:3000/
```

如果是通过 GitHub 接手，注意：当前工作区可能有未提交改动。请先在旧电脑提交并推送到一个非发布分支，或者直接复制整个项目文件夹。不要默认推送到 `main`，因为 GitHub Pages 可能会自动发布。

## 当前视觉方向

保持：

- 黑色 / 深灰背景
- 荧光绿色点缀
- 极简未来科技感
- 圆角卡片、细边框、柔和光效
- FISHDI 当前品牌调性
- 真实作品图片保留原始颜色，不要加绿色滤镜

避免：

- 重做成蓝色、白色或完全不同风格
- 过度霓虹和装饰
- 全站都变成卡片式后台面板
- 很小很暗的正文
- 未经确认发布或部署

## 当前首页状态

最新一版首页已经调整为：

- Hero 左侧文案，右侧作品碎片墙
- Hero 作品墙两条 CSS marquee 轨道：上层向左，下层向右
- 下方正式作品区改为 `项目案例 / Case Studies`
- 已新增 `/works` 全部作品归档页
- 详情页继续使用 `/works/[slug]`
- 项目详情返回逻辑仍要保留：从哪张卡片进入，返回时回到那张卡片附近

关键文件：

```text
components/Hero.tsx
components/HeroWorksWall.tsx
components/FeaturedWorks.tsx
components/ProjectCardLink.tsx
data/projects.ts
data/featuredWorks.ts
data/projectNavigation.ts
app/works/page.tsx
app/works/[slug]/page.tsx
app/globals.css
```

## 每次改完必须做

```bash
npm run lint
npm run build
```

前端布局改动还要检查：

- 1440px
- 1280px
- 1024px
- 768px
- 390px

重点确认：

- 无横向滚动
- 中文标题不拆词、不单字孤行
- 首页作品墙不遮挡内容
- `/works` 页面正常
- 六个 `/works/[slug]` 详情页正常
- 返回作品逻辑不被破坏
- 移动端导航正常

## 最新验证记录

最近一次验证：

```bash
npm run lint
npm run build
```

结果：通过。

最近本地预览：

```text
http://127.0.0.1:3000/
```

## 当前仍需用户后续补充

- 真实项目封面和详情页图片
- 真实联系邮箱，当前仍可能是占位邮箱
- 真实社交主页链接
- 每个项目更具体的过程、成果和项目背景

不要虚构客户、商业结果、指标或评价。

# TODOS

## 技术验证：Astro 6 构建性能 + Cloudflare Workers Static Assets 部署
- **What**: 用 Astro 6 生成 1000 个测试页面，测量构建时间并推算 50K 页面的构建时间。同时验证 Cloudflare Workers Static Assets 部署流程。
- **Why**: 这是阻塞项——如果 Astro 构建 50K 页超过 20 分钟（Cloudflare 构建超时限制），需要切换到 Plan B（11ty/Eleventy 或分批构建 + 增量部署）。
- **Pros**: ���投入内容采集之前验证技术可行性，避免浪费时间。
- **Cons**: 需要先学习 Astro 基础，约 2-4 小时。
- **Context**: 搜索发现 Astro SSG 优化后约 127 页/秒。50K 页理论构建时间约 7 分钟，在 20 分钟限制内。但需要实测确认，因为 Content Collections 的 schema 验证、Pagefind 索引生成等会增加时间。Astro 6 基于 Cloudflare workerd 运行时，与 Cloudflare Workers Static Assets 是天然搭配。
- **Depends on**: 无
- **Blocked by**: 无

## 法律验证：确认内容源使用协议
- **What**: 阅读维基文库（zh.wikisource.org）和 ctext.org 的使用协议/版权声明，确认其内容是否允许全文转载聚合到第三方商业站点。
- **Why**: 阻塞项——整个项目的内容基础依赖于此。如果不允许全文转载，需要走 Plan B（仅摘要+链接原文，或自行数字化已确认公版域的原始文本）。
- **Pros**: 避免法律风险，确保项目可持续。
- **Cons**: 需要仔细阅读法律条款，可能需要咨询律师。
- **Context**: 维基文库使用 CC-BY-SA 3.0 协议——允许转载但必须署名 + 同条件分享（即你的站也必须以 CC-BY-SA 授权）。这可能与未来的商业化（Phase 3 会员制）产生冲突。ctext.org 的协议需要单独确认。Project Gutenberg 对中文内容覆盖有限但协议明确。
- **Depends on**: 无
- **Blocked by**: 无

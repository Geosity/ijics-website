# IJICS 论文 API

启动：`npm run dev:api`，仅监听 `127.0.0.1:4181`。`npm run dev:full` 同时启动 Vue 4174 和该接口，浏览器经同域 `/api` 代理调用。

| GET 路径 | 返回 |
| --- | --- |
| `/api/health` | `{ok, mode}` |
| `/api/articles?q=&type=&issue=` | `{data: Article[], meta}` |
| `/api/articles/:id` | `{data: Article, meta}` |
| `/api/articles/:id/metrics` | `{data:{id,readCount,downloadCount,citationCount,metricsAsOf}}` |

`type` 为 `all/editorial/articles/communication`，`issue` 为 issue ID（例如43）。未知论文404，服务故障503/上游502，不支持的方法405。

Article 是白名单视图模型：id、title、doi、abstract、authors（显示名称）、authorDetails（公开姓名分段）、keywords、category、volume、issue、issueId、pages、published、figure/figureCaption、pdfUrl/browseUrl、references，以及三项计数与metricsAsOf。null表示未知，0表示接口返回零；不在点击后模拟加一。原接口pdfLink可能为DOCX，禁止用于下载或阅读；仅用官方browse/download端点。API的pdfSize并不保证为最终PDF字节数，界面只显示经实际下载核对的pdfDownloadSize。

## 测试与正式接口

默认`IJICS_API_MODE=fixture`：36篇官网公开记录的注明日期快照。仅此模式支持：

- `?scenario=error` → 503
- 列表`?scenario=empty` → 空数组
- 详情`?scenario=null-metrics` → 三项计数null

`IJICS_API_MODE=live npm run dev:full`：详情与指标从固定官方详情API读取并净化；图资产使用本地映射。列表仍为现有目录快照，meta.mode=snapshot，避免把目录缓存当实时全文检索。测试故障参数在live模式不生效。上游15秒截止，浏览器12秒截止，失败显式提示。

前端`VITE_API_BASE`为空时读取打包快照；`/api`通过同域代理连接；绝对URL可连接另一个遵守该契约的网关（须配置允许来源）。现有官方原始响应不符合该净化契约，不能绕过适配器直接使用。网关不接收任意上游URL，不传入凭据，不公开作者邮箱、内部用户/稿件字段。

静态托管不能独自运行live网关。上线时需部署该网关并配置同域反向代理，或使用允许站点来源的网关地址。当前GitHub Pages构建采用有日期的快照，CI定时更新，论文正文与元数据预渲染；这不冒充实时统计服务。

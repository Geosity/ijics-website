<script setup>
import {ref,computed,onMounted,onUnmounted} from 'vue';
import {useFeatureCarousel} from '../composables/useFeatureCarousel.js';
import ArticleList from '../components/ArticleList.vue';
import snapshots from '../data/articles.json' with {type:'json'};
import {assetUrl} from '../api/assetUrl.js';
import {fetchArticles} from '../api/articleClient.js';
const featuredIds=[376,379,382,322,352,369,373,372];
const records=ref(snapshots),slide=ref(0),refreshError=ref('');
const coverArticle=computed(()=>records.value.find(a=>a.id===364));
const latestArticles=computed(()=>featuredIds.map(id=>records.value.find(a=>a.id===id)).filter(Boolean));
const {carouselRef,trackRef}=useFeatureCarousel(slide);
let controller;onMounted(()=>{if(import.meta.env.VITE_API_BASE){controller=new AbortController();fetchArticles({signal:controller.signal}).then(x=>records.value=x).catch(e=>{if(e.name!=='AbortError')refreshError.value='Current usage data is unavailable. Showing dated article records.'});}});onUnmounted(()=>controller?.abort());
</script>
<template><p v-if="refreshError" class="data-warning" role="status">{{refreshError}}</p><main id="main" class="page-shell">


      <div class="content-flow">
        <section class="home-band" id="home">
          <div class="home-grid">
            <section class="reader-panel" id="articles" aria-labelledby="reader-title">
              <div ref="carouselRef" class="feature-carousel" aria-label="Featured notices" aria-roledescription="carousel">
                <div class="feature-track" id="featureTrack" ref="trackRef" :style="{transform: 'translateX(-' + slide * 100 + '%)'}">
                  <article class="feature-slide feature-slide-journal">
                    <div class="feature-frame">
                      <aside class="feature-identity" aria-label="IJICS journal identity">
                        <div class="feature-identity-brand" role="img" aria-label="IJICS, The International Journal of Intelligent Control and Systems">
                          <span class="feature-identity-circles" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
                          <strong class="feature-identity-wordmark" aria-hidden="true">IJICS</strong>
                          <span class="feature-identity-title-cn" aria-hidden="true" lang="zh-CN">国际智能控制与系统学报（英文）</span>
                          <span class="feature-identity-title-en" aria-hidden="true">The International Journal of<br><b>Intelligent Control and Systems</b></span>
                        </div>
                        <RouterLink to="/aim-scope#aim-scope">About IJICS <span aria-hidden="true">→</span></RouterLink>
                      </aside>
                      <div class="feature-page feature-page-journal">
                        <div class="feature-journal-main feature-journal-latest">
                          <h1 class="visually-hidden" id="reader-title">The International Journal of Intelligent Control and Systems</h1>
                          <h2 class="feature-overview-title">Journal Overview</h2>
                          <p class="feature-journal-introduction">
                            IJICS is an international, peer-reviewed journal publishing original research, reviews,
                            communications, and scholarly perspectives in intelligent control and systems.
                          </p>
                          <dl class="latest-issue-facts" aria-label="Latest issue information">
                            <div><dt>Latest Issue</dt><dd id="latestIssueLabel">Volume 31, Issue 2 (2026)</dd></div>
                            <div><dt>Published</dt><dd id="latestIssueDate">25 June 2026</dd></div>
                          </dl>
                          <article class="cover-paper-summary" aria-labelledby="coverPaperLabel">
                            <p class="cover-paper-label" id="coverPaperLabel">Cover Article</p>
                            <h2><RouterLink id="coverPaperLink" to="/articles/364">{{coverArticle?.title}}</RouterLink></h2>
                            <p class="cover-paper-authors" id="coverPaperAuthors">{{coverArticle?.authors.join(", ")}}</p>
                            <p class="cover-paper-meta" id="coverPaperPages">Pages 124–136</p>
                          </article>
                        </div>
                        <RouterLink class="latest-cover" id="latestIssueCoverLink" aria-label="View Volume 31, Issue 2 (2026)" to="/issues/43">
                          <span class="latest-cover-kicker">Latest Issue</span>
                          <img id="latestIssueCover" src="https://static.cacpaper.com/ijics-journal/ijics/issue-cover/1784277938.417322.png" alt="Cover of Volume 31, Issue 2 (2026)" width="360" height="480">
                        </RouterLink>
                      </div>
                    </div>
                  </article>

                  <article class="feature-slide feature-slide-scope">
                    <div class="feature-frame">
                      <aside class="feature-identity" aria-label="IJICS journal identity">
                        <div class="feature-identity-brand" role="img" aria-label="IJICS, The International Journal of Intelligent Control and Systems">
                          <span class="feature-identity-circles" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
                          <strong class="feature-identity-wordmark" aria-hidden="true">IJICS</strong>
                          <span class="feature-identity-title-cn" aria-hidden="true" lang="zh-CN">国际智能控制与系统学报（英文）</span>
                          <span class="feature-identity-title-en" aria-hidden="true">The International Journal of<br><b>Intelligent Control and Systems</b></span>
                        </div>
                        <RouterLink to="/aim-scope#aim-scope">View Aims and Scope <span aria-hidden="true">→</span></RouterLink>
                      </aside>
                      <div class="feature-page feature-page-scope">
                        <div class="feature-scope-heading">
                          <h2>Aims and Scope</h2>
                          <p class="feature-scope-intro">IJICS welcomes theoretical, computational, experimental, and applied contributions that advance intelligent control, autonomous systems, robotics, and systems engineering.</p>
                        </div>
                        <ul class="feature-scope-grid" aria-label="IJICS research areas">
                          <li><span class="feature-scope-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 19V6M4 19h14M7 15l4-4 3 2 5-7"></path></svg></span>Intelligent Control Theory</li>
                          <li><span class="feature-scope-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><circle cx="5" cy="6" r="2"></circle><circle cx="19" cy="6" r="2"></circle><circle cx="5" cy="18" r="2"></circle><circle cx="19" cy="18" r="2"></circle><path d="m7 7.5 3 2.5m4 0 3-2.5m-7 6.5-3 2.5m7-2.5 3 2.5"></path></svg></span>Multi-Agent Systems</li>
                          <li><span class="feature-scope-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-2 3v2a3 3 0 0 0 2 3v1a3 3 0 0 0 3 3M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 2 3v2a3 3 0 0 1-2 3v1a3 3 0 0 1-3 3M12 3v18M8 9h4M12 15h4"></path></svg></span>Machine Learning</li>
                          <li><span class="feature-scope-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 20h7M7 20v-3l4-4M11 13l3 3 4-4M14 16l-3-3 3-3 3 3M18 12l2-2-3-3-3 3"></path><circle cx="7" cy="7" r="2"></circle><path d="m8.5 8.5 3 3"></path></svg></span>Intelligent Robotics</li>
                          <li><span class="feature-scope-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 11h16M7 8h10l2 3-2 3H7l-2-3 2-3ZM9 14l-1 4m7-4 1 4M9 5h6"></path><circle cx="8" cy="11" r="1"></circle><circle cx="16" cy="11" r="1"></circle></svg></span>Unmanned Systems</li>
                          <li><span class="feature-scope-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 21V9l6 3V7l6 4V4h3v17H3Z"></path><path d="M7 17h2m3 0h2m3 0h2"></path></svg></span>Intelligent Manufacturing</li>
                          <li><span class="feature-scope-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"></circle><circle cx="5" cy="18" r="2"></circle><circle cx="19" cy="18" r="2"></circle><circle cx="12" cy="13" r="2"></circle><path d="M12 7v4m-2 3-3.5 2.5m7.5-2.5 3.5 2.5"></path></svg></span>Networked Control Systems</li>
                          <li><span class="feature-scope-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 7h12m0 0-3-3m3 3-3 3M20 17H8m0 0 3-3m-3 3 3 3"></path></svg></span>System Integration &amp; Automation</li>
                        </ul>
                        <dl class="feature-facts">
                          <div><dt>Published in</dt><dd>Beijing, China</dd></div>
                          <div><dt>Frequency</dt><dd>Quarterly</dd></div>
                          <div><dt>ISSN</dt><dd>0218-7965</dd></div>
                          <div><dt>CN</dt><dd>10-1942/TP</dd></div>
                          <div><dt>Established</dt><dd>1993</dd></div>
                          <div><dt>Society</dt><dd>CAA</dd></div>
                        </dl>
                      </div>
                    </div>
                  </article>

                  <article class="feature-slide feature-slide-pick feature-slide-paper feature-slide-pick-agri">
                    <div class="feature-content">
                      <p class="eyebrow">Volume 31, Issue 2 · 2026</p>
                      <h2>Agricultural Intelligence Takes Root: Turning Plant Science into a Digital Frontier</h2>
                      <p class="feature-summary">Agricultural intelligence is becoming a system-level endeavor, not a collection of point solutions.</p>
                      <p class="feature-authors">Mengzhen Kang, Xiujuan Wang, Marc Jaeger, Véronique Letort, Fei-Yue Wang</p>
                      <p class="feature-doi">New AI and New Society · pp. 117–118 · DOI 10.62678/IJICS202606.10376</p>
                    </div>
                    <figure class="feature-paper-figure feature-paper-figure-agri" role="img" aria-label="AIEI 2026 delegates at CIRAD in Montpellier, France"></figure>
                    <RouterLink class="quiet-link" to="/articles/376">Read article</RouterLink>
                  </article>

                  <article class="feature-slide feature-slide-pick feature-slide-paper feature-slide-pick-robotics">
                    <div class="feature-content">
                      <p class="eyebrow">Volume 31, Issue 2 · 2026</p>
                      <h2>Humanoid Robotics on the Move: Insights from the 2026 Beijing E-Town Half Marathon</h2>
                      <p class="feature-summary">Public-scenario performance is becoming an important measure of humanoid robotics maturity.</p>
                      <p class="feature-authors">Editorial Office of IJICS</p>
                      <p class="feature-doi">New AI and New Society · pp. 119–120 · DOI 10.62678/IJICS202606.10379</p>
                    </div>
                    <figure class="feature-paper-figure feature-paper-figure-robotics" role="img" aria-label="Humanoid robotics artwork from the article"></figure>
                    <RouterLink class="quiet-link" to="/articles/379">Read article</RouterLink>
                  </article>
                </div>
                <div class="feature-pagination" aria-label="Choose featured notice">
                  <button type="button" data-feature-slide="0" aria-label="Show latest issue" @click="slide = 0" :class="{'is-active':slide === 0}" :aria-pressed="slide === 0"></button>
                  <button type="button" data-feature-slide="1" aria-label="Show journal scope" @click="slide = 1" :class="{'is-active':slide === 1}" :aria-pressed="slide === 1"></button>
                  <button type="button" data-feature-slide="2" aria-label="Show first editor's pick" @click="slide = 2" :class="{'is-active':slide === 2}" :aria-pressed="slide === 2"></button>
                  <button type="button" data-feature-slide="3" aria-label="Show second editor's pick" @click="slide = 3" :class="{'is-active':slide === 3}" :aria-pressed="slide === 3"></button>
                </div>
              </div>

              <section class="journal-credential-rail" aria-label="IJICS leadership and author resources">
                <aside class="credential-editor" aria-label="Editorial leadership">
                  <span class="credential-editor-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m13 3 8 8-9 9H4v-8l9-9Z"></path><path d="m12 6 6 6M4 20l6-6M8 12l4 4"></path></svg></span>
                  <div><small>Editor-in-Chief</small><strong>Fei-Yue Wang</strong><p>Chinese Academy of Sciences</p><RouterLink to="/editorial-board#editorial-board">View Editorial Board <span aria-hidden="true">→</span></RouterLink></div>
                </aside>
                <aside class="author-resource-panel" aria-label="Author Center shortcuts">
                  <h2>Author Center</h2>
                  <nav class="author-resource-grid" aria-label="Submission resources">
                    <a class="author-resource-submit" href="https://www.ijics.cn/user/login"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4m0 0L7 9m5-5 5 5"></path><path d="M5 14v6h14v-6"></path></svg><span>Submit</span></a>
                    <RouterLink to="/instructions-for-authors#instructions-for-authors"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6V3Z"></path><path d="M15 3v5h5M9 12h7m-7 4h7"></path></svg><span>Guidelines</span></RouterLink>
                    <RouterLink to="/author-center#templates"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h8l4 4v14H7V3Z"></path><path d="M15 3v5h5"></path></svg><span>Template</span></RouterLink>
                    <RouterLink to="/instructions-for-authors#submission-checklist"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="1"></rect><path d="m8 12 3 3 6-7"></path></svg><span>Checklist</span></RouterLink>
                  </nav>
                </aside>
              </section>

              <div class="issue-showcase" id="current-issue" aria-labelledby="current-issue-title">
                <div class="issue-showcase-header">
                  <div>
                    <p class="eyebrow">Latest Issue</p>
                    <h2 id="current-issue-title" data-latest-issue-title="">Volume 31, Issue 2 (2026)</h2>
                  </div>
                  <RouterLink class="quiet-link" data-latest-issue-link="" to="/issues/43">Read latest issue</RouterLink>
                </div>

                <ArticleList :articles="latestArticles"></ArticleList>
              </div>
            </section>
          </div>
        </section>

        <div class="home-information-grid">
        <section class="summary-band" id="call-for-papers" aria-label="Calls for papers and journal updates">
          <div class="updates-panel" aria-labelledby="updates-title">
            <div class="updates-heading">
              <div><h2 id="updates-title">Calls for Papers</h2></div>
              <a class="quiet-link" href="https://www.ijics.cn/call-for-papers">View Special Issues</a>
            </div>

            <p class="calls-empty-state">There are currently no open calls for papers.</p>

            <div class="journal-news-board" aria-labelledby="news-title">
              <div class="journal-news-heading"><h2 id="news-title">News</h2></div>
              <div class="journal-news-list">
                <article class="journal-news-card">
                  <img alt="Issue news thumbnail" :src="assetUrl(&quot;/assets/update-news-issue.svg&quot;)">
                  <div>
                    <p class="news-meta">2026-06-25 | Latest Issue</p>
                    <h3>Volume 31, Issue 2 (2026) is now available</h3>
                    <p>Browse the table of contents and read articles in this issue.</p>
                    <RouterLink class="quiet-link" to="/issues/43">Read latest issue</RouterLink>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section class="caa-related" aria-labelledby="related-links-title">
          <div class="caa-related-copy">
            <h2 id="related-links-title">Related Links</h2>
            <p>Links to related journals and professional societies.</p>
          </div>
          <div class="related-link-list">
            <a class="caa-related-link" href="https://www.caa.org.cn/" target="_blank" rel="noopener noreferrer">
              <span class="caa-related-identity">
                <span class="caa-related-mark"><img alt="Chinese Association of Automation logo" :src="assetUrl(&quot;/assets/caa-logo.png&quot;)"></span>
                <strong>Chinese Association of Automation</strong>
              </span>
              <span>Visit CAA</span>
            </a>
            <a class="caa-related-link related-link-jist" href="https://jessyl1102.github.io/JIST-/" target="_blank" rel="noopener noreferrer">
              <span class="caa-related-identity">
                <span class="related-link-monogram" aria-hidden="true">JIST</span>
                <strong>Journal of Intelligent Science and Technology</strong>
              </span>
              <span>Visit JIST</span>
            </a>
          </div>
        </section>
        </div>
      </div>
      <section class="journal-recognition-footer" aria-label="Journal recognition and indexing">
                <ul class="journal-value-list credential-recognition-list">
                  <li class="journal-value-item">
                    <span class="journal-value-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
                        <circle cx="12" cy="9" r="5"></circle><path d="m8.5 13-1 9 4.5-2 4.5 2-1-9"></path><path d="m10 9 1.3 1.3L14 7.7"></path>
                      </svg>
                    </span>
                    <span class="journal-value-copy"><strong>Excellence Action Plan for China's STM Journals</strong><small class="credential-translation" lang="zh-CN">中国科技期刊卓越行动计划</small><small>2019</small></span>
                  </li>
                  <li class="journal-value-item">
                    <span class="journal-value-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M4 5h16v14H4zM8 9h8M8 13h8M8 17h5"></path></svg>
                    </span>
                    <span class="journal-value-copy"><strong>High-Quality STM Journals Directory</strong><small class="credential-translation" lang="zh-CN">高质量科技期刊分级目录</small><small>2025</small></span>
                  </li>
                  <li class="journal-value-item">
                    <span class="journal-value-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
                        <ellipse cx="12" cy="5" rx="8" ry="3"></ellipse><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5"></path><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"></path>
                      </svg>
                    </span>
                    <span class="journal-value-copy"><strong>Japan Science and Technology Agency (JST)</strong><small>2025</small></span>
                  </li>
                  <li class="journal-value-item">
                    <span class="journal-value-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
                        <circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"></path>
                      </svg>
                    </span>
                    <span class="journal-value-copy"><strong>Index Copernicus International (ICI)</strong></span>
                  </li>
                </ul>
      </section>
    </main></template>
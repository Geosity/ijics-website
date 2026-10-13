<script setup>
import {assetUrl} from '../api/assetUrl.js';
import {copyText} from '../api/copyText.js';
</script>
<template>
<main id="main" class="page-shell">

      <div class="content-flow information-page guided-information-page ">
        <nav class="information-breadcrumb" aria-label="Breadcrumb"><RouterLink to="/#home">Home</RouterLink><span>/</span><strong>Anti-Fraud Notice</strong></nav>
        <header class="subpage-heading" id="anti-fraud"><h1>Anti-Fraud Notice</h1></header>
        <section class="information-layout">
          <nav class="page-toc" aria-label="Anti-Fraud Notice sections">
            <strong>Table of Contents</strong>
            <a href="#official-identity">Official Contact Information</a>
            <a href="#login-check">Submission System</a>
            <a href="#payment-check">Fees and Payment Requests</a>
            <a href="#report-message">Reporting Suspicious Communications</a>
          </nav>
          <div class="information-content">
<article class="content-section" id="official-identity"><h2>Official Contact Information</h2><p>The journal website is <strong>www.ijics.cn</strong>. Contact the Editorial Office at <strong>ijics@caa.org.cn</strong>.</p></article>
            <article class="content-section" id="login-check"><h2>Submission System</h2><p>The online submission system is located at <strong>https://www.ijics.cn/user/login</strong>. Check the browser address before entering credentials.</p></article>
            <article class="content-section" id="payment-check"><h2>Fees and Payment Requests</h2><p>IJICS currently charges no manuscript processing fee. Any future publication charges will be announced on the journal website. Contact the Editorial Office to verify a payment request.</p></article>
            <article class="content-section" id="report-message"><h2>Reporting Suspicious Communications</h2><p>Forward the sender address, link, and manuscript reference to the Editorial Office. Do not include account passwords or payment credentials.</p><a class="primary-action" href="mailto:ijics@caa.org.cn">Email the Editorial Office</a></article>
          </div>
        </section>
      </div>
    </main>
</template>

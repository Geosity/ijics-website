<script setup>
import {assetUrl} from '../api/assetUrl.js';
import {copyText} from '../api/copyText.js';
</script>
<template>
<main id="main" class="page-shell">

      <div class="content-flow information-page guided-information-page ">
        <nav class="information-breadcrumb" aria-label="Breadcrumb"><RouterLink to="/#home">Home</RouterLink><span>/</span><strong>Submit a Manuscript</strong></nav>
        <header class="subpage-heading" id="submit-manuscript"><h1>Submit a Manuscript</h1></header>
        <section class="information-layout">
          <nav class="page-toc" aria-label="Submit a Manuscript sections">
            <strong>Table of Contents</strong>
            <a href="#before-submit">Before You Submit</a>
            <a href="#submission-steps">Submission Process</a>
            <a href="#reviewer-suggestions">Suggested Reviewers</a>
            <a href="#official-login">Submission System</a>
          </nav>
          <div class="information-content">
<article class="content-section" id="before-submit">
              <h2>Before You Submit</h2>
              <ul class="check-list"><li>The manuscript is original and not under consideration elsewhere.</li><li>The manuscript fits the IJICS Aims and Scope.</li><li>All authors have read and approved the submitted version.</li><li>The manuscript follows the preparation requirements.</li></ul>
            </article>
            <article class="content-section" id="submission-steps">
              <h2>Submission Process</h2>
              <ol class="numbered-flow"><li><strong>Register and sign in.</strong><span>Use the IJICS online submission system.</span></li><li><strong>Upload the manuscript.</strong><span>DOC and PDF files are accepted; PDF is preferred.</span></li><li><strong>Confirm author details.</strong><span>Confirm that every co-author is included and the file is correctly uploaded.</span></li><li><strong>Submission confirmation.</strong><span>The system sends an acknowledgment email after a successful submission.</span></li><li><strong>Editorial correspondence.</strong><span>Editorial decisions and requests for revision are sent by email.</span></li></ol>
            </article>
            <article class="content-section" id="reviewer-suggestions"><h2>Suggested Reviewers</h2><p>Authors may suggest 2-3 potential reviewers by providing names, institutional email addresses, and reasons for suggestion. Suggested reviewers should not have co-authored or collaborated with the authors within the past three years.</p></article>
            <article class="content-section" id="official-login"><h2>Submission System</h2><p>Check that the browser address begins with <strong>https://www.ijics.cn/</strong> before entering account credentials.</p><a class="primary-action" href="https://www.ijics.cn/user/login">Submit a Manuscript</a></article>
          </div>
        </section>
      </div>
    </main>
</template>

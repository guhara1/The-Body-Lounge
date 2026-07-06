"use strict";

/* Global site configuration — single source of truth for brand, contact,
   and canonical origin. Consumed by every template. */

const SITE = {
  brand: "간다GO",
  brandLatin: "GandaGO",
  tagline: "서울 출장마사지 지역·프로그램 안내",
  // Canonical origin — live Cloudflare Pages domain (served at root).
  origin: "https://the-body-lounge.pages.dev",
  phone: "0508-202-4719",
  phoneHref: "tel:0508-202-4719",
  // Telegram inquiry links (웹사이트 제작문의 / 제휴문의)
  telegram: {
    build: "https://t.me/gandago_build",
    partner: "https://t.me/gandago_partner",
  },
  locale: "ko_KR",
  buildYear: 2026,
  // Editorial / E-E-A-T signals. Swap `author` to a real operator name when
  // available; reviewDate feeds the byline text and schema dateModified.
  author: "간다GO 편집팀",
  reviewDate: "2026-07-06",
  reviewDateText: "2026년 7월 6일",
  // Search-console site verification
  naverVerification: "a8108a965402cbbf2d3caf831d7119010ad49bb1",
  // Default meta image (og / schema preferred thumbnail)
  ogImage: "/assets/img/og-cover.png",
  ogImageW: 1200,
  ogImageH: 630,
  // 16:9 hero banner shown directly below the hero box. Upload your image to
  // this repo path and it appears automatically (leave as-is to keep the path).
  heroImage: "/assets/img/hero-16x9.webp",
  heroImageAlt: "간다GO 서울 출장마사지 안내",
};

/* Deploy-time overrides (set by CI for GitHub Pages, etc.):
   - SITE_ORIGIN : scheme+host, e.g. https://guhara1.github.io
   - BASE_PATH   : sub-path prefix, e.g. /The-Body-Lounge (project Pages) or "" (root/custom domain)
   canonicalBase = origin + basePath and is used for canonical/og/schema/sitemap
   URLs; basePath is also prefixed onto every in-page root-absolute href/src. */
if (process.env.SITE_ORIGIN) SITE.origin = process.env.SITE_ORIGIN;
SITE.basePath = (process.env.BASE_PATH || "").replace(/\/$/, "");
SITE.canonicalBase = SITE.origin + SITE.basePath;

module.exports = { SITE };

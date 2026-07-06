"use strict";

/* Global site configuration — single source of truth for brand, contact,
   and canonical origin. Consumed by every template. */

const SITE = {
  brand: "간다GO",
  brandLatin: "GandaGO",
  tagline: "서울 출장마사지 지역·프로그램 안내",
  // Canonical origin (update to the live domain when deployed)
  origin: "https://www.ganda-go.com",
  phone: "0508-202-4719",
  phoneHref: "tel:0508-202-4719",
  // Telegram inquiry links (웹사이트 제작문의 / 제휴문의)
  telegram: {
    build: "https://t.me/gandago_build",
    partner: "https://t.me/gandago_partner",
  },
  locale: "ko_KR",
  buildYear: 2026,
  // Default meta image (og / schema preferred thumbnail)
  ogImage: "/assets/img/og-cover.png",
  ogImageW: 1200,
  ogImageH: 630,
  // 16:9 hero banner shown directly below the hero box. Upload your image to
  // this repo path and it appears automatically (leave as-is to keep the path).
  heroImage: "/assets/img/hero-16x9.jpg",
  heroImageAlt: "간다GO 서울 출장마사지 안내",
};

module.exports = { SITE };

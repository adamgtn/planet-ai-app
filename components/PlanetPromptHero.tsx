"use client";

/**
 * PlanetPromptHero — hero animasi "studio" PlanetPrompt.
 *
 * Port dari planetprompt-hero.html. Loop 3 fase otomatis:
 *   1. brief  → form keisi sendiri + kursor klik "Generate Prompt"
 *   2. gen    → JSON streaming baris per baris + progress bar
 *   3. result → kartu hasil fan-out + badge "Banner Siap"
 *
 * Timing / warna / layout dipertahankan persis (CSS di module).
 * Props opsional supaya bisa dipakai ulang.
 */

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Sora, JetBrains_Mono } from "next/font/google";
import styles from "./PlanetPromptHero.module.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

type PlanetPromptHeroProps = {
  /** Nama brand yang diketik di form + muncul di JSON. */
  brand?: string;
  /** Headline yang diketik di form + muncul di JSON. */
  headline?: string;
  /** Gambar hasil utama (kartu tengah). */
  featImage?: string;
  /** Gambar kartu samping kiri. */
  s1Image?: string;
  /** Gambar kartu samping kanan. */
  s2Image?: string;
  /** Gambar kartu jauh kiri. */
  appImage?: string;
  /** Gambar kartu jauh kanan. */
  showcaseImage?: string;
  className?: string;
};

export default function PlanetPromptHero({
  brand = "Keripik Kaca Azqiya",
  headline = "Sensasi Keripik Kaca Premium",
  featImage = "/lp/planetprompt/showcase/showcase-01.png",
  s1Image = "/lp/planetprompt/showcase/showcase-06.png",
  s2Image = "/lp/planetprompt/showcase/showcase-11.png",
  appImage = "/lp/planetprompt/showcase/showcase-16.png",
  showcaseImage = "/lp/planetprompt/showcase/showcase-21.png",
  className = "",
}: PlanetPromptHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const q = (sel: string) => root.querySelector<HTMLElement>(sel);
    const win = q('[data-pph="window"]');
    const cursor = q('[data-pph="cursor"]');
    const genbtn = q('[data-pph="genbtn"]');
    const tBrand = q('[data-pph="t-brand"]');
    const tHead = q('[data-pph="t-head"]');
    const iBrand = q('[data-pph="i-brand"]');
    const iHead = q('[data-pph="i-head"]');
    const bar = q('[data-pph="bar"]');
    const fields = {
      brand: q('[data-pph="f-brand"]'),
      head: q('[data-pph="f-head"]'),
      style: q('[data-pph="f-style"]'),
      ratio: q('[data-pph="f-ratio"]'),
      color: q('[data-pph="f-color"]'),
    };
    const jsonLines = Array.from(
      root.querySelectorAll<HTMLElement>('[data-pph="ln"]')
    );

    if (
      !win || !cursor || !genbtn || !tBrand || !tHead || !iBrand || !iHead || !bar
    ) {
      return;
    }

    // Nama class hashed dari CSS module (untuk toggle dinamis)
    const SHOW = styles.show;
    const ACTIVE = styles.active;
    const PRESS = styles.press;
    const TO_HEAD = styles["to-headline"];
    const TO_BTN = styles["to-btn"];
    const CURSOR_BASE = styles.cursor;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const wait = (ms: number) =>
      new Promise<void>((res) => {
        timer = setTimeout(res, ms);
      });

    async function typeInto(
      el: HTMLElement,
      input: HTMLElement,
      text: string,
      speed: number
    ) {
      el.textContent = "";
      input.classList.add(ACTIVE);
      for (const ch of text) {
        if (cancelled) return;
        el.textContent += ch;
        await wait(speed);
      }
      await wait(280);
      input.classList.remove(ACTIVE);
    }

    function resetBrief() {
      Object.values(fields).forEach((f) => f?.classList.remove(SHOW));
      tBrand!.textContent = "";
      tHead!.textContent = "";
      iBrand!.classList.remove(ACTIVE);
      iHead!.classList.remove(ACTIVE);
      cursor!.className = CURSOR_BASE;
      cursor!.style.opacity = "1";
      genbtn!.classList.remove(PRESS);
      jsonLines.forEach((l) => l.classList.remove(SHOW));
      bar!.style.width = "0";
    }

    async function streamJSON() {
      for (let i = 0; i < jsonLines.length; i++) {
        if (cancelled) return;
        jsonLines[i].classList.add(SHOW);
        bar!.style.width = Math.round(((i + 1) / jsonLines.length) * 100) + "%";
        await wait(190);
      }
      await wait(450);
    }

    async function loop() {
      while (!cancelled) {
        win!.dataset.phase = "brief";
        resetBrief();
        await wait(650);
        if (cancelled) return;

        fields.brand!.classList.add(SHOW);
        await wait(260);
        if (cancelled) return;
        await typeInto(tBrand!, iBrand!, brand, 52);
        if (cancelled) return;

        fields.head!.classList.add(SHOW);
        cursor!.classList.add(TO_HEAD);
        await wait(420);
        if (cancelled) return;
        await typeInto(tHead!, iHead!, headline, 40);
        if (cancelled) return;

        cursor!.classList.remove(TO_HEAD);
        fields.style!.classList.add(SHOW);
        await wait(180);
        if (cancelled) return;
        fields.ratio!.classList.add(SHOW);
        await wait(180);
        if (cancelled) return;
        fields.color!.classList.add(SHOW);
        await wait(260);
        if (cancelled) return;

        cursor!.classList.add(TO_BTN);
        await wait(760);
        if (cancelled) return;
        genbtn!.classList.add(PRESS);
        await wait(170);
        if (cancelled) return;
        genbtn!.classList.remove(PRESS);
        cursor!.style.opacity = "0";
        await wait(220);
        if (cancelled) return;

        win!.dataset.phase = "gen";
        await wait(280);
        if (cancelled) return;
        await streamJSON();
        if (cancelled) return;

        win!.dataset.phase = "result";
        await wait(3600);
        if (cancelled) return;
      }
    }

    loop();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [brand, headline]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={`${styles.root} ${sora.variable} ${jetbrainsMono.variable} ${className}`}
    >
      <div className={styles.stage}>
        <div className={styles["orbit-glow"]} />

      {/* APP WINDOW */}
      <div className={styles.window} data-pph="window" data-phase="brief">
        <div className={styles.titlebar}>
          <div className={styles.dots}>
            <i />
            <i />
            <i />
          </div>
          <div className={styles.url}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            app.planetprompt.id/studio
          </div>
          <div className={styles.brandtag}>
            <span className={styles.planet}>
              <span className={styles.core} />
              <span className={styles.ring} />
            </span>
            PP
          </div>
        </div>

        <div className={styles.screen}>
          {/* BRIEF */}
          <div className={`${styles.view} ${styles["view-brief"]}`}>
            <div className={styles.kicker}>/ Banner Prompt Generator</div>
            <div className={styles.vtitle}>Desain Banner Promosi Anda</div>

            <div className={styles.field} data-pph="f-brand">
              <label>Brand</label>
              <div className={styles.input} data-pph="i-brand">
                <span data-pph="t-brand" />
                <span className={styles.caret} />
              </div>
            </div>
            <div className={styles.field} data-pph="f-head">
              <label>Headline</label>
              <div className={styles.input} data-pph="i-head">
                <span data-pph="t-head" />
                <span className={styles.caret} />
              </div>
            </div>
            <div className={styles.row2}>
              <div className={styles.field} data-pph="f-style">
                <label>Style</label>
                <div className={`${styles.input} ${styles.select}`}>Luxury Premium</div>
              </div>
              <div className={styles.field} data-pph="f-ratio">
                <label>Rasio</label>
                <div className={`${styles.input} ${styles.select}`}>1:1 · 9:16 · 16:9</div>
              </div>
            </div>
            <div className={styles.field} data-pph="f-color">
              <label>Palet Warna</label>
              <div className={styles.swatches}>
                <span className={styles.swatch} style={{ background: "#e6b450" }} />
                <span className={styles.swatch} style={{ background: "#fff" }} />
                <span className={styles.swatch} style={{ background: "#7b3fe4" }} />
              </div>
            </div>

            <div className={styles.cursor} data-pph="cursor">
              <svg viewBox="0 0 24 24" fill="#fff" stroke="#1a0b2e" strokeWidth="1.4">
                <path d="M5 3l15 9-6.5 1.2L17 20l-3 1.3-3.4-6.8L6 18z" />
              </svg>
            </div>
            <button className={styles.genbtn} data-pph="genbtn" type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                <path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4z" />
              </svg>
              Generate Prompt
            </button>
          </div>

          {/* GENERATING */}
          <div className={`${styles.view} ${styles["view-gen"]}`}>
            <div className={styles["gen-head"]}>
              <span className={styles.spin} /> Membangun prompt JSON…
            </div>
            <div className={styles.json}>
              <div className={styles.ln} data-pph="ln">
                <span className={styles.p}>{"{"}</span>
              </div>
              <div className={styles.ln} data-pph="ln">
                &nbsp;&nbsp;<span className={styles.k}>&quot;brand&quot;</span>:{" "}
                <span className={styles.s}>&quot;{brand}&quot;</span>,
              </div>
              <div className={styles.ln} data-pph="ln">
                &nbsp;&nbsp;<span className={styles.k}>&quot;headline&quot;</span>:{" "}
                <span className={styles.s}>&quot;{headline}&quot;</span>,
              </div>
              <div className={styles.ln} data-pph="ln">
                &nbsp;&nbsp;<span className={styles.k}>&quot;style&quot;</span>:{" "}
                <span className={styles.s}>&quot;Luxury Premium&quot;</span>,
              </div>
              <div className={styles.ln} data-pph="ln">
                &nbsp;&nbsp;<span className={styles.k}>&quot;ratio&quot;</span>: [
                <span className={styles.s}>&quot;1:1&quot;</span>,
                <span className={styles.s}>&quot;9:16&quot;</span>,
                <span className={styles.s}>&quot;16:9&quot;</span>],
              </div>
              <div className={styles.ln} data-pph="ln">
                &nbsp;&nbsp;<span className={styles.k}>&quot;palette&quot;</span>: [
                <span className={styles.s}>&quot;#E6B450&quot;</span>,
                <span className={styles.s}>&quot;#FFFFFF&quot;</span>],
              </div>
              <div className={styles.ln} data-pph="ln">
                &nbsp;&nbsp;<span className={styles.k}>&quot;target&quot;</span>:{" "}
                <span className={styles.s}>&quot;chatgpt&quot;</span>
              </div>
              <div className={styles.ln} data-pph="ln">
                <span className={styles.p}>{"}"}</span>
              </div>
            </div>
            <div className={styles["gen-bar"]}>
              <i data-pph="bar" />
            </div>
          </div>

          {/* RESULT */}
          <div className={`${styles.view} ${styles["view-result"]}`}>
            <div className={styles.ready}>
              <span className={styles.dot} /> Banner Siap
            </div>
            <div className={styles.fan}>
              <div className={`${styles.pcard} ${styles.feat}`}>
                <Image src={featImage} alt="" fill sizes="200px" className={styles.pimg} />
              </div>
              <div className={`${styles.pcard} ${styles.s1}`}>
                <Image src={s1Image} alt="" fill sizes="150px" className={styles.pimg} />
              </div>
              <div className={`${styles.pcard} ${styles.f1}`}>
                <Image src={appImage} alt="" fill sizes="120px" className={styles.pimg} />
              </div>
              <div className={`${styles.pcard} ${styles.s2}`}>
                <Image src={s2Image} alt="" fill sizes="150px" className={styles.pimg} />
              </div>
              <div className={`${styles.pcard} ${styles.f2}`}>
                <Image src={showcaseImage} alt="" fill sizes="120px" className={styles.pimg} />
              </div>
            </div>
            <div className={styles.resfoot}>
              <b>5 variasi</b> rasio · siap posting
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Badges — overhang di luar kartu (stage) biar nggak nutupin window */}
      <div className={`${styles.badge} ${styles["badge-format"]}`}>
        <div className={styles.lbl}>Format</div>
        <div className={styles.big}>Multi-rasio</div>
        <div className={styles.sub}>
          PLANETPROMPT · <b>v1.0</b>
        </div>
        <div className={styles.chips}>JSON · CHATGPT · MJ · STORY</div>
      </div>
      <div className={`${styles.badge} ${styles["badge-speed"]}`}>
        <div className={styles.lbl}>Rata-rata</div>
        <div className={styles.big}>&lt; 30 detik</div>
        <div className={styles.flow}>
          <b>brief</b> → JSON → <b>visual</b>
        </div>
      </div>
    </div>
  );
}

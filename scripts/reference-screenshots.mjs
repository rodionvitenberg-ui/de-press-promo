#!/usr/bin/env node
/**
 * Reference screenshots of the legacy clone — regression baseline
 * (README, Phase 0: "Скриншоты/видео всех состояний (эталон регрессий)").
 *
 * Zero-dependency CDP driver (Node >= 22 built-in WebSocket):
 *   spawn headless chrome (--remote-debugging-port=0) → WS to page target →
 *   navigate → wait for real state → interact (menu / wheel / hover) →
 *   Page.captureScreenshot → study/screenshots/{desktop,mobile}/*.png.
 *
 * Usage:
 *   npm run dev            # or PORT=3001 npm run start
 *   npm run screenshots    # BASE_URL env overrides http://localhost:3000
 *
 * Honest failures: if the loader never finishes (headless quirk), the state is
 * recorded in manifest.json with `"loaderWait": "timeout"` and a "forced"
 * variant (loader hidden via JS) is captured for page-level regressions.
 */
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const OUT_DIR = process.env.OUT_DIR ?? "study/screenshots";
const CHROME = process.env.CHROME ?? "google-chrome";
const LOADER_TIMEOUT_MS = 45_000;
const TWEEN_WAIT_MS = 1_500;

const DESKTOP_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const MOBILE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

const ROUTES = [
  { name: "home", path: "/" },
  { name: "studio", path: "/studio/" },
  { name: "careers", path: "/careers/" },
  { name: "values", path: "/values/" },
  { name: "contact", path: "/contact/" },
];

// ---------------------------------------------------------------------------
// CDP plumbing
// ---------------------------------------------------------------------------

function launchChrome() {
  const child = spawn(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--enable-unsafe-swiftshader",
      "--mute-audio",
      "--autoplay-policy=no-user-gesture-required",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--remote-debugging-port=0",
      "about:blank",
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("chrome did not report DevTools port")),
      15_000,
    );
    child.stderr.on("data", (chunk) => {
      const match = /DevTools listening on (ws:\/\/\S+)/.exec(String(chunk));
      if (match) {
        clearTimeout(timer);
        resolve({ child, browserWs: match[1] });
      }
    });
    child.on("exit", (code) => reject(new Error(`chrome exited: ${code}`)));
  });
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method) {
        for (const fn of this.listeners.get(msg.method) ?? []) fn(msg.params);
      }
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, fn) {
    if (!this.listeners.has(method)) this.listeners.set(method, new Set());
    this.listeners.get(method).add(fn);
  }
}

async function connect(browserWs) {
  const httpBase = browserWs.replace(/^ws:/, "http:").replace(/\/devtools\/.*$/, "");
  const targets = await (await fetch(`${httpBase}/json/list`)).json();
  const page = targets.find((t) => t.type === "page");
  if (!page) throw new Error("no page target");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve);
    ws.addEventListener("error", reject);
  });
  return new Cdp(ws);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Page-state helpers
// ---------------------------------------------------------------------------

async function evalJs(cdp, expression) {
  const { result, exceptionDetails } = await cdp.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (exceptionDetails) {
    throw new Error(
      exceptionDetails.exception?.description ?? "eval failed",
    );
  }
  return result.value;
}

/** Wait until the mirrored page is booted: WP body classes present, loader gone. */
async function waitForPageReady(cdp) {
  const deadline = Date.now() + LOADER_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const state = await evalJs(
      cdp,
      `(() => {
        const c = document.body.className;
        return {
          booted: c.includes("page-template"),
          locked: c.includes("lock-scroll"),
          canvas: !!document.querySelector(".dog-scene canvas"),
        };
      })()`,
    );
    if (state.booted && !state.locked) return { ...state, loaderWait: "done" };
    await sleep(300);
  }
  return { booted: false, locked: true, canvas: false, loaderWait: "timeout" };
}

async function navigate(cdp, url) {
  const loaded = new Promise((resolve) =>
    cdp.on("Page.loadEventFired", resolve),
  );
  await cdp.send("Page.navigate", { url });
  await loaded;
}

async function configureViewport(cdp, { width, height, mobile, ua }) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
  await cdp.send("Emulation.setUserAgentOverride", { userAgent: ua });
}

async function shoot(cdp, file) {
  const { data } = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  await writeFile(file, Buffer.from(data, "base64"));
  console.log(`captured: ${file}`);
}

/** Dispatch a wheel gesture at the viewport center. */
async function wheel(cdp, deltaY, ticks = 10) {
  for (let i = 0; i < ticks; i++) {
    await cdp.send("Input.dispatchMouseEvent", {
      type: "mouseWheel",
      x: 720,
      y: 450,
      deltaX: 0,
      deltaY,
    });
    await sleep(40);
  }
}

/** Best-effort: force-complete a stuck loader so page states remain usable. */
async function forceUnlock(cdp) {
  await evalJs(
    cdp,
    `(() => {
      document.body.classList.remove("lock-scroll");
      const loader = document.querySelector(".site-loader");
      if (loader) loader.style.display = "none";
    })()`,
  );
  await sleep(400);
}

// ---------------------------------------------------------------------------
// Capture recipes
// ---------------------------------------------------------------------------

async function captureDesktop(cdp, baseDir, route) {
  const manifest = [];
  await navigate(cdp, `${BASE_URL}${route.path}`);
  const ready = await waitForPageReady(cdp);
  await shoot(cdp, path.join(baseDir, `${route.name}.png`));
  manifest.push({
    device: "desktop",
    state: "top",
    route: route.path,
    ...ready,
  });

  if (route.name !== "home") return manifest;

  // Menu open (tween-driven → fixed wait)
  const menuButton = `document.querySelector(".site-header-button").click()`;
  await evalJs(cdp, menuButton);
  await sleep(TWEEN_WAIT_MS);
  await shoot(cdp, path.join(baseDir, `${route.name}--menu.png`));
  manifest.push({ device: "desktop", state: "menu", route: route.path });
  await evalJs(cdp, menuButton);
  await sleep(TWEEN_WAIT_MS);

  // Two scroll depths (wheel-driven virtual scroll)
  await wheel(cdp, 120, 15);
  await sleep(TWEEN_WAIT_MS);
  await shoot(cdp, path.join(baseDir, `${route.name}--scroll-1.png`));
  manifest.push({ device: "desktop", state: "scroll-1", route: route.path });

  await wheel(cdp, 120, 30);
  await sleep(TWEEN_WAIT_MS);
  await shoot(cdp, path.join(baseDir, `${route.name}--scroll-2.png`));
  manifest.push({ device: "desktop", state: "scroll-2", route: route.path });

  // Cases hover → matcap + body data-theme swap
  const hover = await evalJs(
    cdp,
    `(() => {
      const link = document.querySelector(".home-cases-list a[data-matcap]");
      if (!link) return { found: false };
      link.scrollIntoView({ block: "center" });
      const r = link.getBoundingClientRect();
      return {
        found: true,
        x: Math.round(r.left + r.width / 2),
        y: Math.round(r.top + r.height / 2),
        theme: link.dataset.theme,
      };
    })()`,
  );
  if (hover.found) {
    await cdp.send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: hover.x,
      y: hover.y,
    });
    await sleep(TWEEN_WAIT_MS);
    const theme = await evalJs(cdp, `document.body.dataset.theme`);
    await shoot(cdp, path.join(baseDir, `${route.name}--case-hover.png`));
    manifest.push({
      device: "desktop",
      state: "case-hover",
      route: route.path,
      expectedTheme: hover.theme,
      bodyTheme: theme,
    });
    await cdp.send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: 5,
      y: 5,
    });
    await sleep(600);
  }
  return manifest;
}

async function captureMobile(cdp, baseDir, route) {
  await navigate(cdp, `${BASE_URL}${route.path}`);
  const ready = await waitForPageReady(cdp);
  await shoot(cdp, path.join(baseDir, `${route.name}.png`));
  return [{ device: "mobile", state: "top", route: route.path, ...ready }];
}

// ---------------------------------------------------------------------------

async function main() {
  const { child, browserWs } = await launchChrome();
  const cdp = await connect(browserWs);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");

  const manifest = [];
  try {
    for (const [width, height, mobile, ua, dirName] of [
      [1440, 900, false, DESKTOP_UA, "desktop"],
      [390, 844, true, MOBILE_UA, "mobile"],
    ]) {
      const baseDir = path.join(OUT_DIR, dirName);
      await mkdir(baseDir, { recursive: true });
      await configureViewport(cdp, { width, height, mobile, ua });
      for (const route of ROUTES) {
        const rows =
          dirName === "desktop"
            ? await captureDesktop(cdp, baseDir, route)
            : await captureMobile(cdp, baseDir, route);
        manifest.push(...rows);
        // Force-unlock variant when the headless loader gets stuck.
        if (rows.some((r) => r.loaderWait === "timeout")) {
          await forceUnlock(cdp);
          await shoot(cdp, path.join(baseDir, `${route.name}--forced.png`));
          manifest.push({
            device: dirName,
            state: "forced-top",
            route: route.path,
            loaderWait: "forced",
          });
        }
      }
    }
  } finally {
    await writeFile(
      path.join(OUT_DIR, "manifest.json"),
      JSON.stringify(manifest, null, 2),
    );
    child.kill("SIGTERM");
  }
  console.log(`done → ${OUT_DIR} (${manifest.length} states)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});




import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
page.on("requestfailed", (r) => errors.push("REQFAIL: " + r.url() + " " + r.failure()?.errorText));

await page.goto("https://3000-7144c69b1a0275ee.monkeycode-ai.live", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(6000);
await page.screenshot({ path: "/tmp/opencode/prev-load.png" });

const state = await page.evaluate(() => {
  const loader = document.querySelector('[data-loader]');
  const skip = document.querySelector('.skip-build-link');
  const h1 = document.querySelector('h1');
  const loaderText = loader ? loader.textContent.slice(0, 80) : null;
  const h1Text = h1 ? h1.textContent : null;
  const visible = (el) => {
    if (!el) return "absent";
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return { vis: cs.visibility, op: cs.opacity, w: Math.round(r.width), h: Math.round(r.height), display: cs.display };
  };
  return {
    skip: visible(skip),
    loader: visible(loader),
    loaderText,
    h1: h1Text,
    h1Visible: visible(h1),
    bodyChildren: [...document.body.children].map((c) => c.tagName + "." + (c.className || "")).slice(0, 10),
    readyState: document.readyState,
    fonts: document.fonts.status,
  };
});
console.log(JSON.stringify(state, null, 2));
console.log("errors:", errors.length ? JSON.stringify(errors) : "none");
await browser.close();

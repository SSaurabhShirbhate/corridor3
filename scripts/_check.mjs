import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "load", timeout: 60000 });
await page.waitForTimeout(13000);
const lum = (c) => { const m = c.match(/([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/); if(!m) return 0; const [r,g,b]=[+m[1],+m[2],+m[3]].map(x=>{x/=255;return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4)}); return 0.2126*r+0.7152*g+0.0722*b; };
const contrast = (a,b) => { const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05); };
async function go(p) {
  await page.evaluate((pp) => window.scrollTo(0, Math.round(pp * 11702)), p);
  await page.waitForFunction((t) => Math.abs(window.scrollY - t) < 3, Math.round(p * 11702), { timeout: 4000 });
  await page.waitForTimeout(400);
  return page.evaluate(() => {
    const cs = (el) => getComputedStyle(el);
    const root = getComputedStyle(document.documentElement);
    const g = (t) => root.getPropertyValue(`--color-${t}`).trim();
    const tokens = { paper: `rgb(${g("paper")})`, charcoal: `rgb(${g("charcoal")})`, ink: `rgb(${g("ink")})`, construction: `rgb(${g("construction")})` };
    const out = { tokens };
    const pr = [...document.querySelectorAll("[data-principle]")];
    if (pr[0]) {
      const card = pr[0], h3 = card.querySelector("h3"), p = card.querySelector("p");
      out.howIBuildCard = { cardBg: cs(card).backgroundColor, h3: cs(h3).color, body: cs(p).color };
    }
    const star = [...document.querySelectorAll("#chapter-skills [data-star]")];
    if (star[0]) {
      const span = star[0].querySelector("span:last-child");
      const box = star[0].closest("[style*='aspect']") || star[0].parentElement;
      out.stackLabel = { labelColor: cs(span).color, boxOrParentBg: cs(box).backgroundColor, parentBg: cs(star[0].parentElement).backgroundColor };
    }
    return out;
  });
}
const fmt = (r) => r.map(([k,v]) => {
  if (k === "howIBuildCard") return `cardBg ${v.cardBg} | h3 ${v.h3} -> ${contrast(v.h3, v.cardBg).toFixed(2)}:1 | body ${v.body} -> ${contrast(v.body, v.cardBg).toFixed(2)}:1`;
  if (k === "stackLabel") return `label ${v.labelColor} | boxBg ${v.boxOrParentBg} | parentBg ${v.parentBg} -> ${contrast(v.labelColor, v.parentBg).toFixed(2)}:1`;
  if (k === "tokens") return `tokens paper=${v.paper} charcoal=${v.charcoal} ink=${v.ink} construction=${v.construction} (p/c ${contrast(v.paper, v.charcoal).toFixed(2)}:1, ink/c ${contrast(v.ink, v.charcoal).toFixed(2)}:1)`;
  return `${k}: ${JSON.stringify(v)}`;
}).join("\n");
console.log("=== p=0.54 (How I build cards) ===\n" + fmt(Object.entries(await go(0.54))));
console.log("\n=== p=0.573 (Stack heading) ===\n" + fmt(Object.entries(await go(0.573))));
console.log("\n=== p=0.62 (constellation) ===\n" + fmt(Object.entries(await go(0.62))));
console.log("\n=== p=0.66 (constellation bottom) ===\n" + fmt(Object.entries(await go(0.66))));
await browser.close();

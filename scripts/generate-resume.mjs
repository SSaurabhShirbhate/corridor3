/**
 * Generates public/resume/saurabh-shirbhate-resume.pdf from the
 * print-ready HTML in scripts/resume/resume.html using Playwright's
 * bundled Chromium.
 *
 * Run after `npx playwright install chromium`:
 *   node scripts/generate-resume.mjs
 */
import { chromium } from "playwright";
import { fileURLToPath } from "url";
import path from "path";
import { mkdirSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "resume", "resume.html");
const outDir = path.join(__dirname, "..", "public", "resume");
const outPath = path.join(outDir, "saurabh-shirbhate-resume.pdf");

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto("file://" + htmlPath, { waitUntil: "networkidle" });
  await page.pdf({
    path: outPath,
    format: "A4",
    printBackground: true,
    margin: { top: "12mm", bottom: "12mm", left: "12mm", right: "12mm" },
  });
  console.log("PDF written to", outPath);
} finally {
  await browser.close();
}

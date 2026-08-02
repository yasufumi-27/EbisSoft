import puppeteer from "puppeteer-core";

const BASE = "http://localhost:4173/EbisSoft";
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox"],
});

const results = [];
const ok = (name, cond, extra = "") =>
  results.push(`${cond ? "PASS" : "FAIL"}  ${name}${extra ? ` — ${extra}` : ""}`);

for (const [label, w, h] of [
  ["PC 1280", 1280, 900],
  ["SP 390", 390, 844],
]) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.setViewport({ width: w, height: h });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle0" });

  // 起動ボタンが右下にある
  const launcher = await page.$(".assistant-launcher");
  ok(`${label}: 起動ボタンが存在`, !!launcher);
  const box = await launcher.boundingBox();
  ok(
    `${label}: 右下に配置`,
    box.x + box.width > w - 100 && box.y + box.height > h - 120,
    `x=${Math.round(box.x)} y=${Math.round(box.y)}`,
  );

  // ドット絵が描画されている（rect の数）
  const rects = await page.$$eval(".assistant-launcher .mascot rect", (r) => r.length);
  ok(`${label}: ドット絵の矩形が描画`, rects > 20, `${rects}個`);

  // 閉じている状態ではパネルが無い
  ok(`${label}: 初期状態でパネル未読込`, (await page.$(".assistant-panel")) === null);

  // クリックで開く
  await launcher.click();
  await page.waitForSelector(".assistant-panel input", { timeout: 8000 });
  await new Promise((r) => setTimeout(r, 500));
  ok(`${label}: クリックでチャットが開く`, true);

  // 質問して回答が返る
  await page.type(".assistant-panel input", "料金はいくらですか？");
  await page.click('.assistant-panel button[type="submit"]');
  await new Promise((r) => setTimeout(r, 2500));
  const answer = await page.$$eval(".assistant-panel [role='log'] > div", (els) =>
    els.map((e) => e.innerText),
  );
  const last = answer.at(-1) ?? "";
  ok(`${label}: 回答が返る`, last.length > 30 && /プラン|料金|円/.test(last), last.slice(0, 40));

  // 出典リンクが付く
  const src = await page.$$eval(".assistant-panel a[href]", (a) => a.map((x) => x.getAttribute("href")));
  ok(`${label}: 出典リンクが表示`, src.length > 0, src.join(","));

  // 知識にないことは答えない
  await page.type(".assistant-panel input", "明日の東京の天気は？");
  await page.click('.assistant-panel button[type="submit"]');
  await new Promise((r) => setTimeout(r, 2500));
  const last2 = await page.$$eval(".assistant-panel [role='log'] > div", (els) => els.at(-1).innerText);
  ok(`${label}: 知識外は答えない`, /見つかりません|お問い合わせ/.test(last2), last2.slice(0, 30));

  // Esc で閉じる
  await page.keyboard.press("Escape");
  await new Promise((r) => setTimeout(r, 400));
  const openAttr = await page.$eval(".assistant-root", (e) => e.dataset.open);
  ok(`${label}: Escで閉じる`, openAttr === "false");

  // 横はみ出し
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  ok(`${label}: 横はみ出しなし`, overflow <= 0, `${overflow}px`);

  ok(`${label}: JSエラーなし`, errors.length === 0, errors.slice(0, 2).join(" | "));
  await page.close();
}

// 下層ページにも出ているか
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
for (const path of ["/ai", "/demo", "/company", "/contact"]) {
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".assistant-launcher", { timeout: 5000 }).catch(() => {});
  ok(`${path} にも常駐`, !!(await page.$(".assistant-launcher")));
}

await browser.close();
console.log(results.join("\n"));
console.log(results.some((r) => r.startsWith("FAIL")) ? "\n=> FAILED" : "\n=> ALL PASS");

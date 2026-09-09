import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(scriptDir, "../..");
const iconPath = path.join(
  projectDir,
  "assets/brand/logo/yebisu-soft-mark-navy.png",
);

loadEnv(path.join(projectDir, ".env.local"));

const topic = process.env.NTFY_TOPIC?.trim();
if (!topic) throw new Error("NTFY_TOPIC が未設定です");
if (!/^[A-Za-z0-9_-]{16,128}$/.test(topic)) {
  throw new Error("NTFY_TOPIC は推測されにくい16文字以上の英数字・_-にしてください");
}
const base = (process.env.NTFY_BASE_URL || "https://ntfy.sh").replace(/\/+$/, "");
const response = await fetch(`${base}/${encodeURIComponent(topic)}`, {
  method: "PUT",
  headers: {
    Title: "EbisSoft Instagram Profile Icon",
    Message: "Official profile icon - ready to upload",
    Tags: "art,star",
    Priority: "4",
    Filename: "yebisu-soft-instagram-profile-icon.png",
    "Content-Type": "image/png",
  },
  body: fs.readFileSync(iconPath),
});

if (!response.ok) {
  throw new Error(`ntfy送信に失敗しました (${response.status}): ${await response.text()}`);
}
console.log(`Sent: ${iconPath}`);

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const rawLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = rawLine.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || process.env[match[1]]) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

import fs from "node:fs";

const d = fs.readFileSync("._dom_srv.txt", "utf8");
console.log("html lang:", d.match(/<html[^>]*>/)?.[0]?.slice(0, 60) ?? "-");
console.log("body lang-de:", d.includes('class="lang-de"'));
console.log("WA ar links:", (d.match(/wa\.me\/491744888845/g) || []).length);
console.log("WA de links:", (d.match(/wa\.me\/491625333817/g) || []).length);
console.log("tel links:", [...new Set(d.match(/tel:\+\d+/g) || [])].join(", ") || "-");
console.log("footer-phone:", d.includes("footer-phone"));
console.log("hero img present:", /hero-lineart/.test(d));
console.log("logo img present:", /logo-96fgr6Fe|logo\.png/.test(d));
console.log("manus junk:", d.includes("manus-runtime") || d.includes("__MANUS__"));
console.log("page renders:", (d.match(/fit88\.de/g) || []).length > 0);
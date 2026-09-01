import fs from "node:fs";

let d;
try {
  d = fs.readFileSync("._dom_de2.txt", "utf8");
} catch {
  console.log("NO DOM FILE");
  process.exit(1);
}
const lang = d.match(/<html[^>]*lang="([^"]+)/)?.[1] ?? "-";
const ar = (d.match(/wa\.me\/491744888845/g) || []).length;
const de = (d.match(/wa\.me\/491625333817/g) || []).length;
console.log("lang:", lang);
console.log("WA ar:", ar, "| WA de:", de);
console.log("Startseite in DOM:", d.includes("Startseite"));
console.log("dir:", d.match(/<html[^>]*dir="([^"]+)/)?.[1] ?? "-");
console.log("Angebote in DOM:", d.includes("Angebote"));
import http from "node:http";
import zlib from "node:zlib";

function get(path, headers = {}) {
  return new Promise((resolve) => {
    const req = http.get(
      { host: "localhost", port: 3000, path, headers },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          let body = Buffer.concat(chunks);
          if (res.headers["content-encoding"] === "br") body = zlib.brotliDecompressSync(body);
          if (res.headers["content-encoding"] === "gzip") body = zlib.gunzipSync(body);
          resolve({
            status: res.statusCode,
            encoding: res.headers["content-encoding"] ?? "-",
            cache: res.headers["cache-control"] ?? "-",
            vary: res.headers["vary"] ?? "-",
            xcto: res.headers["x-content-type-options"] ?? "-",
            xframe: res.headers["x-frame-options"] ?? "-",
            powered: res.headers["x-powered-by"] ?? "-",
            type: res.headers["content-type"]?.split(";")[0] ?? "-",
            bodyBytes: body.length,
          });
        });
      },
    );
    req.on("error", (e) => resolve({ error: e.message }));
  });
}

const tests = [
  { name: "index.html (br)", path: "/index.html", headers: { "Accept-Encoding": "br, gzip" } },
  { name: "index.html (no enc)", path: "/index.html", headers: {} },
  { name: "services.html (gzip)", path: "/services.html", headers: { "Accept-Encoding": "gzip" } },
  { name: "CSS asset (br)", path: "/assets/fit88-qomX5_r0.css", headers: { "Accept-Encoding": "br, gzip" } },
  { name: "logo png (br)", path: "/assets/logo-96fgr6Fe.png", headers: { "Accept-Encoding": "br, gzip" } },
  { name: "fit88.js (br)", path: "/fit88.js", headers: { "Accept-Encoding": "br, gzip" } },
  { name: "MISSING png", path: "/assets/nope.png", headers: {} },
  { name: "MISSING path", path: "/no-such-page", headers: {} },
  { name: "MISSING html", path: "/missing.html", headers: {} },
];

for (const t of tests) {
  const r = await get(t.path, t.headers);
  console.log(t.name.padEnd(22), JSON.stringify(r));
}
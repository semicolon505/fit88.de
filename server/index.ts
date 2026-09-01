import express, { type NextFunction, type Request, type Response } from "express";
import fs from "fs";
import { createServer } from "http";
import path from "path";
import { brotliCompressSync, gzipSync } from "zlib";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Response bodies matching these MIME types are eligible for HTTP compression. */
const COMPRESSIBLE = /^(text\/|application\/(json|xml|javascript|ecmascript|x-javascript|xhtml\+xml)|image\/svg\+xml|.*\+json|.*\+xml)/i;

/** Smallest body size (bytes) worth compressing. */
const MIN_COMPRESS_BYTES = 1024;

/** Plain-text MIME types that tell the browser to always revalidate. */
const HTML_EXT = [".html", ".htm"];

/**
 * Compression middleware using Node's built-in zlib.
 * Negotiates Brotli (preferred) then gzip from Accept-Encoding,
 * and skips images/binaries (already compressed internally).
 */
function compression() {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();

    const accept = String(req.headers["accept-encoding"] ?? "");
    const encoding = /\bbr\b/.test(accept) ? "br" : /\bgzip\b/.test(accept) ? "gzip" : null;
    if (!encoding) return next();

    const chunks: Buffer[] = [];
    const originalWrite = res.write.bind(res) as (
      chunk: unknown,
      encodingOrCb?: unknown,
      cb?: unknown,
    ) => boolean;
    const originalEnd = res.end.bind(res);

    // Wrap write/end to buffer the response, then decide compression by Content-Type.
    res.write = ((chunk: unknown, encodingOrCb?: unknown, cb?: unknown) => {
      const enc = typeof encodingOrCb === "string" ? (encodingOrCb as BufferEncoding) : "utf8";
      const callback = typeof encodingOrCb === "function" ? encodingOrCb : cb;
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), enc));
      if (typeof callback === "function") callback(null);
      return true;
    }) as typeof res.write;

    res.end = ((chunk?: unknown, encodingOrCb?: unknown, cb?: unknown) => {
      const callback =
        typeof chunk === "function"
          ? chunk
          : typeof encodingOrCb === "function"
            ? encodingOrCb
            : cb;

      if (chunk !== undefined && chunk !== null && typeof chunk !== "function") {
        const enc = typeof encodingOrCb === "string" ? (encodingOrCb as BufferEncoding) : "utf8";
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), enc));
      }

      const body = Buffer.concat(chunks);
      const contentType = String(res.getHeader("content-type") ?? "");

      if (!res.headersSent && COMPRESSIBLE.test(contentType) && body.length >= MIN_COMPRESS_BYTES) {
        res.removeHeader("Content-Length");
        if (encoding === "br") {
          const out = brotliCompressSync(body);
          res.setHeader("Content-Encoding", "br");
          res.setHeader("Content-Length", out.length);
          return originalEnd(out, callback as (() => void) | undefined);
        }
        const gz = gzipSync(body);
        res.setHeader("Content-Encoding", "gzip");
        res.setHeader("Content-Length", gz.length);
        return originalEnd(gz, callback as (() => void) | undefined);
      }

      return originalEnd(body, callback as (() => void) | undefined);
    }) as typeof res.end;

    res.setHeader("Vary", "Accept-Encoding");
    next();
  };
}

/** Minimal dependency-free response header hardening. */
function securityHeaders() {
  return (_req: Request, res: Response, next: NextFunction): void => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
    next();
  };
}

/** Terse request logger (no extra deps). */
function requestLogger() {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (process.env.QUIET === "1") return next();
    const start = Date.now();
    res.on("finish", () => {
      const ms = Date.now() - start;
      const bytes = Number(res.getHeader("content-length") ?? 0);
      console.log(
        `${res.statusCode} ${req.method.padEnd(4)} ${req.originalUrl} ${ms}ms ${
          bytes ? `${(bytes / 1024).toFixed(1)}KB` : ""
        }`,
      );
    });
    next();
  };
}
async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const productionPath = path.resolve(__dirname, "public");
  const staticPath = fs.existsSync(productionPath)
    ? productionPath
    : path.resolve(__dirname, "..", "dist", "public");

  app.disable("x-powered-by");
  app.use(requestLogger());
  app.use(compression());
  app.use(securityHeaders());

  // Cache strategy:
  // - Hashed build assets under /assets/  -> immutable, 1 year
  // - Fonts (woff/woff2)                 -> immutable, 1 year
  // - Regular images/svg                 -> 7 days, must revalidate
  // - HTML pages                         -> always revalidate (no-cache)
  const setHeaders = (res: Response, filePath: string): void => {
    const ext = path.extname(filePath).toLowerCase();
    const isHashedAsset =
      filePath.includes(`${path.sep}assets${path.sep}`) || /[-.][a-f0-9]{8}\./i.test(filePath);

    if (HTML_EXT.includes(ext)) {
      res.setHeader("Cache-Control", "no-cache");
      return;
    }
    if (isHashedAsset || ext === ".woff" || ext === ".woff2") {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      return;
    }
    res.setHeader("Cache-Control", "public, max-age=604800, must-revalidate");
  };

  app.use(
    express.static(staticPath, {
      index: "index.html",
      extensions: ["html"],
      setHeaders,
      fallthrough: true,
    }),
  );

  // Fallback for everything that reached express.static without a file match:
  // - Missing files WITH an extension (css/js/png/...) -> plain 404 (was: HTML 200)
  // - Extensionless routes                            -> serve the real 404.html
  app.use((req, res, next) => {
    const ext = path.extname(req.path).toLowerCase();
    if (ext && !HTML_EXT.includes(ext)) {
      res.status(404).type("text/plain").send("404 Not Found");
      return;
    }
    res.status(404).sendFile(path.join(staticPath, "404.html"), (err) => {
      if (err) next(err);
      else res.end();
    });
  });

  // Central error handler — never leak stack traces to clients
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[server] unhandled error:", err.message);
    if (!res.headersSent) {
      res.status(500).type("text/plain").send("Internal Server Error");
    } else {
      res.end();
    }
  });

  const port = Number(process.env.PORT || 3000);
  const host = process.env.HOST || "0.0.0.0";

  server.listen(port, host, () => {
    console.log(`[server] running at http://localhost:${port}/`);
    console.log(`[server] serving: ${staticPath}`);
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    console.log(`\n[server] ${signal} received, shutting down...`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000).unref();
  };
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

startServer().catch((err) => {
  console.error("[server] failed to start:", err);
  process.exit(1);
});

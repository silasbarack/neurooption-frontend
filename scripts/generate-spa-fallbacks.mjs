import { copyFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const routes = [
  "login",
  "signin",
  "register",
  "registration",
  "signup",
  "forgot-password",
  "reset-password",
  "trading",
  "finance",
  "markets",
  "market",
  "deposit",
  "withdraw",
  "transactions",
  "chat",
  "help",
  "profile",
  "settings",
  "achievements",
  "tournaments",
  "open-trades",
  "history",
  "signals",
  "social-trading",
  "express-trades",
  "delete-account",
];

const source = join("dist", "index.html");

await Promise.all(
  routes.map(async (route) => {
    const target = join("dist", route, "index.html");
    await mkdir(dirname(target), { recursive: true });
    await copyFile(source, target);
  }),
);

await copyFile(source, join("dist", "404.html"));
console.log("Generated SPA entry points for " + routes.length + " routes.");

await writeFile(join("dist", "build-info.json"), JSON.stringify({
  commit: process.env.RENDER_GIT_COMMIT || process.env.GITHUB_SHA || "local",
  builtAt: new Date().toISOString(),
}) + "\n");

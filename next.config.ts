import type { NextConfig } from "next";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

function readPackageMeta(): { name: string; version: string } {
  try {
    const raw = readFileSync(path.join(process.cwd(), "package.json"), "utf8");
    const j = JSON.parse(raw) as { name?: string; version?: string };
    return {
      name: typeof j.name === "string" ? j.name : "",
      version: typeof j.version === "string" ? j.version : "",
    };
  } catch {
    return { name: "", version: "" };
  }
}

function resolveGitBranch(): string {
  if (process.env.NEXT_PUBLIC_CLIPPER_QA_GIT_BRANCH) {
    return process.env.NEXT_PUBLIC_CLIPPER_QA_GIT_BRANCH;
  }
  if (process.env.VERCEL_GIT_COMMIT_REF) {
    return process.env.VERCEL_GIT_COMMIT_REF;
  }
  if (process.env.GITHUB_HEAD_REF) {
    return process.env.GITHUB_HEAD_REF;
  }
  try {
    return execSync("git rev-parse --abbrev-ref HEAD", {
      encoding: "utf8",
    }).trim();
  } catch {
    return "";
  }
}

const pkg = readPackageMeta();
const gitBranch = resolveGitBranch();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CLIPPER_QA_APP_NAME:
      process.env.NEXT_PUBLIC_CLIPPER_QA_APP_NAME || pkg.name,
    NEXT_PUBLIC_CLIPPER_QA_APP_VERSION:
      process.env.NEXT_PUBLIC_CLIPPER_QA_APP_VERSION || pkg.version,
    NEXT_PUBLIC_CLIPPER_QA_GIT_BRANCH:
      process.env.NEXT_PUBLIC_CLIPPER_QA_GIT_BRANCH || gitBranch,
  },
};

export default nextConfig;

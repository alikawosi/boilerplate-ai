#!/usr/bin/env node
import {
  intro,
  outro,
  text,
  select,
  spinner,
  isCancel,
  cancel,
} from "@clack/prompts";
import color from "picocolors";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

// Fix for ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to handle user cancelling (Ctrl+C)
function handleCancel(value: unknown) {
  if (isCancel(value)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }
}

async function main() {
  console.clear();

  // 1. Intro Header
  intro(`${color.bgCyan(color.black(" BOILERPLATE-AI "))}`);

  // 2. Ask for Project Name
  const projectName = await text({
    message: "What is the name of your project?",
    placeholder: "my-dream-startup",
    validate(value) {
      if (value.length === 0) return "Name is required!";
    },
  });
  handleCancel(projectName);

  // 3. Ask for Stack (The "Menu")
  const stack = await select({
    message: "Pick your stack type:",
    options: [
      {
        value: "nextjs",
        label: "Next.js Fullstack (Recommended)",
        hint: "Next.js + Tailwind",
      },
      { value: "mobile", label: "Mobile Only", hint: "React Native / Expo" },
    ],
  });
  handleCancel(stack);

  // 4. Simulate Creation (We will add real logic later)
  const s = spinner();
  s.start("Scaffolding your project...");

  // Mock delay to look cool
  await new Promise((resolve) => setTimeout(resolve, 2000));

  s.stop("Project created successfully!");

  // 5. Outro
  outro(`Run 'cd ${String(projectName)}' to get started!`);
}

main().catch(console.error);

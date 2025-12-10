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
import { scaffoldProject } from "./utils/scaffold.js";

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

  // 4. Create the Project
  if (stack === "nextjs") {
    await scaffoldProject(projectName as string);
  } else {
    // For now, we only support Next.js
    console.log(color.yellow("Mobile templates coming soon!"));
    process.exit(0);
  }

  // Mock delay to look cool
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // 5. Outro
  outro(`Run 'cd ${String(projectName)}' to get started!`);
}

main().catch(console.error);

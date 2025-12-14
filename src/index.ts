#!/usr/bin/env node

import {
  intro,
  outro,
  text,
  multiselect,
  confirm,
  isCancel,
  cancel,
} from "@clack/prompts";
import color from "picocolors";
import { scaffoldProject } from "./utils/scaffold.js"; // Ensure extension is .js for ESM

async function main() {
  console.clear();

  intro(
    `${color.bgCyan(color.black("  SAAS-CLI  "))} ${color.cyan("The Ultimate SaaS Starter")}`
  );

  // 1. Project Name Prompt
  const projectName = await text({
    message: "What is your project named?",
    placeholder: "my-saas-app",
    validate(value) {
      if (value.length === 0) return "Project name is required!";
      if (/[^a-zA-Z0-9-_]/.test(value))
        return "Project name can only contain letters, numbers, dashes, and underscores.";
    },
  });

  if (isCancel(projectName)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  // 2. Module Selection Prompt
  const modules = await multiselect({
    message: "Which modules would you like to include?",
    options: [
      {
        value: "stripe",
        label: "Stripe (Payments)",
        hint: "Subscriptions & Checkout",
      },
      {
        value: "resend",
        label: "Resend (Email)",
        hint: "Transactional Emails",
      },
      { value: "openai", label: "OpenAI", hint: "AI Integration" },
      // Add more modules here as you build them
    ],
    required: false,
  });

  if (isCancel(modules)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  // 3. Mobile App Prompt
  const withMobile = await confirm({
    message: "Do you want to include a Mobile App (Expo)?",
    initialValue: false,
  });

  if (isCancel(withMobile)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  // 4. Confirm and Run
  // We explicitly cast modules to string[] because multiselect returns string | symbol
  await scaffoldProject(
    projectName as string,
    modules as string[],
    withMobile as boolean
  );

  outro(color.green("You're all set! Happy coding."));
}

main().catch(console.error);

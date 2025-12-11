#!/usr/bin/env node
import {
  intro,
  outro,
  text,
  select,
  multiselect,
  spinner,
  isCancel,
  cancel,
} from "@clack/prompts";
import color from "picocolors";
import path from "path";
import { fileURLToPath } from "url";
import { scaffoldProject } from "./utils/scaffold.js"; // Note the .js extension

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
    placeholder: "my-startup",
    defaultValue: "my-startup",
    validate(value) {
      if (value.length === 0) return "Name is required!";
      if (/[^a-z0-9-]/.test(value))
        return "Name should be lowercase, numbers, and hyphens only.";
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
        hint: "App Router + Tailwind + Shadcn",
      },
      {
        value: "mobile",
        label: "Mobile App (Coming Soon)",
        hint: "Expo / React Native",
      },
    ],
  });
  handleCancel(stack);

  if (stack === "mobile") {
    outro(color.yellow("Mobile templates are coming in v1.1! Stay tuned."));
    process.exit(0);
  }

  // 4. Ask for Integrations (Modules)
  const integrations = await multiselect({
    message: "Select the modules you need (Space to select):",
    options: [
      {
        value: "supabase",
        label: "Supabase",
        hint: "Auth + Database + Middleware",
      },
      { value: "stripe", label: "Stripe", hint: "Payments + Webhooks" },
      { value: "resend", label: "Resend", hint: "Email Service" },
    ],
    required: false, // It's okay to select nothing
  });
  handleCancel(integrations);

  // 5. Run the Scaffolder
  // We cast integrations to string[] because multiselect returns string | symbol
  await scaffoldProject(projectName as string, integrations as string[]);

  // 6. Final Success Message is handled inside scaffoldProject, but we add a clean exit here.
  // (Optional: You can move the 'outro' here if you want it outside the utils)
}

main().catch((err) => {
  console.error(color.red("Unexpected error:"));
  console.error(err);
  process.exit(1);
});

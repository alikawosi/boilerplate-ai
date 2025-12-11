import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { spinner } from "@clack/prompts";
import color from "picocolors";
import { execa } from "execa";

// Fix for ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function scaffoldProject(projectName: string, modules: string[]) {
  const s = spinner();
  const projectDir = path.resolve(process.cwd(), projectName);

  // Define where our templates live
  // We go up two levels from /src/utils to reach /root, then into /templates
  const templateDir = path.resolve(__dirname, "../../templates/nextjs");
  const modulesDir = path.resolve(__dirname, "../../templates/modules");

  // 1. Copy Base Template
  s.start("Copying base template...");
  try {
    if (fs.existsSync(projectDir)) {
      s.stop("Error: Directory already exists.");
      console.error(
        color.red(
          `\nThe folder "${projectName}" already exists. Please choose a different name.`
        )
      );
      process.exit(1);
    }

    await fs.copy(templateDir, projectDir);

    // Update package.json name
    const pkgPath = path.join(projectDir, "package.json");
    const pkg = await fs.readJson(pkgPath);
    pkg.name = projectName;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    s.stop("Base template copied.");
  } catch (error) {
    s.stop("Failed to copy base template.");
    console.error(error);
    process.exit(1);
  }

  // 2. Inject Selected Modules (The Overlay System)
  if (modules.length > 0) {
    s.start(`Installing modules: ${modules.join(", ")}...`);

    for (const module of modules) {
      const moduleSource = path.join(modulesDir, module);

      // Check if we actually have a template folder for this module
      if (await fs.pathExists(moduleSource)) {
        // --- ENV MERGING LOGIC START ---
        // We handle .env.example manually so we can append instead of overwrite
        const envPath = path.join(moduleSource, ".env.example");
        const targetEnvPath = path.join(projectDir, ".env.example");

        if (await fs.pathExists(envPath)) {
          const envContent = await fs.readFile(envPath, "utf-8");

          // Check if target .env.example exists; if so append, else write new
          if (await fs.pathExists(targetEnvPath)) {
            await fs.appendFile(targetEnvPath, `\n${envContent}`);
          } else {
            await fs.writeFile(targetEnvPath, envContent);
          }
        }
        // --- ENV MERGING LOGIC END ---

        // Copy all other files, skipping .env.example because we just handled it
        await fs.copy(moduleSource, projectDir, {
          overwrite: true,
          filter: (src) => !src.endsWith(".env.example"),
        });
      }
    }
    s.stop("Modules installed successfully.");
  }

  // 3. Create .gitignore
  // We write this dynamically so it doesn't interfere with our own repo's gitignore
  s.start("Creating system files...");
  const gitignoreContent = `
node_modules
.next
.env
.env.*
!.env.example
.DS_Store
dist
  `;
  await fs.writeFile(
    path.join(projectDir, ".gitignore"),
    gitignoreContent.trim()
  );
  s.stop("System files created.");

  // 4. Initialize Git
  s.start("Initializing Git repository...");
  try {
    await execa("git", ["init"], { cwd: projectDir });
    s.stop("Git initialized.");
  } catch (error) {
    s.stop("Skipped Git initialization (Git not found).");
  }

  // 5. Install Dependencies (Base + Modules)
  s.start("Installing dependencies (this may take a minute)...");

  // Define base dependencies usually found in package.json,
  // but here we define EXTRA packages needed for the selected modules.
  const extraPackages: string[] = [];

  if (modules.includes("supabase")) {
    extraPackages.push("@supabase/supabase-js", "@supabase/ssr");
  }
  if (modules.includes("stripe")) {
    extraPackages.push("stripe");
  }
  if (modules.includes("resend")) {
    extraPackages.push("resend");
  }

  try {
    // A. Install the base dependencies from the copied package.json
    await execa("npm", ["install"], { cwd: projectDir });

    // B. Install any extra packages required by the modules
    if (extraPackages.length > 0) {
      await execa("npm", ["install", ...extraPackages], { cwd: projectDir });
    }

    s.stop("All dependencies installed!");
  } catch (error) {
    s.stop("Dependency installation failed.");
    console.error(
      color.yellow("\nNote: The project was created, but npm install failed.")
    );
    console.error(
      color.yellow(`Run 'cd ${projectName} && npm install' manually.`)
    );
  }

  // 6. Final Success Output
  console.log(
    `\n${color.bgGreen(color.black(" SUCCESS "))} Project created in ${color.green(projectDir)}`
  );
  console.log(`\nNext steps:`);
  console.log(`  ${color.cyan(`cd ${projectName}`)}`);

  if (modules.includes("supabase") || modules.includes("stripe")) {
    console.log(
      `  ${color.cyan("cp .env.example .env.local")} (Set up your keys)`
    );
  }

  console.log(`  ${color.cyan("npm run dev")}\n`);
}

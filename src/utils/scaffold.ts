import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { spinner } from "@clack/prompts";
import color from "picocolors";
import { execa } from "execa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function scaffoldProject(
  projectName: string,
  modules: string[],
  withMobile: boolean = false
) {
  const s = spinner();
  const projectDir = path.resolve(process.cwd(), projectName);
  const webTargetDir = path.join(projectDir, "web");
  const nativeTargetDir = path.join(projectDir, "native");

  // Define Template Paths relative to the built CLI location
  const infraDir = path.resolve(
    __dirname,
    "../../templates/infrastructure/supabase"
  );
  const webDir = path.resolve(__dirname, "../../templates/web/nextjs");
  const modulesDir = path.resolve(__dirname, "../../templates/modules");
  const nativeDir = path.resolve(__dirname, "../../templates/native");

  // 1. Validate & Create Root Directory
  if (fs.existsSync(projectDir)) {
    console.error(
      color.red(`\nError: Directory "${projectName}" already exists.`)
    );
    process.exit(1);
  }
  await fs.ensureDir(projectDir);
  await fs.ensureDir(webTargetDir);
  if (withMobile) {
    await fs.ensureDir(nativeTargetDir);
  }

  // 2. Setup Root Configuration (Monorepo)
  s.start("Setting up monorepo structure...");
  try {
    const workspaces = ["web"];
    if (withMobile) {
      workspaces.push("native");
    }

    const rootPkg = {
      name: projectName,
      private: true,
      workspaces,
    };
    await fs.writeJson(path.join(projectDir, "package.json"), rootPkg, {
      spaces: 2,
    });
    s.stop("Monorepo structure configured.");
  } catch (error) {
    s.stop("Failed to setup monorepo structure.");
    console.error(error);
    process.exit(1);
  }

  // 3. Setup Infrastructure (Supabase) - Mandatory
  s.start("Setting up database infrastructure (Supabase)...");
  try {
    // Copy to a 'supabase' folder in the root
    await fs.copy(infraDir, path.join(projectDir, "supabase"));
    s.stop("Supabase infrastructure configured.");
  } catch (error) {
    s.stop("Failed to copy infrastructure.");
    console.error(error);
    process.exit(1);
  }

  // 4. Setup Frontend (Next.js)
  s.start("Scaffolding Next.js application...");
  try {
    // Copy Next.js files to the WEB folder
    await fs.copy(webDir, webTargetDir);

    // Update package.json name in WEB folder
    const pkgPath = path.join(webTargetDir, "package.json");
    if (await fs.pathExists(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      pkg.name = `${projectName}-web`;
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
    }

    s.stop("Next.js application scaffolded.");
  } catch (error) {
    s.stop("Failed to copy frontend template.");
    console.error(error);
    process.exit(1);
  }

  // 5. Inject Selected Modules
  if (modules.length > 0) {
    s.start(`Injecting modules: ${modules.join(", ")}...`);

    for (const module of modules) {
      const moduleSource = path.join(modulesDir, module);

      if (await fs.pathExists(moduleSource)) {
        // A. Handle .env merging logic
        const envSourcePath = path.join(moduleSource, ".env.example");
        // Target is now inside web folder
        const envTargetPath = path.join(webTargetDir, ".env.example");

        if (await fs.pathExists(envSourcePath)) {
          const envContent = await fs.readFile(envSourcePath, "utf-8");

          if (await fs.pathExists(envTargetPath)) {
            // Read current content to check if it ends with a newline
            const currentEnv = await fs.readFile(envTargetPath, "utf-8");
            const prefix = currentEnv.endsWith("\n") ? "" : "\n";
            await fs.appendFile(
              envTargetPath,
              `${prefix}# Module: ${module}\n${envContent}\n`
            );
          } else {
            await fs.writeFile(envTargetPath, envContent);
          }
        }

        // B. Copy module files (excluding .env.example)
        // Merge into web directory
        await fs.copy(moduleSource, webTargetDir, {
          overwrite: true,
          filter: (src) => !src.endsWith(".env.example"),
        });
      }
    }
    s.stop("Modules injected successfully.");
  }

  // 6. Setup Mobile App (Optional)
  if (withMobile) {
    s.start("Scaffolding Mobile App (Expo)...");
    if (await fs.pathExists(nativeDir)) {
      try {
        await fs.copy(nativeDir, nativeTargetDir);

        // Update package.json name to just "projectName" as requested
        const pkgPath = path.join(nativeTargetDir, "package.json");
        if (await fs.pathExists(pkgPath)) {
          const pkg = await fs.readJson(pkgPath);
          pkg.name = projectName;
          await fs.writeJson(pkgPath, pkg, { spaces: 2 });
        }

        // Update app.json (expo.name and expo.slug)
        const appJsonPath = path.join(nativeTargetDir, "app.json");
        if (await fs.pathExists(appJsonPath)) {
          const appJson = await fs.readJson(appJsonPath);
          if (appJson.expo) {
            appJson.expo.name = projectName;
            appJson.expo.slug = projectName;
          }
          await fs.writeJson(appJsonPath, appJson, { spaces: 2 });
        }

        // Copy .env from web to native
        // We use the fully constructed .env.example from web as the base .env for native
        const webEnvPath = path.join(webTargetDir, ".env.example");
        const nativeEnvPath = path.join(nativeTargetDir, ".env");
        if (await fs.pathExists(webEnvPath)) {
          await fs.copy(webEnvPath, nativeEnvPath);
        }

        s.stop("Mobile App scaffolded.");
      } catch (error) {
        s.stop("Failed to copy mobile template.");
        console.error(error);
        process.exit(1);
      }
    } else {
      s.stop("Mobile template not found.");
      console.warn(
        color.yellow(
          `⚠ Mobile template not found at ${nativeDir}. Skipping mobile scaffold.`
        )
      );
    }
  }

  // 7. Create System Files (.gitignore)
  s.start("Creating system files...");
  // .gitignore stays at root
  const gitignoreContent = `
node_modules
.next
.env
.env.*
!.env.example
.DS_Store
dist
supabase/.branches
supabase/.temp
.vercel
  `;
  await fs.writeFile(
    path.join(projectDir, ".gitignore"),
    gitignoreContent.trim()
  );
  s.stop("System files created.");

  // 8. Initialize Git
  s.start("Initializing Git...");
  try {
    await execa("git", ["init"], { cwd: projectDir });
    s.stop("Git initialized.");
  } catch {
    s.stop("Skipped Git initialization (git not found).");
  }

  // 9. Install Dependencies
  s.start("Installing dependencies...");

  // Base dependencies always needed for the scaffold
  const dependenciesToInstall = ["@supabase/supabase-js", "@supabase/ssr"];

  // Module specific dependencies
  if (modules.includes("stripe")) dependenciesToInstall.push("stripe");
  if (modules.includes("resend")) dependenciesToInstall.push("resend");
  if (modules.includes("openai")) dependenciesToInstall.push("openai");

  try {
    // 1. Install root/workspace dependencies
    // This will install dependencies for all workspaces defined in package.json
    await execa("npm", ["install"], { cwd: projectDir });

    // 2. Install added module dependencies into web workspace
    if (dependenciesToInstall.length > 0) {
      await execa(
        "npm",
        ["install", ...dependenciesToInstall, "--workspace=web"],
        {
          cwd: projectDir,
        }
      );
    }
    s.stop("Dependencies installed.");
  } catch (error) {
    s.stop("Dependency installation failed.");
    console.error(
      color.yellow("⚠ Could not install dependencies automatically.")
    );
    console.error(
      color.yellow(
        `  Please run 'npm install' and 'npm install ${dependenciesToInstall.join(
          " "
        )} --workspace=web' manually.`
      )
    );
  }

  // Final Success Message
  console.log(
    `\n${color.bgGreen(color.black(" SUCCESS "))} Project created at ${color.green(
      projectDir
    )}`
  );
  console.log(`\nNext steps:`);
  console.log(`  1. ${color.cyan(`cd ${projectName}`)}`);
  console.log(
    `  2. ${color.cyan(
      "cd web && cp .env.example .env.local"
    )} (Fill in your keys)`
  );
  console.log(`  3. ${color.cyan("npm run dev --workspace=web")}`);
  if (withMobile) {
    console.log(
      `  4. ${color.cyan("cd native && npx expo start")} (To run mobile app)`
    );
  }
  console.log(
    `  ${withMobile ? "5" : "4"}. ${color.cyan(
      "npx supabase start"
    )} (To run local DB)`
  );
}

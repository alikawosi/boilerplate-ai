import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { spinner } from "@clack/prompts";
import color from "picocolors";
import { execa } from "execa"; // <--- Import this

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function scaffoldProject(projectName: string) {
  const s = spinner();
  const projectDir = path.resolve(process.cwd(), projectName);
  const templateDir = path.resolve(__dirname, "../../templates/nextjs");

  // 1. Copy Files
  s.start("Copying files...");
  try {
    await fs.copy(templateDir, projectDir);

    const pkgPath = path.join(projectDir, "package.json");
    const pkg = await fs.readJson(pkgPath);
    pkg.name = projectName;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    const gitignoreContent = `node_modules\n.next\n.env\n.DS_Store\n.env.local`;
    await fs.writeFile(
      path.join(projectDir, ".gitignore"),
      gitignoreContent.trim()
    );

    s.stop("Files copied!");
  } catch (error) {
    s.stop("Failed to copy files");
    console.error(error);
    return;
  }

  // 2. Initialize Git
  s.start("Initializing Git...");
  try {
    await execa("git", ["init"], { cwd: projectDir });
    s.stop("Git initialized!");
  } catch (error) {
    s.stop("Failed to initialize Git (you can do it manually)");
  }

  // 3. Install Dependencies
  s.start("Installing dependencies (this might take a moment)...");
  try {
    await execa("npm", ["install"], { cwd: projectDir });
    s.stop("Dependencies installed!");
  } catch (error) {
    s.stop("Failed to install dependencies");
  }

  // Success Message
  console.log(`\n${color.green("Success!")} Your project is ready.`);
}

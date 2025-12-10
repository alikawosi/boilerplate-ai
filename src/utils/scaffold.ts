import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { spinner } from "@clack/prompts";
import color from "picocolors";

// Get current directory for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function scaffoldProject(projectName: string) {
  const s = spinner();
  s.start("Copying project files...");

  const projectDir = path.resolve(process.cwd(), projectName);
  const templateDir = path.resolve(__dirname, "../../templates/nextjs");

  try {
    // 1. Copy the entire template folder
    await fs.copy(templateDir, projectDir);

    // 2. Update package.json name
    const pkgPath = path.join(projectDir, "package.json");
    const pkg = await fs.readJson(pkgPath);
    pkg.name = projectName;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    // 3. Create a .gitignore (We create it dynamically so it isn't ignored in our repo)
    const gitignoreContent = `
node_modules
.next
.env
.DS_Store
    `;
    await fs.writeFile(
      path.join(projectDir, ".gitignore"),
      gitignoreContent.trim()
    );

    s.stop(`${color.green("Files copied successfully!")}`);
    return true;
  } catch (error) {
    s.stop(`${color.red("Failed to copy files.")}`);
    console.error(error);
    return false;
  }
}

import { existsSync, unlinkSync } from "node:fs";
import { join } from "path";

export function deleteImage(path: string) {
  if (!path) {
    return;
  }

  const relativePath = join(__dirname, "../../", path);

  if (existsSync(relativePath)) {
    unlinkSync(relativePath);
  } else {
    console.log(`Imagem ${path} não encontrada.`);
  }
}

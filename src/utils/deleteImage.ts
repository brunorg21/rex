import { existsSync, unlinkSync } from "node:fs";
import { join } from "path";

export function deleteImage(path: string) {
  // Verificar se o caminho da imagem é fornecido
  console.log("path =>", path);
  if (!path) {
    console.log("Caminho da imagem não fornecido.");
    return;
  }

  const relativePath = join(__dirname, "../../", path);

  if (existsSync(relativePath)) {
    unlinkSync(relativePath);
    console.log(`Imagem ${path} deletada com sucesso.`);
  } else {
    console.log(`Imagem ${path} não encontrada.`);
  }
}

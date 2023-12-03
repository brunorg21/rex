import path from "node:path";
import { writeFileSync, existsSync } from "fs";
import { randomUUID } from "node:crypto";
import { unlinkSync } from "node:fs";

export async function updateImage(existingFilePath: any, newImage: any) {
  if (!existsSync(existingFilePath)) {
    throw new Error("O arquivo a ser atualizado não existe.");
  }

  unlinkSync(existingFilePath);

  const newExtension = path.extname(newImage.filename);

  const newBaseName = path.basename(newImage.filename, newExtension);

  const newFileName = `${newBaseName}-${randomUUID()}-${newExtension}`;

  const newFilePath = path.resolve(__dirname, "../../uploads", newFileName);

  newImage.data.then((buffer: Buffer) => {
    writeFileSync(newFilePath, buffer);
  });

  return newFilePath;
}

import path, { join } from "node:path";
import { writeFileSync, existsSync } from "fs";
import { randomUUID } from "node:crypto";
import { deleteImage } from "./deleteImage";

export async function updateImage(existingFilePath: any, newImage: any) {
  const existingPath = path.join(__dirname, "../..", existingFilePath ?? "");

  if (!existsSync(existingPath)) {
    const newExtension = path.extname(newImage.filename);

    const newBaseName = path.basename(newImage.filename, newExtension);

    const newFileName = `${newBaseName}-${randomUUID()}-${newExtension}`;

    const newFilePath = path.resolve(__dirname, "../../uploads", newFileName);
    const relativePath = join("/uploads", newFileName);

    newImage.data.then((buffer: Buffer) => {
      writeFileSync(newFilePath, buffer);
    });

    return relativePath.replace(/\\/g, "/");
  }

  deleteImage(existingFilePath);

  const newExtension = path.extname(newImage.filename);

  const newBaseName = path.basename(newImage.filename, newExtension);

  const newFileName = `${newBaseName}-${randomUUID()}-${newExtension}`;

  const newFilePath = path.resolve(__dirname, "../../uploads", newFileName);
  const relativePath = join("/uploads", newFileName);

  newImage.data.then((buffer: Buffer) => {
    writeFileSync(newFilePath, buffer);
  });

  return relativePath.replace(/\\/g, "/");
}

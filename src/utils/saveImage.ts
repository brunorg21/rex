import { randomUUID } from "crypto";
import path, { join } from "node:path";
import { writeFileSync } from "fs";

export async function saveImage(file: any) {
  const extension = path.extname(file.filename);

  const fileBaseName = path.basename(file.filename, extension);

  const fileUploadName = `${fileBaseName}-${randomUUID()}-${extension}`;

  const destination = path.resolve(__dirname, "../../uploads", fileUploadName);
  const relativePath = join("/uploads", fileUploadName);

  file.data.then((buffer: Buffer) => {
    writeFileSync(destination, buffer);
  });

  return relativePath.replace(/\\/g, "/");
}

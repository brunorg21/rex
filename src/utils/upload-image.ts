import { randomUUID } from "crypto";
import { Readable } from "stream";
import { getDriveService } from "../lib/google-drive-auth";

const driveService = getDriveService();

export async function uploadImage(file: any, buffer: Buffer) {
  try {
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);

    const response = await driveService.files.create({
      requestBody: {
        name: `${file.filename}-${randomUUID()}`,
        parents: [process.env.GOOGLE_API_FOLDER_ID!],
      },
      media: {
        body: readable,
        mimeType: file.mimetype,
      },
      fields: "id",
    });

    return response.data.id;
  } catch (error) {}
}

export async function deleteImage(fileId: string) {
  try {
    const response = await driveService.files.delete({
      fileId,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

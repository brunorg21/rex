import { existsSync, writeFile } from "fs";
import { google } from "googleapis";
import { join } from "path";
import { cwd } from "process";

export function getDriveService() {
  const CREDENTIALS_PATH = join(cwd(), "credentials.json");

  if (!existsSync(CREDENTIALS_PATH)) {
    const credentials = process.env.CREDENTIALS!;

    const filePath = "./credentials.json";

    writeFile(filePath, credentials, (err) => {
      if (err) {
        console.error("Erro ao criar o arquivo:", err);
        return;
      }
      console.log("Arquivo criado com sucesso!");
    });
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  const driveService = google.drive({
    version: "v3",
    auth,
  });

  return driveService;
}

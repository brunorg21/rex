import { google } from "googleapis";
import { join } from "path";
import { cwd } from "process";

export function getDriveService() {
  const CREDENTIALS_PATH = join(cwd(), "credentials.json");

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

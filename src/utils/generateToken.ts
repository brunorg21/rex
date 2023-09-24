import { sign } from "jsonwebtoken";
export function generateToken(userId: number) {
  const token = sign({}, "5488943c-7a3b-4248-b7b6-8063baf9ef2d", {
    subject: String(userId),
    expiresIn: "2h",
  });

  return token;
}

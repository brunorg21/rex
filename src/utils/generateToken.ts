import { sign } from "jsonwebtoken";
export function generateToken(userId: number) {
  const token = sign({}, process.env.JWT_SECRET_KEY!, {
    subject: String(userId),
    expiresIn: "2 days",
  });

  return token;
}

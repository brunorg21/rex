import { FastifyInstance } from "fastify";
import nodemailer from "nodemailer";
import { z } from "zod";

const emailBodySchema = z.object({
  message: z.string(),
  email: z.string().email(),
});

export async function emailRoute(app: FastifyInstance) {
  app.post(
    "/send",

    async (request, reply) => {
      const { message, email } = emailBodySchema.parse(request.body);

      if (!email) {
        return reply.status(401).send({
          message: "Email is missing",
        });
      }

      const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "742e0dd51276ca",
          pass: "cc11c580b7743f",
        },
      });

      if (!transport) {
        return reply.status(401).send({
          message: "Invalid credentials",
        });
      }

      const finalMessage = `<p>${message}</p>`;

      transport.sendMail({
        from: email,
        to: "rbrunog21@gmail.com",
        subject: "Feedback",
        html: finalMessage,
      });

      reply.status(201).send({ message: "E-mail enviado" });
    }
  );
}

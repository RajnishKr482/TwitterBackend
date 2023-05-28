import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();
const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
function generateEmailToken(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}
router.post("/login", async (req, res) => {
  const { email } = req.body;
  const emailToken = generateEmailToken();
  const expiration = new Date(
    new Date().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000,
  );
  try {
    const createdToken = await prisma.token.create({
      data: {
        type: "EMAIL",
        emailToken,
        expiration,
        user: {
          connectOrCreate: {
            where: {
              email,
            },
            create: {
              email,
            },
          },
        },
      },
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(400).json({
      error: "Count not start the authentication process",
    });
  }

  //send emailToken to user
});

//validate the emailToken
// Generate a long -live JWT token
router.post("/authenticate", async (req, res) => {
  const { email, emailToken } = req.body;

  const dbEmailToken = await prisma.token.findUnique({
    where: {
      emailToken,
    },
    include: {
      user: true,
    },
  });
  if (!dbEmailToken || !dbEmailToken?.valid) {
    return res.sendStatus(401);
  }
  if (dbEmailToken?.expiration < new Date()) {
    return res.status(401).json({
      error: "Token Expired!",
    });
  }
  if (dbEmailToken.user.email !== email) {
    return res.sendStatus(401);
  }
  res.sendStatus(200);
});
export default router;

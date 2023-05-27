import { PrismaClient } from "@prisma/client";
import { Router } from "express";
const prisma = new PrismaClient();
const router = Router();

// Tweet CRUD
//creating tweet
router.post("/", async (req, res) => {
  const { content, image, userId } = req.body;
  try {
    const result = await prisma.tweet.create({
      data: {
        content,
        image,
        userId,
      },
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({});
  }
});
//list tweet
router.get("/", async (req, res) => {
  const allTweets = await prisma.tweet.findMany({
    // include: {
    //   user: true,
    // },
    // select: {
    //   id: true,
    //   content: true,
    //   user: {
    //     select: {
    //       id: true,
    //       name: true,
    //       username: true,
    //       image: true,
    //     },
    //   },
    // },
  });
  res.json(allTweets);
});
//get one tweet
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const tweet = await prisma.tweet.findUnique({
    where: { id: Number(id) },
    include: {
      user: true,
    },
  });
  if (!tweet) {
    return res.status(404).json({
      error: "Tweet not found!",
    });
  }
  res.json(tweet);
});
//update tweet
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { content, userId } = req?.body;
  try {
    const result = await prisma.tweet.update({
      where: { id: Number(userId) },
      data: {
        content,
      },
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: "failed to update the user",
    });
  }
});

//delete tweet
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await prisma.tweet.delete({ where: { id: Number(id) } });
  res.sendStatus(200);
  //   res.status(501).json({
  //     error: `Not Implemented :${id}`,
  //   });
});
export default router;

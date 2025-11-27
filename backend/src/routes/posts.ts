import express from "express";
import prisma from "../prisma/prisma";
import { randomUUID } from "crypto";
import authMiddleware from "../middleware";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../utils/types";
import logger from "../utils/logging";

const router = express.Router();

/**
 * @route   POST /post/create
 * @desc    Create a new post (Authenticated Users Only)
 * @access  PROTECTED
 */
router.post("/create", authMiddleware, async (req: Request, res: Response) => {
    try {
        const { title, content,imageUrl } = req.body;
        const userId = (req as AuthenticatedRequest).user;
        logger.info("create post request from ",userId);
        if (!title || !content || !imageUrl) {
            res.status(400).json({ error: "Title and content and image are required" });
            return;
        }

        const extractLinks = (md : string) => {
            const links = [];
            const regex = /\[.*?\]\((.*?)\)/g;
            let match;
            while ((match = regex.exec(md)) !== null) {
                links.push(match[1]);
            }
            return links;
        };

        const citations = extractLinks(content)

        const post = await prisma.post.create({
          data: {
            id: randomUUID(),
            title,
            content,
            imageURL: imageUrl,
            authorId: userId,
            citations : citations
          }
        });
        logger.success("post created successfully ",post.id);
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    logger.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
});

/**
 * @route   GET /post/random
 * @desc    Get 5 random posts (Authenticated Users Only)
 * @access  PROTECTED
 */
router.get("/random", async (req: Request, res: Response) => {
    try {
        //const count = await prisma.post.count();
        logger.info("random post route called")
        const randomPosts = await prisma.post.findMany({
            take: 12, // Grid has rows of 4,3,2,1 - LCM of (4,3,2,1) is 12,
            //skip: Math.max(0, Math.floor(Math.random() * (count - 5))),

            select: {
                title: true,
                content: true,
                id: true, 
                imageURL : true
            },
            orderBy: { createdAt: "desc" },
        });

        const formattedPosts = randomPosts.map(post => ({
            id : post.id,
            title: post.title,
            wordCount: post.content.split(/\s+/).filter(Boolean).length,
            imageUrl : post.imageURL,
            content : post.content
        }));    
        logger.success("random post route success")
        res.status(200).json(formattedPosts);
    } catch (error) {
        console.error("Error fetching random posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @route   GET /post/user
 * @desc    Get all posts by the authenticated user
 * @access  PROTECTED
 */
router.get("/posts", authMiddleware, async (req: Request, res: Response) => {
    try {
        const { author } = req.query; 
        author ? logger.info(`post req for ${author}'s posts`) : logger.info("post request for all posts")
        const posts = await prisma.post.findMany({
            where: author ? { authorId: author as string } : undefined,
            orderBy: { createdAt: "desc" }, 
        });

        if (posts.length === 0) {
            logger.error("no post found");
            res.status(201).json({ message: "No posts found" });
            return;
        }
        logger.success("successfully found posts")
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


/** 
 * @route GET /postId
 * @desc Gets the post data by the post id
 * @access PUBLIC
*/

router.get("/:id",async (req : Request,res : Response) => {
    const id  = req.params.id;
    logger.info('request blog : ',id);
    const postData = await prisma.post.findFirst({
        where : {
            id : id
        }
    })

    if(!postData){
        res.status(201).json({message : "no post found"})
        logger.error("blog error : ",id);
        return;
    }
    logger.success("blog data (200) : ",id)
    res.status(200).json(postData);
    return;
})
export default router;

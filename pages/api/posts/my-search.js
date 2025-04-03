import prisma from '@/utils/db';
import { withAuth } from '@/utils/auth';

async function handler(req, res) {

    // check if method is GET
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {

        // get search query, sort options, and pagination parameters from request
        const { query, sortByTitle, sortByTags, sortByContent, sortByTemplates, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        // get author id from request
        const authorId = req.user.id;

        // validate input
        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }

        // validate page number
        if (page < 1) {
            return res.status(400).json({ error: "Invalid page number" });
        }

        let posts = [];
        let total = 0;

        // determine sort criteria
        if (sortByTitle?.toLowerCase() === 'true') {

            // return posts with title containing query
            posts = await prisma.post.findMany({
                where: { 
                    authorId,
                    title: { 
                        contains: query.toLowerCase() 
                    } 
                },
                skip: parseInt(skip),
                take: parseInt(limit),
                select: {
                    id: true,
                    title: true,
                    description: true,
                    isHidden: true,
                    author: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    },
                    tags: {
                        select: {
                            name: true,
                        },
                    },
                    comments: true,
                    createdAt: true
                },
            });
            
            total = await prisma.post.count({
                where: { 
                    authorId,
                    title: { 
                        contains: query.toLowerCase() 
                    } 
                },
            });
            
        } 
        else if (sortByTags?.toLowerCase() === 'true') {

            // return posts with tags containing query
            posts = await prisma.post.findMany({
                where: { 
                    authorId,
                    tags: { 
                        some: {
                            name: {
                                contains: query.toLowerCase()
                            }
                        }
                    }
                },
                skip: parseInt(skip),
                take: parseInt(limit),
                select: {
                    id: true,
                    title: true,
                    description: true,
                    isHidden: true,
                    author: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    },
                    tags: {
                        select: {
                            name: true,
                        },
                    },
                    comments: true,
                    createdAt: true
                },
            });
            
            total = await prisma.post.count({
                where: { 
                    authorId,
                    tags: { 
                        some: {
                            name: {
                                contains: query.toLowerCase()
                            }
                        }
                    }
                },
            });
            
        } 
        else if (sortByContent?.toLowerCase() === 'true') {

            // return posts with content containing query
            posts = await prisma.post.findMany({
                where: { 
                    authorId,
                    content: { 
                        contains: query.toLowerCase()
                    }
                },
                skip: parseInt(skip),
                take: parseInt(limit),
                select: {
                    id: true,
                    title: true,
                    description: true,
                    isHidden: true,
                    author: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    },
                    tags: {
                        select: {
                            name: true,
                        },
                    },
                    comments: true,
                    createdAt: true
                },
            });
            
            total = await prisma.post.count({
                where: { 
                    authorId,
                    content: { 
                        contains: query.toLowerCase()
                    }
                },
            });
            
        } 
        else if (sortByTemplates?.toLowerCase() === 'true') {

            // return posts with templates containing query
            posts = await prisma.post.findMany({
                where: { 
                    authorId,
                    templates: { 
                        some: {
                            title: {
                                contains: query.toLowerCase()
                            }
                        }
                    }
                },
                skip: parseInt(skip),
                take: parseInt(limit),
                select: {
                    id: true,
                    title: true,
                    description: true,
                    isHidden: true,
                    author: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    },
                    tags: {
                        select: {
                            name: true,
                        },
                    },
                    comments: true,
                    createdAt: true
                },
            });
            
            total = await prisma.post.count({
                where: { 
                    authorId,
                    templates: { 
                        some: {
                            title: {
                                contains: query.toLowerCase()
                            }
                        }
                    }
                },
            });
            
        } 
        else {
            
            return res.status(400).json({ error: "Invalid sort criteria" });
       
        }

        // return found posts
        return res.status(200).json({ 
            posts,
            total,
            totalPages: Math.ceil(total / parseInt(limit))
        });

    }
    catch (error) {
        return res.status(500).json({ error: "An unexpected error occurred while searching for posts", message: error.message });

    }

}

export default withAuth(handler);
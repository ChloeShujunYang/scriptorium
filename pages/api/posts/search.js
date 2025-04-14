import prisma from '@/utils/db';

export default async function handler(req, res) {

    // check if method is GET
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        console.log('Search request query:', req.query);

        // get search query, sort options, and pagination parameters from request
        const { query, sortByTitle, sortByTags, sortByContent, sortByTemplates, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        // validate input
        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }

        // validate page number
        if (page < 1) {
            return res.status(400).json({ error: "Invalid page number" });
        }

        // validate limit
        if (limit < 1 || limit > 100) {
            return res.status(400).json({ error: "Limit must be between 1 and 100" });
        }

        // validate sort criteria
        if (!sortByTitle && !sortByTags && !sortByContent && !sortByTemplates) {
            return res.status(400).json({ error: "At least one sort criteria must be specified" });
        }

        let posts = [];
        let total = 0;
        let searchCriteria = '';

        // determine sort criteria
        if (sortByTitle?.toLowerCase() === 'true') {
            searchCriteria = 'title';
            console.log('Searching by title:', query.toLowerCase());
            
            // return posts with title containing query
            posts = await prisma.post.findMany({
                where: { 
                    title: { 
                        contains: query.toLowerCase() 
                    },
                    isHidden: false
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
                    votes: {
                        select: {
                            id: true,
                            isUpvote: true,
                            voterId: true
                        }
                    },
                    comments: {
                        select: {
                            id: true,
                            content: true,
                            createdAt: true
                        }
                    },
                    createdAt: true
                },
            });
            
            total = await prisma.post.count({
                where: { 
                    title: { 
                        contains: query.toLowerCase() 
                    },
                    isHidden: false
                },
            });
        } 
        else if (sortByTags?.toLowerCase() === 'true') {
            searchCriteria = 'tags';
            console.log('Searching by tags:', query.toLowerCase());
            
            // return posts with tags containing query
            posts = await prisma.post.findMany({
                where: { 
                    tags: { 
                        some: {
                            name: {
                                contains: query.toLowerCase()
                            }
                        }
                    },
                    isHidden: false
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
                    votes: {
                        select: {
                            id: true,
                            isUpvote: true,
                            voterId: true
                        }
                    },
                    comments: {
                        select: {
                            id: true,
                            content: true,
                            createdAt: true
                        }
                    },
                    createdAt: true
                },
            });
            
            total = await prisma.post.count({
                where: { 
                    tags: { 
                        some: {
                            name: {
                                contains: query.toLowerCase()
                            }
                        }
                    },
                    isHidden: false
                },
            });
        } 
        else if (sortByContent?.toLowerCase() === 'true') {
            searchCriteria = 'content';
            console.log('Searching by content:', query.toLowerCase());
            
            // return posts with content containing query
            posts = await prisma.post.findMany({
                where: { 
                    content: { 
                        contains: query.toLowerCase()
                    },
                    isHidden: false
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
                    votes: {
                        select: {
                            id: true,
                            isUpvote: true,
                            voterId: true
                        }
                    },
                    comments: {
                        select: {
                            id: true,
                            content: true,
                            createdAt: true
                        }
                    },
                    createdAt: true
                },
            });
            
            total = await prisma.post.count({
                where: { 
                    content: { 
                        contains: query.toLowerCase()
                    },
                    isHidden: false
                },
            });
        } 
        else if (sortByTemplates?.toLowerCase() === 'true') {
            searchCriteria = 'templates';
            console.log('Searching by templates:', query.toLowerCase());
            
            // return posts with templates containing query
            posts = await prisma.post.findMany({
                where: { 
                    templates: { 
                        some: {
                            title: {
                                contains: query.toLowerCase()
                            }
                        }
                    },
                    isHidden: false
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
                    votes: {
                        select: {
                            id: true,
                            isUpvote: true,
                            voterId: true
                        }
                    },
                    comments: {
                        select: {
                            id: true,
                            content: true,
                            createdAt: true
                        }
                    },
                    createdAt: true
                },
            });
            
            total = await prisma.post.count({
                where: { 
                    templates: { 
                        some: {
                            title: {
                                contains: query.toLowerCase()
                            }
                        }
                    },
                    isHidden: false
                },
            });
        } 
        else {
            return res.status(400).json({ error: "Invalid sort criteria" });
        }

        console.log(`Search results for ${searchCriteria}:`, {
            query: query.toLowerCase(),
            foundPosts: posts.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit))
        });

        // return found posts
        return res.status(200).json({ 
            posts,
            total,
            totalPages: Math.ceil(total / parseInt(limit))
        });

    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ 
            error: "An unexpected error occurred while searching for posts",
            details: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
    }

}
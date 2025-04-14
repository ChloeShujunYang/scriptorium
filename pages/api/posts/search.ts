import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const posts = await prisma.post.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { content: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { tags: { some: { name: { contains: q, mode: 'insensitive' } } } }
            ]
          },
          {
            OR: [
              { isHidden: false },
              { authorId: session?.user?.id },
              { AND: [
                { isHidden: true },
                { author: { role: 'ADMIN' } }
              ]}
            ]
          }
        ]
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        tags: true,
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
        votes: {
          select: {
            id: true,
            isUpvote: true,
            voterId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data before sending
    const transformedPosts = posts.map(post => ({
      ...post,
      upvotes: post.votes.filter(v => v.isUpvote).length,
      downvotes: post.votes.filter(v => !v.isUpvote).length,
    }));

    return res.status(200).json(transformedPosts);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Failed to search posts' });
  }
} 
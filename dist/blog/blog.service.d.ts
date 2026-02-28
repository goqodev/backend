import { PrismaService } from '../prisma/prisma.service';
export declare class BlogService {
    private prisma;
    constructor(prisma: PrismaService);
    getPosts(options: {
        locale: string;
        category?: string;
        page: number;
        limit: number;
    }): Promise<{
        data: {
            slug: string;
            category: string;
            readTime: number;
            image: string;
            date: string;
            author: string;
            title: string;
            excerpt: string;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    getPostBySlug(slug: string, locale: string): Promise<{
        slug: string;
        category: string;
        readTime: number;
        image: string;
        date: string;
        author: string;
        meta: {
            title: string;
            description: string;
        };
        title: string;
        intro: string;
        sections: Record<string, unknown>[];
    }>;
    getCategories(): Promise<string[]>;
}

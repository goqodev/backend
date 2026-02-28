import { BlogService } from './blog.service';
import { PostQueryDto } from './dto/post-query.dto';
export declare class BlogController {
    private blogService;
    constructor(blogService: BlogService);
    getPosts(query: PostQueryDto): Promise<{
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
    getPost(slug: string, locale?: string): Promise<{
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

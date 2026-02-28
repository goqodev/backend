import { AdminBlogService } from './admin-blog.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class AdminBlogController {
    private adminBlogService;
    constructor(adminBlogService: AdminBlogService);
    listPosts(): Promise<{
        id: number;
        slug: string;
        category: string;
        image: string;
        date: string;
        isPublished: boolean;
        translations: Record<string, unknown>;
    }[]>;
    getPost(id: number): Promise<{
        id: number;
        slug: string;
        category: string;
        readTime: number;
        image: string;
        date: string;
        author: string;
        isPublished: boolean;
        sortOrder: number;
        translations: Record<string, unknown>;
        sections: {
            id: number;
            key: string;
            type: string;
            sortOrder: number;
            translations: Record<string, unknown>;
        }[];
    }>;
    createPost(dto: CreatePostDto): Promise<{
        id: number;
        slug: string;
    }>;
    updatePost(id: number, dto: UpdatePostDto): Promise<{
        id: number;
        slug: string;
    }>;
    deletePost(id: number): Promise<{
        deleted: boolean;
    }>;
    togglePublish(id: number): Promise<{
        id: number;
        isPublished: boolean;
    }>;
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BlogService = class BlogService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPosts(options) {
        const { locale, category, page, limit } = options;
        const skip = (page - 1) * limit;
        const where = { isPublished: true };
        if (category)
            where.category = category;
        const [posts, total] = await Promise.all([
            this.prisma.blogPost.findMany({
                where,
                include: {
                    translations: { where: { locale } },
                },
                orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.blogPost.count({ where }),
        ]);
        return {
            data: posts.map((post) => {
                const t = post.translations[0];
                return {
                    slug: post.slug,
                    category: post.category,
                    readTime: post.readTime,
                    image: post.image,
                    date: post.publishedAt.toISOString().split('T')[0],
                    author: post.author,
                    title: t?.title ?? '',
                    excerpt: t?.intro?.substring(0, 200) ?? '',
                };
            }),
            total,
            page,
            limit,
        };
    }
    async getPostBySlug(slug, locale) {
        const post = await this.prisma.blogPost.findUnique({
            where: { slug },
            include: {
                translations: { where: { locale } },
                sections: {
                    orderBy: { sortOrder: 'asc' },
                    include: {
                        translations: { where: { locale } },
                        listItems: {
                            where: { locale },
                            orderBy: { sortOrder: 'asc' },
                        },
                        detailItems: {
                            where: { locale },
                            orderBy: { sortOrder: 'asc' },
                        },
                    },
                },
            },
        });
        if (!post || !post.isPublished) {
            throw new common_1.NotFoundException('Post not found');
        }
        const t = post.translations[0];
        return {
            slug: post.slug,
            category: post.category,
            readTime: post.readTime,
            image: post.image,
            date: post.publishedAt.toISOString().split('T')[0],
            author: post.author,
            meta: {
                title: t?.metaTitle ?? '',
                description: t?.metaDescription ?? '',
            },
            title: t?.title ?? '',
            intro: t?.intro ?? '',
            sections: post.sections.map((section) => {
                const st = section.translations[0];
                const base = {
                    key: section.key,
                    type: section.type,
                    title: st?.title ?? '',
                    content: st?.content ?? '',
                };
                if (section.type === 'list') {
                    base.list = section.listItems.map((item) => item.text);
                }
                if (section.type === 'items') {
                    base.items = section.detailItems.map((item) => ({
                        subtitle: item.subtitle,
                        text: item.text,
                    }));
                }
                return base;
            }),
        };
    }
    async getCategories() {
        const categories = await this.prisma.blogPost.findMany({
            where: { isPublished: true },
            select: { category: true },
            distinct: ['category'],
        });
        return categories.map((c) => c.category);
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BlogService);
//# sourceMappingURL=blog.service.js.map
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminBlogService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const prisma_service_1 = require("../../prisma/prisma.service");
const LOCALES = ['ro', 'en', 'ru'];
let AdminBlogService = class AdminBlogService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async invalidateCache() {
        await this.cache.clear();
    }
    async listPosts() {
        const posts = await this.prisma.blogPost.findMany({
            include: { translations: true },
            orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }],
        });
        return posts.map((post) => {
            const translationsMap = {};
            for (const t of post.translations) {
                translationsMap[t.locale] = { title: t.title };
            }
            return {
                id: post.id,
                slug: post.slug,
                category: post.category,
                image: post.image,
                date: post.publishedAt.toISOString().split('T')[0],
                isPublished: post.isPublished,
                translations: translationsMap,
            };
        });
    }
    async getPost(id) {
        const post = await this.prisma.blogPost.findUnique({
            where: { id },
            include: {
                translations: true,
                sections: {
                    orderBy: { sortOrder: 'asc' },
                    include: {
                        translations: true,
                        listItems: { orderBy: { sortOrder: 'asc' } },
                        detailItems: { orderBy: { sortOrder: 'asc' } },
                    },
                },
            },
        });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        const translationsMap = {};
        for (const t of post.translations) {
            translationsMap[t.locale] = {
                metaTitle: t.metaTitle,
                metaDescription: t.metaDescription,
                title: t.title,
                intro: t.intro,
            };
        }
        return {
            id: post.id,
            slug: post.slug,
            category: post.category,
            readTime: post.readTime,
            image: post.image,
            date: post.publishedAt.toISOString().split('T')[0],
            author: post.author,
            isPublished: post.isPublished,
            sortOrder: post.sortOrder,
            translations: translationsMap,
            sections: post.sections.map((section, idx) => {
                const sectionTranslations = {};
                for (const locale of LOCALES) {
                    const st = section.translations.find((t) => t.locale === locale);
                    const sectionData = {
                        title: st?.title ?? '',
                        content: st?.content ?? '',
                    };
                    if (section.type === 'list') {
                        sectionData.list = section.listItems
                            .filter((li) => li.locale === locale)
                            .map((li) => li.text);
                    }
                    if (section.type === 'items') {
                        sectionData.items = section.detailItems
                            .filter((di) => di.locale === locale)
                            .map((di) => ({ subtitle: di.subtitle, text: di.text }));
                    }
                    sectionTranslations[locale] = sectionData;
                }
                return {
                    id: section.id,
                    key: section.key,
                    type: section.type,
                    sortOrder: section.sortOrder ?? idx,
                    translations: sectionTranslations,
                };
            }),
        };
    }
    async createPost(dto) {
        return this.prisma.$transaction(async (tx) => {
            const post = await tx.blogPost.create({
                data: {
                    slug: dto.slug,
                    category: dto.category,
                    readTime: dto.readTime,
                    image: dto.image,
                    publishedAt: new Date(dto.date),
                    author: dto.author,
                    isPublished: dto.isPublished ?? false,
                },
            });
            for (const locale of LOCALES) {
                const t = dto.translations[locale];
                await tx.blogPostTranslation.create({
                    data: {
                        postId: post.id,
                        locale,
                        metaTitle: t.metaTitle,
                        metaDescription: t.metaDescription,
                        title: t.title,
                        intro: t.intro,
                    },
                });
            }
            for (let i = 0; i < dto.sections.length; i++) {
                const s = dto.sections[i];
                const section = await tx.blogSection.create({
                    data: {
                        postId: post.id,
                        key: s.key,
                        type: s.type,
                        sortOrder: s.sortOrder ?? i,
                    },
                });
                for (const locale of LOCALES) {
                    const st = s.translations[locale];
                    await tx.blogSectionTranslation.create({
                        data: {
                            sectionId: section.id,
                            locale,
                            title: st.title,
                            content: st.content,
                        },
                    });
                    if (s.type === 'list' && st.list) {
                        for (let j = 0; j < st.list.length; j++) {
                            await tx.blogSectionListItem.create({
                                data: {
                                    sectionId: section.id,
                                    locale,
                                    sortOrder: j,
                                    text: st.list[j],
                                },
                            });
                        }
                    }
                    if (s.type === 'items' && st.items) {
                        for (let j = 0; j < st.items.length; j++) {
                            await tx.blogSectionDetailItem.create({
                                data: {
                                    sectionId: section.id,
                                    locale,
                                    sortOrder: j,
                                    subtitle: st.items[j].subtitle,
                                    text: st.items[j].text,
                                },
                            });
                        }
                    }
                }
            }
            await this.invalidateCache();
            return { id: post.id, slug: post.slug };
        });
    }
    async updatePost(id, dto) {
        const existing = await this.prisma.blogPost.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Post not found');
        return this.prisma.$transaction(async (tx) => {
            await tx.blogPost.update({
                where: { id },
                data: {
                    ...(dto.slug && { slug: dto.slug }),
                    ...(dto.category && { category: dto.category }),
                    ...(dto.readTime !== undefined && { readTime: dto.readTime }),
                    ...(dto.image && { image: dto.image }),
                    ...(dto.date && { publishedAt: new Date(dto.date) }),
                    ...(dto.author && { author: dto.author }),
                    ...(dto.isPublished !== undefined && {
                        isPublished: dto.isPublished,
                    }),
                },
            });
            if (dto.translations) {
                for (const locale of LOCALES) {
                    const t = dto.translations[locale];
                    if (!t)
                        continue;
                    await tx.blogPostTranslation.upsert({
                        where: { postId_locale: { postId: id, locale } },
                        create: {
                            postId: id,
                            locale,
                            metaTitle: t.metaTitle,
                            metaDescription: t.metaDescription,
                            title: t.title,
                            intro: t.intro,
                        },
                        update: {
                            metaTitle: t.metaTitle,
                            metaDescription: t.metaDescription,
                            title: t.title,
                            intro: t.intro,
                        },
                    });
                }
            }
            if (dto.sections) {
                await tx.blogSection.deleteMany({ where: { postId: id } });
                for (let i = 0; i < dto.sections.length; i++) {
                    const s = dto.sections[i];
                    const section = await tx.blogSection.create({
                        data: {
                            postId: id,
                            key: s.key,
                            type: s.type,
                            sortOrder: s.sortOrder ?? i,
                        },
                    });
                    for (const locale of LOCALES) {
                        const st = s.translations[locale];
                        await tx.blogSectionTranslation.create({
                            data: {
                                sectionId: section.id,
                                locale,
                                title: st.title,
                                content: st.content,
                            },
                        });
                        if (s.type === 'list' && st.list) {
                            for (let j = 0; j < st.list.length; j++) {
                                await tx.blogSectionListItem.create({
                                    data: {
                                        sectionId: section.id,
                                        locale,
                                        sortOrder: j,
                                        text: st.list[j],
                                    },
                                });
                            }
                        }
                        if (s.type === 'items' && st.items) {
                            for (let j = 0; j < st.items.length; j++) {
                                await tx.blogSectionDetailItem.create({
                                    data: {
                                        sectionId: section.id,
                                        locale,
                                        sortOrder: j,
                                        subtitle: st.items[j].subtitle,
                                        text: st.items[j].text,
                                    },
                                });
                            }
                        }
                    }
                }
            }
            await this.invalidateCache();
            return { id, slug: dto.slug ?? existing.slug };
        });
    }
    async deletePost(id) {
        const existing = await this.prisma.blogPost.findUnique({ where: { id } });
        if (!existing)
            throw new common_1.NotFoundException('Post not found');
        await this.prisma.blogPost.delete({ where: { id } });
        await this.invalidateCache();
        return { deleted: true };
    }
    async togglePublish(id) {
        const post = await this.prisma.blogPost.findUnique({ where: { id } });
        if (!post)
            throw new common_1.NotFoundException('Post not found');
        const updated = await this.prisma.blogPost.update({
            where: { id },
            data: { isPublished: !post.isPublished },
        });
        await this.invalidateCache();
        return { id, isPublished: updated.isPublished };
    }
};
exports.AdminBlogService = AdminBlogService;
exports.AdminBlogService = AdminBlogService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_manager_1.Cache])
], AdminBlogService);
//# sourceMappingURL=admin-blog.service.js.map
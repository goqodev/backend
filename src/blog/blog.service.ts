import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async getPosts(options: {
    locale: string;
    category?: string;
    page: number;
    limit: number;
  }) {
    const { locale, category, page, limit } = options;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { isPublished: true };
    if (category) where.category = category;

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

  async getPostBySlug(slug: string, locale: string) {
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
      throw new NotFoundException('Post not found');
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
        const base: Record<string, unknown> = {
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
}

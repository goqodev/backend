import { Controller, Get, Param, Query, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { BlogService } from './blog.service';
import { PostQueryDto } from './dto/post-query.dto';

@Controller('blog')
@UseInterceptors(CacheInterceptor)
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get('posts')
  @CacheTTL(60000) // 60s
  getPosts(@Query() query: PostQueryDto) {
    return this.blogService.getPosts({
      locale: query.locale ?? 'ro',
      category: query.category,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    });
  }

  @Get('posts/:slug')
  getPost(
    @Param('slug') slug: string,
    @Query('locale') locale: string = 'ro',
  ) {
    return this.blogService.getPostBySlug(slug, locale);
  }

  @Get('categories')
  getCategories() {
    return this.blogService.getCategories();
  }
}

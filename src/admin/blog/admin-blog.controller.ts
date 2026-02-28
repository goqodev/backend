import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { AdminBlogService } from './admin-blog.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@UseGuards(JwtAuthGuard)
@Controller('admin/blog/posts')
export class AdminBlogController {
  constructor(private adminBlogService: AdminBlogService) {}

  @Get()
  listPosts() {
    return this.adminBlogService.listPosts();
  }

  @Get(':id')
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.adminBlogService.getPost(id);
  }

  @Post()
  createPost(@Body() dto: CreatePostDto) {
    return this.adminBlogService.createPost(dto);
  }

  @Put(':id')
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
  ) {
    return this.adminBlogService.updatePost(id, dto);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.adminBlogService.deletePost(id);
  }

  @Patch(':id/publish')
  togglePublish(@Param('id', ParseIntPipe) id: number) {
    return this.adminBlogService.togglePublish(id);
  }
}

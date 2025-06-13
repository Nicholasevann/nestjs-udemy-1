import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTagDto } from './dtos/create-tag.dto';
import { TagsService } from './providers/tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}
  @Post()
  public create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }
  @Delete()
  public async delete(@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.delete(id);
  }
  // tags/soft
  @Delete('soft')
  public async softDelete(@Query('id', ParseIntPipe) id: number) {
    return this.tagsService.softDelete(id);
  }
  @Get()
  public async findAll() {
    return this.tagsService.findAll();
  }
}

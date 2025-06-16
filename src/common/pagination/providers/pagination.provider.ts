import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject('REQUEST')
    private readonly request: Request,
  ) {}

  public async paginateQuery<T extends ObjectLiteral>(
    paginateQuery: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    // Set defaults and ensure positive values
    const limit = Math.max(1, paginateQuery?.limit ?? 10);
    const page = Math.max(1, paginateQuery?.page ?? 1);

    // Get total count first for efficiency
    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / limit);

    // Ensure current page doesn't exceed total pages
    const currentPage = Math.min(page, totalPages || 1);

    // Get paginated results
    const results = await repository.find({
      take: limit,
      skip: (currentPage - 1) * limit,
    });

    // Build base URL properly
    const protocol = this.request.protocol;
    const host = this.request.get('host');
    const pathname = this.request.path; // Use path instead of url to avoid query params
    const baseUrl = `${protocol}://${host}${pathname}`;

    // Calculate next and previous pages
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    const prevPage = currentPage > 1 ? currentPage - 1 : null;

    // Build pagination links
    const buildUrl = (pageNum: number) =>
      `${baseUrl}?page=${pageNum}&limit=${limit}`;

    const finalResponse: Paginated<T> = {
      data: results,
      meta: {
        itemsPerPage: limit,
        totalItems: totalItems,
        currentPage: currentPage,
        totalPages: totalPages,
      },
      links: {
        first: totalPages > 0 ? buildUrl(1) : '1',
        last: totalPages > 0 ? buildUrl(totalPages) : totalPages.toString(),
        current: buildUrl(currentPage),
        next: nextPage ? buildUrl(nextPage) : '-',
        previous: prevPage ? buildUrl(prevPage) : '-',
      },
    };

    return finalResponse;
  }
}

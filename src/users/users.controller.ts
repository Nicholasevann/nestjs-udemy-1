import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { CreateManyUserDto } from './dtos/create-many-user.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public getUsers(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    return this.usersService.findAll(limit, page);
  }

  @Post()
  // @SetMetadata('authType', 'none')
  // @Auth(AuthType.None)
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('create-many')
  public createManyUser(@Body() createManyUserDto: CreateManyUserDto) {
    return this.usersService.createMany(createManyUserDto);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get user by ID',
    description:
      'Retrieve a user by their unique ID, with optional parameters.',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
    type: GetUsersParamDto,
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'Limit the number of results',
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'Page the number of results',
  })
  public getUsersById(
    @Param() getUserParamDto: GetUsersParamDto,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ) {
    return this.usersService.findById(getUserParamDto.id ?? 0);
  }
  @Patch('/:id')
  public updateUser(@Body() patchUserDto: PatchUserDto) {
    console.log('Update user:', patchUserDto);
    return patchUserDto;
  }
}

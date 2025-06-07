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
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/get-users-param.dto';
import { PatchUserDto } from './dtos/patch-user.dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

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
  public createUser(@Body() createUserDto: CreateUserDto) {
    console.log('User data:', createUserDto instanceof CreateUserDto);
    return this.usersService.createUser(createUserDto);
  }

  @Get('/:id/{:optional}')
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
    console.log(getUserParamDto, limit, page);
  }
  @Patch('/:id')
  public updateUser(@Body() patchUserDto: PatchUserDto) {
    console.log('Update user:', patchUserDto);
    return patchUserDto;
  }
}

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

@Controller('users')
export class UsersController {
  @Get()
  public getUsers() {
    return 'List of users';
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    console.log('User data:', createUserDto instanceof CreateUserDto);
    return 'User created';
  }

  @Get('/:id/{:optional}')
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

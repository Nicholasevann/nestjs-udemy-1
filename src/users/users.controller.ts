import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Headers,
  Ip,
  Param,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  @Get()
  public getUsers() {
    return 'List of users';
  }

  @Post()
  public createUser(@Body() createUserDto: CreateUserDto) {
    console.log('User data:', createUserDto);
    return 'User created';
  }

  @Get('/:id/{:optional}')
  public getUsersById(
    @Param('id', ParseIntPipe) id: number,
    @Param('optional') optional?: any,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
  ) {
    console.log(limit, page);
    if (optional) {
      return `ID is ${id} and optional parameter is ${optional}`;
    } else {
      return `ID is ${id} and no optional parameter`;
    }
  }
}

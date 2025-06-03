import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  public getUsers() {
    return 'List of users';
  }

  @Post()
  public createUser(@Body() body: any) {
    console.log('User data:', body);
    return 'User created';
  }

  @Get('/:id/{:optional}')
  public getUsersById(
    @Param('id') id: any,
    @Param('optional') optional?: any,
    @Query('limit') limit?: any,
  ) {
    console.log(typeof id);
    console.log(typeof limit);
    console.log(optional);
    if (optional) {
      return `ID is ${id} and optional parameter is ${optional}`;
    } else {
      return `ID is ${id} and no optional parameter`;
    }
  }
}

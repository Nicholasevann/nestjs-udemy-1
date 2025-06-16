import { Injectable } from '@nestjs/common';
import { HasingProvider } from './hasing.provider';
import * as bcrypt from 'bcrypt';
@Injectable()
export class BcryptProvider implements HasingProvider {
  compare(password: string, password1: any) {
    throw new Error('Method not implemented.');
  }
  public async hashPassword(data: string | Buffer): Promise<string> {
    // generate salt
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }
  comparePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}

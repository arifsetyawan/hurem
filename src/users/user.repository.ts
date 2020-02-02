import {EntityRepository, Repository} from 'typeorm';
import {User} from './user.entity';
import {AuthCredentialDto} from '../auth/dto/auth-credential.dto';
import {ConflictException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
        const {username, password} = authCredentialDto;

        const user = new User();
        user.username = username;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try {
            await user.save();
        } catch (error) {
            throw new ConflictException('Failed Signup', error.code);
        }
    }

    async validateUserPassword(authCredentialDTO: AuthCredentialDto): Promise<string> {
        const { username, password } = authCredentialDTO;
        const user = await this.findOne({username});

        if (user && await user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }

    }

    private async hashPassword(password: string, salt: string) {
        return bcrypt.hash(password, salt);
    }
}

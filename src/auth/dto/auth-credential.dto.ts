import {IsNotEmpty, IsString, Matches, MinLength} from 'class-validator';

export class AuthCredentialDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message : 'password weak'},
    )
    password: string;
}

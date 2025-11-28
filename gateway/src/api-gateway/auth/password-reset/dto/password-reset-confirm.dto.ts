import { IsString, MinLength, Matches } from 'class-validator';
export class PasswordResetConfirmDto {
  @IsString() token!: string;
 
  @MinLength(12)
  @Matches(/[a-z]/, { message: 'Must contain a lowercase letter' })
  @Matches(/[A-Z]/, { message: 'Must contain an uppercase letter' })
  @Matches(/\d/, { message: 'Must contain a digit' })
  @Matches(/\W/, { message: 'Must contain a special character' })
  newPassword!: string;
}
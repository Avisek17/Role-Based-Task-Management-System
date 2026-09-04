import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateTaskDto{
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(100)
    title?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @MinLength(3)
    @MaxLength(500)
    description?: string
}
import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsNumber, IsString } from "class-validator";

export class ClaimIdDto {
    @IsString()
    @IsEthereumAddress()
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    userAddress: string;
    @IsNumber()
    @ApiProperty({type: Number, example: 0})
    claimTopic: number;
}
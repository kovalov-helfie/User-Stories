import { ApiProperty } from "@nestjs/swagger";
import { IsEthereumAddress, IsNumber, IsString } from "class-validator";

export class DeleteObligationDto {
    @IsString()
    @IsEthereumAddress()
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    userAddress: string;
    @IsString()
    @IsEthereumAddress()
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    tokenAddress: string;
    @IsNumber()
    @ApiProperty({type: Number, example: 0})
    obligationId: number;
    @IsString()
    @ApiProperty({type: String, example: "0x21fbf0696d5e0aa2ef41a2b4ffb623bcaf070461d61cf7251c74161f82fec3a4370854bc0a34b3ab487c1bc021cd318c734c51ae29374f2beb0e6f2dd49b4bf41c"})
    signature: string;
}
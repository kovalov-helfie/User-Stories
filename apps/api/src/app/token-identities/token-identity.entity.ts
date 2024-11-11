import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Asset } from "../assets/asset.entity";

@Table
export class TokenIdentity extends Model<TokenIdentity> {
    @PrimaryKey
    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    identityAddress: string;
    @Column({type: DataType.STRING, allowNull: true})
    @ApiProperty({type: String, example: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"})
    initialOwnerAddress: string;
    @HasMany(() => Asset)
    assets: Asset[];
}
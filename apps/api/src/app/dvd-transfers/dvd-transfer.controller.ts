
import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UnauthorizedException } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";
import { SignatureService } from "../signatures/signature.service";
import { ApiService } from "../api/api.service";
import { DvdTransfer } from "./dvd-transfer.entity";
import { CreateDvdTransferDto } from "./dto/create-dvd-transfer.dto";
import { UpdateDvdTransferDto } from "./dto/update-dvd-transfer.dto";
import { ExecuteStatus } from "../types";

@ApiTags('DvdTransfers')
@Controller('/dvd-transfers')
export class DvdTransferController {
    constructor(
        private readonly apiService: ApiService,
        private readonly signatureService: SignatureService) {
    }

    @Get('/')
    @ApiResponse({status: 200, description: 'all dvd transfers', type: [DvdTransfer]})
    @ApiOperation({summary: "retrieve all dvd transfers"})
    @ApiQuery({name: 'withObligations', required: true, description: 'dvd transfers with obligations', type: Boolean, example: true})
    async getAllDvdTransfers(@Query('withObligations') withObligations: string) {
        return await this.apiService.findAllDvdTransfers({withObligations: withObligations === 'true'});
    }

    @Get('/:tokenAddress')
    @ApiResponse({status: 200, description: 'asset dvd transfers', type: [DvdTransfer]})
    @ApiOperation({summary: "retrieve all asset dvd transfers"})
    @ApiParam({name: 'tokenAddress', required: true, description: 'eth token address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    async getDvdTransfersByToken(@Param('tokenAddress') tokenAddress: string) {
        return await this.apiService.findDvdTransfersByToken({tokenAddress: tokenAddress});
    }

    @Get('/:userAddress')
    @ApiResponse({status: 200, description: 'user dvd transfers', type: [DvdTransfer]})
    @ApiOperation({summary: "retrieve all user dvd transfers"})
    @ApiParam({name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    async getDvdTransfersByBuyer(@Param('userAddress') userAddress: string) {
        return await this.apiService.findDvdTransfersByUser({userAddress: userAddress});
    }

    @Get('/user/:userAddress-:sellerToken')
    @ApiResponse({status: 200, description: 'buyer dvd transfers', type: [DvdTransfer]})
    @ApiOperation({summary: "retrieve all buyer dvd transfers"})
    @ApiParam({name: 'userAddress', required: true, description: 'eth user address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    @ApiParam({name: 'sellerToken', required: true, description: 'eth seller token address', type: String, example: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'})
    async getDvdTransfersByBuyerAndToken(@Param('userAddress') userAddress: string, @Param('sellerToken') sellerToken: string) {
        return await this.apiService.findDvdTransfersByUserAndSellerToken({userAddress: userAddress, sellerToken: sellerToken});
    }

    @Get('dvd-transfer/:dvdTransferId')
    @ApiResponse({status: 200, description: 'get dvd transfer', type: DvdTransfer})
    @ApiOperation({summary: "retrieve dvd transfer by dvd transfer id"})
    @ApiParam({name: 'dvdTransferId', required: true, description: 'dvd transfer id', type: Number, example: 0})
    async getDvdTransferById(@Param('dvdTransferId') dvdTransferId: string) {
        return await this.apiService.findDvdTransferById({dvdTransferId: Number(dvdTransferId)});
    }

    @Post('/add-dvd-transfer')
    @ApiResponse({status: 201, description: 'add dvd transfer', type: DvdTransfer})
    @ApiOperation({summary: "add dvd transfer"})
    async addDvdTransfer(@Body() dto: CreateDvdTransferDto) {
        if(!(await this.signatureService.verifySignature('addDvdTransfer', dto.signature, dto.buyer))) {
            throw new UnauthorizedException(`User [${dto.buyer}] not authorized`)
        } else if(!(await this.apiService.isUserExists({userAddress: dto.buyer}))) {
            throw new BadRequestException(`User [${dto.buyer}] does not exist`)
        } else if(!(await this.apiService.isUserVerified({userAddress: dto.buyer}))) {
            throw new BadRequestException(`User [${dto.buyer}] is not verified`)
        } else if(!(await this.apiService.isUserVerified({userAddress: dto.seller}))) {
            throw new BadRequestException(`Seller [${dto.seller}] is not verified`)
        } else if(!(await this.apiService.isAssetExists({tokenAddress: dto.sellerToken}))) {
            throw new BadRequestException(`Seller token [${dto.seller}] is not verified`)
        } else if(!(await this.apiService.isObligationExistsOnSeller({seller: dto.seller, tokenAddress: dto.sellerToken}))) {
            throw new BadRequestException(`Seller [${dto.seller}] does not exist`)
        } else if(!(await this.apiService.isObligationExists({obligationId: dto.obligationId}))) {
            throw new BadRequestException(`Obligation [${dto.obligationId}] does not exist`)
        }
        return await this.apiService.createDvdTransfer({
            obligationId: dto.obligationId,
            nonce: dto.nonce,
            buyer: dto.buyer,
            buyerToken: dto.buyerToken,
            buyerAmount: dto.buyerAmount,
            seller: dto.seller,
            sellerToken: dto.sellerToken,
            sellerAmount: dto.sellerAmount,
            transferId: dto.transferId
        });
    }

    @Patch('/update-dvd-transfer')
    @ApiResponse({status: 200, description: 'update dvd transfer', type: DvdTransfer})
    @ApiOperation({summary: "update dvd transfer by dvdTransferId"})
    async updateDvdTransfer(@Body() dto: UpdateDvdTransferDto) {
        if(!(await this.signatureService.verifySignature('updateDvdTransfer', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(!(await this.apiService.isUserExists({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(!(await this.apiService.isUserVerified({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] is not verified`)
        } else if(!(await this.apiService.isDvdTransferExists({dvdTransferId: dto.dvdTransferId}))) {
            throw new BadRequestException(`DvdTransfer [${dto.dvdTransferId}] does not exist`)
        } else if(!(await this.apiService.isDvdTransferSeller({dvdTransferId: dto.dvdTransferId, seller: dto.userAddress}))) {
            throw new BadRequestException(`Not Asset DvdTransfer [${dto.dvdTransferId}] owner [${dto.userAddress}]`)            
        }

        const status = dto.verify ? ExecuteStatus.EXECUTED : ExecuteStatus.CANCELED;
        return await this.apiService.updateDvdTransfer({
            dvdTransferId: dto.dvdTransferId,
            status: status
        });
    }
}
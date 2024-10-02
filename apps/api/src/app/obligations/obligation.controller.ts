
import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UnauthorizedException } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";
import { SignatureService } from "../signatures/signature.service";
import { ApiService } from "../api/api.service";
import { Obligation } from "./obligation.entity";
import { CreateObligationDto } from "./dto/create-obligation.dto";
import { UpdateObligationDto } from "./dto/update-obligation.dto";
import { BuyObligationDto } from "./dto/buy-obligation.dto";
import { DeleteObligationDto } from "./dto/delete-obligation.dto";

@ApiTags('Obligations')
@Controller('/obligations')
export class ObligationController {
    constructor(
        private readonly apiService: ApiService,
        private readonly signatureService: SignatureService) {
    }

    @Get('/')
    @ApiResponse({status: 200, description: 'all obligations', type: [Obligation]})
    @ApiOperation({summary: "retrieve all obligations"})
    @ApiQuery({name: 'withAssets', required: true, description: 'obligations with assets', type: Boolean, example: true})
    @ApiQuery({name: 'isNotExecuted', required: false, description: 'only is not executed obligations', type: Boolean, example: false})
    async getObligations(@Query('withAssets') withAssets: string, @Query('isNotExecuted') isNotExecuted: string | null) {
        const isNotExec = isNotExecuted !== null ? isNotExecuted === 'false' : null;
        return await this.apiService.findAllObligations({withAssets: withAssets === 'true', isNotExecuted: isNotExec});
    }

    @Get('/:assetId')
    @ApiResponse({status: 200, description: 'asset obligations', type: Obligation})
    @ApiOperation({summary: "retrieve all asset obligations"})
    @ApiParam({name: 'assetId', required: true, description: 'asset id', type: Number, example: 0})
    async getObligationByAsset(@Param('assetId') assetId: string) {
        return await this.apiService.findObligationByAsset({assetId: Number(assetId)});
    }

    @Get('obligation/:obligationId')
    @ApiResponse({status: 200, description: 'get obligation', type: Obligation})
    @ApiOperation({summary: "retrieve obligation by obligation id"})
    @ApiParam({name: 'obligationId', required: true, description: 'obligation id', type: Number, example: 0})
    async getObligationById(@Param('obligationId') obligationId: string) {
        return await this.apiService.findObligationById({obligationId: Number(obligationId)});
    }

    @Get('obligation/unlock-date/:obligationId')
    @ApiResponse({status: 200, description: 'get obligation', type: Obligation})
    @ApiOperation({summary: "retrieve obligation by obligation id"})
    @ApiParam({name: 'obligationId', required: true, description: 'obligation id', type: Number, example: 0})
    async getObligationUnlockDate(@Param('obligationId') obligationId: string) {
        return await this.apiService.getObligationUnlockDate({obligationId: Number(obligationId)});
    }

    @Post('/add-obligation')
    @ApiResponse({status: 201, description: 'add asset obligation', type: Obligation})
    @ApiOperation({summary: "add asset obligation"})
    async createObligation(@Body() dto: CreateObligationDto) {
        if(!(await this.signatureService.verifySignature('addObligation', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(!(await this.apiService.isUserExists({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(!(await this.apiService.isUserVerified({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] is not verified`)
        } else if(!(await this.apiService.isUserVerified({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] is not verified`)
        }
        return await this.apiService.createObligation({
            assetId: dto.assetId, 
            userAddress: dto.userAddress, 
            minPurchaseAmount: dto.minPurchaseAmount,
            lockupPeriod: dto.lockupPeriod,
            transferRestrictionAddress: dto.transferRestrictionAddress
        });
    }


    @Patch('obligation/update-obligation')
    @ApiResponse({status: 200, description: 'update obligation', type: Obligation})
    @ApiOperation({summary: "update obligation by obligationId"})
    async updateObligation(@Body() dto: UpdateObligationDto) {
        if(!(await this.signatureService.verifySignature('updateObligation', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(!(await this.apiService.isUserExists({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(!(await this.apiService.isAssetExists({assetId: dto.assetId}))) {
            throw new BadRequestException(`Asset [${dto.assetId}] does not exist`)
        } else if(!(await this.apiService.isUserVerified({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] is not verified`)
        } else if(!(await this.apiService.isObligationExists({obligationId: dto.obligationId}))) {
            throw new BadRequestException(`Obligation [${dto.obligationId}] does not exist`)
        } 
        if(!(await this.apiService.isObligationExecuted({obligationId: dto.obligationId}))) {
            if(!(await this.apiService.isObligationOwner({obligationId: dto.obligationId, userAddress: dto.userAddress}))) {
                throw new BadRequestException(`Not Asset Obligation [${dto.obligationId}] owner [${dto.userAddress}]`)
            }
        } else {
            if(!(await this.apiService.isObligationOwner({obligationId: dto.obligationId, userAddress: dto.userAddress}))) {
                throw new BadRequestException(`Not Asset Obligation [${dto.obligationId}] owner [${dto.userAddress}]`)
            } else if(!(await this.apiService.isAvailableToUpdateObligation({obligationId: dto.obligationId, userAddress: dto.userAddress}))) {
                const obligation = await this.apiService.findObligationById({obligationId: dto.obligationId})
                const date = obligation.createdAt 
                date.setSeconds(date.getSeconds() + obligation.lockupPeriod)
                throw new BadRequestException(`Obligation [${dto.obligationId}] is locked till ${date}`)
            }
        }
        return await this.apiService.updateObligation({
            obligationId: dto.obligationId,
            userAddress: dto.userAddress,
            lockupPeriod: dto.lockupPeriod,
            minPurchaseAmount: dto.minPurchaseAmount, 
            transferRestrictionAddress: dto.transferRestrictionAddress,
        });
    }

    @Patch('obligation/buy-obligation')
    @ApiResponse({status: 200, description: 'buy obligation', type: Obligation})
    @ApiOperation({summary: "buy obligation by obligationId"})
    async buyObligation(@Body() dto: BuyObligationDto) {
        if(!(await this.signatureService.verifySignature('buyObligation', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(!(await this.apiService.isUserExists({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(!(await this.apiService.isAssetExists({assetId: dto.assetId}))) {
            throw new BadRequestException(`Asset [${dto.assetId}] does not exist`)
        } else if(!(await this.apiService.isUserVerified({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] is not verified`)
        } else if(!(await this.apiService.isObligationExists({obligationId: dto.obligationId}))) {
            throw new BadRequestException(`Obligation [${dto.obligationId}] does not exist`)
        }  
        if((await this.apiService.isObligationExecuted({obligationId: dto.obligationId}))) {
            throw new BadRequestException(`Obligation [${dto.obligationId}] is already executed`)
        } else {
            if((await this.apiService.isObligationOwner({obligationId: dto.obligationId, userAddress: dto.userAddress}))) {
                throw new BadRequestException(`Obligation [${dto.obligationId}] self-buy by user [${dto.userAddress}]`)
            } else if((await this.apiService.isObligationRestrictedAddress({userAddress: dto.userAddress, obligationId: dto.obligationId}))) {
                throw new BadRequestException(`Obligation [${dto.obligationId}] transfer is forbidden for ${dto.userAddress}`)
            }
        } 

        return await this.apiService.executeObligation({
            obligationId: dto.obligationId,
            isExecuted: true,
        });
    }

    @Delete('obligation/delete-obligation')
    @ApiResponse({status: 200, description: 'delete obligation', type: Obligation})
    @ApiOperation({summary: "delete obligation by obligationId"})
    async deleteObligation(@Body() dto: DeleteObligationDto) {
        if(!(await this.signatureService.verifySignature('deleteObligation', dto.signature, dto.userAddress))) {
            throw new UnauthorizedException(`User [${dto.userAddress}] not authorized`)
        } else if(!(await this.apiService.isUserExists({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] does not exist`)
        } else if(!(await this.apiService.isAssetExists({assetId: dto.assetId}))) {
            throw new BadRequestException(`Asset [${dto.assetId}] does not exist`)
        } else if(!(await this.apiService.isUserVerified({userAddress: dto.userAddress}))) {
            throw new BadRequestException(`User [${dto.userAddress}] is not verified`)
        } else if(!(await this.apiService.isObligationExists({obligationId: dto.obligationId}))) {
            throw new BadRequestException(`Obligation [${dto.obligationId}] does not exist`)
        } 
        if(!(await this.apiService.isObligationExecuted({obligationId: dto.obligationId}))) {
            if(!(await this.apiService.isObligationOwner({obligationId: dto.obligationId, userAddress: dto.userAddress}))) {
                throw new BadRequestException(`Not Asset Obligation [${dto.obligationId}] owner [${dto.userAddress}]`)
            }
        } else {
            if((await this.apiService.isObligationOwner({obligationId: dto.obligationId, userAddress: dto.userAddress}))) {
                throw new BadRequestException(`Not Asset Obligation [${dto.obligationId}] owner [${dto.userAddress}]`)
            } else if(!(await this.apiService.isAvailableToUpdateObligation({obligationId: dto.obligationId, userAddress: dto.userAddress}))) {
                const obligation = await this.apiService.findObligationById({obligationId: dto.obligationId})
                const date = obligation.createdAt 
                date.setSeconds(date.getSeconds() + obligation.lockupPeriod)
                throw new BadRequestException(`Obligation [${dto.obligationId}] is locked till ${date}`)
            }
        }
        return await this.apiService.deleteObligation({
            obligationId: dto.obligationId,
        });
    }
}
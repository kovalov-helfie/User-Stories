import { DVD_TRANSFER_REPOSITORY } from "../constants";
import { DvdTransfer } from "./dvd-transfer.entity";

export const dvdTransfersProviders = [{
    provide: DVD_TRANSFER_REPOSITORY,
    useValue: DvdTransfer
}]
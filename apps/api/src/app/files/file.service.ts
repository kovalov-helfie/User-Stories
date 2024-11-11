import { Injectable } from "@nestjs/common";
import { Express } from 'express';
import { Multer } from 'multer';
import fs from 'node:fs/promises'
import path from 'node:path'
import { keccak256 } from "viem";

export type KeccakFile = {
    filename: string;
    data: string;
}

@Injectable()
export class FileService {
    // TODO: aws S3
    async saveFile(file: Express.Multer.File, fileName: string): Promise<KeccakFile> {
        const root = process.cwd()
        const fileExt = file.originalname?.split('.').at(-1) ?? ".jpg"
        const fileN = `${fileName}.${fileExt}`
        await fs.writeFile(path.join(root, 'static', fileN), file.buffer)
        return { filename: fileN, data: keccak256(file.buffer) }
    }
}
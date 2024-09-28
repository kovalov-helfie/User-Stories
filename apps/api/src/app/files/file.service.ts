import { Injectable } from "@nestjs/common";
import { Express } from 'express';
import { Multer } from 'multer';
import fs from 'node:fs/promises'
import path from 'node:path'

@Injectable()
export class FileService {
    // TODO: aws S3
    async saveFile(file: Express.Multer.File, fileName: string) {
        const root = process.cwd()
        const fileExt = file.originalname?.split('.').at(-1) ?? ".jpg"
        const fileN = `${fileName}.${fileExt}`
        await fs.writeFile(path.join(root, 'static', fileN), file.buffer)
        return fileN
    }
}
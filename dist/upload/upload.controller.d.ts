import { CloudinaryService } from './cloudinary.service';
export declare class UploadController {
    private readonly cloudinary;
    constructor(cloudinary: CloudinaryService);
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
        publicId: string;
    }>;
}

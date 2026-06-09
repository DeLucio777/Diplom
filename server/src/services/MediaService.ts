import MediaRepository from '../repositories/MediaRepository';
import MediaCatalog from '../entities/mediaCatalog';
import fs from 'fs';
import path from 'path';
class MediaService {
    private mediaRepo: MediaRepository;

    constructor() {
        this.mediaRepo = new MediaRepository();
    }

    async getAll(): Promise<MediaCatalog[]> {
        return await this.mediaRepo.getAll();
    }

    async getById(id: number): Promise<MediaCatalog | null> {
        return await this.mediaRepo.getById(id);
    }

    async saveFile(file: Express.Multer.File, description: string): Promise<MediaCatalog> {
        const uploadDir = path.join(process.cwd(), 'uploads', 'media');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filename = Date.now() + '-' + file.originalname;
        const filepath = path.join(uploadDir, filename);

        fs.writeFileSync(filepath, file.buffer);

        const media: MediaCatalog = {
            PK_MediaId: Date.now(),              // или ID из БД
            FileType: file.mimetype,
            FilePath: `/uploads/media/${filename}`,
            Descripti: description,
            UploadDate: new Date()
        };

        await this.mediaRepo.create(media);

        return media;
    }

}

export default MediaService;

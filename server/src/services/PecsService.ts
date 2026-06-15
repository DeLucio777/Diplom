import PECSRepository from '../repositories/PECSRepository';
import CatalogPECS from '../entities/catalogPECS';
import fs from 'fs';
import path from 'path';

class PecsService {
    private pecsRepo: PECSRepository;

    constructor() {
        this.pecsRepo = new PECSRepository();
    }

    async getAll(): Promise<CatalogPECS[]> {
        return await this.pecsRepo.getAll();
    }

    async getById(id: number): Promise<CatalogPECS | null> {
        return await this.pecsRepo.getById(id);
    }

    async saveFile(file: any, description: string, category: string): Promise<CatalogPECS> {
        const uploadDir = path.join(process.cwd(), 'uploads', 'pecs');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filename = Date.now() + '-' + file.originalname;
        const filepath = path.join(uploadDir, filename);

        fs.writeFileSync(filepath, file.buffer);

        const pecs: CatalogPECS = {
            PK_PECSid: 0,
            filePath: `/uploads/pecs/${filename}`,
            Descripti: description,
            Category: category,
            UploadDate: new Date()
        };

        const pecsId = await this.pecsRepo.create(pecs);
        pecs.PK_PECSid = pecsId;

        return pecs;
    }
}

export default PecsService;

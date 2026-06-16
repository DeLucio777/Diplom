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

    async update(id: number, pecs: CatalogPECS): Promise<boolean> {
        return await this.pecsRepo.update(id, pecs);
    }

    async delete(id: number): Promise<boolean> {
        const pecs = await this.pecsRepo.getById(id);
        const deleted = await this.pecsRepo.delete(id);

        if (deleted && pecs?.filePath) {
            this.deletePhysicalFile(pecs.filePath);
        }

        return deleted;
    }

    private deletePhysicalFile(filePath: string): void {
        try {
            const normalizedPath = filePath.replace(/^\/+/, '');
            const absolutePath = path.join(process.cwd(), normalizedPath);

            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }
        } catch (error) {
            console.error('Error deleting PECS file:', error);
        }
    }
}

export default PecsService;

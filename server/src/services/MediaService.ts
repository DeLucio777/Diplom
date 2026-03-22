import MediaRepository from '../repositories/MediaRepository';
import MediaCatalog from '../entities/mediaCatalog';

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
}

export default MediaService;

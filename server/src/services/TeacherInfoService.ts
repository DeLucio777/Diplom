import TeacherInfoRepository from '../repositories/TeacherInfoRepository';
import TeacherInfo from '../entities/teacherInfo';

class TeacherInfoService {
    private teacherInfoRepo: TeacherInfoRepository;

    constructor() {
        this.teacherInfoRepo = new TeacherInfoRepository();
    }

    async getAll(): Promise<TeacherInfo[]> {
        return await this.teacherInfoRepo.getAll();
    }

    async getByUserId(userId: number): Promise<TeacherInfo | null> {
        return await this.teacherInfoRepo.getByUserId(userId);
    }

    async save(userId: number, data: Partial<TeacherInfo>): Promise<TeacherInfo | null> {
        return await this.teacherInfoRepo.save(userId, data);
    }
}

export default TeacherInfoService;

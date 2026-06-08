import UserInfoRepository from '../repositories/UserInfoRepository';
import UserInfo from '../entities/userInfo';

class UserInfoService {
    private userInfoRepo: UserInfoRepository;

    constructor() {
        this.userInfoRepo = new UserInfoRepository();
    }

    async getByUser(userId: number): Promise<UserInfo | null> {
        return await this.userInfoRepo.getByUser(userId);
    }

    async save(userId: number, data: Partial<UserInfo>): Promise<UserInfo | null> {
        return await this.userInfoRepo.save(userId, data);
    }
}

export default UserInfoService;
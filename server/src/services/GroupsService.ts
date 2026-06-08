import GroupsRepository from '../repositories/GroupsRepository';
import Group from '../entities/group';
import Child from '../entities/child';

class GroupsService {
    private groupsRepo: GroupsRepository;

    constructor() {
        this.groupsRepo = new GroupsRepository();
    }

    async getAll(): Promise<Group[]> {
        return await this.groupsRepo.getAll();
    }

    async getByEducator(educatorId: number): Promise<Group[]> {
        return await this.groupsRepo.getByEducator(educatorId);
    }

    async getMembers(groupId: number): Promise<Child[]> {
        return await this.groupsRepo.getMembers(groupId);
    }

    async create(group: Group): Promise<Group | null> {
        return await this.groupsRepo.create(group);
    }

    async delete(id: number): Promise<void> {
        return await this.groupsRepo.delete(id);
    }

    async addMember(groupId: number, childId: number): Promise<void> {
        return await this.groupsRepo.addMember(groupId, childId);
    }

    async removeMember(groupId: number, childId: number): Promise<void> {
        return await this.groupsRepo.removeMember(groupId, childId);
    }
}

export default GroupsService;
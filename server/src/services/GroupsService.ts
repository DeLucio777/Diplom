import GroupsRepository from '../repositories/GroupsRepository';
import Group from '../entities/group';
import ChildGroupMember from '../entities/childrentToGroups';

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

    async getMembers(groupId: number): Promise<ChildGroupMember[]> {
        return await this.groupsRepo.getMembers(groupId);
    }

    async create(group: Group): Promise<Group | null> {
        return await this.groupsRepo.create(group);
    }

    async delete(id: number): Promise<boolean> {
        return await this.groupsRepo.delete(id);
    }

    async addMember(groupId: number, childId: number): Promise<ChildGroupMember | null> {
        return await this.groupsRepo.addMember(groupId, childId);
    }

    async removeMember(groupId: number, childId: number): Promise<boolean> {
        return await this.groupsRepo.removeMember(groupId, childId);
    }
}

export default GroupsService;
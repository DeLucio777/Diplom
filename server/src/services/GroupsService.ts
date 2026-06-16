import GroupsRepository from '../repositories/GroupsRepository';
import Group from '../entities/group';
import Child from '../entities/child';
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

    async getMembers(groupId: number): Promise<Child[]> {
        return await this.groupsRepo.getMembers(groupId);
    }

    async getAllMembers(): Promise<ChildGroupMember[]> {
        return await this.groupsRepo.getAllMembers();
    }

    async create(group: Group): Promise<Group | null> {
        return await this.groupsRepo.create(group);
    }

    async delete(id: number): Promise<boolean> {
        return await this.groupsRepo.delete(id);
    }
    async update(group: Group): Promise<boolean> {
        console.log(group);
        return await this.groupsRepo.update(group);
    }
    async addMember(groupId: number, userId: number): Promise<ChildGroupMember | null> {
        return await this.groupsRepo.addMember(groupId, userId);
    }

    async removeMember(groupId: number, userId: number): Promise<boolean> {
        return await this.groupsRepo.removeMember(groupId, userId);
    }

    async removeMemberById(memberId: number): Promise<boolean> {
        return await this.groupsRepo.removeMemberById(memberId);
    }
}

export default GroupsService;
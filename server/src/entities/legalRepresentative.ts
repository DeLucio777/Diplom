export default class LegalRepresentative {
    PK_RepresentativeId: number;
    FK_UserId: number;
    FullName: string;
    RelationType?: string;
    Phone?: string;
    Email?: string;
}
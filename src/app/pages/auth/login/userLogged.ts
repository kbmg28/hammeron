export interface UserLogged {
    name: string;
    email: string;
    permissions: Set<string>;
    spaceId: string;
    spaceName: string;
}

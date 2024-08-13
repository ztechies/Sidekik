type Role = 'user' | 'admin' | 'client';

interface RoleRights {
  client: string[];
  user: string[];
  admin: string[];
}

const allRoles: RoleRights = {
  client: [],
  user: [],
  admin: ['getUsers', 'manageUsers'],
};

const roles: Role[] = Object.keys(allRoles) as Role[];
const roleRights = new Map<Role, string[]>(Object.entries(allRoles) as [Role, string[]][]);

export { roles, roleRights };
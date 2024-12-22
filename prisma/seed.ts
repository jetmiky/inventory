import type { Prisma } from '@prisma/client';
import prisma from '@/prisma/client';

const roles: Prisma.RoleCreateInput[] = [
    {
        usid: 'administrator',
        name: 'Administrator',
        description: 'Role that can manage users and roles',
    },
    {
        usid: 'manager-inventory',
        name: 'Manager Inventory',
        description: 'Role that can manage inventories',
    },
    {
        usid: 'staff-inventory',
        name: 'Staff Inventory',
        description: 'Role that can operates with inventories',
    },
];

const users: Prisma.UserCreateInput[] = [
    {
        name: 'Administrator',
        email: 'admin@smb.id',
        phone: '+628123456789',
        address: 'Admin',
        password: 'password',
        roles: {
            connect: { usid: 'administrator' },
        },
    },
];

async function main() {
    for (const role of roles) {
        await prisma.role.create({ data: role });
    }

    for (const user of users) {
        await prisma.user.create({ data: user });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

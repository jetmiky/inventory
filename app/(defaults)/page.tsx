import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { config } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getDefaultRouteOf } from '@/middleware';

export const metadata: Metadata = {
    title: 'Dashboard',
};

const DashboardPage = async () => {
    const session = await getServerSession(config);

    if (session) {
        const route = getDefaultRouteOf(session.user.roles[0]);
        redirect(route);
    }

    return;
};

export default DashboardPage;

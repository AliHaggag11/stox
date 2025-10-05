'use server';

import { createClient } from '@/lib/supabase/server';

export const getAllUsersForNewsEmail = async () => {
    try {
        const supabase = createClient();

        const { data: users, error } = await supabase
            .from('users')
            .select('id, email, name, country')
            .not('email', 'is', null);

        if (error) {
            console.error('Error fetching users:', error);
            return [];
        }

        return users?.filter(user => user.email && user.name).map(user => ({
            id: user.id,
            email: user.email,
            name: user.name
        })) || [];
    } catch (e) {
        console.error('Error fetching users for news email:', e);
        return [];
    }
}

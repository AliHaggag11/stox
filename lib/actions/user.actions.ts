'use server';

import { createServiceClient } from '@/lib/supabase/service-client';

export const getAllUsersForNewsEmail = async () => {
    try {
        const supabase = createServiceClient();
        console.log('Supabase client created successfully');

        // Try without the email filter first to see if it's a query issue
        const { data: allUsers, error: allError } = await supabase
            .from('users')
            .select('*');
            
        console.log('All users query result:', { allUsers, allError });
        
        // Now try with the original query
        const { data: users, error } = await supabase
            .from('users')
            .select('id, email, name, country')
            .not('email', 'is', null);

        console.log('Raw users query result:', { users, error });

        if (error) {
            console.error('Error fetching users:', error);
            return [];
        }

        console.log('Users before filtering:', users);
        
        const filteredUsers = users?.filter(user => user.email && user.name).map(user => ({
            id: user.id,
            email: user.email,
            name: user.name
        })) || [];
        
        console.log('Filtered users for news email:', filteredUsers);
        
        return filteredUsers;
    } catch (e) {
        console.error('Error fetching users for news email:', e);
        return [];
    }
}

'use server';

import { createClient } from '@/lib/supabase/server';
import { inngest } from "@/lib/inngest/client";

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
    try {
        const supabase = createClient();
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: fullName
                }
            }
        });

        if (error) {
            return { success: false, error: error.message };
        }

        if (data.user) {
            // Create user profile in our users table
            const { error: insertError } = await supabase.from('users').insert({
                id: data.user.id,
                email: data.user.email!,
                name: fullName,
                country
            });

            if (insertError) {
                console.error('Error creating user profile:', insertError);
            }

            await inngest.send({
                name: 'app/user.created',
                data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry }
            });
        }

        return { success: true, data };
    } catch (e) {
        console.log('Sign up failed', e);
        return { success: false, error: 'Sign up failed' };
    }
}

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
    try {
        const supabase = createClient();
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (e) {
        console.log('Sign in failed', e);
        return { success: false, error: 'Sign in failed' };
    }
}

export const signOut = async () => {
    try {
        const supabase = createClient();
        await supabase.auth.signOut();
        return { success: true };
    } catch (e) {
        console.log('Sign out failed', e);
        return { success: false, error: 'Sign out failed' };
    }
}

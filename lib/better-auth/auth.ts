import { createClient } from '@/lib/supabase/server'

export const getAuth = async () => {
    return {
        api: {
            getSession: async ({ headers }: { headers: any }) => {
                try {
                    // Create client within request scope
                    const supabase = createClient()
                    
                    const { data: { session }, error } = await supabase.auth.getSession()
                    
                    if (error) {
                        console.error('Auth session error:', error)
                        return null
                    }
                    
                    if (!session?.user) {
                        return null
                    }
                    
                    // Get additional user data from our users table
                    const { data: userData } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', session.user.id)
                        .single()
                    
                    return {
                        user: {
                            id: session.user.id,
                            email: session.user.email || userData?.email,
                            name: userData?.name || session.user.user_metadata?.name,
                            ...userData
                        },
                        session
                    }
                } catch (error) {
                    console.error('Auth error:', error)
                    return null
                }
            }
        },
        signIn: async (email: string, password: string) => {
            const supabase = createClient()
            return supabase.auth.signInWithPassword({ email, password })
        },
        signUp: async (email: string, password: string, options?: { name?: string }) => {
            const supabase = createClient()
            return supabase.auth.signUp({ 
                email, 
                password,
                options: {
                    data: {
                        name: options?.name
                    }
                }
            })
        },
        signOut: async () => {
            const supabase = createClient()
            return supabase.auth.signOut()
        }
    }
}

export const auth = getAuth()

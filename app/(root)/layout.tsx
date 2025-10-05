import Header from "@/components/Header";
import GlobalSearchProvider from "@/components/GlobalSearchProvider";
import { createClient } from "@/lib/supabase/server-client";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children : React.ReactNode }) => {
    const supabase = await createClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (!user || error) {
        redirect('/sign-in');
    }

    // Get user data from our database
    const { data: userData } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

    const userInfo = {
        id: user.id,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatar_url: userData?.avatar_url || null,
    }

    return (
        <main className="min-h-screen text-gray-400">
            <GlobalSearchProvider />
            <Header user={userInfo} />

            <div className="container py-10">
                {children}
            </div>
        </main>
    )
}
export default Layout

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server-client";
import UserProfile from "@/components/UserProfile";

export default async function ProfilePage() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (!user || error) {
    redirect('/sign-in');
  }

  // Fetch user data from our database to get avatar_url and other settings
  const { data: userData } = await supabase
    .from('users')
    .select('avatar_url, country')
    .eq('id', user.id)
    .single();

  const userInfo = {
    id: user.id,
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    country: userData?.country || null,
    avatar_url: userData?.avatar_url || null,
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 mb-2">Profile Settings</h1>
          <p className="text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <UserProfile user={userInfo} />
    </div>
  );
}

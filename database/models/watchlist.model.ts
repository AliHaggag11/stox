// Supabase Database Types
export interface WatchlistItem {
  id?: string;
  user_id: string;
  symbol: string;
  company: string;
  added_at: string; // ISO date string
  created_at?: string;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      watchlist: {
        Row: WatchlistItem;
        Insert: Omit<WatchlistItem, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<WatchlistItem, 'id' | 'created_at' | 'updated_at'>>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          country?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          country?: string;
        };
        Update: Partial<{
          email: string;
          name: string;
          country: string;
        }>;
      };
    };
  };
}

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, anon);

export interface FavoriteOutfit {
  id: string;
  outfit_name: string;
  outfit_state: any;
  thumbnail: string | null;
  created_at: string;
}

export interface DailyChallenge {
  id: string;
  challenge_date: string;
  theme: string;
  prompt: string;
  suggested_items: any;
}

export async function saveFavorite(name: string, state: any, thumbnail: string | null): Promise<FavoriteOutfit | null> {
  const { data, error } = await supabase
    .from('favorite_outfits')
    .insert({ outfit_name: name, outfit_state: state, thumbnail })
    .select()
    .single();
  if (error) {
    console.error('saveFavorite error', error);
    return null;
  }
  return data as FavoriteOutfit;
}

export async function listFavorites(): Promise<FavoriteOutfit[]> {
  const { data, error } = await supabase
    .from('favorite_outfits')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('listFavorites error', error);
    return [];
  }
  return (data || []) as FavoriteOutfit[];
}

export async function deleteFavorite(id: string): Promise<boolean> {
  const { error } = await supabase.from('favorite_outfits').delete().eq('id', id);
  if (error) {
    console.error('deleteFavorite error', error);
    return false;
  }
  return true;
}

export async function renameFavorite(id: string, name: string): Promise<boolean> {
  const { error } = await supabase.from('favorite_outfits').update({ outfit_name: name }).eq('id', id);
  if (error) {
    console.error('renameFavorite error', error);
    return false;
  }
  return true;
}

export async function getDailyChallenge(date: string): Promise<DailyChallenge | null> {
  const { data, error } = await supabase
    .from('daily_challenges')
    .select('*')
    .eq('challenge_date', date)
    .maybeSingle();
  if (error) {
    console.error('getDailyChallenge error', error);
    return null;
  }
  return data as DailyChallenge | null;
}

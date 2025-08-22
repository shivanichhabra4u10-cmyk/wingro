import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadFile(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from(process.env.REACT_APP_SUPABASE_BUCKET!)
    .upload(path, file, { upsert: true });
  if (error) throw error;
  return data;
}

export function getPublicUrl(path: string) {
  return supabase.storage
    .from(process.env.REACT_APP_SUPABASE_BUCKET!)
    .getPublicUrl(path).data.publicUrl;
}

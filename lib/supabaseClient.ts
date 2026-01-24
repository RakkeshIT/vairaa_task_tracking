import { createClient, SupabaseClient } from "@supabase/supabase-js";

const Supabase_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL!
const Supabase_ano_Key: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabaseClient: SupabaseClient = createClient(Supabase_URL, Supabase_ano_Key)
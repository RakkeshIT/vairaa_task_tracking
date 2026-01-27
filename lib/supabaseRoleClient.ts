import { createClient } from "@supabase/supabase-js";

const Supabase_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const Supabase_service_Key = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseRoleClient = createClient(Supabase_URL, Supabase_service_Key)
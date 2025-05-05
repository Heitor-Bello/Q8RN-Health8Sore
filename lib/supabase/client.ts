import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// Cria uma instância do cliente Supabase para uso no lado do cliente
export const createClient = () => {
  return createClientComponentClient<Database>()
}

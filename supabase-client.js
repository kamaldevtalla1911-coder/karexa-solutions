import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabaseUrl = "https://ivfnypmkjimozlaqmwpd.supabase.co";
const supabasePublishableKey = "sb_publishable_2NJg3yOk4pbzAOEf1kNFIg_wqyMFC-s";

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = exports.getSupabaseClient = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_js_1 = require("@/config/env.js");
let supabaseClientInstance = null;
const getSupabaseClient = () => {
    if (!supabaseClientInstance) {
        supabaseClientInstance = (0, supabase_js_1.createClient)(env_js_1.env.SUPABASE_URL, env_js_1.env.SUPABASE_SERVICE_ROLE_KEY, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });
    }
    return supabaseClientInstance;
};
exports.getSupabaseClient = getSupabaseClient;
exports.supabase = (0, exports.getSupabaseClient)();

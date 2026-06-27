import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { supabase } from '@/config/supabase.js';
import { SupabaseClient } from '@supabase/supabase-js';

declare module 'fastify' {
  interface FastifyInstance {
    supabase: SupabaseClient;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate('supabase', supabase);
});

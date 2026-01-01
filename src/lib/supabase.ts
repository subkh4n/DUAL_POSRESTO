import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy initialization to avoid build-time errors on Vercel
let supabaseInstance: SupabaseClient | null = null;

function initializeSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

// Create a proxy that lazily initializes and forwards all calls
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = initializeSupabase();

    if (!client) {
      // During build time, return safe stubs
      if (prop === "from") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return () => createChainableMock();
      }
      if (prop === "auth") {
        return createAuthMock();
      }
      return () =>
        Promise.resolve({
          data: null,
          error: new Error("Supabase not configured"),
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (client as any)[prop];
  },
});

// Chainable mock for database operations
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createChainableMock(): any {
  const errorResult = Promise.resolve({
    data: null,
    error: new Error("Supabase not configured"),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chainable: any = {};
  const methods = [
    "select",
    "insert",
    "update",
    "delete",
    "upsert",
    "order",
    "limit",
    "range",
    "single",
    "maybeSingle",
    "eq",
    "neq",
    "gt",
    "gte",
    "lt",
    "lte",
    "like",
    "ilike",
    "is",
    "in",
    "contains",
    "containedBy",
    "filter",
    "match",
    "not",
    "or",
    "and",
    "textSearch",
  ];

  methods.forEach((method) => {
    chainable[method] = () => chainable;
  });

  chainable.then = (resolve: (value: { data: null; error: Error }) => void) => {
    return errorResult.then(resolve);
  };

  return chainable;
}

// Mock for auth operations
function createAuthMock() {
  const errorResult = Promise.resolve({
    data: null,
    error: new Error("Supabase not configured"),
  });

  return {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithOAuth: () => errorResult,
    signInWithOtp: () => errorResult,
    signInWithPassword: () => errorResult,
    signUp: () => errorResult,
    signOut: () => errorResult,
    resetPasswordForEmail: () => errorResult,
    updateUser: () => errorResult,
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  };
}

// Export getSupabase for explicit null checks
export function getSupabase(): SupabaseClient | null {
  return initializeSupabase();
}

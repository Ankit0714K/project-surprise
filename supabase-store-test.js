
/* Project Surprise — Supabase connection test */
window.SurpriseDB = {
  async testConnection() {
    const client = window.supabaseClient;

    if (!client) {
      throw new Error("Supabase client initialize nahi hua.");
    }

    const {
      data: { session },
      error: sessionError
    } = await client.auth.getSession();

    if (sessionError) throw sessionError;

    if (!session) {
      throw new Error("Login session nahi mili.");
    }

    const { data, error } = await client
      .from("surprises")
      .select("id, title, status")
      .eq("owner_id", session.user.id)
      .limit(5);

    if (error) throw error;

    return {
      connected: true,
      userId: session.user.id,
      drafts: data
    };
  }
};

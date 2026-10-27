
/* Project Surprise — Supabase Draft Repository
   This version saves and reads private drafts only.
   It does not publish surprises or verify payments.
*/

(function () {
  "use strict";

  function getClient() {
    const client = window.supabaseClient;

    if (!client) {
      throw new Error(
        "Supabase client nahi mila. Pehle js/supabase.js load karo."
      );
    }

    return client;
  }

  async function getUser() {
    const client = getClient();

    // Reuse an existing session if one is already available.
    const { data: sessionData, error: sessionError } =
      await client.auth.getSession();

    if (sessionError) throw sessionError;
    if (sessionData.session?.user) return sessionData.session.user;

    // Create a guest account automatically when this visitor has no session.
    const { data, error } = await client.auth.signInAnonymously();

    if (error) {
      throw new Error(
        "Automatic guest sign-in failed: " + error.message +
        ". Supabase Dashboard mein Authentication settings ke andar Anonymous Sign-Ins enabled hone chahiye."
      );
    }

    if (!data.user) {
      throw new Error("Guest sign-in complete nahi hua. Page refresh karke dobara try karo.");
    }

    return data.user;
  }
  function createSlug() {
    return crypto.randomUUID();
  }

  function toContent(site) {
    return {
      to: site.to ?? "",
      from: site.from ?? "",
      eyebrow: site.eyebrow ?? "",
      message: site.message ?? "",
      date: site.date ?? "",
      dateLabel: site.dateLabel ?? "",
      surprise: site.surprise ?? "",
      accent: site.accent ?? "",
      templateId: site.templateId ?? "",
      photos: Array.isArray(site.photos) ? site.photos : [],
      password: site.password ?? "",
      views: Number(site.views ?? 0),
      createdAt: site.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  const Repository = {
    // Get all surprises owned by the current user.
    async listMyDrafts() {
      const client = getClient();
      const user = await getUser();

      const { data, error } = await client
        .from("surprises")
        .select(
          "id, public_slug, title, occasion, content, status, created_at, updated_at"
        )
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data || [];
    },

    // Save a new draft or update an existing draft.
    async saveDraft(site) {
      const client = getClient();
      const user = await getUser();

      const record = {
        owner_id: user.id,
        title: site.title || "Untitled surprise",
        occasion: site.occasion || "birthday",
        content: toContent(site),
        status: "draft",
        updated_at: new Date().toISOString()
      };

      let result;

      if (site.id) {
        // Update only a draft owned by the current user.
        result = await client
          .from("surprises")
          .update(record)
          .eq("id", site.id)
          .eq("owner_id", user.id)
          .eq("status", "draft")
          .select(
            "id, public_slug, title, occasion, content, status"
          )
          .maybeSingle();
      } else {
        // Let the database generate the row ID.
        record.public_slug = createSlug();

        result = await client
          .from("surprises")
          .insert(record)
          .select(
            "id, public_slug, title, occasion, content, status"
          )
          .single();
      }

      if (result.error) throw result.error;

      if (!result.data) {
        throw new Error(
          "Draft save nahi hua. Ho sakta hai draft exist na karta ho ya permission na ho."
        );
      }

      return result.data;
    },

    // Get one surprise owned by the current user.
    async getMyDraft(id) {
      const client = getClient();
      const user = await getUser();

      const { data, error } = await client
        .from("surprises")
        .select(
          "id, public_slug, title, occasion, content, status"
        )
        .eq("id", id)
        .eq("owner_id", user.id)
        .maybeSingle();

      if (error) throw error;

      return data;
    },

    // Delete only a draft owned by the current user.
    async deleteMyDraft(id) {
      const client = getClient();
      const user = await getUser();

      const { error } = await client
        .from("surprises")
        .delete()
        .eq("id", id)
        .eq("owner_id", user.id)
        .eq("status", "draft");

      if (error) throw error;

      return true;
    }
  };

  window.SurpriseRepository = Repository;
})();

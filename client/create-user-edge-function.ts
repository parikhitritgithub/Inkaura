import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const { name, email, password, phone, role } = await req.json();

    const supabase = createClient(
      Deno.env.get("PROJECT_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      return new Response(
        JSON.stringify({ error: authError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const user = authData.user;

    // 1. Insert into "users" table
    const { error: dbError } = await supabase
      .from("users")
      .insert({
        id: user.id,
        name,
        email,
        phone,
        role,
        is_active: true,
      });

    if (dbError) {
      return new Response(
        JSON.stringify({ error: dbError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 2. Insert into "employees" table to maintain foreign key integrity
    const { error: empError } = await supabase
      .from("employees")
      .insert({
        auth_user_id: user.id,
        full_name: name,
        email,
        phone,
        role,
        is_active: true,
      });

    if (empError) {
      // Depending on your preference, you could rollback the user creation here 
      // or just log it. For now we will return the error to the client.
      return new Response(
        JSON.stringify({ error: "Failed to create employee profile: " + empError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        userId: user.id,
        user: {
          id: user.id,
          email: user.email,
          name,
          phone,
          role,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

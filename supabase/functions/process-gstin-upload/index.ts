import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

Deno.serve(async (req: Request) => {
  try {
    const { upload_id } = await req.json();

    if (!upload_id) {
      return new Response(JSON.stringify({ error: "Missing upload_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Get upload details
    const { data: upload, error: uploadError } = await supabase
      .from("gstin_uploads")
      .select("*")
      .eq("id", upload_id)
      .single();

    if (uploadError || !upload) {
      throw new Error(`Upload not found: ${uploadError?.message}`);
    }

    // 2. Update status to processing
    await supabase
      .from("gstin_uploads")
      .update({ status: "processing" })
      .eq("id", upload_id);

    // 3. Download file
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("gstin-uploads")
      .download(upload.file_path);

    if (downloadError || !fileData) {
      throw new Error(`Failed to download file: ${downloadError?.message}`);
    }

    const text = await fileData.text();
    // Simple CSV parser for demo
    const lines = text.split("\n").filter((line: string) => line.trim() !== "");
    const gstinList = lines.slice(1).map((line: string) => line.split(",")[0].trim());

    await supabase
      .from("gstin_uploads")
      .update({ total_records: gstinList.length })
      .eq("id", upload_id);

    // 4. Mock Verification Loop
    let activeCount = 0;
    let cancelledCount = 0;
    let invalidCount = 0;

    for (const gstin of gstinList) {
      // Mock logic: 70% Active, 20% Cancelled, 10% Invalid
      const rand = Math.random();
      let status = "Active";
      if (rand > 0.7 && rand <= 0.9) status = "Cancelled";
      else if (rand > 0.9) status = "Invalid";

      if (status === "Active") activeCount++;
      else if (status === "Cancelled") cancelledCount++;
      else invalidCount++;

      await supabase.from("gstin_results").insert({
        upload_id: upload.id,
        user_id: upload.user_id,
        gstin: gstin,
        legal_name: `Company for ${gstin}`,
        trade_name: `Trade Name for ${gstin}`,
        status: status,
        state: "Uttar Pradesh",
        registration_date: "2017-07-01",
        taxpayer_type: "Regular",
        remarks: "Verified via mock API"
      });

      // Update progress
      await supabase
        .from("gstin_uploads")
        .update({ 
            processed_records: activeCount + cancelledCount + invalidCount,
            active_count: activeCount,
            cancelled_count: cancelledCount,
            invalid_count: invalidCount
        })
        .eq("id", upload_id);
    }

    // 5. Finalize status
    await supabase
      .from("gstin_uploads")
      .update({ 
        status: "completed",
        completed_at: new Date().toISOString()
      })
      .eq("id", upload_id);

    return new Response(JSON.stringify({ success: true, processed: gstinList.length }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

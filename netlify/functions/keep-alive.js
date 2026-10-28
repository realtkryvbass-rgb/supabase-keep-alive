export default async () => {
  const projects = [
    {
      name: "Комунальні платежі",
      url: "https://zmfzvdsogaezifqpuytc.supabase.co/rest/v1/addresses?select=id&limit=1",
      root: "https://zmfzvdsogaezifqpuytc.supabase.co/rest/v1/",
      key: process.env.SUPABASE_KEY_1
    },
    {
      name: "єЖурнал",
      url: "https://eykfoazvujjydsjgbmpb.supabase.co/rest/v1/jr_students?select=id&limit=1",
      root: "https://eykfoazvujjydsjgbmpb.supabase.co/rest/v1/",
      key: process.env.SUPABASE_KEY_2
    },
    {
      name: "Abonus",
      url: "https://poiyfpvfdvxdttzrfpjj.supabase.co/rest/v1/entries?select=id&limit=1",
      root: "https://poiyfpvfdvxdttzrfpjj.supabase.co/rest/v1/",
      key: process.env.SUPABASE_KEY_3
    },
    {
      name: "Доходи",
      url: "https://xzecdwhhrxuemanqvolh.supabase.co/rest/v1/income_sources?select=id&limit=1",
      root: "https://xzecdwhhrxuemanqvolh.supabase.co/rest/v1/",
      key: process.env.SUPABASE_KEY_4
    }
  ];

  const results = [];

  for (const project of projects) {
    // ===== 1. Запит до таблиці =====
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(project.url, {
        method: "GET",
        headers: {
          "apikey": project.key,
          "Authorization": `Bearer ${project.key}`
        },
        signal: controller.signal
      });

      clearTimeout(timeout);

      results.push({
        name: `${project.name} (table)`,
        status: response.status,
        ok: response.ok
      });

      console.log(`${project.name} (table): ${response.status}`);
    } catch (error) {
      results.push({
        name: `${project.name} (table)`,
        error: error.name === "AbortError" ? "Timeout 8s" : error.message
      });
      console.error(`${project.name} (table):`, error.name === "AbortError" ? "Timeout 8s" : error.message);
    }

    // ===== 2. Запит до системного /rest/v1/ =====
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(project.root, {
        method: "GET",
        headers: {
          "apikey": project.key,
          "Authorization": `Bearer ${project.key}`
        },
        signal: controller.signal
      });

      clearTimeout(timeout);

      results.push({
        name: `${project.name} (root)`,
        status: response.status,
        ok: response.ok
      });

      console.log(`${project.name} (root): ${response.status}`);
    } catch (error) {
      results.push({
        name: `${project.name} (root)`,
        error: error.name === "AbortError" ? "Timeout 8s" : error.message
      });
      console.error(`${project.name} (root):`, error.name === "AbortError" ? "Timeout 8s" : error.message);
    }
  }

  // Підсумок
  console.log("=== Keep-alive results ===");
  results.forEach(r => {
    if (r.error) {
      console.error(`${r.name}: ERROR - ${r.error}`);
    } else {
      console.log(`${r.name}: ${r.status}`);
    }
  });

  return new Response(JSON.stringify({ results }, null, 2), {
    headers: { "Content-Type": "application/json" }
  });
};

export const config = {
  schedule: "0 18 * * *"   // кожний день о 18:00 UTC
};

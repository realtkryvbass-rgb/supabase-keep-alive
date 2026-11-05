export default async () => {
  const projects = [
    {
      name: "Комунальні платежі",
      url: "https://zmfzvdsogaezifqpuytc.supabase.co/rest/v1/addresses?select=id&limit=1",
      key: process.env.SUPABASE_KEY_1
    },
    {
      name: "єЖурнал",
      url: "https://eykfoazvujjydsjgbmpb.supabase.co/rest/v1/jr_students?select=id&limit=1",
      key: process.env.SUPABASE_KEY_2
    },
    {
      name: "Abonus",
      url: "https://poiyfpvfdvxdttzrfpjj.supabase.co/rest/v1/entries?select=id&limit=1",
      key: process.env.SUPABASE_KEY_3
    },
    {
      name: "Доходи",
      url: "https://xzecdwhhrxuemanqvolh.supabase.co/rest/v1/income_sources?select=id&limit=1",
      key: process.env.SUPABASE_KEY_4
    },
    {
      name: "aTime",
      url: "https://wzwlfebhezizvehdhycm.supabase.co/auth/v1/health",
      key: process.env.SUPABASE_KEY_5
    },
    {
      name: "eBoard",
      url: "https://fqpxotzdufjbxpwcgyft.supabase.co/rest/v1/boards?select=id&limit=1",
      key: process.env.SUPABASE_KEY_6
    },
    {
      name: "PaTestO",
      url: "https://ukkqervmxdzdxorsoylp.supabase.co/rest/v1/tests?select=id&limit=1",
      key: process.env.SUPABASE_KEY_7
    }
  ];

  const results = await Promise.all(projects.map(async (project) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(project.url, {
        method: "GET",
        headers: {
          "apikey": project.key,
          "Authorization": `Bearer ${project.key}`
        },
        signal: controller.signal
      });
      console.log(`${project.name}: ${response.status}`);
      return { name: project.name, status: response.status, ok: response.ok };
    } catch (error) {
      const msg = error.name === "AbortError" ? "Timeout 8s" : error.message;
      console.error(`${project.name}:`, msg);
      return { name: project.name, error: msg };
    } finally {
      clearTimeout(timeout);
    }
  }));

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

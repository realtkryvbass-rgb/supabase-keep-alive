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
    }
  ];

  const results = [];

  for (const project of projects) {
    try {
      const response = await fetch(project.url, {
        method: "GET",
        headers: {
          "apikey": project.key,
          "Authorization": `Bearer ${project.key}`
        }
      });

      results.push({
        name: project.name,
        status: response.status,
        ok: response.ok
      });

      console.log(`${project.name}: ${response.status}`);
    } catch (error) {
      results.push({
        name: project.name,
        error: error.message
      });
      console.error(`${project.name}:`, error.message);
    }
  }

  return new Response(JSON.stringify({ results }, null, 2), {
    headers: { "Content-Type": "application/json" }
  });
};

export const config = {
  schedule: "0 4 * * 1,4"
};

import { GenerateAnswer } from "@/application/GenerateAnswer";
import { GenerateSummary } from "@/application/GenerateSummary";
import { GenerateTitle } from "@/application/GenerateTitle";
import { OpenAIGatewayClient } from "@/infra/gateway/OpenAIGatewayClient";
import { YouTubeGatewayClient } from "@/infra/gateway/YouTubeGatewayClient";
import { Hono } from "hono";
import { cors } from "hono/cors";

declare const process: {
  env: {
    OPENAI_API_KEY: string;
  };
};

type Bindings = {
  DB: D1Database;
  OPENAI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/v1/*", cors());

app.post("/v1/generate-title", async (c) => {
  const input = await c.req.json();

  const openAIGateway = new OpenAIGatewayClient(process.env.OPENAI_API_KEY);
  const generateTitle = new GenerateTitle(openAIGateway);

  const output = await generateTitle.execute(input);

  return c.json({
    title: output.title,
  });
});

app.post("/v1/generate-summary", async (c) => {
  const input = await c.req.json();

  const openAIGateway = new OpenAIGatewayClient(process.env.OPENAI_API_KEY);
  const generateSummary = new GenerateSummary(YouTubeGatewayClient, openAIGateway);

  const output = await generateSummary.execute(input);

  return c.json({
    summary: output.summary,
  });
});

app.post("/v1/generate-answer", async (c) => {
  const input = await c.req.json();

  const openAIGateway = new OpenAIGatewayClient(process.env.OPENAI_API_KEY);
  const generateAnswer = new GenerateAnswer(openAIGateway);

  const output = await generateAnswer.execute(input);

  return c.json({
    question: output.question,
    answer: output.answer,
  });
});

// app.post("/v1/refine-summaries", async (c) => {
//   const input = await c.req.json();

//   const openAIGateway = new OpenAIGatewayClient(process.env.OPENAI_API_KEY);
//   const refineSummaries = new RefineSummaries(openAIGateway);

//   const output = await refineSummaries.execute(input);

//   return c.json({
//     title: output.title,
//     timedSummaries: output.timedSummaries,
//     joinedSummaries: output.joinedSummaries,
//     refinedSummaries: output.refinedSummaries,
//     joinedRefinedSummaries: output.joinedRefinedSummaries,
//   });
// });

// app.post("/v1/generate-article", async (c) => {
//   const input = await c.req.json();

//   const openAIStreamGateway = new OpenAIStreamGatewayClient(process.env.OPENAI_API_KEY);
//   const generateStreamArticle = new GenerateStreamArticle(openAIStreamGateway);

//   const output = await generateStreamArticle.execute(input);

//   return new Response(output.stream);
// });

// app.post("/v1/generate", async (c) => {
//   const input = await c.req.json();

//   const openAIGateway = new OpenAIGatewayClient(process.env.OPENAI_API_KEY);
//   const generateSummary = new GenerateSummary(YouTubeGatewayClient, openAIGateway);

//   const openAIStreamGateway = new OpenAIStreamGatewayClient(process.env.OPENAI_API_KEY);
//   const generateStreamArticle = new GenerateStreamArticle(openAIStreamGateway);

//   const { summary } = await generateSummary.execute(input);

//   const output = await generateStreamArticle.execute({
//     title: "Unknown",
//     timedSummaries: summary,
//     joinedSummaries: summary.join(" "),
//     language: input.language,
//   });

//   return new Response(output.stream);
// });

export default app;

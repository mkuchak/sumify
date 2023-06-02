import { GenerateAnswer } from "@/application/GenerateAnswer";
import { GenerateBlogPost } from "@/application/GenerateBlogPost";
import { GenerateSummary } from "@/application/GenerateSummary";
import { GenerateTitle } from "@/application/GenerateTitle";
import { OpenAIGatewayClient } from "@/infra/gateway/OpenAIGatewayClient";
import { OpenAIStreamGatewayClient } from "@/infra/gateway/OpenAIStreamGatewayClient";
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
  const openAIGateway = new OpenAIStreamGatewayClient(process.env.OPENAI_API_KEY);
  const generateAnswer = new GenerateAnswer(openAIGateway);
  const output = await generateAnswer.execute(input);
  return new Response(output.stream);
});

app.post("/v1/generate-blog-post", async (c) => {
  const input = await c.req.json();
  const openAIGateway = new OpenAIStreamGatewayClient(process.env.OPENAI_API_KEY);
  const generateBlogPost = new GenerateBlogPost(openAIGateway);
  const output = await generateBlogPost.execute(input);
  return new Response(output.stream);
});

export default app;

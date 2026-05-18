import { ChatOllama } from "@langchain/ollama";
import { createAgent, HumanMessage } from "langchain";

const irisAI = async ({ prompt }: { prompt: string }) => {
  const model = new ChatOllama({
    model: "qwen3:1.7b",
    temperature: 0,
    think: false,
  });

  const messages = [new HumanMessage(prompt)];

  const agent = createAgent({
    model: model,
    tools: [],
    systemPrompt: `You are an Powerful AI Assistant Named IRIS Zero. You can Control User's Full Computer just by Voice and IRIS ZERO is a Local AI Assisant. 100% Local and can Run even without Internet.`,
  });

  const result = await agent.invoke({ messages: messages });
  const Output = result.messages[result.messages.length - 1].text;
  console.log(Output);
  return Output;
};

irisAI({ prompt: "Who are you?" });
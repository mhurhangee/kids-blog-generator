import { openai } from "@ai-sdk/openai";
import { createTool } from "@mastra/core/tools";
import { Agent } from "@mastra/core/agent";
import { z } from "zod";

const llm = openai("gpt-4o-mini");

const copywriterAgent = new Agent({
    name: "Copywriter",
    instructions: "You are a copywriter agent that writes blog post copy.",
    model: llm,
});

const copywriterTool = createTool({
    id: "copywriter-agent",
    description: "Calls the copywriter agent to write blog post copy.",
    inputSchema: z.object({
        topic: z.string().describe("Blog post topic"),
    }),
    outputSchema: z.object({
        copy: z.string().describe("Blog post copy"),
    }),
    execute: async ({ context }) => {
        const result = await copywriterAgent.generate(
            `Create a blog post about ${context.topic}`,
        );
        console.log('Copywriter result:', result.text)
        return { copy: result.text };
    },
});

const editorAgent = new Agent({
    name: "Editor",
    instructions:
        "You are an editor agent that rewrites blog post copy to be suitable for a 5 year old. Include lots of emojis and remove all markdown formating.",
    model: llm,
});

const editorTool = createTool({
    id: "editor-agent",
    description: "Calls the editor agent to edit blog post copy in a child-friendly manner.",
    inputSchema: z.object({
        copy: z.string().describe("Blog post copy"),
    }),
    outputSchema: z.object({
        copy: z.string().describe("Edited child-friendly blog post copy"),
    }),
    execute: async ({ context }) => {
        const result = await editorAgent.generate(
            `Edit the following blog post only returning the child-friendly edited copy: ${context.copy}`,
        );
        console.log('Editor result:', result.text)
        return { copy: result.text };
    },
});


export const blogPublisherAgent = new Agent({
    name: "blog-publisher-agent",
    instructions:
        "You are a publisher agent that first calls the copywriter agent to write blog post copy about a specific topic and then calls the editor agent to edit the copy in a child-friendly manner. Only return the final edited child-friendly copy.",
    model: llm,
    tools: { copywriterTool, editorTool },
});

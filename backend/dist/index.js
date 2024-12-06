"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
console.log(process.env.GEMINI_API_KEY);
const express_1 = __importDefault(require("express"));
const generative_ai_1 = require("@google/generative-ai");
const prompts_1 = require("./prompts");
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = req.body.prompt;
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }
    const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
        generationConfig: {
            candidateCount: 1,
            maxOutputTokens: 200,
        },
    });
    //const prompt = "Code a todo application in reactjs";
    const result = yield model.generateContent({
        contents: [
            {
                role: 'user',
                parts: [
                    {
                        text: prompt,
                    }
                ],
            },
        ],
        // generationConfig: {
        //   maxOutputTokens: 100,
        //   temperature: 0.1,
        // },
    });
    const answer = result.response.text().trim();
    console.log(answer);
    if (answer === "react") {
        res.json({
            prompts: [prompts_1.BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [react_1.basePrompt]
        });
        return;
    }
    if (answer === "node") {
        res.json({
            prompts: [prompts_1.BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [node_1.basePrompt]
        });
        return;
    }
    res.status(403).json({
        message: "You cant access this"
    });
}));
// app.post("/chat" , async (req,res)=>{
//   try{
//   if (!process.env.GEMINI_API_KEY) {
//     throw new Error('GEMINI_API_KEY is not defined in environment variables');
// }
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({
// model: "gemini-1.5-flash",
// systemInstruction:getSystemPrompt(),
// generationConfig: {
//   candidateCount: 1,
//   maxOutputTokens: 8000,
// },
// });
// //const prompt = "Code a todo application in reactjs";
// const contents : Content[] = req.body.content
// console.log(contents);
// const content = contents.map((items : any) => ({
//      role :  items.role || 'user',
//      parts : items.parts.map((part : any)=> ({text : part.text}))
// }))
// const result = await model.generateContent({contents : content});
//   console.log(result.response.text());
//   res.json({});
// } catch (error) {
//   console.error("Error generating content:", error);
// }
// })
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = req.body.messages;
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: (0, prompts_1.getSystemPrompt)(),
        generationConfig: {
            candidateCount: 1,
            maxOutputTokens: 8000,
        },
    });
    // Map the incoming messages to the correct Gemini API format
    const contents = messages.map((message) => ({
        role: message.role, // e.g., 'user' or 'assistant'
        parts: message.parts.map((part) => part.text), // Extract text from the parts array
    }));
    try {
        const result = yield model.generateContent({
            contents, // Pass correctly formatted contents
        });
        console.log(result.response.text());
        res.json({ result: result.response.text() });
    }
    catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Failed to generate content" });
    }
}));
app.listen(3000);
// async function run() {
//     // Make sure to include these imports:
// // import { GoogleGenerativeAI } from "@google/generative-ai";
//     if (!process.env.GEMINI_API_KEY) {
//         throw new Error('GEMINI_API_KEY is not defined in environment variables');
//     }
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash",
//     systemInstruction:getSystemPrompt(),
//     generationConfig: {
//       candidateCount: 1,
//       maxOutputTokens: 1000,
//       temperature: 1.0,
//     },
//   });
// //const prompt = "Code a todo application in reactjs";
// const result = await model.generateContentStream(
//     {
//         contents: [
//           {
//             role: 'user',
//             parts: [
//               {
//                 text: BASE_PROMPT ,
//               }
//             ],
//           } ,
//           {
//             role: 'user',
//             parts: [
//               {
//                 text:`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
//               }
//             ], 
//           } ,
//           {
//             role: 'user',
//             parts: [
//               {
//                 text: "Create a Todo App"
// ,
//               }
//             ], 
//           }
//         ],
//         // generationConfig: {
//         //   maxOutputTokens: 100,
//         //   temperature: 0.1,
//         // },
//       }
// );
// // Print text as it comes in.
// for await (const chunk of result.stream) {
//   const chunkText = chunk.text();
// //   console.log(chunkText);
//   process.stdout.write(chunkText);
//  console.log(chunkText);
// }
// }

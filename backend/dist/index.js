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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
console.log(process.env.GEMINI_API_KEY);
const generative_ai_1 = require("@google/generative-ai");
const prompts_1 = require("./prompts");
const react_1 = require("./defaults/react");
// Replace 'YOUR_API_KEY' with your actual API key
// async function main() {
//     //  const { GoogleGenerativeAI } = require('@google/generative-ai');
//     if (!process.env.GEMINI_API_KEY) {
//         throw new Error('GEMINI_API_KEY is not defined in environment variables');
//     }
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//     const prompt = 'write the code for todo application in reactjs';
//     const result = await model.generateContent(prompt);
//     console.log(result.response.text());
//     // const result = await model.generateText(prompt);
//     // console.log(result.text);
//   }
//   main();
// async function main() {
//     if (!process.env.GEMINI_API_KEY) {
//         throw new Error('GEMINI_API_KEY is not defined in environment variables');
//     }
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({
//   model: 'gemini-1.5-flash',
// });
// const result = await model.generateContent({
//   contents: [
//     {
//       role: 'user',
//       parts: [
//         {
//           text:
//             'write the code for TODO application in reactjs',
//         },
//       ],
//     },
//   ],
//   // Setting it on the generateContentStream request.
//   tools: [
//     {
//       codeExecution: {},
//     },
//   ],
// });
// const response = result.response;
// console.log(response.text());
// }
// main()
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        // Make sure to include these imports:
        // import { GoogleGenerativeAI } from "@google/generative-ai";
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not defined in environment variables');
        }
        const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: (0, prompts_1.getSystemPrompt)(),
            generationConfig: {
                candidateCount: 1,
                maxOutputTokens: 1000,
                temperature: 1.0,
            },
        });
        //const prompt = "Code a todo application in reactjs";
        const result = yield model.generateContentStream({
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            text: prompts_1.BASE_PROMPT,
                        }
                    ],
                },
                {
                    role: 'user',
                    parts: [
                        {
                            text: `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                        }
                    ],
                },
                {
                    role: 'user',
                    parts: [
                        {
                            text: "Create a Todo App",
                        }
                    ],
                }
            ],
            // generationConfig: {
            //   maxOutputTokens: 100,
            //   temperature: 0.1,
            // },
        });
        try {
            // Print text as it comes in.
            for (var _d = true, _e = __asyncValues(result.stream), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const chunk = _c;
                const chunkText = chunk.text();
                //   console.log(chunkText);
                process.stdout.write(chunkText);
                console.log(chunkText);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
run();

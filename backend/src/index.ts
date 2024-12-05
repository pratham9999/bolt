require("dotenv").config();
console.log(process.env.GEMINI_API_KEY)

import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BASE_PROMPT , getSystemPrompt } from './prompts';
import {basePrompt as nodeBasePrompt} from "./defaults/node";
import {basePrompt as reactBasePrompt} from "./defaults/react";



const app= express();

app.use(express.json())

app.post("/template", async(req, res)=>{

  const prompt = req.body.prompt;
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
model: "gemini-1.5-flash",
systemInstruction:"Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
generationConfig: {
  candidateCount: 1,
  maxOutputTokens: 1000,
  temperature: 1.0,
},
});

//const prompt = "Code a todo application in reactjs";

const result = await model.generateContent(
{
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          }
        ],
      } ,

     
    ],
    // generationConfig: {
    //   maxOutputTokens: 100,
    //   temperature: 0.1,
    // },
  }
);

const answer = result.response.text();

if(answer == "react"){

}



})




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




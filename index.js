// import * as fs from "fs";
import * as dotenv from "dotenv"
import express from "express"
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = 9090;

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function getGeminiResponse(prompt) {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error(error);
        return null;
    }
}
async function getGeminiResponseWithImage(prompt, image) {
    const result = await model.generateContent([prompt, image]);
    return result.response.text();
}

const reqTimeoutMin = 10;
const resTimeoutMin = 10;

function setTimeout(req, res) {
    req.socket.setTimeout(reqTimeoutMin * 60 * 1000);
    res.socket.setTimeout(resTimeoutMin * 60 * 1000);
}

app.get('/', async (req, res) => {
    setTimeout(req, res);
    const prompt = req.query["prompt"];
    const answer = await getGeminiResponse(prompt);
    res.send(`<div>${answer}</div>`);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// // const prompt = "이 쿠키의 맛이 어떨 것 같아?";
// const image = {
//     inlineData: {
//         data: Buffer.from(fs.readFileSync("cookie.webp")).toString("base64"),
//         mimeType: "image/webp",
//     },
// };
// // const result = await model.generateContent([prompt, image]);

// console.log(result.response.text());
// testreq.js (ESM)
import 'dotenv/config';
import axios from 'axios';
import pkg from 'https-proxy-agent'; // https-proxy-agent is CommonJS -> import default
const { HttpsProxyAgent } = pkg;

const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY || '';
const proxyAgent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : null;

const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const payload = {
    contents: [
        {
            role: "user",
            parts: [{ text: "Search the web and tell me the latest price of Bitcoin." }]
        }
    ],
    tools: [{ google_search: {} }]
};

async function send() {
    try {
        if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) throw new Error('Missing GEMINI_API_KEY or GOOGLE_API_KEY in environment');
        const headers = { 'X-goog-api-key': process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY, 'Content-Type': 'application/json' };
        const opts = { headers, timeout: 20000 };
        if (proxyAgent) opts.httpsAgent = proxyAgent;
        const res = await axios.post(url, payload, opts);

        console.log('status:', res.status);
        console.log('data:', res.data);
        console.log("--------------------");
        console.log('data:', JSON.stringify(res.data.candidates[0].content.parts[0].text));
    } catch (err) {
        // خطاها را واضح‌تر چاپ کنیم
        console.error('Request failed:');
        if (err.response) {
            console.error('status', err.response.status);
            console.error('data', err.response.data);
        } else {
            console.error(err.message);
        }
    }
}

send();

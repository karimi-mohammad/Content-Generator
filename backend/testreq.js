// testreq.js (ESM)
import axios from 'axios';
import pkg from 'https-proxy-agent'; // https-proxy-agent is CommonJS -> import default
const { HttpsProxyAgent } = pkg;

const proxyUrl = 'http://127.0.0.1:12334'; // توجه: بین آدرس و پورت باید ":" باشه
const proxyAgent = new HttpsProxyAgent(proxyUrl);

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
        const res = await axios.post(url, payload, {
            headers: {
                'X-goog-api-key': 'AIzaSyBIDAitGoaRXSi02fd2glT2bxIpmfvxk7A',
                'Content-Type': 'application/json'
            },
            // axios برای درخواست‌های https از httpsAgent استفاده می‌کند
            httpsAgent: proxyAgent,
            // در صورت نیاز timeout اضافه کن:
            timeout: 20000
        });

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

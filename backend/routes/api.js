const express = require('express');
const axios = require('axios');
const pkg = require('https-proxy-agent');
const { HttpsProxyAgent } = pkg;

const router = express.Router();

const proxyUrl = 'http://127.0.0.1:12334';
const proxyAgent = new HttpsProxyAgent(proxyUrl);

const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

router.get('/test-gemini', async (req, res) => {
    const payload = {
        contents: [
            {
                role: "user",
                parts: [{ text: "Search the web and tell me the latest price of Bitcoin." }]
            }
        ],
        tools: [{ google_search: {} }]
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'X-goog-api-key': 'AIzaSyBIDAitGoaRXSi02fd2glT2bxIpmfvxk7A',
                'Content-Type': 'application/json'
            },
            httpsAgent: proxyAgent,
            timeout: 20000
        });

        res.status(200).json({
            status: response.status,
            data: response.data
        });
    } catch (err) {
        console.error('Request failed:', err.message);
        if (err.response) {
            res.status(err.response.status).json({
                error: 'Request failed',
                status: err.response.status,
                data: err.response.data
            });
        } else {
            res.status(500).json({
                error: 'Internal server error',
                message: err.message
            });
        }
    }
});

router.post('/generate-outline', async (req, res) => {
    const { Topic, tone, desired_length, target_audience, SEO_KeyWords, SERP_titles, SITE_NAME_SUBJECT, Site_Posts } = req.body;

    if (!Topic || !SITE_NAME_SUBJECT || !SEO_KeyWords || !target_audience || !desired_length || !Site_Posts) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const systemPrompt = `تو یک نویسنده حرفه ای مطلب و متخصص SEO فارسی هستی که برای یک وبسایت ${SITE_NAME_SUBJECT} مطالب حرفه ای و SEO شده مینویسی`;

    const userPrompt = `موضوع: ${Topic}

کلمه کلیدی : ${SEO_KeyWords.join(', ')}

هدف مخاطب: ${target_audience}

طول تقریبی مقاله: ${desired_length} کلمه

وظیفه:

1) یک عنوان اصلی (H1) پیشنهادی بده که شامل کلمه کلیدی باشد.

2) یک OUTLINE دقیق با H2 و H3 بساز. برای هر H2 یک توضیح 1–2 خطی و تعداد کلمه پیشنهادی برای آن بخش بده.

3) مقالاتی که در سایت من موجود هست این موارد هست میخواهم موارد مرتبط رو بین مطلب لینک داخلی ایجاد کنم برای SEO موارد مربوط به هر بخش رو لیست کن  :
   
${Site_Posts.join(', ')}

4) خروجی را در قالب JSON بده:

{
  "title": "",
  "sections": [ {"h": "", "desc": "", "words": 100} ],
  "internal_links": ["..."]
}`;

    const text = systemPrompt + "\n\n" + userPrompt;

    const payload = {
        contents: [
            {
                role: "user",
                parts: [{ text: text }]
            }
        ]
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'X-goog-api-key': 'AIzaSyBIDAitGoaRXSi02fd2glT2bxIpmfvxk7A',
                'Content-Type': 'application/json'
            },
            httpsAgent: proxyAgent,
            timeout: 30000
        });

        const generatedText = response.data.candidates[0].content.parts[0].text.replace(/^```json\n/, '').replace(/\n```$/, '');
        let result;
        try {
            result = JSON.parse(generatedText);
        } catch (parseErr) {
            return res.status(500).json({ error: 'Failed to parse JSON response', raw: generatedText });
        }

        res.status(200).json({
            status: response.status,
            data: result
        });
    } catch (err) {
        console.error('Request failed:', err.message);
        if (err.response) {
            res.status(err.response.status).json({
                error: 'Request failed',
                status: err.response.status,
                data: err.response.data
            });
        } else {
            res.status(500).json({
                error: 'Internal server error',
                message: err.message
            });
        }
    }
});

router.post('/generate-content', async (req, res) => {
    const { subject, part, length, SEO_KeyWords, SITE_NAME_SUBJECT } = req.body;

    if (!subject || !part || !length || !SEO_KeyWords || !SITE_NAME_SUBJECT) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const systemPrompt = `تو یک نویسنده حرفه ای مطلب و متخصص SEO فارسی هستی که برای یک وبسایت ${SITE_NAME_SUBJECT} مطالب حرفه ای و SEO شده مینویسی`;

    const userPrompt = `موضوع کلی: ${subject}

بخش: ${part}

حداکثر طول: ${length}

کلمات کلیدی: ${SEO_KeyWords.join(', ')}

نکات لازم:

- مطلبی برای این بخش با مشخصات داده شده باید تولید شود

- در صورت نیاز برای توضیح بهتر مثال استفاده شود

- از کلمات کلیدی استفاده کن

خروجی: فقط متن مقاله به فرمت Markdown بدون توضیحات اضافی.`;

    const text = systemPrompt + "\n\n" + userPrompt;

    const payload = {
        contents: [
            {
                role: "user",
                parts: [{ text: text }]
            }
        ]
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'X-goog-api-key': 'AIzaSyBIDAitGoaRXSi02fd2glT2bxIpmfvxk7A',
                'Content-Type': 'application/json'
            },
            httpsAgent: proxyAgent,
            timeout: 30000
        });

        const generatedText = response.data.candidates[0].content.parts[0].text;
        // Assuming the output is directly the markdown text, no JSON wrapper
        res.status(200).json({
            status: response.status,
            content: generatedText.trim()
        });
    } catch (err) {
        console.error('Request failed:', err.message);
        if (err.response) {
            res.status(err.response.status).json({
                error: 'Request failed',
                status: err.response.status,
                data: err.response.data
            });
        } else {
            res.status(500).json({
                error: 'Internal server error',
                message: err.message
            });
        }
    }
});

module.exports = router;

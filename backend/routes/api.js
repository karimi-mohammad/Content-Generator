const express = require('express');
const axios = require('axios');
const pkg = require('https-proxy-agent');
const { HttpsProxyAgent } = pkg;

const router = express.Router();

// Read API key from environment. Prefer GEMINI_API_KEY, fallback to GOOGLE_API_KEY.
const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!API_KEY) {
    console.warn('Warning: No GEMINI_API_KEY or GOOGLE_API_KEY found in environment. The endpoints that call Gemini will fail until you set it.');
}

const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY || '';
const proxyAgent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : null;

function makeAxiosOptions(headers = {}, timeout = 30000) {
    const opts = { headers, timeout };
    if (proxyAgent) opts.httpsAgent = proxyAgent;
    return opts;
}

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
        if (!API_KEY) return res.status(500).json({ error: 'Missing server-side API key (GEMINI_API_KEY or GOOGLE_API_KEY)' });
        const response = await axios.post(url, payload, makeAxiosOptions({ 'X-goog-api-key': API_KEY, 'Content-Type': 'application/json' }, 20000));

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
        if (!API_KEY) return res.status(500).json({ error: 'Missing server-side API key (GEMINI_API_KEY or GOOGLE_API_KEY)' });
        const response = await axios.post(url, payload, makeAxiosOptions({ 'X-goog-api-key': API_KEY, 'Content-Type': 'application/json' }, 30000));

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
    const { subject, part, length, SEO_KeyWords, SITE_NAME_SUBJECT, notes, tone, target_audience, sectionIndex, previousContent } = req.body;

    if (!subject || !part || !length || !SEO_KeyWords || !SITE_NAME_SUBJECT) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const systemPrompt = `تو یک نویسنده حرفه ای مطلب و متخصص SEO فارسی هستی که برای یک وبسایت ${SITE_NAME_SUBJECT} مطالب حرفه ای و SEO شده مینویسی`;

    const userPrompt = `موضوع کلی: ${subject}

بخش: ${part}

این بخش شماره ${sectionIndex} از مقاله است.

حداکثر طول: ${length}

کلمات کلیدی: ${SEO_KeyWords.join(', ')}

لحن: ${tone || 'آموزشی، ساده و رسمی'}

مخاطب: ${target_audience || 'دانش‌آموزان'}

${previousContent ? `محتوای بخش‌های قبلی:\n${previousContent}\n\n` : ''}

نکات لازم:

- مطلب chunk شده هست و در حال حاضر در حال تولید یک بخش از مقاله هستیم که بخش  ${sectionIndex} ام از مطلب هست 

- بخش های مطلب پشت سر هم هستند

- مطلبی برای این بخش با مشخصات داده شده باید تولید شود

- در صورت نیاز برای توضیح بهتر مثال استفاده شود

- از کلمات کلیدی استفاده کن

${notes ? `- نکات اضافی: ${notes.replace(/`/g, "'")}` : ''}

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
        if (!API_KEY) return res.status(500).json({ error: 'Missing server-side API key (GEMINI_API_KEY or GOOGLE_API_KEY)' });
        const response = await axios.post(url, payload, makeAxiosOptions({ 'X-goog-api-key': API_KEY, 'Content-Type': 'application/json' }, 30000));

        const generatedText = response.data.candidates[0].content.parts[0].text;
        // Assuming the output is directly the markdown text
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

router.post('/convert-markdown', async (req, res) => {
    const { markdown_content } = req.body;

    if (!markdown_content) {
        return res.status(400).json({ error: 'Missing markdown_content' });
    }

    const systemPrompt = `You are an expert content formatter AI trained to convert Markdown into clean,
WordPress-friendly HTML.

Your output MUST respect these rules:

1. All paragraphs must be wrapped inside:
   <span style="font-size: 14pt;"> ... </span>

2. Bold text => <strong>...</strong>

3. Bullet lists must be converted to:
   <ul><li><span style="font-size: 14pt;">...</span></li></ul>

4. Level-2 and level-3 headings must be converted to spans (NOT <h2> or <h3>):
   Example:
   ## عنوان  
   → <span style="font-size: 14pt;"><strong>🔵 عنوان</strong></span>

5. Horizontal lines in Markdown (--- or ***) must be converted to:
   <hr />

6. Tables must be converted to full <table><thead>…</thead><tbody>…</tbody></table>
   with spans inside each cell.

7. No <p>, no <h1-h6> tags allowed.

8. Only clean HTML. No inline CSS except: style="font-size: 14pt;"

9. Preserve Arabic diacritics, RTL structure, and spacing.

You must ALWAYS generate valid HTML ready for WordPress editors like Classic Editor or RankMath.`;

    const userPrompt = `این Markdown را به HTML مخصوص وردپرس تبدیل کن.  
فقط خروجی HTML بده، بدون توضیحات اضافه.

[Markdown ورودی من:]

${markdown_content}`;

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
        if (!API_KEY) return res.status(500).json({ error: 'Missing server-side API key (GEMINI_API_KEY or GOOGLE_API_KEY)' });
        const response = await axios.post(url, payload, makeAxiosOptions({ 'X-goog-api-key': API_KEY, 'Content-Type': 'application/json' }, 30000));

        const generatedText = response.data.candidates[0].content.parts[0].text;
        // Assuming the output is directly the HTML
        res.status(200).json({
            status: response.status,
            html: generatedText.trim()
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

// New endpoint: Optimize content for SEO and readability (Persian rules)
router.post('/optimize-seo', async (req, res) => {
    const { input_text, keywords } = req.body;

    if (!input_text || !keywords) {
        return res.status(400).json({ error: 'Missing required fields: input_text or keywords' });
    }

    const systemPrompt = `تو یک متخصص سئو، نویسنده وب و بهینه‌ساز حرفه‌ای محتوا هستی. وظیفه تو این است که متن ارائه‌شده توسط کاربر را بدون تغییر در موضوع، ساختار اصلی و پیام کلی آن، از نظر سئو و خوانایی بهینه‌سازی کنی.

قوانین:
1. ساختار کلی متن، تیترها و ترتیب مطالب حفظ شود.
2. متن را روان‌تر، خواناتر و جذاب‌تر کن.
3. از کلمات کلیدی داده‌شده در جای مناسب استفاده کن و چگالی آن‌ها را طبیعی نگه دار.
4. از پرکردن متن غیرضروری و Keyword Stuffing خودداری کن.
5. در صورت نیاز، جمله‌ها را فقط برای بهتر شدن سئو و روانی بازنویسی کن.
6. پاراگراف‌ها را منظم، استاندارد و مناسب وب بنویس.
7. لحن متن را مطابق لحن اصلی حفظ کن.
8. هیچ توضیح اضافه‌ای بیرون از متن نهایی ارائه نده؛ فقط نسخه بهینه‌شده متن را خروجی بده.`;

    const userPrompt = `متن:

${input_text}

کلمات کلیدی:

${Array.isArray(keywords) ? keywords.join(', ') : keywords}

لطفاً نسخه بهینه‌شده متن را طبق قوانین فوق و فقط خود متن (بدون توضیحات اضافه) خروجی بده.`;

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
        if (!API_KEY) return res.status(500).json({ error: 'Missing server-side API key (GEMINI_API_KEY or GOOGLE_API_KEY)' });
        const response = await axios.post(url, payload, makeAxiosOptions({ 'X-goog-api-key': API_KEY, 'Content-Type': 'application/json' }, 30000));

        const generatedText = response.data.candidates[0].content.parts[0].text;
        // Return trimmed text directly
        res.status(200).json({ status: response.status, optimized_text: generatedText.trim() });
    } catch (err) {
        console.error('Request failed:', err.message);
        if (err.response) {
            res.status(err.response.status).json({
                error: 'Request failed',
                status: err.response.status,
                data: err.response.data
            });
        } else {
            res.status(500).json({ error: 'Internal server error', message: err.message });
        }
    }
});

// New endpoint: Generate SEO information for a topic
router.post('/generate-seo-info', async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Missing required field: topic' });
    }

    const systemPrompt = `تو یک متخصص سئو حرفه‌ای هستی و وظیفه‌ات تولید خروجی‌های دقیق سئویی بر اساس موضوعی است که کاربر می‌دهد.

قوانین:
1. تمام خروجی باید فقط و فقط در قالب JSON باشد.
2. کلمات کلیدی را در سه دسته ارائه بده: اصلی، فرعی و Long Tail.
3. عنوان مقاله باید جذاب و بین 50 تا 65 کاراکتر باشد.
4. متا دیسکریپشن باید بین 120 تا 155 کاراکتر باشد.
5. چکیده باید 1 الی 2 جمله کوتاه باشد.
6. اگر کاربر درخواست کرد، ساختار مقاله (H1, H2, H3) را هم تولید کن.
7. خارج از JSON هیچ متنی نمایش نده.`;

    const userPrompt = `برای موضوع زیر، خروجی کامل سئویی تولید کن و فقط در قالب JSON برگردان.

موضوع:
${topic}

ساختار JSON مورد انتظار:

{
  "title": "",
  "meta_description": "",
  "snippet": "",
  "keywords": {
    "main": [],
    "secondary": [],
    "long_tail": []
  },
  "outline": [
    {
      "h1": "",
      "h2": [],
      "h3": []
    }
  ]
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
        if (!API_KEY) return res.status(500).json({ error: 'Missing server-side API key (GEMINI_API_KEY or GOOGLE_API_KEY)' });
        const response = await axios.post(url, payload, makeAxiosOptions({ 'X-goog-api-key': API_KEY, 'Content-Type': 'application/json' }, 30000));

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
            res.status(500).json({ error: 'Internal server error', message: err.message });
        }
    }
});

module.exports = router;

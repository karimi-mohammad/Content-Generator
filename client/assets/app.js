// Simple UI logic for the article generator (mocked backend) — client folder
const form = document.getElementById('mainForm');
const sectionsCard = document.getElementById('sectionsCard');
const sectionsList = document.getElementById('sectionsList');
const finalCard = document.getElementById('finalCard');
const finalArticle = document.getElementById('finalArticle');

let state = { sections: [], keywords: [] };
const API_BASE = 'http://localhost:4000/api';
let finalMarkdown = '';

function saveFormData() {
    const data = {
        topic: document.getElementById('topic').value,
        tone: document.getElementById('tone').value,
        keywords: document.getElementById('keywords').value,
        desired_length: document.getElementById('desired_length').value,
        target_audience: document.getElementById('target_audience').value,
        serp: document.getElementById('serp').value,
        site_name: document.getElementById('site_name').value,
        site_posts: document.getElementById('site_posts').value
    };
    localStorage.setItem('formData', JSON.stringify(data));
}

function loadFormData() {
    const data = JSON.parse(localStorage.getItem('formData') || '{}');
    document.getElementById('topic').value = data.topic || '';
    document.getElementById('tone').value = data.tone || '';
    document.getElementById('keywords').value = data.keywords || '';
    document.getElementById('desired_length').value = data.desired_length || '600';
    document.getElementById('target_audience').value = data.target_audience || '';
    document.getElementById('serp').value = data.serp || '';
    document.getElementById('site_name').value = data.site_name || '';
    document.getElementById('site_posts').value = data.site_posts || '';
}

// Ensure loading is hidden on load
document.getElementById('loading').style.display = 'none';

function createMockSections(topic) {
    return [
        { title: 'مقدمه', content: '', status: 'pending', notes: '', words: 100 },
        { title: 'تعاریف و نکات کلیدی', content: '', status: 'pending', notes: '', words: 150 },
        { title: 'مثال‌ها و تمرین‌ها', content: '', status: 'pending', notes: '', words: 200 },
        { title: 'نتیجه‌گیری', content: '', status: 'pending', notes: '', words: 50 }
    ].map((s, i) => ({ ...s, id: i + 1 }));
}

function renderSections() {
    sectionsList.innerHTML = '';
    state.sections.forEach(sec => {
        const li = document.createElement('li'); li.className = 'section-item';
        li.innerHTML = `
      <div class="section-head">
        <div class="title-row">
          <input class="sec-title" data-id="${sec.id}" value="${escapeHtml(sec.title)}">
          <div class="section-controls">
            <button data-action="generate" data-id="${sec.id}">تولید محتوا</button>
            <button data-action="seo" data-id="${sec.id}" class="secondary">بررسی SEO</button>
            <button data-action="delete" data-id="${sec.id}" class="secondary">حذف</button>
          </div>
        </div>
        <div class="words-row">
          <label>تعداد کلمات:</label>
          <input class="sec-words" data-id="${sec.id}" type="number" min="50" value="${sec.words}">
        </div>
        <div class="notes-row">
          <input class="sec-notes" data-id="${sec.id}" placeholder="نکات خاص برای این بخش (اختیاری)" value="${escapeHtml(sec.notes || '')}">
        </div>
      </div>
      <div class="section-body">
        <textarea data-id="${sec.id}" class="sec-body">${escapeHtml(sec.content)}</textarea>
      </div>
    `;
        sectionsList.appendChild(li);
    });
}

form.addEventListener('submit', async e => {
    e.preventDefault();
    const topic = document.getElementById('topic').value.trim();
    if (!topic) return alert('لطفاً موضوع را وارد کنید.');
    document.getElementById('loading').style.display = 'flex';
    // parse keywords (comma-separated)
    const kwInput = document.getElementById('keywords')?.value || '';
    state.keywords = kwInput.split(',').map(s => s.trim()).filter(Boolean);
    const payload = {
        Topic: document.getElementById('topic').value,
        tone: document.getElementById('tone').value,
        desired_length: Number(document.getElementById('desired_length').value) || 600,
        target_audience: document.getElementById('target_audience').value,
        SEO_KeyWords: state.keywords,
        SERP_titles: document.getElementById('serp').value ? document.getElementById('serp').value.split('\n') : [],
        SITE_NAME_SUBJECT: document.getElementById('site_name').value,
        Site_Posts: document.getElementById('site_posts').value ? document.getElementById('site_posts').value.split('\n') : []
    };
    try {
        const resp = await fetch(`${API_BASE}/generate-outline`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!resp.ok) throw new Error(`Server returned ${resp.status}`);
        const data = await resp.json();
        if (data.data && data.data.sections) {
            state.sections = data.data.sections.map((s, i) => ({ id: i + 1, title: s.h || s.title || `بخش ${i + 1}`, content: '', status: 'pending', notes: '', words: s.words || 100 }));
        } else if (data.data && data.data.title) {
            // When only title provided, attempt to create default outline from parsed
            if (Array.isArray(data.data.sections)) {
                state.sections = data.data.sections.map((s, i) => ({ id: i + 1, title: s.h || s.title || `بخش ${i + 1}`, content: '', status: 'pending', notes: '', words: s.words || 100 }));
            } else {
                state.sections = createMockSections(topic);
            }
        } else {
            state.sections = createMockSections(topic);
        }
        document.getElementById('loading').style.display = 'none';
        sectionsCard.hidden = false;
        finalCard.hidden = true;
        renderSections();
    } catch (err) {
        console.warn('Backend /generate-outline failed, using mock:', String(err));
        state.sections = createMockSections(topic);
        document.getElementById('loading').style.display = 'none';
        sectionsCard.hidden = false;
        finalCard.hidden = true;
        renderSections();
    }
});

sectionsList.addEventListener('click', async e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action; const id = Number(btn.dataset.id);
    const sec = state.sections.find(s => s.id === id);
    if (action === 'generate') {
        btn.disabled = true; btn.textContent = 'در حال تولید...';
        document.getElementById('loading').style.display = 'flex';
        try {
            const sectionIndex = state.sections.indexOf(sec) + 1;
            const previousSection = state.sections[state.sections.indexOf(sec) - 1];
            const previousContent = previousSection ? previousSection.content : '';
            const payload = {
                subject: document.getElementById('topic').value,
                part: sec.title,
                length: sec.words || Number(document.getElementById('desired_length').value) || 400,
                SEO_KeyWords: state.keywords,
                SITE_NAME_SUBJECT: document.getElementById('site_name').value,
                notes: sec.notes || '',
                tone: document.getElementById('tone').value,
                target_audience: document.getElementById('target_audience').value,
                sectionIndex: sectionIndex,
                previousContent: previousContent
            };
            const resp = await fetch(`${API_BASE}/generate-content`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!resp.ok) throw new Error('server-error');
            const json = await resp.json();
            sec.content = json.content || json.output || mockGenerateContent(document.getElementById('topic').value, sec.title);
        } catch (err) {
            console.warn('generate-content failed — using mock', String(err));
            sec.content = mockGenerateContent(document.getElementById('topic').value, sec.title);
        }
        sec.status = 'generated';
        renderSections();
        btn.disabled = false; btn.textContent = 'تولید محتوا';
        document.getElementById('loading').style.display = 'none';
        checkIfAllGenerated();
    } else if (action === 'seo') {
        const textarea = document.querySelector(`textarea[data-id="${id}"]`);
        const report = runSeoChecks(textarea.value, document.getElementById('topic').value, state.keywords);
        alert(report);
    } else if (action === 'delete') {
        state.sections = state.sections.filter(s => s.id !== id);
        renderSections();
    }
});

sectionsList.addEventListener('input', e => {
    const t = e.target; const id = Number(t.dataset.id);
    if (!id) return;
    const sec = state.sections.find(s => s.id === id);
    if (t.classList.contains('sec-title')) sec.title = t.value;
    if (t.classList.contains('sec-body')) sec.content = t.value;
    if (t.classList.contains('sec-notes')) sec.notes = t.value;
    if (t.classList.contains('sec-words')) sec.words = Number(t.value);
});

document.getElementById('addSection').addEventListener('click', () => {
    const newId = Math.max(...state.sections.map(s => s.id), 0) + 1;
    state.sections.push({ id: newId, title: 'بخش جدید', content: '', status: 'pending', notes: '', words: 100 });
    renderSections();
});

function checkIfAllGenerated() {
    if (state.sections.every(s => s.status === 'generated')) {
        compileFinalArticle();
    }
}

function compileFinalArticle() {
    document.getElementById('loading').style.display = 'flex';
    const kwLine = state.keywords && state.keywords.length ? `کلمات کلیدی: ${state.keywords.join(', ')}\n\n` : '';
    const header = `موضوع: ${document.getElementById('topic').value}\n` + kwLine;
    const body = state.sections.map(s => `${s.content}\n`).join('\n');
    const markdown = header + body;
    finalMarkdown = markdown;

    // Convert to HTML
    fetch(`${API_BASE}/convert-markdown`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown_content: markdown })
    })
        .then(resp => resp.json())
        .then(data => {
            if (data.html) {
                finalArticle.innerHTML = data.html;
            } else {
                finalArticle.textContent = markdown; // fallback
            }
            document.getElementById('loading').style.display = 'none';
            finalCard.hidden = false;
            finalCard.scrollIntoView({ behavior: 'smooth' });
        })
        .catch(err => {
            console.warn('Convert to HTML failed, using markdown:', err);
            finalArticle.textContent = markdown;
            document.getElementById('loading').style.display = 'none';
            finalCard.hidden = false;
            finalCard.scrollIntoView({ behavior: 'smooth' });
        });
} document.getElementById('copyBtn').addEventListener('click', async () => {
    const html = finalArticle.innerHTML || '';
    try {
        await navigator.clipboard.writeText(html);
        alert('HTML کپی شد!');
    } catch (err) {
        console.error('Failed to copy:', err);
        alert('کپی ناموفق بود.');
    }
});

document.getElementById('downloadBtn').addEventListener('click', () => {
    const html = finalArticle.innerHTML || finalArticle.textContent || '';
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'article.html';
    document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});

document.getElementById('restartBtn').addEventListener('click', () => location.reload());

document.getElementById('retryConvertBtn').addEventListener('click', async () => {
    if (!finalMarkdown) return alert('هیچ محتوایی برای تبدیل وجود ندارد.');
    document.getElementById('loading').style.display = 'flex';
    try {
        const resp = await fetch(`${API_BASE}/convert-markdown`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ markdown_content: finalMarkdown })
        });
        const data = await resp.json();
        if (data.html) {
            finalArticle.innerHTML = data.html;
        } else {
            finalArticle.textContent = finalMarkdown;
        }
    } catch (err) {
        console.warn('Retry convert failed:', err);
        finalArticle.textContent = finalMarkdown;
    }
    document.getElementById('loading').style.display = 'none';
});

document.getElementById('generateAllSections').addEventListener('click', async () => {
    const btn = document.getElementById('generateAllSections');
    btn.disabled = true;
    btn.textContent = 'در حال تولید همه بخش‌ها...';
    document.getElementById('loading').style.display = 'flex';
    for (let i = 0; i < state.sections.length; i++) {
        const sec = state.sections[i];
        if (sec.status === 'generated') continue; // اگر قبلاً تولید شده، رد کن
        try {
            const sectionIndex = i + 1;
            const previousSection = state.sections[i - 1];
            const previousContent = previousSection ? previousSection.content : '';
            const payload = {
                subject: document.getElementById('topic').value,
                part: sec.title,
                length: sec.words || Number(document.getElementById('desired_length').value) || 400,
                SEO_KeyWords: state.keywords,
                SITE_NAME_SUBJECT: document.getElementById('site_name').value,
                notes: sec.notes || '',
                tone: document.getElementById('tone').value,
                target_audience: document.getElementById('target_audience').value,
                sectionIndex: sectionIndex,
                previousContent: previousContent
            };
            const resp = await fetch(`${API_BASE}/generate-content`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!resp.ok) throw new Error('server-error');
            const json = await resp.json();
            sec.content = json.content || json.output || mockGenerateContent(document.getElementById('topic').value, sec.title);
            sec.status = 'generated';
        } catch (err) {
            console.warn('generate-content failed for section', i + 1, String(err));
            sec.content = mockGenerateContent(document.getElementById('topic').value, sec.title);
            sec.status = 'generated';
        }
    }
    renderSections();
    document.getElementById('loading').style.display = 'none';
    btn.disabled = false;
    btn.textContent = 'تولید همه بخش‌ها';
    checkIfAllGenerated();
});

function mockGenerateContent(topic, title) {
    return `${title} — در این بخش به موضوع «${topic}» پرداخته می‌شود. مثال‌ها، توضیحات و نکات آموزشی به صورت ساده و قابل‌فهم آورده شده است.`;
}

function runSeoChecks(text, topic, keywords = []) {
    if (!text.trim()) return 'محتوایی برای بررسی وجود ندارد.';
    const words = text.split(/\s+/).filter(Boolean);
    const kwPrimary = topic.split(/\s+/)[0] || topic;
    const occurrencesPrimary = (text.match(new RegExp(escapeRegExp(kwPrimary), 'gi')) || []).length;
    const densityPrimary = ((occurrencesPrimary / Math.max(1, words.length)) * 100).toFixed(2);
    const lines = [];
    lines.push(`کلمات: ${words.length}`);
    lines.push(`تکرار واژه (موضوع) «${kwPrimary}»: ${occurrencesPrimary} — تراکم: ${densityPrimary}%`);
    if (keywords && keywords.length) {
        keywords.forEach(k => {
            const occ = (text.match(new RegExp(escapeRegExp(k), 'gi')) || []).length;
            const den = ((occ / Math.max(1, words.length)) * 100).toFixed(2);
            lines.push(`واژه کلیدی «${k}»: ${occ} — تراکم: ${den}%`);
        });
    }
    return lines.join('\n');
}

function escapeHtml(s) {
    return (s || '').replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;"
    })[m]);
}
function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

// Load form data on page load
document.addEventListener('DOMContentLoaded', loadFormData);

// Save form data on input
form.addEventListener('input', saveFormData);

// Reset form
document.getElementById('resetForm').addEventListener('click', () => {
    localStorage.removeItem('formData');
    loadFormData();
});

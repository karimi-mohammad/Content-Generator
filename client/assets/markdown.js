// Client-side handler for Markdown -> HTML conversion, copy and download
(function () {
    const mdEl = document.getElementById('markdown');
    const convertBtn = document.getElementById('convert');
    const copyBtn = document.getElementById('copy');
    const downloadBtn = document.getElementById('download');
    const preview = document.getElementById('preview');
    const rawHtml = document.getElementById('rawHtml');
    const status = document.getElementById('status');

    function setStatus(text, timeout = 2500) {
        status.textContent = text;
        if (timeout) setTimeout(() => { if (status.textContent === text) status.textContent = ''; }, timeout);
    }

    async function convert() {
        const md = mdEl.value || '';
        if (!md.trim()) {
            alert('متن Markdown را وارد کنید.');
            return;
        }

        setStatus('در حال تبدیل...');

        // Try server API first
        try {
            const res = await fetch('/api/convert-markdown', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markdown_content: md })
            });

            if (res.ok) {
                const data = await res.json();
                if (data && data.html) {
                    renderHtml(data.html);
                    setStatus('تبدیل با استفاده از API سرور انجام شد');
                    return;
                }
            } else {
                // If server returns 4xx/5xx, we'll fallback to client conversion
                console.warn('Server convert-markdown error', res.status);
            }
        } catch (err) {
            console.warn('API call failed, falling back to client-side conversion', err.message);
        }

        // Fallback: client-side conversion using marked
        try {
            const _raw = marked.parse(md);
            const formatted = postProcessHtml(_raw);
            renderHtml(formatted);
            setStatus('تبدیل در سمت کلاینت انجام شد (فالن بک)');
        } catch (err) {
            console.error('Client-side conversion failed', err);
            setStatus('خطا در تبدیل');
            alert('خطا در تبدیل Markdown به HTML.');
        }
    }

    function renderHtml(html) {
        preview.innerHTML = html;
        rawHtml.value = html;
    }

    function postProcessHtml(html) {
        // Basic post processing to try to mimic server rules: wrap paragraphs and list items
        // Using DOMParser to safely walk nodes
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Remove any script tags
        doc.querySelectorAll('script').forEach(s => s.remove());

        // Replace paragraphs <p> with <span style="font-size: 14pt;">...</span>
        doc.querySelectorAll('p').forEach(p => {
            const span = doc.createElement('span');
            span.setAttribute('style', 'font-size: 14pt;');
            span.innerHTML = p.innerHTML;
            p.replaceWith(span);
        });

        // Replace h2/h3 with span + strong + emoji marker
        doc.querySelectorAll('h2, h3').forEach(h => {
            const span = doc.createElement('span');
            span.setAttribute('style', 'font-size: 14pt;');
            const strong = doc.createElement('strong');
            strong.innerHTML = '🔵 ' + h.textContent;
            span.appendChild(strong);
            h.replaceWith(span);
        });

        // Wrap list item content with span style
        doc.querySelectorAll('li').forEach(li => {
            // If li already has a span child with style, skip
            const first = li.firstElementChild;
            if (first && first.tagName.toLowerCase() === 'span' && first.getAttribute('style')) return;
            const span = doc.createElement('span');
            span.setAttribute('style', 'font-size: 14pt;');
            span.innerHTML = li.innerHTML;
            li.innerHTML = '';
            li.appendChild(span);
        });

        // Tables: wrap th/td contents with span
        doc.querySelectorAll('th, td').forEach(cell => {
            const span = doc.createElement('span');
            span.setAttribute('style', 'font-size: 14pt;');
            span.innerHTML = cell.innerHTML;
            cell.innerHTML = '';
            cell.appendChild(span);
        });

        // Ensure ul/ol remain, but we want ul/li output preserved
        // Return body innerHTML
        return doc.body.innerHTML;
    }

    async function copyHtml() {
        const text = rawHtml.value || preview.innerHTML || '';
        if (!text) { setStatus('هیچ HTML‌ای برای کپی وجود ندارد'); return; }
        try {
            await navigator.clipboard.writeText(text);
            setStatus('HTML در کلیپ‌بورد کپی شد');
        } catch (err) {
            console.error('Copy failed', err);
            // Fallback: select textarea
            rawHtml.select();
            document.execCommand('copy');
            setStatus('HTML انتخاب و کپی شد (فالن بک)');
        }
    }

    function downloadHtmlFile() {
        const html = rawHtml.value || preview.innerHTML || '';
        if (!html) { setStatus('هیچ HTML‌ای برای دانلود وجود ندارد'); return; }
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.html';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setStatus('فایل HTML دانلود شد');
    }

    convertBtn.addEventListener('click', convert);
    copyBtn.addEventListener('click', copyHtml);
    downloadBtn.addEventListener('click', downloadHtmlFile);

    // Expose convert on Ctrl+Enter inside textarea
    mdEl.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            convert();
        }
    });

})();

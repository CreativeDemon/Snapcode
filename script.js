document.getElementById('generateLink').addEventListener('click', () => {
    const title = document.getElementById('fileTitle').value.trim();
    const codeInput = document.getElementById('codeInput').value.trim();
    const fileInput = document.getElementById('fileInput').files[0];

    if (!title) {
        alert('Please enter a file title.');
        return;
    }

    if (fileInput && fileInput.size > 10 * 1024 * 1024) {
        alert('File size must be under 10 MB.');
        return;
    }

    if (codeInput) {
        processCode(codeInput, title);
    } else if (fileInput) {
        const reader = new FileReader();
        reader.onload = () => processCode(reader.result, title);
        reader.readAsText(fileInput);
    } else {
        alert('Please paste code or upload a file.');
    }
});

function processCode(code, title) {
    const detectedLanguage = detectLanguage(code);
    const fileName = `${title}.${detectedLanguage.extension}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const link = URL.createObjectURL(blob);

    displayResult(link, fileName, code, title);
}

function detectLanguage(code) {
    // Simple detection based on common patterns in code
    const languages = {
        javascript: { extension: 'js', pattern: /function\s+/ },
        python: { extension: 'py', pattern: /def\s+/ },
        html: { extension: 'html', pattern: /<html>/ },
        css: { extension: 'css', pattern: /body\s*{/ },
        java: { extension: 'java', pattern: /public\s+class\s+/ },
        cpp: { extension: 'cpp', pattern: /#include\s<.*>/ },
        c: { extension: 'c', pattern: /#include\s<.*>/ },
        txt: { extension: 'txt', pattern: /./ }
    };

    for (const lang in languages) {
        if (languages[lang].pattern.test(code)) {
            return languages[lang];
        }
    }

    return languages.txt;  // Default to text if not matched
}

function displayResult(link, fileName, code, title) {
    const resultDiv = document.getElementById('result');
    const previewLink = `preview.html?title=${encodeURIComponent(title)}&code=${encodeURIComponent(code)}`;
    
    resultDiv.innerHTML = `
        <p>File generated: <strong>${fileName}</strong></p>
        <a href="${link}" download="${fileName}">Download</a>
        <span>|</span>
        <a href="${previewLink}" target="_blank">Preview</a>
    `;
    resultDiv.style.display = 'block';
}
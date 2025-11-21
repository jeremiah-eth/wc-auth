import { marked } from 'marked';
import * as fs from 'fs';
import * as path from 'path';

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT_DIR, 'readme.html');

// Configuration for the docs
const DOCS = [
    { title: 'Overview', file: 'README.md' },
    { title: 'Walkthrough', file: 'walkthrough.md' },
    { title: 'Contributing', file: 'CONTRIBUTING.md' },
];

// CSS Styles (GitHub-like + Dark Mode support)
const STYLES = `
    :root {
        --bg-color: #ffffff;
        --text-color: #24292f;
        --link-color: #0969da;
        --border-color: #d0d7de;
        --code-bg: #f6f8fa;
        --sidebar-bg: #f6f8fa;
        --sidebar-hover: #eef1f4;
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --bg-color: #0d1117;
            --text-color: #c9d1d9;
            --link-color: #58a6ff;
            --border-color: #30363d;
            --code-bg: #161b22;
            --sidebar-bg: #010409;
            --sidebar-hover: #161b22;
        }
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        line-height: 1.6;
        color: var(--text-color);
        background-color: var(--bg-color);
        margin: 0;
        display: flex;
        height: 100vh;
        overflow: hidden;
    }

    /* Sidebar */
    .sidebar {
        width: 280px;
        background-color: var(--sidebar-bg);
        border-right: 1px solid var(--border-color);
        padding: 2rem 1rem;
        overflow-y: auto;
        flex-shrink: 0;
    }

    .sidebar h1 {
        font-size: 1.5rem;
        margin-bottom: 2rem;
        padding-left: 0.5rem;
        color: var(--text-color);
    }

    .nav-link {
        display: block;
        padding: 0.75rem 1rem;
        color: var(--text-color);
        text-decoration: none;
        border-radius: 6px;
        margin-bottom: 0.25rem;
        font-weight: 500;
    }

    .nav-link:hover {
        background-color: var(--sidebar-hover);
        text-decoration: none;
    }

    .nav-link.active {
        background-color: var(--link-color);
        color: white;
    }

    /* Main Content */
    .main-content {
        flex: 1;
        overflow-y: auto;
        padding: 2rem 4rem;
        max-width: 900px;
    }

    /* Markdown Styles */
    h1, h2, h3, h4, h5, h6 {
        margin-top: 24px;
        margin-bottom: 16px;
        font-weight: 600;
        line-height: 1.25;
    }

    h1 { font-size: 2em; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }

    a { color: var(--link-color); text-decoration: none; }
    a:hover { text-decoration: underline; }

    code {
        padding: 0.2em 0.4em;
        margin: 0;
        font-size: 85%;
        background-color: var(--code-bg);
        border-radius: 6px;
        font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    }

    pre {
        padding: 16px;
        overflow: auto;
        font-size: 85%;
        line-height: 1.45;
        background-color: var(--code-bg);
        border-radius: 6px;
    }

    pre code {
        background-color: transparent;
        padding: 0;
    }

    blockquote {
        padding: 0 1em;
        color: var(--text-color);
        border-left: 0.25em solid var(--border-color);
        margin: 0;
        opacity: 0.8;
    }

    table {
        border-spacing: 0;
        border-collapse: collapse;
        margin-top: 0;
        margin-bottom: 16px;
        width: 100%;
    }

    table th, table td {
        padding: 6px 13px;
        border: 1px solid var(--border-color);
    }

    table tr:nth-child(2n) {
        background-color: var(--code-bg);
    }

    /* Mobile */
    @media (max-width: 768px) {
        body { flex-direction: column; }
        .sidebar { width: 100%; height: auto; border-right: none; border-bottom: 1px solid var(--border-color); padding: 1rem; }
        .main-content { padding: 1rem; }
    }
`;

const SCRIPT = `
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Update active state
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Scroll to section
            const targetId = link.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
`;

async function generateDocs() {
    let contentHtml = '';
    let navHtml = '';

    for (const doc of DOCS) {
        const filePath = path.join(ROOT_DIR, doc.file);
        if (fs.existsSync(filePath)) {
            const markdown = fs.readFileSync(filePath, 'utf-8');
            const html = await marked(markdown);

            // Create a section for each file
            const sectionId = doc.title.toLowerCase().replace(/\s+/g, '-');

            navHtml += `<a href="#${sectionId}" class="nav-link">${doc.title}</a>`;
            contentHtml += `<section id="${sectionId}" class="doc-section">${html}</section><hr style="margin: 3rem 0; border: 0; border-top: 1px solid var(--border-color);">`;
        }
    }

    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>wc-auth Documentation</title>
    <style>${STYLES}</style>
</head>
<body>
    <nav class="sidebar">
        <h1>wc-auth</h1>
        ${navHtml}
    </nav>
    <main class="main-content">
        ${contentHtml}
    </main>
    <script>${SCRIPT}</script>
</body>
</html>
    `;

    fs.writeFileSync(OUTPUT_FILE, fullHtml);
    console.log(`Documentation generated at: ${OUTPUT_FILE}`);
}

generateDocs().catch(console.error);

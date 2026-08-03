import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const NOVEL_FILE = path.join(ROOT_DIR, 'building a kingdom in the middle ages.txt');
const COVER_IMAGE = path.join(ROOT_DIR, 'building a kingdom in the middle ages.webp');

// Simple env parser since dotenv might not be installed
function loadEnv() {
    try {
        const envPath = path.join(ROOT_DIR, '.env.local');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8');
            const tokenMatch = envContent.match(/SANITY_API_TOKEN=(.+)/);
            if (tokenMatch) {
                return tokenMatch[1].trim();
            }
        }
    } catch (err) {
        console.error('Error loading .env.local:', err);
    }
    return process.env.SANITY_API_TOKEN;
}

const token = loadEnv();

if (!token) {
    console.error('Error: SANITY_API_TOKEN not found in .env.local or environment variables.');
    process.exit(1);
}

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lke4t7vu',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: token,
    useCdn: false,
    apiVersion: '2024-01-26',
});

async function parseNovelFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    let title = 'Building a Kingdom in the Middle Ages'; // Default
    let author = 'Unknown';
    let synopsis = '';
    let chapters = [];

    // Basic metadata extraction (based on file preview)
    // 1: ====================
    // 2:  Travel back to the Middle Ages to build infrastructure
    // 3:  Author: Jiang Qianli

    const authorLine = lines.find(l => l.includes('Author:'));
    if (authorLine) {
        author = authorLine.split('Author:')[1].trim();
    }

    // Extract Synopsis
    const synopsisStart = lines.findIndex(l => l.trim().startsWith('Synopsis:'));
    if (synopsisStart !== -1) {
        // Assuming synopsis ends before the first chapter or a delimiter
        // Just taking a chunk for now
        let synopsisEnd = lines.findIndex((l, index) => index > synopsisStart && l.trim().startsWith('Chapter 1'));
        if (synopsisEnd === -1) synopsisEnd = lines.findIndex((l, index) => index > synopsisStart && l.includes('===================='));

        if (synopsisEnd !== -1) {
            synopsis = lines.slice(synopsisStart + 1, synopsisEnd).join('\n').trim();
        }
    }

    // Split chapters
    // Regex: ^\s*Chapter \d+
    const chapterRegex = /^\s*Chapter\s+(\d+)(?::\s*(.*))?$/;

    let currentChapter = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const match = line.match(chapterRegex);

        if (match) {
            if (currentChapter) {
                chapters.push(currentChapter);
            }
            currentChapter = {
                number: parseInt(match[1]),
                title: match[2] || `Chapter ${match[1]}`, // Use "Chapter X" if no subtitle
                content: []
            };
        } else if (currentChapter) {
            currentChapter.content.push(lines[i]); // Keep original indentation/spacing if needed, or trim?
            // Usually Sanity text fields preserve newlines, so we keep lines.
        }
    }

    if (currentChapter) {
        chapters.push(currentChapter);
    }

    // Process chapter content
    chapters = chapters.map(ch => ({
        ...ch,
        content: ch.content.join('\n').trim()
    }));

    return { title, author, synopsis, chapters };
}

async function uploadImage(imagePath) {
    if (!fs.existsSync(imagePath)) {
        console.warn(`Cover image not found at ${imagePath}`);
        return null;
    }
    console.log('Uploading cover image...');
    const buffer = fs.readFileSync(imagePath);
    const asset = await client.assets.upload('image', buffer, {
        filename: path.basename(imagePath)
    });
    return asset._id;
}

async function main() {
    try {
        console.log('Reading novel file...');
        const { title, author, synopsis, chapters } = await parseNovelFile(NOVEL_FILE);

        console.log(`Parsed Novel: "${title}" by ${author}`);
        console.log(`Found ${chapters.length} chapters.`);

        if (chapters.length === 0) {
            console.error('No chapters found. Check the file format.');
            return;
        }

        const imageId = await uploadImage(COVER_IMAGE);

        console.log('Creating Novel document...');
        const novelDoc = {
            _type: 'novel',
            title: title,
            author: author,
            excerpt: synopsis.slice(0, 300) + '...', // Just a snippet for excerpt
            description: synopsis,
            totalChapters: chapters.length,
            slug: { _type: 'slug', current: 'building-a-kingdom-in-the-middle-ages' },
            publishedAt: new Date().toISOString(),
        };

        if (imageId) {
            novelDoc.coverImage = {
                _type: 'image',
                asset: { _type: 'reference', _ref: imageId }
            };
        }

        // Check if novel already exists to establish ID? 
        // For simplicity, we create a new one or createIfNotExists with a fixed ID if we wanted idempotency.
        // Let's rely on create for now, or createIfNotExists based on slug?
        // Using create creates a new one every time. createOrReplace might be better if we have a deterministic ID.
        // Let's generate a deterministic ID from slug.
        const novelId = 'novel-building-kingdom';
        novelDoc._id = novelId;

        const createdNovel = await client.createOrReplace(novelDoc);
        console.log(`Novel created with ID: ${createdNovel._id}`);

        console.log('Uploading chapters...');

        // Process in chunks to avoid rate limits
        const CHUNK_SIZE = 5;
        for (let i = 0; i < chapters.length; i += CHUNK_SIZE) {
            const chunk = chapters.slice(i, i + CHUNK_SIZE);
            await Promise.all(chunk.map(async (ch) => {
                const chapterDoc = {
                    _type: 'chapter',
                    novel: { _type: 'reference', _ref: createdNovel._id },
                    number: ch.number,
                    title: ch.title,
                    content: ch.content,
                    publishedAt: new Date().toISOString(),
                };

                // Deterministic ID for safely re-running: chapter-{novelId}-{number}
                const chapterId = `chapter-${novelId}-${ch.number}`;
                chapterDoc._id = chapterId;

                await client.createOrReplace(chapterDoc);
                console.log(`Uploaded Chapter ${ch.number}: ${ch.title}`);
            }));
        }

        console.log('Done!');

    } catch (err) {
        console.error('Script failed:', err);
    }
}

main();

import { ParsedSpecFile, Section } from './types.js';

export function parseSpecFile(path: string, raw: string): ParsedSpecFile {
  const lines = raw.split('\n');
  const sections: Section[] = [];
  let inCodeBlock = false;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];

    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) continue;

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      sections.push({
        heading: headingMatch[2].trim(),
        level: headingMatch[1].length,
        line: index + 1,
        content: '',
      });
    } else if (sections.length > 0) {
      sections[sections.length - 1].content += line + '\n';
    }
  }

  for (const section of sections) {
    section.content = section.content.trim();
  }

  return {
    path,
    raw,
    sections,
    sizeBytes: Buffer.byteLength(raw, 'utf-8'),
  };
}

const { createCanvas } = require('canvas');
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');
const fs = require('fs');
const path = require('path');

const pdfPath = 'public/books/days-at-the-morisaki-bookshop.pdf';
const outDir = 'public/landing-pages/meng-to-sketchbook/morisaki';
fs.mkdirSync(outDir, { recursive: true });

async function run() {
  console.log('Loading PDF...');
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({ data }).promise;
  const numPages = doc.numPages;
  console.log(`PDF Loaded! ${numPages} pages.`);

  const p1 = await doc.getPage(1);
  const scale = 1.8;
  const vp = p1.getViewport({ scale });
  const w = Math.round(vp.width);
  const h = Math.round(vp.height);
  const spreadW = w * 2;
  const spreadH = h;

  const spreads = [];

  // Spread 1: Cover (Left: blank/flap, Right: Page 1)
  spreads.push({
    left: null,
    right: 1,
    title: 'Days at the Morisaki Bookshop',
    place: 'Cover & Title Page',
    pagesLabel: 'Page 1'
  });

  // Intermediate spreads: left = 2*k, right = 2*k + 1
  for (let p = 2; p <= numPages; p += 2) {
    const leftP = p;
    const rightP = (p + 1 <= numPages) ? (p + 1) : null;
    spreads.push({
      left: leftP,
      right: rightP,
      title: `Pages ${leftP}–${rightP || leftP}`,
      place: `Morisaki Bookshop`,
      pagesLabel: rightP ? `pp. ${leftP}–${rightP}` : `p. ${leftP}`
    });
  }

  console.log(`Total spreads to generate: ${spreads.length}`);

  // Cache extracted text titles for chapters
  for (let i = 0; i < spreads.length; i++) {
    const s = spreads[i];
    let detectedChapter = '';
    
    // Check right page text
    if (s.right) {
      const page = await doc.getPage(s.right);
      const tc = await page.getTextContent();
      const txt = tc.items.map(it => it.str).join(' ');
      const chMatch = txt.match(/(Part\s+(?:One|Two|Three)|Chapter\s+\d+|Contents|About\s+the\s+Author)/i);
      if (chMatch) detectedChapter = chMatch[1];
    }
    // Check left page text
    if (!detectedChapter && s.left) {
      const page = await doc.getPage(s.left);
      const tc = await page.getTextContent();
      const txt = tc.items.map(it => it.str).join(' ');
      const chMatch = txt.match(/(Part\s+(?:One|Two|Three)|Chapter\s+\d+|Contents|About\s+the\s+Author)/i);
      if (chMatch) detectedChapter = chMatch[1];
    }

    if (detectedChapter) {
      s.title = detectedChapter + ` (${s.pagesLabel})`;
    } else if (i === 0) {
      s.title = 'Title Page (Page 1)';
    } else {
      s.title = `Pages ${s.left}–${s.right || s.left}`;
    }
  }

  // Pre-render loop
  for (let i = 0; i < spreads.length; i++) {
    const s = spreads[i];
    const filename = `spread-${String(i + 1).padStart(2, '0')}.jpg`;
    const filePath = path.join(outDir, filename);

    const canvas = createCanvas(spreadW, spreadH);
    const ctx = canvas.getContext('2d');

    // Paper background
    ctx.fillStyle = '#f8f4ec';
    ctx.fillRect(0, 0, spreadW, spreadH);

    // Render left
    if (s.left) {
      const page = await doc.getPage(s.left);
      const lCanvas = createCanvas(w, h);
      const lCtx = lCanvas.getContext('2d');
      await page.render({ canvasContext: lCtx, viewport: page.getViewport({ scale }) }).promise;
      ctx.drawImage(lCanvas, 0, 0);
    } else {
      // Inside front cover flap
      ctx.fillStyle = '#eee8db';
      ctx.fillRect(0, 0, w, spreadH);
      ctx.fillStyle = 'rgba(43, 39, 33, 0.35)';
      ctx.font = 'italic 26px serif';
      ctx.textAlign = 'center';
      ctx.fillText('OurPages · Shared Reading', w / 2, spreadH / 2 - 20);
      ctx.font = '16px serif';
      ctx.fillStyle = 'rgba(43, 39, 33, 0.22)';
      ctx.fillText('Days at the Morisaki Bookshop', w / 2, spreadH / 2 + 15);
      ctx.font = 'italic 14px serif';
      ctx.fillText('by Satoshi Yagisawa', w / 2, spreadH / 2 + 38);
    }

    // Render right
    if (s.right) {
      const page = await doc.getPage(s.right);
      const rCanvas = createCanvas(w, h);
      const rCtx = rCanvas.getContext('2d');
      await page.render({ canvasContext: rCtx, viewport: page.getViewport({ scale }) }).promise;
      ctx.drawImage(rCanvas, w, 0);
    } else {
      ctx.fillStyle = '#eee8db';
      ctx.fillRect(w, 0, w, spreadH);
      ctx.fillStyle = 'rgba(43, 39, 33, 0.25)';
      ctx.font = 'italic 22px serif';
      ctx.textAlign = 'center';
      ctx.fillText('End of Book', w + w / 2, spreadH / 2);
    }

    // Spine gradient
    const spineW = 120;
    const spineGrad = ctx.createLinearGradient(w - spineW / 2, 0, w + spineW / 2, 0);
    spineGrad.addColorStop(0, 'rgba(43, 39, 33, 0)');
    spineGrad.addColorStop(0.44, 'rgba(43, 39, 33, 0.08)');
    spineGrad.addColorStop(0.5, 'rgba(43, 39, 33, 0.28)');
    spineGrad.addColorStop(0.56, 'rgba(43, 39, 33, 0.08)');
    spineGrad.addColorStop(1, 'rgba(43, 39, 33, 0)');
    ctx.fillStyle = spineGrad;
    ctx.fillRect(w - spineW / 2, 0, spineW, spreadH);

    // Outer edge shadows
    const leftEdge = ctx.createLinearGradient(0, 0, 36, 0);
    leftEdge.addColorStop(0, 'rgba(43, 39, 33, 0.07)');
    leftEdge.addColorStop(1, 'rgba(43, 39, 33, 0)');
    ctx.fillStyle = leftEdge;
    ctx.fillRect(0, 0, 36, spreadH);

    const rightEdge = ctx.createLinearGradient(spreadW - 36, 0, spreadW, 0);
    rightEdge.addColorStop(0, 'rgba(43, 39, 33, 0)');
    rightEdge.addColorStop(1, 'rgba(43, 39, 33, 0.07)');
    ctx.fillStyle = rightEdge;
    ctx.fillRect(spreadW - 36, 0, 36, spreadH);

    // Warm cream tint overlay
    ctx.fillStyle = 'rgba(236, 231, 220, 0.10)';
    ctx.fillRect(0, 0, spreadW, spreadH);

    const buf = canvas.toBuffer('image/jpeg', { quality: 0.90 });
    fs.writeFileSync(filePath, buf);

    s.file = `morisaki/${filename}`;
    if ((i + 1) % 10 === 0 || i === spreads.length - 1) {
      console.log(`Rendered spread ${i + 1} / ${spreads.length} (${s.title})`);
    }
  }

  // Save manifest
  const manifestPath = path.join(outDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(spreads, null, 2));
  console.log('Successfully rendered ALL spreads and saved manifest.json!');
}

run().catch(console.error);

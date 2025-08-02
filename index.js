// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
import { z as z2 } from "zod";

// shared/schema.ts
import { z } from "zod";
var cvFormSchema = z.object({
  nama: z.string().min(1, "Nama lengkap wajib diisi"),
  tgl_lahir: z.string().min(1, "Tanggal lahir wajib diisi"),
  usia: z.number().min(15, "Usia minimal 15 tahun").max(70, "Usia maksimal 70 tahun"),
  jk: z.enum(["Pria", "Wanita"], { required_error: "Jenis kelamin wajib dipilih" }),
  email: z.string().email("Format email tidak valid").optional().or(z.literal("")),
  telepon: z.string().optional(),
  alamat: z.string().optional(),
  pendidikan: z.string().optional(),
  keahlian: z.string().min(1, "Keahlian wajib diisi"),
  pengalaman: z.string().optional()
});
var downloadRequestSchema = z.object({
  format: z.enum(["txt", "html", "pdf", "docx", "png"]),
  data: cvFormSchema,
  content: z.string()
});

// server/routes.ts
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from "docx";
async function registerRoutes(app2) {
  app2.post("/api/cv/download", async (req, res) => {
    try {
      const { format, data, content } = downloadRequestSchema.parse(req.body);
      const filename = `CV-${data.nama?.replace(/\s+/g, "-") || "BYFORT"}-${Date.now()}`;
      switch (format) {
        case "txt":
          const txtContent = `
\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2557   \u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557
\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u255A\u2588\u2588\u2557 \u2588\u2588\u2554\u255D\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u255A\u2550\u2550\u2588\u2588\u2554\u2550\u2550\u255D
\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D \u255A\u2588\u2588\u2588\u2588\u2554\u255D \u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D   \u2588\u2588\u2551   
\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557  \u255A\u2588\u2588\u2554\u255D  \u2588\u2588\u2554\u2550\u2550\u255D  \u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557   \u2588\u2588\u2551   
\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D   \u2588\u2588\u2551   \u2588\u2588\u2551     \u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551  \u2588\u2588\u2551   \u2588\u2588\u2551   
\u255A\u2550\u2550\u2550\u2550\u2550\u255D    \u255A\u2550\u255D   \u255A\u2550\u255D      \u255A\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u255D  \u255A\u2550\u255D   \u255A\u2550\u255D   

\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
\u2551                      CURRICULUM VITAE                       \u2551
\u2551                     CV PROFESIONAL                          \u2551
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D

\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502                   INFORMASI PRIBADI                       \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518

\u{1F464} Nama Lengkap    : ${(data.nama || "").toUpperCase()}
\u{1F382} Tanggal Lahir   : ${data.tgl_lahir} (${data.usia} tahun)
\u{1F465} Jenis Kelamin   : ${data.jk}
${data.email ? `\u{1F4E7} Email           : ${data.email}` : ""}
${data.telepon ? `\u{1F4F1} Telepon         : ${data.telepon}` : ""}
${data.alamat ? `\u{1F3E0} Alamat          : ${data.alamat}` : ""}

${data.pendidikan ? `
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502                        PENDIDIKAN                         \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518

\u{1F393} ${data.pendidikan}
` : ""}

\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502                  KEAHLIAN & KOMPETENSI                    \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518

${(data.keahlian || "").split("\n").map((skill) => `\u{1F680} ${skill.trim()}`).filter((s) => s.length > 2).join("\n")}

${data.pengalaman ? `
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502                   PENGALAMAN KERJA                        \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518

${data.pengalaman.split("\n").map((exp) => `\u{1F4BC} ${exp.trim()}`).filter((e) => e.length > 2).join("\n")}
` : ""}

\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
\u2551               BYFORT CV BUILDER - 2025                      \u2551
\u2551          CV Profesional dibuat pada ${(/* @__PURE__ */ new Date()).toLocaleDateString("id-ID")}          \u2551
\u2551              www.byfort.com - CV Generator                   \u2551
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D
          `.trim();
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.setHeader("Content-Disposition", `attachment; filename="${filename}.txt"`);
          res.send(txtContent);
          break;
        case "html":
          try {
            const cleanContent = content.replace(/<div[^>]*class="[^"]*"[^>]*>/g, "<div>").replace(/<h[1-6][^>]*>/g, "<h2>").replace(/<\/h[1-6]>/g, "</h2>").replace(/<span[^>]*>/g, "").replace(/<\/span>/g, "");
            const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CV - ${data.nama}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    
    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
      line-height: 1.6; 
      margin: 0; 
      padding: 40px;
      background: #fff;
      color: #1a1a1a;
      font-size: 14px;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
      border-radius: 16px;
      overflow: hidden;
    }
    
    .header { 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center; 
      padding: 50px 40px;
      position: relative;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    }
    
    .header-content {
      position: relative;
      z-index: 1;
    }
    
    h1 { 
      font-size: 2.8rem; 
      font-weight: 700; 
      margin: 0 0 20px 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin-bottom: 30px;
      font-weight: 400;
    }
    
    .contact-info { 
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 25px;
    }
    
    .contact-item {
      background: rgba(255,255,255,0.15);
      padding: 12px 20px;
      border-radius: 25px;
      backdrop-filter: blur(10px);
      text-align: center;
      font-weight: 500;
    }
    
    .content {
      padding: 50px 40px;
    }
    
    .section { 
      margin-bottom: 45px;
      position: relative;
    }
    
    h2 { 
      color: #667eea;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 25px 0;
      padding-bottom: 15px;
      border-bottom: 3px solid #f1f3f4;
      position: relative;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    h2::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 2px;
    }
    
    .section-content {
      font-size: 15px;
      line-height: 1.7;
      color: #4a5568;
    }
    
    .skill-list { 
      white-space: pre-line;
      background: #f8fafc;
      padding: 25px;
      border-radius: 12px;
      border-left: 4px solid #667eea;
    }
    
    .footer {
      text-align: center;
      padding: 30px;
      background: #f8fafc;
      color: #718096;
      font-size: 13px;
      font-style: italic;
    }
    
    @media print { 
      body { margin: 0; padding: 20px; }
      .container { box-shadow: none; }
      .header { background: #667eea !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-content">
        <h1>${data.nama}</h1>
        <div class="subtitle">Curriculum Vitae Profesional</div>
        <div class="contact-info">
          <div class="contact-item">\u{1F382} ${data.tgl_lahir} (${data.usia} tahun)</div>
          <div class="contact-item">\u{1F464} ${data.jk}</div>
          ${data.email ? `<div class="contact-item">\u{1F4E7} ${data.email}</div>` : ""}
          ${data.telepon ? `<div class="contact-item">\u{1F4F1} ${data.telepon}</div>` : ""}
          ${data.alamat ? `<div class="contact-item">\u{1F4CD} ${data.alamat}</div>` : ""}
        </div>
      </div>
    </div>
    
    <div class="content">
      ${data.pendidikan ? `
      <div class="section">
        <h2>\u{1F393} Pendidikan</h2>
        <div class="section-content skill-list">${data.pendidikan}</div>
      </div>
      ` : ""}
      
      <div class="section">
        <h2>\u{1F680} Keahlian & Kompetensi</h2>
        <div class="section-content skill-list">${data.keahlian}</div>
      </div>
      
      ${data.pengalaman ? `
      <div class="section">
        <h2>\u{1F4BC} Pengalaman Kerja</h2>
        <div class="section-content skill-list">${data.pengalaman}</div>
      </div>
      ` : ""}
    </div>
    
    <div class="footer">
      CV Profesional dibuat menggunakan BYFORT CV Builder \u2022 ${(/* @__PURE__ */ new Date()).toLocaleDateString("id-ID")}
    </div>
  </div>
</body>
</html>`;
            res.setHeader("Content-Type", "text/html");
            res.setHeader("Content-Disposition", `attachment; filename="${filename}.html"`);
            res.send(pdfContent);
          } catch (error) {
            console.error("HTML generation error:", error);
            res.status(500).json({ message: "Gagal membuat HTML. Silakan coba format lain." });
          }
          break;
        case "pdf":
          try {
            const pdfHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CV ${data.nama}</title>
  <style>
    @page { 
      size: A4; 
      margin: 20mm; 
    }
    body { 
      font-family: 'Times New Roman', serif; 
      line-height: 1.8; 
      color: #000;
      font-size: 12pt;
      margin: 0;
      padding: 0;
    }
    .header { 
      text-align: center; 
      border-bottom: 3px double #000; 
      padding-bottom: 15px; 
      margin-bottom: 25px; 
    }
    .name { 
      font-size: 20pt; 
      font-weight: bold; 
      margin-bottom: 8px; 
    }
    .contact { 
      font-size: 10pt; 
      margin-bottom: 3px; 
    }
    .section { 
      margin-bottom: 20px; 
      page-break-inside: avoid;
    }
    .section-title { 
      font-size: 14pt; 
      font-weight: bold; 
      text-transform: uppercase; 
      border-bottom: 1px solid #000; 
      padding-bottom: 2px; 
      margin-bottom: 10px; 
    }
    .content { 
      margin-left: 15px; 
      text-align: justify; 
    }
    .footer { 
      text-align: center; 
      font-size: 8pt; 
      margin-top: 30px; 
      color: #666; 
    }
    @media print {
      body { 
        margin: 0; 
        padding: 0; 
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${data.nama}</div>
    ${data.email ? `<div class="contact">Email: ${data.email}</div>` : ""}
    ${data.telepon ? `<div class="contact">Telepon: ${data.telepon}</div>` : ""}
    <div class="contact">Tanggal Lahir: ${data.tgl_lahir} (${data.usia} tahun)</div>
    <div class="contact">Jenis Kelamin: ${data.jk}</div>
    ${data.alamat ? `<div class="contact">Alamat: ${data.alamat}</div>` : ""}
  </div>
  
  ${data.pendidikan ? `
  <div class="section">
    <div class="section-title">Pendidikan</div>
    <div class="content">${data.pendidikan.replace(/\n/g, "<br>")}</div>
  </div>
  ` : ""}
  
  <div class="section">
    <div class="section-title">Keahlian & Kompetensi</div>
    <div class="content">${data.keahlian.replace(/\n/g, "<br>")}</div>
  </div>
  
  ${data.pengalaman ? `
  <div class="section">
    <div class="section-title">Pengalaman Kerja</div>
    <div class="content">${data.pengalaman.replace(/\n/g, "<br>")}</div>
  </div>
  ` : ""}
  
  <div class="footer">
    CV dibuat menggunakan BYFORT CV Builder pada ${(/* @__PURE__ */ new Date()).toLocaleDateString("id-ID")}
  </div>
  
  <script>
    // Auto-print functionality
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>`;
            res.setHeader("Content-Type", "text/html");
            res.setHeader("Content-Disposition", `attachment; filename="${filename}.html"`);
            res.send(pdfHtmlContent);
          } catch (error) {
            console.error("PDF generation error:", error);
            res.status(500).json({ message: "Gagal membuat PDF. Silakan coba format lain." });
          }
          break;
        case "docx":
          try {
            const sections = [];
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: data.nama,
                    bold: true,
                    size: 32
                  })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 }
              })
            );
            const contactInfo = [];
            if (data.email) contactInfo.push(`Email: ${data.email}`);
            if (data.telepon) contactInfo.push(`Telepon: ${data.telepon}`);
            contactInfo.push(`Tanggal Lahir: ${data.tgl_lahir} (${data.usia} tahun)`);
            contactInfo.push(`Jenis Kelamin: ${data.jk}`);
            if (data.alamat) contactInfo.push(`Alamat: ${data.alamat}`);
            contactInfo.forEach((info) => {
              sections.push(
                new Paragraph({
                  children: [new TextRun({ text: info, size: 20 })],
                  alignment: AlignmentType.CENTER,
                  spacing: { after: 100 }
                })
              );
            });
            if (data.pendidikan) {
              sections.push(
                new Paragraph({
                  children: [new TextRun({ text: "PENDIDIKAN", bold: true, size: 24 })],
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 400, after: 200 }
                }),
                new Paragraph({
                  children: [new TextRun({ text: data.pendidikan, size: 22 })],
                  spacing: { after: 300 }
                })
              );
            }
            sections.push(
              new Paragraph({
                children: [new TextRun({ text: "KEAHLIAN & KOMPETENSI", bold: true, size: 24 })],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 }
              })
            );
            data.keahlian.split("\n").forEach((skill) => {
              if (skill.trim()) {
                sections.push(
                  new Paragraph({
                    children: [new TextRun({ text: skill.trim(), size: 22 })],
                    spacing: { after: 100 }
                  })
                );
              }
            });
            if (data.pengalaman) {
              sections.push(
                new Paragraph({
                  children: [new TextRun({ text: "PENGALAMAN KERJA", bold: true, size: 24 })],
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 400, after: 200 }
                })
              );
              data.pengalaman.split("\n").forEach((exp) => {
                if (exp.trim()) {
                  sections.push(
                    new Paragraph({
                      children: [new TextRun({ text: exp.trim(), size: 22 })],
                      spacing: { after: 100 }
                    })
                  );
                }
              });
            }
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `CV dibuat menggunakan BYFORT CV Builder pada ${(/* @__PURE__ */ new Date()).toLocaleDateString("id-ID")}`,
                    size: 18,
                    italics: true
                  })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { before: 600 }
              })
            );
            const doc = new Document({
              sections: [
                {
                  properties: {},
                  children: sections
                }
              ]
            });
            const buffer = await Packer.toBuffer(doc);
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            res.setHeader("Content-Disposition", `attachment; filename="${filename}.docx"`);
            res.send(buffer);
          } catch (error) {
            console.error("DOCX generation error:", error);
            res.status(500).json({ message: "Gagal membuat DOCX. Silakan coba format lain." });
          }
          break;
        case "png":
          try {
            const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="1200" xmlns="http://www.w3.org/2000/svg" style="background: white;">
  <defs>
    <style>
      .header { font-family: Arial, sans-serif; font-size: 32px; font-weight: bold; text-anchor: middle; fill: #000; }
      .subheader { font-family: Arial, sans-serif; font-size: 18px; text-anchor: middle; fill: #666; }
      .section-title { font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; fill: #007bff; text-anchor: start; }
      .content { font-family: Arial, sans-serif; font-size: 18px; fill: #333; text-anchor: start; }
      .small { font-family: Arial, sans-serif; font-size: 14px; fill: #999; text-anchor: middle; }
    </style>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="1200" fill="white" stroke="#ddd" stroke-width="2"/>
  
  <!-- Header Section -->
  <text x="400" y="60" class="header">${(data.nama || "").replace(/[<>&"']/g, (m) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[m])}</text>
  
  <!-- Contact info -->
  <text x="400" y="100" class="subheader">Tanggal Lahir: ${(data.tgl_lahir || "").replace(/[<>&"']/g, (m) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[m])} (${data.usia} tahun)</text>
  <text x="400" y="130" class="subheader">Jenis Kelamin: ${(data.jk || "").replace(/[<>&"']/g, (m) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[m])}</text>
  ${data.email ? `<text x="400" y="160" class="subheader">Email: ${(data.email || "").replace(/[<>&"']/g, (m) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[m])}</text>` : ""}
  ${data.telepon ? `<text x="400" y="${data.email ? "190" : "160"}" class="subheader">Telepon: ${(data.telepon || "").replace(/[<>&"']/g, (m) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[m])}</text>` : ""}
  ${data.alamat ? `<text x="400" y="${data.email && data.telepon ? "220" : data.email || data.telepon ? "190" : "160"}" class="subheader">Alamat: ${(data.alamat || "").replace(/[<>&"']/g, (m) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[m])}</text>` : ""}
  
  <!-- Separator Line -->
  <line x1="50" y1="${data.alamat ? "250" : "220"}" x2="750" y2="${data.alamat ? "250" : "220"}" stroke="#007bff" stroke-width="3"/>
  
  <!-- Education Section -->
  ${data.pendidikan ? `
  <text x="50" y="${data.alamat ? "290" : "260"}" class="section-title">PENDIDIKAN</text>
  <text x="70" y="${data.alamat ? "325" : "295"}" class="content">${(data.pendidikan || "").replace(/[<>&"']/g, (m) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[m])}</text>
  ` : ""}
  
  <!-- Skills Section -->
  <text x="50" y="${data.pendidikan ? data.alamat ? "370" : "340" : data.alamat ? "290" : "260"}" class="section-title">KEAHLIAN &amp; KOMPETENSI</text>
  ${(data.keahlian || "").split("\n").map(
              (skill, i) => `<text x="70" y="${(data.pendidikan ? data.alamat ? 405 : 375 : data.alamat ? 325 : 295) + i * 25}" class="content">${skill.trim().replace(/[<>&"']/g, (m) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[m])}</text>`
            ).join("")}
  
  <!-- Experience Section -->
  ${data.pengalaman ? `
  <text x="50" y="${data.pendidikan ? data.alamat ? "650" : "620" : data.alamat ? "570" : "540"}" class="section-title">PENGALAMAN KERJA</text>
  ${(data.pengalaman || "").split("\n").map(
              (exp, i) => `<text x="70" y="${(data.pendidikan ? data.alamat ? 685 : 655 : data.alamat ? 605 : 575) + i * 25}" class="content">${exp.trim().replace(/[<>&"']/g, (m) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" })[m])}</text>`
            ).join("")}
  ` : ""}
  
  <!-- Footer -->
  <text x="400" y="1150" class="small">CV dibuat menggunakan BYFORT CV Builder pada ${(/* @__PURE__ */ new Date()).toLocaleDateString("id-ID")}</text>
</svg>`;
            res.setHeader("Content-Type", "image/svg+xml");
            res.setHeader("Content-Disposition", `attachment; filename="${filename}.png"`);
            res.send(svgContent);
          } catch (error) {
            console.error("Image generation error:", error);
            res.status(500).json({ message: "Gagal membuat gambar. Silakan coba format lain." });
          }
          break;
        default:
          res.status(400).json({ message: "Format tidak valid" });
      }
    } catch (error) {
      console.error("Download error:", error);
      if (error instanceof z2.ZodError) {
        res.status(400).json({ message: "Data tidak valid", errors: error.errors });
      } else {
        res.status(500).json({ message: "Terjadi kesalahan server" });
      }
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

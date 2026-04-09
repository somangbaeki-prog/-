/**
 * exporter.js - HTML/이미지 내보내기 로직
 */

/**
 * 미리보기 영역을 PNG 이미지로 다운로드합니다.
 * html2canvas 라이브러리를 사용합니다.
 */
async function exportToPNG() {
  const preview = document.getElementById('preview-content');
  if (!preview) return;

  const btn = document.getElementById('btn-export-png');
  if (btn) {
    btn.textContent = '⏳ 변환 중...';
    btn.disabled = true;
  }

  try {
    const canvas = await html2canvas(preview, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      scale: 2,
      logging: false,
    });

    const link = document.createElement('a');
    link.download = 'novelsnap.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (err) {
    console.error('PNG 내보내기 실패:', err);
    alert('이미지 내보내기에 실패했습니다. 😢');
  } finally {
    if (btn) {
      btn.textContent = '🖼️ PNG 저장';
      btn.disabled = false;
    }
  }
}

/**
 * 미리보기 영역을 HTML 파일로 다운로드합니다.
 */
function exportToHTML() {
  const preview = document.getElementById('preview-content');
  if (!preview) return;

  const bgColor = preview.style.backgroundColor || '#fff8f0';
  const textColor = preview.style.color || '#5c4a3a';

  // 인라인 스타일을 포함한 독립 HTML 생성
  const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NovelSnap 내보내기</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Jua&family=Gamja+Flower&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Gamja Flower', 'Jua', cursive;
      background: ${bgColor};
      color: ${textColor};
      padding: 24px;
      min-height: 100vh;
    }
    .preview-content { max-width: 680px; margin: 0 auto; }
    .narration {
      font-family: 'Gamja Flower', cursive;
      font-size: 16px;
      line-height: 1.9;
      color: ${textColor};
      padding: 8px 12px;
      margin: 4px 0;
    }
    .paragraph-break { height: 12px; }
    .chat-row {
      display: flex;
      align-items: flex-end;
      margin: 10px 0;
      gap: 8px;
    }
    .chat-row.right { flex-direction: row-reverse; }
    .avatar {
      width: 44px; height: 44px; border-radius: 50%;
      object-fit: cover; flex-shrink: 0;
      border: 2px solid #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    }
    .avatar-placeholder {
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, #ffb3c6, #ffd6e0);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    }
    .chat-info { display: flex; flex-direction: column; gap: 3px; }
    .chat-row.right .chat-info { align-items: flex-end; }
    .char-name {
      font-size: 12px; font-weight: bold;
      color: #888; padding: 0 6px;
    }
    .bubble {
      max-width: 260px;
      padding: 10px 14px;
      border-radius: 18px;
      font-size: 15px;
      line-height: 1.6;
      position: relative;
      word-break: break-word;
      box-shadow: 0 2px 8px rgba(0,0,0,0.10);
    }
    .bubble-dialogue {
      background: #fff;
      color: #333;
      border-radius: 4px 18px 18px 18px;
    }
    .chat-row.right .bubble-dialogue {
      background: #ffe066;
      border-radius: 18px 4px 18px 18px;
    }
    .bubble-thought {
      background: rgba(220, 200, 255, 0.55);
      color: #5c4a7f;
      font-style: italic;
      border-radius: 18px;
      border: 1.5px dashed #c4a8e8;
    }
    .thought-row { justify-content: center; }
    .thought-row .bubble-thought { text-align: center; }
  </style>
</head>
<body>
<div class="preview-content">
${preview.innerHTML}
</div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const link = document.createElement('a');
  link.download = 'novelsnap.html';
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
}

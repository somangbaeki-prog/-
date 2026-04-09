/**
 * parser.js - 소설 텍스트 파싱 로직
 * 소설 텍스트를 서술 / 대사 / 속마음으로 분류합니다.
 */

/**
 * 소설 텍스트를 파싱하여 세그먼트 배열로 반환합니다.
 * @param {string} text - 원본 소설 텍스트
 * @returns {Array} segments - 파싱된 세그먼트 배열
 */
function parseNovelText(text) {
  const segments = [];
  let remaining = text;

  while (remaining.length > 0) {
    // 큰따옴표 대사 찾기 " "
    const dialogueMatch = remaining.match(/^([\s\S]*?)[""]([^""]+)[""]/);
    // 작은따옴표 속마음 찾기 ' '
    const thoughtMatch = remaining.match(/^([\s\S]*?)[''']([^''']+)[''']/);

    // 앞에 오는 것 우선 처리
    const dBefore = dialogueMatch ? dialogueMatch[1].length : Infinity;
    const tBefore = thoughtMatch ? thoughtMatch[1].length : Infinity;

    if (!dialogueMatch && !thoughtMatch) {
      // 더 이상 대사/속마음 없음
      const narration = remaining.trim();
      if (narration) {
        segments.push({ type: 'narration', text: narration });
      }
      break;
    }

    if (dBefore <= tBefore && dialogueMatch) {
      // 대사가 먼저 옴
      const before = dialogueMatch[1];
      const dialogue = dialogueMatch[2];

      if (before.trim()) {
        segments.push({ type: 'narration', text: before.trim() });
      }
      segments.push({ type: 'dialogue', text: dialogue, characterId: null });
      remaining = remaining.slice(dialogueMatch[0].length);
    } else if (thoughtMatch) {
      // 속마음이 먼저 옴
      const before = thoughtMatch[1];
      const thought = thoughtMatch[2];

      if (before.trim()) {
        segments.push({ type: 'narration', text: before.trim() });
      }
      segments.push({ type: 'thought', text: thought, characterId: null });
      remaining = remaining.slice(thoughtMatch[0].length);
    }
  }

  return segments;
}

/**
 * 여러 줄로 나뉜 텍스트를 파싱합니다.
 * 빈 줄은 문단 구분으로 처리합니다.
 * @param {string} text - 원본 소설 텍스트
 * @returns {Array} segments
 */
function parseNovelTextByLines(text) {
  const segments = [];
  const lines = text.split('\n');

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      segments.push({ type: 'break' });
      continue;
    }

    const lineSegments = parseNovelText(trimmed);
    segments.push(...lineSegments);
  }

  // 연속된 break 제거
  const deduped = [];
  for (let i = 0; i < segments.length; i++) {
    if (segments[i].type === 'break' && deduped.length > 0 && deduped[deduped.length - 1].type === 'break') {
      continue;
    }
    deduped.push(segments[i]);
  }

  // 앞뒤 break 제거
  while (deduped.length > 0 && deduped[0].type === 'break') deduped.shift();
  while (deduped.length > 0 && deduped[deduped.length - 1].type === 'break') deduped.pop();

  return deduped;
}

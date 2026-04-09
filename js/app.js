/**
 * app.js - NovelSnap 메인 앱 로직
 */

// ── 상태 ──────────────────────────────────────────────────────────────
const state = {
  characters: [],       // { id, name, imageData, side }
  segments: [],         // 파싱된 세그먼트 배열
  bgColor: '#fff8f0',
  textColor: '#5c4a3a',
  bubbleColorLeft: '#ffffff',
  bubbleColorRight: '#ffe066',
  fontFamily: "'Gamja Flower', cursive",
};

let nextCharId = 1;

// ── 초기화 ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initColorPickers();
  initBubbleColorPickers();
  initThemePresets();
  initFontSelector();
  initCharacterForm();
  initConvertButton();
  initExportButtons();
  updatePreviewColors();
});

// ── 컬러 피커 ─────────────────────────────────────────────────────────
function initColorPickers() {
  const bgPicker = document.getElementById('bg-color');
  const textPicker = document.getElementById('text-color');

  bgPicker.value = state.bgColor;
  textPicker.value = state.textColor;

  bgPicker.addEventListener('input', (e) => {
    state.bgColor = e.target.value;
    updatePreviewColors();
  });
  textPicker.addEventListener('input', (e) => {
    state.textColor = e.target.value;
    updatePreviewColors();
    renderPreview();
  });
}

function updatePreviewColors() {
  const preview = document.getElementById('preview-content');
  if (preview) {
    preview.style.backgroundColor = state.bgColor;
    preview.style.color = state.textColor;
    preview.style.fontFamily = state.fontFamily;
  }
}

// ── 말풍선 컬러 피커 ──────────────────────────────────────────────────
function initBubbleColorPickers() {
  const leftPicker = document.getElementById('bubble-left-color');
  const rightPicker = document.getElementById('bubble-right-color');
  if (!leftPicker || !rightPicker) return;

  leftPicker.value = state.bubbleColorLeft;
  rightPicker.value = state.bubbleColorRight;

  leftPicker.addEventListener('input', (e) => {
    state.bubbleColorLeft = e.target.value;
    renderPreview();
  });
  rightPicker.addEventListener('input', (e) => {
    state.bubbleColorRight = e.target.value;
    renderPreview();
  });
}

// ── 테마 프리셋 ────────────────────────────────────────────────────────
const THEMES = [
  { name: '🌸 파스텔 핑크',      bg: '#fff0f5', text: '#7c3a5a', bLeft: '#ffffff', bRight: '#ffcce0' },
  { name: '💜 파스텔 라벤더',    bg: '#f3f0ff', text: '#4a3a7c', bLeft: '#ffffff', bRight: '#e0d5ff' },
  { name: '🌿 파스텔 민트',      bg: '#f0fff8', text: '#2d6a52', bLeft: '#ffffff', bRight: '#b5f0d8' },
  { name: '🍑 파스텔 피치',      bg: '#fff5f0', text: '#7c4a3a', bLeft: '#ffffff', bRight: '#ffd5c0' },
  { name: '🩵 파스텔 스카이블루', bg: '#f0f8ff', text: '#1a4a7c', bLeft: '#ffffff', bRight: '#c0deff' },
  { name: '🍋 파스텔 레몬',      bg: '#fffde7', text: '#5c4a00', bLeft: '#ffffff', bRight: '#fff3a0' },
  { name: '🌹 파스텔 로즈',      bg: '#fff0f3', text: '#8c2a4a', bLeft: '#ffffff', bRight: '#ffc0cc' },
  { name: '🪻 파스텔 라일락',    bg: '#f8f0ff', text: '#5a3a8c', bLeft: '#ffffff', bRight: '#d8c0f5' },
];

function initThemePresets() {
  const container = document.getElementById('theme-presets');
  THEMES.forEach((theme) => {
    const btn = document.createElement('button');
    btn.className = 'theme-btn';
    btn.textContent = theme.name;
    btn.style.background = theme.bg;
    btn.style.color = theme.text;
    btn.title = theme.name;
    btn.addEventListener('click', () => {
      state.bgColor = theme.bg;
      state.textColor = theme.text;
      state.bubbleColorLeft = theme.bLeft;
      state.bubbleColorRight = theme.bRight;
      document.getElementById('bg-color').value = theme.bg;
      document.getElementById('text-color').value = theme.text;
      document.getElementById('bubble-left-color').value = theme.bLeft;
      document.getElementById('bubble-right-color').value = theme.bRight;
      document.getElementById('bg-color-value').textContent = theme.bg;
      document.getElementById('text-color-value').textContent = theme.text;
      document.getElementById('bubble-left-color-value').textContent = theme.bLeft;
      document.getElementById('bubble-right-color-value').textContent = theme.bRight;
      updatePreviewColors();
      renderPreview();
    });
    container.appendChild(btn);
  });
}

// ── 폰트 선택 ──────────────────────────────────────────────────────────
const FONTS = [
  { name: 'Gamja Flower (감자꽃) ★기본', family: "'Gamja Flower', cursive" },
  { name: 'Jua (주아)',                  family: "'Jua', sans-serif" },
  { name: 'Noto Sans KR',               family: "'Noto Sans KR', sans-serif" },
  { name: 'Nanum Gothic (나눔고딕)',     family: "'Nanum Gothic', sans-serif" },
  { name: 'Nanum Myeongjo (나눔명조)',   family: "'Nanum Myeongjo', serif" },
  { name: 'Nanum Pen Script (나눔펜)',   family: "'Nanum Pen Script', cursive" },
  { name: 'Do Hyeon (도현)',             family: "'Do Hyeon', sans-serif" },
  { name: 'Gothic A1 (고딕A1)',          family: "'Gothic A1', sans-serif" },
  { name: 'Black Han Sans (검은고딕)',   family: "'Black Han Sans', sans-serif" },
  { name: 'Sunflower (해바라기)',        family: "'Sunflower', sans-serif" },
  { name: 'Cute Font (귀여운폰트)',      family: "'Cute Font', cursive" },
  { name: 'Gaegu (개구)',                family: "'Gaegu', cursive" },
  { name: 'Hi Melody (하이멜로디)',      family: "'Hi Melody', cursive" },
  { name: 'Song Myung (송명)',           family: "'Song Myung', serif" },
  { name: 'Single Day (싱글데이)',       family: "'Single Day', cursive" },
];

function initFontSelector() {
  const select = document.getElementById('font-select');
  if (!select) return;

  FONTS.forEach((font) => {
    const opt = document.createElement('option');
    opt.value = font.family;
    opt.textContent = font.name;
    opt.style.fontFamily = font.family;
    if (font.family === state.fontFamily) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener('change', (e) => {
    state.fontFamily = e.target.value;
    updatePreviewColors();
    renderPreview();
  });
}

// ── 캐릭터 관리 ────────────────────────────────────────────────────────
function initCharacterForm() {
  const form = document.getElementById('char-form');
  const imageInput = document.getElementById('char-image');
  const preview = document.getElementById('char-image-preview');

  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      preview.src = ev.target.result;
      preview.style.display = 'block';
      preview.dataset.selected = 'true';
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    addCharacter();
  });
}

function addCharacter() {
  const nameInput = document.getElementById('char-name');
  const imageInput = document.getElementById('char-image');
  const sideSelect = document.getElementById('char-side');
  const preview = document.getElementById('char-image-preview');

  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    return;
  }

  const character = {
    id: nextCharId++,
    name,
    imageData: preview.dataset.selected === 'true' && preview.src ? preview.src : null,
    side: sideSelect.value,
  };

  state.characters.push(character);
  renderCharacterList();
  updateAllDropdowns();

  // 폼 리셋
  nameInput.value = '';
  imageInput.value = '';
  preview.src = '';
  preview.style.display = 'none';
  delete preview.dataset.selected;
}

function removeCharacter(id) {
  state.characters = state.characters.filter((c) => c.id !== id);
  // 세그먼트에서 해당 캐릭터 할당 해제
  state.segments.forEach((seg) => {
    if (seg.characterId === id) seg.characterId = null;
  });
  renderCharacterList();
  updateAllDropdowns();
  renderPreview();
}

function renderCharacterList() {
  const list = document.getElementById('char-list');
  list.innerHTML = '';

  if (state.characters.length === 0) {
    list.innerHTML = '<p class="empty-msg">아직 등록된 캐릭터가 없어요 💭</p>';
    return;
  }

  state.characters.forEach((char) => {
    const item = document.createElement('div');
    item.className = 'char-item';

    const avatar = char.imageData
      ? `<img src="${char.imageData}" class="char-avatar" alt="${char.name}">`
      : `<div class="char-avatar-placeholder">👤</div>`;

    const sideLabel = char.side === 'right' ? '오른쪽' : '왼쪽';

    item.innerHTML = `
      ${avatar}
      <div class="char-item-info">
        <span class="char-item-name">${char.name}</span>
        <span class="char-item-side">${sideLabel}</span>
      </div>
      <button class="char-delete-btn" onclick="removeCharacter(${char.id})" title="삭제">✕</button>
    `;
    list.appendChild(item);
  });
}

// ── 변환 ────────────────────────────────────────────────────────────
function initConvertButton() {
  document.getElementById('btn-convert').addEventListener('click', () => {
    const text = document.getElementById('novel-input').value;
    state.segments = parseNovelTextByLines(text);
    renderPreview();
    // 모바일에서 미리보기로 스크롤
    if (window.innerWidth < 900) {
      document.getElementById('preview-panel').scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// ── 미리보기 렌더링 ────────────────────────────────────────────────────
function renderPreview() {
  const container = document.getElementById('preview-content');
  container.innerHTML = '';
  container.style.backgroundColor = state.bgColor;
  container.style.color = state.textColor;
  container.style.fontFamily = state.fontFamily;

  if (state.segments.length === 0) {
    container.innerHTML = `<div class="preview-placeholder">
      <div class="placeholder-emoji">📖</div>
      <p>왼쪽에 소설 텍스트를 입력하고<br>✨ 변환하기 버튼을 눌러주세요!</p>
    </div>`;
    return;
  }

  state.segments.forEach((seg, idx) => {
    if (seg.type === 'break') {
      const br = document.createElement('div');
      br.className = 'paragraph-break';
      container.appendChild(br);
      return;
    }

    if (seg.type === 'narration') {
      const p = document.createElement('div');
      p.className = 'narration';
      p.style.color = state.textColor;
      p.textContent = seg.text;
      container.appendChild(p);
      return;
    }

    if (seg.type === 'dialogue') {
      container.appendChild(buildChatRow(seg, idx));
      return;
    }

    if (seg.type === 'thought') {
      container.appendChild(buildThoughtRow(seg, idx));
      return;
    }
  });
}

function buildChatRow(seg, idx) {
  const char = state.characters.find((c) => c.id === seg.characterId);
  const isRight = char ? char.side === 'right' : false;

  const row = document.createElement('div');
  row.className = `chat-row${isRight ? ' right' : ''}`;
  row.dataset.segIdx = idx;

  // 아바타
  const avatarDiv = document.createElement('div');
  if (char && char.imageData) {
    const img = document.createElement('img');
    img.src = char.imageData;
    img.className = 'avatar';
    img.alt = char.name;
    avatarDiv.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'avatar-placeholder';
    placeholder.textContent = char && char.name ? char.name[0] : '?';
    avatarDiv.appendChild(placeholder);
  }

  // 말풍선 그룹
  const infoDiv = document.createElement('div');
  infoDiv.className = 'chat-info';

  if (char) {
    const nameEl = document.createElement('div');
    nameEl.className = 'char-name';
    nameEl.textContent = char.name;
    infoDiv.appendChild(nameEl);
  }

  const bubble = document.createElement('div');
  bubble.className = 'bubble bubble-dialogue';
  bubble.style.backgroundColor = isRight ? state.bubbleColorRight : state.bubbleColorLeft;
  bubble.textContent = seg.text;
  infoDiv.appendChild(bubble);

  // 캐릭터 선택 드롭다운
  const dropdown = buildCharDropdown(seg, idx);
  infoDiv.appendChild(dropdown);

  row.appendChild(avatarDiv);
  row.appendChild(infoDiv);

  return row;
}

function buildThoughtRow(seg, idx) {
  const char = state.characters.find((c) => c.id === seg.characterId);
  const isRight = char ? char.side === 'right' : false;

  const row = document.createElement('div');
  row.className = `chat-row thought-row${isRight ? ' right' : ''}`;
  row.dataset.segIdx = idx;

  // 아바타
  const avatarDiv = document.createElement('div');
  if (char && char.imageData) {
    const img = document.createElement('img');
    img.src = char.imageData;
    img.className = 'avatar';
    img.alt = char.name;
    avatarDiv.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'avatar-placeholder';
    placeholder.textContent = char && char.name ? char.name[0] : '💭';
    avatarDiv.appendChild(placeholder);
  }

  // 말풍선 그룹
  const infoDiv = document.createElement('div');
  infoDiv.className = 'chat-info';

  if (char) {
    const nameEl = document.createElement('div');
    nameEl.className = 'char-name';
    nameEl.textContent = char.name;
    infoDiv.appendChild(nameEl);
  }

  const bubble = document.createElement('div');
  bubble.className = 'bubble bubble-thought';
  bubble.textContent = `💭 ${seg.text}`;
  infoDiv.appendChild(bubble);

  const dropdown = buildCharDropdown(seg, idx);
  infoDiv.appendChild(dropdown);

  row.appendChild(avatarDiv);
  row.appendChild(infoDiv);
  return row;
}

function buildCharDropdown(seg, idx) {
  const wrapper = document.createElement('div');
  wrapper.className = 'char-dropdown-wrapper';

  const select = document.createElement('select');
  select.className = 'char-dropdown';
  select.dataset.segIdx = idx;

  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = '— 캐릭터 선택 —';
  select.appendChild(defaultOpt);

  state.characters.forEach((char) => {
    const opt = document.createElement('option');
    opt.value = char.id;
    opt.textContent = char.name;
    if (seg.characterId === char.id) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener('change', (e) => {
    const val = e.target.value;
    state.segments[idx].characterId = val ? parseInt(val) : null;
    renderPreview();
  });

  wrapper.appendChild(select);
  return wrapper;
}

function updateAllDropdowns() {
  // 미리보기 다시 그리기
  renderPreview();
}

// ── 내보내기 버튼 ─────────────────────────────────────────────────────
function initExportButtons() {
  document.getElementById('btn-export-png').addEventListener('click', exportToPNG);
  document.getElementById('btn-export-html').addEventListener('click', exportToHTML);
}

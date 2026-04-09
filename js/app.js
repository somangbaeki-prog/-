/**
 * app.js - NovelSnap 메인 앱 로직
 */

// ── 상태 ──────────────────────────────────────────────────────────────
const state = {
  characters: [],       // { id, name, imageData, side }
  segments: [],         // 파싱된 세그먼트 배열
  bgColor: '#fff8f0',
  textColor: '#5c4a3a',
};

let nextCharId = 1;

// ── 초기화 ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initColorPickers();
  initThemePresets();
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
  }
}

// ── 테마 프리셋 ────────────────────────────────────────────────────────
const THEMES = [
  { name: '🌸 핑크', bg: '#fff0f5', text: '#7c3a5a' },
  { name: '💜 라벤더', bg: '#f3f0ff', text: '#4a3a7c' },
  { name: '🌿 민트', bg: '#f0fff8', text: '#2d6a52' },
  { name: '🍋 레몬', bg: '#fffde7', text: '#5c4a00' },
  { name: '🩵 스카이', bg: '#f0f8ff', text: '#1a4a7c' },
  { name: '🤍 화이트', bg: '#ffffff', text: '#333333' },
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
      document.getElementById('bg-color').value = theme.bg;
      document.getElementById('text-color').value = theme.text;
      updatePreviewColors();
      renderPreview();
    });
    container.appendChild(btn);
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
  const row = document.createElement('div');
  row.className = 'chat-row thought-row';
  row.dataset.segIdx = idx;

  const infoDiv = document.createElement('div');
  infoDiv.className = 'chat-info thought-info';

  const bubble = document.createElement('div');
  bubble.className = 'bubble bubble-thought';
  bubble.textContent = `💭 ${seg.text}`;
  infoDiv.appendChild(bubble);

  const dropdown = buildCharDropdown(seg, idx);
  infoDiv.appendChild(dropdown);

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

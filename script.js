// ===== 전역 변수 =====
let isDragging = false;
let currentTextAlign = 'left';
let currentVerticalAlign = 'middle';
let textPosition = { x: 0.75, y: 0.5 }; // 우측 절반의 중앙 (0.5~1.0 범위에서 0.75)
let currentFontFamily = 'Roboto'; // 한글 지원을 위해 Roboto로 변경

// ===== 폰트 정보 매핑 =====
const fontInfo = {
  // 글로벌 폰트 (확실한 한글 지원)
  'Inter': { weight: '500', fallback: 'sans-serif' },
  'Roboto': { weight: '400', fallback: 'sans-serif' },
  'Open Sans': { weight: '400', fallback: 'sans-serif' },
  'Lato': { weight: '400', fallback: 'sans-serif' },
  'Montserrat': { weight: '500', fallback: 'sans-serif' },
  // 개성있는 폰트
  'Jua': { weight: '400', fallback: 'sans-serif' },
  'Gaegu': { weight: '400', fallback: 'sans-serif' },
  'Do Hyeon': { weight: '400', fallback: 'sans-serif' },
  'Black Han Sans': { weight: '400', fallback: 'sans-serif' },
  'Sunflower': { weight: '500', fallback: 'sans-serif' }
};

// ===== 그라데이션 관리 =====
function updateGradient() {
  const angle = document.getElementById("angle-select").value;
  const color1 = document.getElementById("color1").value;
  const color2 = document.getElementById("color2").value;
  const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
  document.getElementById("gradient-preview").style.background = gradient;
}

// ===== 텍스트 관리 =====
function updateUserText() {
  const userText = document.getElementById("user-text").value;
  const draggableText = document.getElementById("draggable-text");
  draggableText.innerText = userText;
  updateTextPosition();
}

function updateTextStyle() {
  const fontSize = document.getElementById("font-size").value;
  const textColor = document.getElementById("text-color").value;
  const shadowSize = document.getElementById("text-shadow").value;
  const fontFamily = document.getElementById("font-family").value;
  const draggableText = document.getElementById("draggable-text");
  
  // 현재 폰트 패밀리 업데이트
  currentFontFamily = fontFamily;
  
  document.getElementById("font-size-value").innerText = fontSize + "px";
  document.getElementById("shadow-value").innerText = shadowSize + "px";
  
  const fontInfo_current = fontInfo[fontFamily];
  const fullFontFamily = `"${fontFamily}", ${fontInfo_current.fallback}`;
  
  draggableText.style.fontSize = fontSize + "px";
  draggableText.style.color = textColor;
  draggableText.style.fontFamily = fullFontFamily;
  draggableText.style.fontWeight = fontInfo_current.weight;
  draggableText.style.textShadow = `${shadowSize}px ${shadowSize}px ${shadowSize * 2}px rgba(0,0,0,0.5)`;
  draggableText.style.textAlign = currentTextAlign;
}

// ===== 텍스트 정렬 =====
function setTextAlign(align) {
  currentTextAlign = align;
  document.querySelectorAll('.alignment-buttons button').forEach(btn => {
    if (btn.id.includes('align-')) btn.classList.remove('active');
  });
  document.getElementById('align-' + align).classList.add('active');
  updateTextStyle();
  updateTextPosition();
}

function setVerticalAlign(align) {
  currentVerticalAlign = align;
  document.querySelectorAll('.alignment-buttons button').forEach(btn => {
    if (btn.id.includes('valign-')) btn.classList.remove('active');
  });
  document.getElementById('valign-' + align).classList.add('active');
  
  if (align === 'top') {
    textPosition.y = 0.2;
  } else if (align === 'middle') {
    textPosition.y = 0.5;
  } else if (align === 'bottom') {
    textPosition.y = 0.8;
  }
  updateTextPosition();
}

// ===== 텍스트 위치 관리 =====
function updateTextPosition() {
  const preview = document.getElementById("gradient-preview");
  const draggableText = document.getElementById("draggable-text");
  const rect = preview.getBoundingClientRect();
  
  // 텍스트는 우측 절반(50%~100%)에만 위치하도록 제한
  const rightHalfWidth = rect.width * 0.5;
  const rightHalfStart = rect.width * 0.5;
  
  // X 위치: 0.5~1.0 범위를 우측 절반으로 매핑
  const relativeX = (textPosition.x - 0.5) * 2; // 0.5~1.0을 0~1로 변환
  const actualX = rightHalfStart + (relativeX * rightHalfWidth);
  
  // Y 위치는 전체 높이 기준
  const y = textPosition.y * rect.height;
  
  // 텍스트 영역을 우측 절반으로 설정
  draggableText.style.left = rightHalfStart + "px";
  draggableText.style.width = (rightHalfWidth - 40) + "px"; // 패딩 40px 제외
  draggableText.style.top = y + "px";
  draggableText.style.transform = "translateY(-50%)";
  
  // 텍스트 정렬 적용
  draggableText.style.textAlign = currentTextAlign;
}

// ===== 드래그 앤 드롭 설정 =====
function setupDragAndDrop() {
  const draggableText = document.getElementById("draggable-text");
  const preview = document.getElementById("gradient-preview");
  const positionIndicator = document.getElementById("position-indicator");

  draggableText.addEventListener('mousedown', (e) => {
    isDragging = true;
    positionIndicator.style.display = 'block';
    e.preventDefault();
  });

  preview.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const rect = preview.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // X 위치는 우측 절반(50%~100%)으로 제한
      const rightHalfStart = rect.width * 0.5;
      const rightHalfWidth = rect.width * 0.5;
      const relativeMouseX = Math.max(0, Math.min(rightHalfWidth, mouseX - rightHalfStart));
      textPosition.x = 0.5 + (relativeMouseX / rightHalfWidth) * 0.5;
      
      // Y 위치는 전체 높이 기준
      textPosition.y = mouseY / rect.height;
      
      // 경계값 제한
      textPosition.x = Math.max(0.5, Math.min(1.0, textPosition.x));
      textPosition.y = Math.max(0.1, Math.min(0.9, textPosition.y));
      
      updateTextPosition();
      
      // 위치 표시
      positionIndicator.style.left = mouseX + "px";
      positionIndicator.style.top = mouseY + "px";
      positionIndicator.innerText = `${Math.round(textPosition.x * 100)}%, ${Math.round(textPosition.y * 100)}%`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    positionIndicator.style.display = 'none';
  });
}

// ===== 이미지 업로드 =====
function uploadImage() {
  const fileInput = document.getElementById("image-upload");
  const file = fileInput.files[0];
  
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function (e) {
    const overlayImage = document.getElementById("overlay-image");
    overlayImage.src = e.target.result;
    overlayImage.style.display = "block";
  };
  reader.readAsDataURL(file);
}

// ===== 프리셋 적용 =====
function applyPreset(preset) {
  const config = generateRandomPreset(preset);
  
  document.getElementById("angle-select").value = config.angle;
  document.getElementById("color1").value = config.color1;
  document.getElementById("color2").value = config.color2;
  document.getElementById("font-size").value = config.fontSize;
  document.getElementById("text-color").value = config.textColor;
  document.getElementById("font-family").value = config.fontFamily;
  
  updateGradient();
  updateTextStyle();
}

// 랜덤 프리셋 생성 함수
function generateRandomPreset(presetType) {
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  const globalFonts = ['Roboto', 'Inter', 'Open Sans', 'Lato', 'Montserrat'];
  const uniqueFonts = ['Jua', 'Gaegu', 'Do Hyeon', 'Black Han Sans', 'Sunflower'];
  
  const randomAngle = angles[Math.floor(Math.random() * angles.length)];
  const randomFontSize = Math.floor(Math.random() * 17) + 16; // 16-32px
  
  switch(presetType) {
    case 'modern':
      const modernColor1 = generateRandomModernColor();
      const modernColor2 = generateRandomModernColor();
      return {
        angle: randomAngle,
        color1: modernColor1,
        color2: modernColor2,
        fontSize: randomFontSize,
        textColor: getOptimalTextColor(modernColor1, modernColor2),
        fontFamily: globalFonts[Math.floor(Math.random() * globalFonts.length)]
      };
      
    case 'classic':
      const classicColor1 = generateRandomClassicColor();
      const classicColor2 = generateRandomClassicColor();
      return {
        angle: randomAngle,
        color1: classicColor1,
        color2: classicColor2,
        fontSize: Math.floor(Math.random() * 7) + 16, // 16-22px (더 작게)
        textColor: getOptimalTextColor(classicColor1, classicColor2),
        fontFamily: globalFonts[Math.floor(Math.random() * globalFonts.length)]
      };
      
    case 'warm':
      const warmColor1 = generateRandomWarmColor();
      const warmColor2 = generateRandomWarmColor();
      return {
        angle: randomAngle,
        color1: warmColor1,
        color2: warmColor2,
        fontSize: randomFontSize,
        textColor: getOptimalTextColor(warmColor1, warmColor2),
        fontFamily: uniqueFonts[Math.floor(Math.random() * uniqueFonts.length)]
      };
      
    case 'cool':
      const coolColor1 = generateRandomCoolColor();
      const coolColor2 = generateRandomCoolColor();
      return {
        angle: randomAngle,
        color1: coolColor1,
        color2: coolColor2,
        fontSize: randomFontSize,
        textColor: getOptimalTextColor(coolColor1, coolColor2),
        fontFamily: Math.random() > 0.5 ? 
          globalFonts[Math.floor(Math.random() * globalFonts.length)] :
          uniqueFonts[Math.floor(Math.random() * uniqueFonts.length)]
      };
      
    default:
      return generateRandomPreset('modern');
  }
}

// 모던 스타일 색상 생성 (차가운 톤)
function generateRandomModernColor() {
  const modernHues = [200, 220, 240, 260, 280, 300]; // 파란색~보라색 계열
  const hue = modernHues[Math.floor(Math.random() * modernHues.length)];
  const saturation = Math.floor(Math.random() * 40) + 60; // 60-100%
  const lightness = Math.floor(Math.random() * 30) + 50;  // 50-80%
  return hslToHex(hue, saturation, lightness);
}

// 클래식 스타일 색상 생성 (중성 톤)
function generateRandomClassicColor() {
  const classicHues = [0, 30, 45, 60]; // 회색, 베이지, 갈색 계열
  const hue = classicHues[Math.floor(Math.random() * classicHues.length)];
  const saturation = Math.floor(Math.random() * 20) + 10; // 10-30% (낮은 채도)
  const lightness = Math.floor(Math.random() * 30) + 70;  // 70-100%
  return hslToHex(hue, saturation, lightness);
}

// 따뜻한 스타일 색상 생성 (따뜻한 톤)
function generateRandomWarmColor() {
  const warmHues = [0, 15, 30, 45, 330, 345]; // 빨강, 주황, 노랑, 분홍 계열
  const hue = warmHues[Math.floor(Math.random() * warmHues.length)];
  const saturation = Math.floor(Math.random() * 30) + 50; // 50-80%
  const lightness = Math.floor(Math.random() * 25) + 65;  // 65-90%
  return hslToHex(hue, saturation, lightness);
}

// 시원한 스타일 색상 생성 (시원한 톤)
function generateRandomCoolColor() {
  const coolHues = [120, 150, 180, 210, 240, 270]; // 초록, 청록, 파랑 계열
  const hue = coolHues[Math.floor(Math.random() * coolHues.length)];
  const saturation = Math.floor(Math.random() * 40) + 40; // 40-80%
  const lightness = Math.floor(Math.random() * 30) + 60;  // 60-90%
  return hslToHex(hue, saturation, lightness);
}

// 배경색에 따른 최적의 텍스트 색상 자동 결정
function getOptimalTextColor(color1, color2) {
  // 두 배경색의 평균 밝기 계산
  const brightness1 = getColorBrightness(color1);
  const brightness2 = getColorBrightness(color2);
  const averageBrightness = (brightness1 + brightness2) / 2;
  
  // 밝기에 따라 검정 또는 흰색 선택
  return averageBrightness > 128 ? '#333333' : '#ffffff';
}

// 색상의 밝기 계산 (0-255)
function getColorBrightness(hexColor) {
  // HEX를 RGB로 변환
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // 인간의 눈에 가중치를 둔 밝기 계산
  return (r * 0.299 + g * 0.587 + b * 0.114);
}

// ===== 색상 생성 =====
function randomizePastelColors() {
  document.getElementById("color1").value = getRandomPastelColor();
  document.getElementById("color2").value = getRandomPastelColor();
  updateGradient();
}

function randomizeColors() {
  document.getElementById("color1").value = getRandomColor();
  document.getElementById("color2").value = getRandomColor();
  updateGradient();
}

function getRandomPastelColor() {
  // 진짜 파스텔 색상: HSL 사용
  // Hue: 0~360 (모든 색상)
  // Saturation: 40~70% (낮은 채도로 부드럽게)
  // Lightness: 75~90% (높은 명도로 밝게)
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 40; // 40~70%
  const lightness = Math.floor(Math.random() * 15) + 75;  // 75~90%
  
  return hslToHex(hue, saturation, lightness);
}

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// HSL을 HEX로 변환하는 헬퍼 함수
function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// ===== 이미지 다운로드 =====
function downloadImage() {
  const overlayImage = document.getElementById("overlay-image");
  const userText = document.getElementById("user-text").value;
  const fontSize = parseInt(document.getElementById("font-size").value);
  const textColor = document.getElementById("text-color").value;
  const shadowSize = parseInt(document.getElementById("text-shadow").value);
  const color1 = document.getElementById("color1").value;
  const color2 = document.getElementById("color2").value;
  const angle = parseInt(document.getElementById("angle-select").value);

  const canvasWidth = 1920;
  const canvasHeight = 1080;
  const previewWidth = 640;
  const previewHeight = 360;
  const scaleX = canvasWidth / previewWidth;
  const scaleY = canvasHeight / previewHeight;

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");

  // 선택된 폰트 로드
  const fontInfo_current = fontInfo[currentFontFamily];
  const fontLoadString = `${fontInfo_current.weight} ${Math.round(fontSize * scaleY)}px "${currentFontFamily}"`;
  
  document.fonts.load(fontLoadString).then(() => {
    // 그라데이션 배경
    const { x0, y0, x1, y1 } = getGradientCoordinates(angle, canvasWidth, canvasHeight);
    const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 이미지 그리기
    if (overlayImage.src && overlayImage.style.display !== "none") {
      const img = new Image();
      img.src = overlayImage.src;
      img.onload = function () {
        const padding = 20 * scaleX;
        const maxImgWidth = (canvasWidth - padding * 2) * 0.5;
        const maxImgHeight = canvasHeight - padding * 2;
        
        const widthRatio = maxImgWidth / img.width;
        const heightRatio = maxImgHeight / img.height;
        const scale = Math.min(widthRatio, heightRatio, 1);
        
        const imgWidth = img.width * scale;
        const imgHeight = img.height * scale;
        const imgX = padding;
        const imgY = padding + (maxImgHeight - imgHeight) / 2;
        
        ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
        
        // 텍스트 그리기
        drawAdvancedText(ctx, userText, fontSize * scaleY, textColor, shadowSize * Math.max(scaleX, scaleY), canvasWidth, canvasHeight);
        
        downloadCanvas(canvas);
      };
    } else {
      // 텍스트만 그리기
      drawAdvancedText(ctx, userText, fontSize * scaleY, textColor, shadowSize * Math.max(scaleX, scaleY), canvasWidth, canvasHeight);
      downloadCanvas(canvas);
    }
  });
}

// ===== 고급 텍스트 그리기 =====
function drawAdvancedText(ctx, text, fontSize, color, shadowSize, canvasWidth, canvasHeight) {
  if (!text.trim()) return;
  
  const fontInfo_current = fontInfo[currentFontFamily];
  ctx.font = `${fontInfo_current.weight} ${fontSize}px "${currentFontFamily}", ${fontInfo_current.fallback}`;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  
  // 그림자 설정
  if (shadowSize > 0) {
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowOffsetX = shadowSize;
    ctx.shadowOffsetY = shadowSize;
    ctx.shadowBlur = shadowSize * 2;
  }
  
  const lines = text.split('\n');
  const lineHeight = fontSize * 1.5;
  
  // 텍스트 위치 계산 - 우측 절반 영역 내에서
  const rightHalfStart = canvasWidth * 0.5;
  const rightHalfWidth = canvasWidth * 0.5;
  const relativeX = (textPosition.x - 0.5) * 2; // 0.5~1.0을 0~1로 변환
  
  let textX;
  if (currentTextAlign === 'left') {
    textX = rightHalfStart + 40; // 좌측 정렬은 우측 절반의 시작 + 패딩
  } else if (currentTextAlign === 'center') {
    textX = rightHalfStart + (rightHalfWidth / 2); // 우측 절반의 중앙
  } else if (currentTextAlign === 'right') {
    textX = canvasWidth - 40; // 우측 정렬은 전체 너비에서 패딩만큼 뺀 위치
  }
  
  const textY = textPosition.y * canvasHeight;
  
  // 텍스트 정렬 설정
  ctx.textAlign = currentTextAlign;
  
  // 여러 줄 텍스트 그리기
  const totalHeight = lineHeight * lines.length;
  let startY = textY - (totalHeight - lineHeight) / 2;
  
  lines.forEach(line => {
    ctx.fillText(line, textX, startY);
    startY += lineHeight;
  });
  
  // 그림자 설정 초기화
  ctx.shadowColor = "transparent";
}

// ===== 유틸리티 함수 =====
function getGradientCoordinates(angle, width, height) {
  const angleRadians = (angle * Math.PI) / 180;
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  
  const x0 = halfWidth + Math.cos(angleRadians + Math.PI) * halfWidth;
  const y0 = halfHeight + Math.sin(angleRadians + Math.PI) * halfHeight;
  const x1 = halfWidth + Math.cos(angleRadians) * halfWidth;
  const y1 = halfHeight + Math.sin(angleRadians) * halfHeight;
  
  return { x0, y0, x1, y1 };
}

function downloadCanvas(canvas) {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `book-review-thumbnail-${Date.now()}.png`;
  link.click();
}

// ===== 초기화 =====
window.onload = function() {
  updateGradient();
  updateTextStyle();
  setupDragAndDrop();
  updateUserText();
  updateTextPosition();
}; 
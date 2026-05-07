const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, '_incoming');
const DONE_DIR = path.join(__dirname, '_incoming', '_done');
const OUTPUT_BASE = path.join(__dirname, 'images', 'works');

const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

const CATEGORIES = ['edc', 'gaming', 'tool', 'figure', 'stand'];

// 카테고리별 서브폴더 생성
function ensureDirs() {
  [...CATEGORIES, 'uncategorized'].forEach(cat => {
    const dir = path.join(OUTPUT_BASE, cat);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
}

// 파일명 접두사에서 카테고리 감지
// 예: edc_전자담배본체_01.jpg → 'edc'
function detectCategory(baseName) {
  const prefix = baseName.split('_')[0].toLowerCase();
  return CATEGORIES.includes(prefix) ? prefix : 'uncategorized';
}

async function processImages() {
  ensureDirs();

  const files = fs.readdirSync(INPUT_DIR).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return EXTENSIONS.includes(ext);
  });

  if (files.length === 0) {
    console.log('처리할 이미지가 없습니다. _incoming/ 폴더에 사진을 넣어주세요.');
    console.log('파일명 규칙: [카테고리코드]_[작업물이름]_[순서].jpg');
    console.log('예시: edc_전자담배본체_01.jpg');
    return;
  }

  console.log(`${files.length}개 이미지 처리 시작...\n`);

  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    const baseName = path.basename(file, path.extname(file));
    const category = detectCategory(baseName);
    const outDir = path.join(OUTPUT_BASE, category);

    const coverPath = path.join(outDir, `${baseName}_cover.jpg`);
    const detailPath = path.join(outDir, `${baseName}_detail.jpg`);

    try {
      // cover: 800x600 (4:3, 카드 썸네일용)
      await sharp(inputPath)
        .resize(800, 600, { fit: 'cover', position: 'centre' })
        .jpeg({ quality: 85 })
        .toFile(coverPath);

      // detail: 800x800 (1:1, 모달 상세 이미지용)
      await sharp(inputPath)
        .resize(800, 800, { fit: 'cover', position: 'centre' })
        .jpeg({ quality: 85 })
        .toFile(detailPath);

      // 원본을 _done 폴더로 이동
      fs.renameSync(inputPath, path.join(DONE_DIR, file));

      console.log(`완료: ${file} → [${category}]`);
      console.log(`  → images/works/${category}/${baseName}_cover.jpg (800x600)`);
      console.log(`  → images/works/${category}/${baseName}_detail.jpg (800x800)\n`);
    } catch (err) {
      console.error(`오류 (${file}):`, err.message);
    }
  }

  console.log('모든 이미지 처리가 완료되었습니다.');
}

processImages();

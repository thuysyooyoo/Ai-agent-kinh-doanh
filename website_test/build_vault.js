const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Đọc index.source.html (hoặc index.html nếu có nguồn đầy đủ)
const indexSourcePath = path.join(__dirname, 'index.source.html');
const indexHtmlPath = fs.existsSync(indexSourcePath) ? indexSourcePath : path.join(__dirname, 'index.html');
const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');

// Tìm vị trí Header và Modals
const headerStart = indexContent.indexOf('<!-- ═══ HEADER ═══ -->');
const loginOverlayStart = indexContent.indexOf('<!-- ═══ LOGIN SCREEN OVERLAY ═══ -->');
const editUserModalStart = indexContent.indexOf('<!-- Edit User Modal -->');
const scriptsStart = indexContent.indexOf('<!-- Security & Database Modules -->');

if (headerStart === -1 || loginOverlayStart === -1 || editUserModalStart === -1 || scriptsStart === -1) {
  console.error('Không tìm thấy các điểm đánh dấu cấu trúc trong index.html');
  process.exit(1);
}

// 1. Lấy phần workspace chính (Header, Main, Footer, Toast)
const mainWorkspace = indexContent.substring(headerStart, loginOverlayStart).trim();

// 2. Lấy phần Modals (sau login-overlay và trước script tags)
const modalsWorkspace = indexContent.substring(editUserModalStart, scriptsStart).trim();

// Toàn bộ HTML cần giấu
const workspaceHtml = mainWorkspace + '\n\n' + modalsWorkspace;

console.log('Đã trích xuất HTML workspace: độ dài', workspaceHtml.length, 'ký tự');

// 3. Đọc mã nguồn JS cần bảo vệ
const securityJs = fs.readFileSync(path.join(__dirname, 'security.js'), 'utf8');
const supabaseClientJs = fs.readFileSync(path.join(__dirname, 'supabase-client.js'), 'utf8');
const appSrcJs = fs.readFileSync(path.join(__dirname, 'app.src.js'), 'utf8');

const combinedJs = securityJs + '\n\n' + supabaseClientJs + '\n\n' + appSrcJs;
console.log('Đã gộp mã nguồn JS: độ dài', combinedJs.length, 'ký tự');

// 4. Tạo payload
const payload = JSON.stringify({
  html: workspaceHtml,
  js: combinedJs
});

// 5. Mã hóa AES-256-GCM với Secret Token từ Supabase
const SECRET_TOKEN = 'EUREKA_SECURE_TOKEN_2026_X9#mK!';
const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);

// Dùng PBKDF2 sinh key 32 bytes (256-bit) với 10,000 iterations (nhanh và chuẩn Web Crypto)
const key = crypto.pbkdf2Sync(SECRET_TOKEN, salt, 10000, 32, 'sha256');

const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
let encrypted = cipher.update(payload, 'utf8', 'base64');
encrypted += cipher.final('base64');
const authTag = cipher.getAuthTag();

const vaultData = {
  salt: salt.toString('base64'),
  iv: iv.toString('base64'),
  tag: authTag.toString('base64'),
  ciphertext: encrypted
};

// Ghi file vault.data.js dưới dạng biến window.EUREKA_VAULT
const vaultJsContent = `window.EUREKA_VAULT = ${JSON.stringify(vaultData)};`;
fs.writeFileSync(path.join(__dirname, 'vault.data.js'), vaultJsContent, 'utf8');
console.log('Đã tạo thành công vault.data.js! Kích thước:', (vaultJsContent.length / 1024).toFixed(1), 'KB');

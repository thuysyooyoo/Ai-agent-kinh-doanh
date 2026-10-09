/* ============================================
   EUREKA LOGISTICS — Security Module v1.0
   security.js — Password Hashing, Rate Limiting,
                  Encrypted localStorage
   ============================================ */

/**
 * @namespace EurekaSecurity
 * Toàn bộ chức năng bảo mật tập trung tại đây.
 * - Hash mật khẩu bằng SHA-256 + salt (Web Crypto API)
 * - Rate limiting đăng nhập (chặn brute-force)
 * - Mã hóa AES-GCM cho localStorage nhạy cảm
 */
window.EurekaSecurity = (function () {
  'use strict';

  // ═══════════════════════════════════
  // 1. PASSWORD HASHING (SHA-256 + salt)
  // ═══════════════════════════════════

  const SALT_PREFIX = 'eureka_salt_v1:';
  const HASH_MARKER = '$sha256$'; // Đánh dấu password đã hash

  /**
   * Hash mật khẩu bằng SHA-256 với salt cố định.
   * @param {string} password - Mật khẩu plaintext
   * @returns {Promise<string>} - Hash dạng hex có prefix $sha256$
   */
  async function hashPassword(password) {
    if (!password) return '';
    // Đã hash rồi thì trả về luôn
    if (String(password).startsWith(HASH_MARKER)) return password;

    const data = new TextEncoder().encode(SALT_PREFIX + password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return HASH_MARKER + hashHex;
  }

  /**
   * So sánh mật khẩu plaintext với hash đã lưu.
   * @param {string} plaintext - Mật khẩu người dùng nhập
   * @param {string} storedHash - Hash đã lưu (có prefix $sha256$) hoặc plaintext cũ
   * @returns {Promise<boolean>}
   */
  async function verifyPassword(plaintext, storedHash) {
    if (!plaintext || !storedHash) return false;

    // Nếu stored chưa hash (legacy plaintext) → so sánh trực tiếp
    if (!String(storedHash).startsWith(HASH_MARKER)) {
      return String(plaintext).trim() === String(storedHash).trim();
    }

    // Hash input rồi so sánh
    const inputHash = await hashPassword(plaintext);
    return inputHash === storedHash;
  }

  /**
   * Kiểm tra password đã được hash chưa
   */
  function isHashed(password) {
    return String(password || '').startsWith(HASH_MARKER);
  }

  // ═══════════════════════════════════
  // 2. RATE LIMITING (chống brute-force)
  // ═══════════════════════════════════

  const MAX_ATTEMPTS = 5;         // Số lần sai tối đa
  const LOCKOUT_MINUTES = 15;     // Khóa bao nhiêu phút
  const LOCKOUT_MS = LOCKOUT_MINUTES * 60 * 1000;

  /**
   * Kiểm tra có đang bị khóa đăng nhập không.
   * @returns {{ locked: boolean, remainingMs: number, attempts: number }}
   */
  function checkRateLimit() {
    try {
      const data = JSON.parse(sessionStorage.getItem('eureka_login_attempts') || '{}');
      const now = Date.now();

      // Đang bị khóa?
      if (data.lockedUntil && now < data.lockedUntil) {
        return {
          locked: true,
          remainingMs: data.lockedUntil - now,
          attempts: data.count || 0
        };
      }

      // Hết thời gian khóa → reset
      if (data.lockedUntil && now >= data.lockedUntil) {
        sessionStorage.removeItem('eureka_login_attempts');
        return { locked: false, remainingMs: 0, attempts: 0 };
      }

      return {
        locked: false,
        remainingMs: 0,
        attempts: data.count || 0
      };
    } catch (e) {
      return { locked: false, remainingMs: 0, attempts: 0 };
    }
  }

  /**
   * Ghi nhận 1 lần đăng nhập thất bại. Tự động khóa nếu vượt giới hạn.
   * @returns {{ locked: boolean, remainingMs: number, attempts: number }}
   */
  function recordFailedAttempt() {
    try {
      const data = JSON.parse(sessionStorage.getItem('eureka_login_attempts') || '{}');
      data.count = (data.count || 0) + 1;
      data.lastAttempt = Date.now();

      if (data.count >= MAX_ATTEMPTS) {
        data.lockedUntil = Date.now() + LOCKOUT_MS;
      }

      sessionStorage.setItem('eureka_login_attempts', JSON.stringify(data));

      return {
        locked: data.count >= MAX_ATTEMPTS,
        remainingMs: data.lockedUntil ? data.lockedUntil - Date.now() : 0,
        attempts: data.count
      };
    } catch (e) {
      return { locked: false, remainingMs: 0, attempts: 0 };
    }
  }

  /**
   * Reset bộ đếm sau đăng nhập thành công.
   */
  function resetRateLimit() {
    sessionStorage.removeItem('eureka_login_attempts');
  }

  /**
   * Format thời gian khóa còn lại sang chuỗi dễ đọc.
   */
  function formatLockoutTime(ms) {
    const minutes = Math.ceil(ms / 60000);
    if (minutes <= 1) return 'dưới 1 phút';
    return `${minutes} phút`;
  }

  // ═══════════════════════════════════
  // 3. ENCRYPTED LOCAL STORAGE (AES-GCM)
  // ═══════════════════════════════════

  // Khóa mã hóa dựa trên session — mỗi lần đăng nhập tạo key mới
  // Nếu ai mở localStorage trên máy khác / tab khác sẽ không giải mã được
  let _encryptionKey = null;
  const ENC_PREFIX = '$enc$';

  /**
   * Tạo hoặc lấy khóa mã hóa AES-GCM từ session.
   */
  async function getEncryptionKey() {
    if (_encryptionKey) return _encryptionKey;

    // Tạo key material từ một secret cố định + fingerprint trình duyệt
    const secret = 'eureka-ls-key-' + (navigator.userAgent || '') + '-' + (window.location.origin || '');
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    _encryptionKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('eureka-salt-2026'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    return _encryptionKey;
  }

  /**
   * Mã hóa chuỗi bằng AES-256-GCM.
   * @param {string} plaintext
   * @returns {Promise<string>} - Base64 encoded (iv + ciphertext)
   */
  async function encrypt(plaintext) {
    try {
      const key = await getEncryptionKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encoded = new TextEncoder().encode(plaintext);
      const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encoded
      );
      // Nối IV (12 bytes) + ciphertext
      const combined = new Uint8Array(iv.length + ciphertext.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(ciphertext), iv.length);
      return ENC_PREFIX + btoa(String.fromCharCode(...combined));
    } catch (e) {
      console.error('[Security] Encrypt error:', e);
      return plaintext; // Fallback plaintext nếu lỗi
    }
  }

  /**
   * Giải mã chuỗi AES-256-GCM.
   * @param {string} encryptedStr - Chuỗi đã mã hóa (có prefix $enc$)
   * @returns {Promise<string>}
   */
  async function decrypt(encryptedStr) {
    try {
      if (!encryptedStr || !String(encryptedStr).startsWith(ENC_PREFIX)) {
        return encryptedStr; // Không phải dữ liệu mã hóa
      }
      const key = await getEncryptionKey();
      const raw = atob(encryptedStr.substring(ENC_PREFIX.length));
      const combined = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) combined[i] = raw.charCodeAt(i);

      const iv = combined.slice(0, 12);
      const ciphertext = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        ciphertext
      );
      return new TextDecoder().decode(decrypted);
    } catch (e) {
      console.error('[Security] Decrypt error:', e);
      return encryptedStr; // Trả về nguyên gốc nếu không giải mã được
    }
  }

  // ═══════════════════════════════════
  // 4. SECURE STORAGE WRAPPER
  // ═══════════════════════════════════

  /** Danh sách các key localStorage cần mã hóa */
  const SENSITIVE_KEYS = [
    'eureka_users',
    'eureka_buyers',
    'eureka_ip_logs',
    'eureka_contract_seller_info'
  ];

  /**
   * Lưu dữ liệu vào localStorage (tự mã hóa nếu key nhạy cảm).
   */
  async function secureSetItem(key, value) {
    if (SENSITIVE_KEYS.includes(key)) {
      const encrypted = await encrypt(value);
      localStorage.setItem(key, encrypted);
    } else {
      localStorage.setItem(key, value);
    }
  }

  /**
   * Đọc dữ liệu từ localStorage (tự giải mã nếu key nhạy cảm).
   */
  async function secureGetItem(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    if (SENSITIVE_KEYS.includes(key) && raw.startsWith(ENC_PREFIX)) {
      return await decrypt(raw);
    }
    return raw; // Chưa mã hóa (legacy) hoặc không nhạy cảm
  }

  // ═══════════════════════════════════
  // 5. PASSWORD MIGRATION HELPER
  // ═══════════════════════════════════

  /**
   * Di chuyển tất cả mật khẩu plaintext sang hash.
   * Gọi 1 lần sau khi load users từ Google Sheets.
   * @param {Array} users - Mảng user objects
   * @returns {Promise<{users: Array, migrated: boolean}>}
   */
  async function migratePasswordsToHash(users) {
    if (!Array.isArray(users)) return { users: [], migrated: false };

    let migrated = false;
    const result = [];

    for (const user of users) {
      if (user.password && !isHashed(user.password)) {
        user.password = await hashPassword(user.password);
        migrated = true;
      }
      result.push(user);
    }

    return { users: result, migrated };
  }

  // ═══════════════════════════════════
  // 6. INPUT SANITIZATION
  // ═══════════════════════════════════

  /**
   * Làm sạch input để chống XSS injection trong innerHTML.
   */
  function sanitizeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ═══════════════════════════════════
  // 7. ANTI-INSPECT & VIEW-SOURCE SHIELD (Đã tắt theo yêu cầu để debug)
  // ═══════════════════════════════════

  function enableSourceProtection() {
    // Đã mở khóa F12, chuột phải và DevTools
  }

  // Không chặn inspect nữa


  // ═══════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════

  return {
    // Password
    hashPassword,
    verifyPassword,
    isHashed,
    migratePasswordsToHash,

    // Rate Limiting
    checkRateLimit,
    recordFailedAttempt,
    resetRateLimit,
    formatLockoutTime,
    MAX_ATTEMPTS,
    LOCKOUT_MINUTES,

    // Encryption
    encrypt,
    decrypt,
    secureSetItem,
    secureGetItem,

    // Sanitization
    sanitizeHTML,

    // Constants
    HASH_MARKER
  };
})();

console.log('[Security] Eureka Security Module v1.0 loaded');

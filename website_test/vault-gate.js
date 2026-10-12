/* ========================================================
   EUREKA LOGISTICS — Zero-Trust Vault Gatekeeper
   vault-gate.js — Giải mã AES-256-GCM & Kích hoạt ứng dụng
   ======================================================== */

(function () {
  'use strict';

  // Thông tin kết nối Supabase được làm mờ (Masked Base64)
  const _c1 = 'aHR0cHM6Ly9pbG50aHZoeXpncXlmYXZneWVvYS5zdXBhYmFzZS5jbw==';
  const _c2 = 'ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW1sc2JuUm9kbWg1ZW1keGVXWmhkbWQ1Wlc5aElpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzT1RFME1Ea3hORFVzSW1WNGNDSTZNakV3TmprNE5URTBOWDAuQjhOZ1JOQ2E2UUY1eER1UjBZWW05SkZzeGRYekdfaU5vdVN4d0hBV2RpNA==';

  const SUPABASE_URL = atob(_c1);
  const SUPABASE_KEY = atob(_c2);

  let supabaseClient = null;
  function getSB() {
    if (!supabaseClient && window.supabase && window.supabase.createClient) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    return supabaseClient;
  }

  // Chuyển Base64 thành Uint8Array
  function b64ToUint8(str) {
    const bin = atob(str);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }

  // Giải mã AES-256-GCM bằng chuẩn Web Crypto API gốc của trình duyệt
  async function decryptVault(secretToken) {
    if (!window.EUREKA_VAULT) {
      throw new Error('Dữ liệu Két sắt (EUREKA_VAULT) chưa được nạp.');
    }

    const { salt, iv, tag, ciphertext } = window.EUREKA_VAULT;
    const saltBytes = b64ToUint8(salt);
    const ivBytes = b64ToUint8(iv);
    const tagBytes = b64ToUint8(tag);
    const cipherBytes = b64ToUint8(ciphertext);

    // Web Crypto API yêu cầu gộp Ciphertext + Tag vào 1 mảng
    const combinedBytes = new Uint8Array(cipherBytes.length + tagBytes.length);
    combinedBytes.set(cipherBytes);
    combinedBytes.set(tagBytes, cipherBytes.length);

    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(secretToken),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    const aesKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: 10000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: ivBytes
      },
      aesKey,
      combinedBytes
    );

    const decoder = new TextDecoder();
    const jsonStr = decoder.decode(decryptedBuffer);
    return JSON.parse(jsonStr);
  }

  // Bung giao diện và kích hoạt ứng dụng
  function mountWorkspace(payload) {
    const appRoot = document.getElementById('app-root');
    const loginOverlay = document.getElementById('login-overlay');

    if (!appRoot) return;

    // 1. Bơm toàn bộ HTML (Header, Main, Footer, Modals) vào DOM
    appRoot.innerHTML = payload.html;
    appRoot.style.display = 'block';

    // 2. Ẩn màn hình đăng nhập
    if (loginOverlay) {
      loginOverlay.style.display = 'none';
    }

    // 3. Nạp và thực thi mã nguồn điều khiển ứng dụng
    const scriptEl = document.createElement('script');
    scriptEl.textContent = payload.js;
    document.body.appendChild(scriptEl);

    console.log('[Vault] Đã mở khóa Két sắt thành công. Ứng dụng đã sẵn sàng!');
  }

  // Dọn dẹp sạch sẽ toàn bộ dữ liệu nhạy cảm trong LocalStorage khi chưa đăng nhập / khi đăng xuất
  function purgeSensitiveStorage() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('eureka_') || key.startsWith('sb-'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      console.log('[Vault] Đã dọn dẹp sạch sẽ dữ liệu nhạy cảm trong LocalStorage.');
    } catch (e) {
      console.warn('[Vault] Lỗi dọn dẹp LocalStorage:', e);
    }
  }

  // Xử lý Đăng xuất triệt để
  window.vaultLogout = function () {
    sessionStorage.clear();
    purgeSensitiveStorage();

    const sb = getSB();
    if (sb && sb.auth) {
      sb.auth.signOut().catch(() => {});
    }

    const appRoot = document.getElementById('app-root');
    const loginOverlay = document.getElementById('login-overlay');

    if (appRoot) {
      appRoot.innerHTML = '';
      appRoot.style.display = 'none';
    }
    if (loginOverlay) {
      loginOverlay.style.display = 'flex';
    }

    // Reset form login
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
  };

  // Dò tìm IP và thiết bị người dùng (Đa nguồn, Timeout an toàn không nghẽn mạng)
  async function detectIpInfo() {
    let ip = 'Unknown';
    let details = `Thiết bị: ${navigator.platform || 'Web'}`;

    const endpoints = [
      {
        url: 'https://api.ipify.org?format=json',
        parse: (d) => d.ip,
        getDetails: () => `IP thuần / Trình duyệt: ${navigator.platform || 'Web'}`
      },
      {
        url: 'https://ipinfo.io/json',
        parse: (d) => d.ip,
        getDetails: (d) => `${d.city || ''}, ${d.country || ''} (${d.org || ''})`
      },
      {
        url: 'https://ipapi.co/json/',
        parse: (d) => d.ip,
        getDetails: (d) => `${d.city || ''}, ${d.country_name || ''} (${d.org || ''})`
      }
    ];

    for (const ep of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch(ep.url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          const detectedIp = ep.parse(data);
          if (detectedIp && detectedIp !== 'Unknown') {
            ip = detectedIp;
            details = ep.getDetails(data) || details;
            break;
          }
        }
      } catch (e) {
        // Chuyển sang endpoint tiếp theo nếu lỗi/timeout
      }
    }

    return { ip, details };
  }

  // Ghi nhận nhật ký IP lên Supabase (chạy bất đồng bộ ngầm)
  async function recordAuthLog(username, status) {
    try {
      const sb = getSB();
      if (!sb) return;

      const { ip, details } = await detectIpInfo();
      const logEntry = {
        username: username || 'Unknown',
        status: status,
        ip: ip,
        details: details,
        timestamp: new Date().toISOString()
      };

      // 1. Ghi trực tiếp vào Supabase ip_logs
      sb.from('ip_logs').insert(logEntry).then(({ error }) => {
        if (error) {
          console.warn('[Vault] ip_logs insert notice:', error.message);
        } else {
          console.log('[Vault] Đã ghi nhận IP log:', logEntry.username, logEntry.status, logEntry.ip);
        }
      }).catch(err => {
        console.warn('[Vault] Lỗi gửi log:', err);
      });

      // 2. Cập nhật vào localStorage để trang Admin hiển thị offline (Lọc giữ lại đúng 7 ngày)
      try {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        let currentLogs = JSON.parse(localStorage.getItem('eureka_ip_logs') || '[]');
        currentLogs.unshift(logEntry);
        currentLogs = currentLogs.filter(l => {
          if (!l || !l.timestamp) return false;
          const t = new Date(l.timestamp).getTime();
          return !isNaN(t) && t >= sevenDaysAgo;
        });
        localStorage.setItem('eureka_ip_logs', JSON.stringify(currentLogs));
      } catch (_) {}

    } catch (e) {
      console.warn('[Vault] recordAuthLog failed:', e);
    }
  }

  // Xử lý khi nhấn nút Đăng nhập
  async function handleLoginSubmit(e) {
    if (e) e.preventDefault();

    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const submitBtn = document.getElementById('login-submit-btn');
    const errorMsg = document.getElementById('login-error-msg');

    if (!usernameInput || !passwordInput) return;

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      if (errorMsg) {
        errorMsg.textContent = 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!';
        errorMsg.style.display = 'block';
      }
      return;
    }

    if (errorMsg) errorMsg.style.display = 'none';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang xác thực...';
    }

    try {
      const sb = getSB();
      const email = username.includes('@') ? username : `${username.toLowerCase()}@eureka.local`;

      // 1. Xác thực tài khoản với Supabase
      const { data: authData, error: authError } = await sb.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (authError || !authData || !authData.session) {
        // Ghi log Thất bại
        recordAuthLog(username, 'Thất bại');
        throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác!');
      }

      // Ghi log Thành công (chạy ngầm không chặn giải mã)
      recordAuthLog(username, 'Thành công');

      // 2. Lấy Chìa Khóa Két Sắt từ Supabase Server (Chỉ cấp cho người đã login)
      const { data: secretToken, error: rpcError } = await sb.rpc('get_secure_sheet_token');
      if (rpcError || !secretToken) {
        throw new Error('Không thể lấy chìa khóa bảo mật từ máy chủ.');
      }

      // 3. Giải mã Két sắt bằng Web Crypto API
      if (submitBtn) submitBtn.textContent = 'Đang mở khóa Két sắt...';
      const payload = await decryptVault(secretToken);

      // 4. Lưu phiên vào sessionStorage
      const userObj = {
        username: username,
        displayName: (authData.user && authData.user.user_metadata && authData.user.user_metadata.displayName) || username,
        role: (authData.user && authData.user.user_metadata && authData.user.user_metadata.role) || (username.toLowerCase() === 'admin' ? 'admin' : 'user')
      };

      sessionStorage.setItem('eureka_logged_in_user', JSON.stringify(userObj));
      sessionStorage.setItem('eureka_vault_session_token', secretToken);

      // Nếu là tài khoản thường, lập tức dọn sạch dữ liệu admin cũ còn sót lại trong LocalStorage
      if (userObj.role !== 'admin' && userObj.username.toLowerCase() !== 'admin') {
        localStorage.removeItem('eureka_users');
        localStorage.removeItem('eureka_ip_logs');
      }

      // 5. Bung giao diện & chạy ứng dụng
      mountWorkspace(payload);

    } catch (err) {
      console.error('[Vault Auth Error]:', err);
      if (errorMsg) {
        errorMsg.textContent = err.message || 'Đăng nhập không thành công!';
        errorMsg.style.display = 'block';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Đăng Nhập';
      }
    }
  }

  // Khôi phục phiên làm việc (F5 tải lại trang)
  async function checkExistingSession() {
    const savedUser = sessionStorage.getItem('eureka_logged_in_user');
    const savedToken = sessionStorage.getItem('eureka_vault_session_token');

    if (savedUser && savedToken) {
      try {
        console.log('[Vault] Khôi phục phiên làm việc từ bộ nhớ đệm...');
        const payload = await decryptVault(savedToken);
        mountWorkspace(payload);
        return true;
      } catch (e) {
        console.warn('[Vault] Không thể khôi phục phiên:', e);
        sessionStorage.clear();
      }
    }
    return false;
  }

  // Khởi động Gatekeeper
  function initGate() {
    // 1. Kiểm tra session hiện có
    checkExistingSession().then(restored => {
      if (!restored) {
        // CHƯA ĐĂNG NHẬP: XÓA SẠCH DỮ LIỆU NHẠY CẢM KHỎI LOCALSTORAGE NGAY LẬP TỨC
        purgeSensitiveStorage();
        const loginOverlay = document.getElementById('login-overlay');
        if (loginOverlay) loginOverlay.style.display = 'flex';
      }
    });

    // 2. Lắng nghe form submit
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLoginSubmit);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGate);
  } else {
    initGate();
  }

})();

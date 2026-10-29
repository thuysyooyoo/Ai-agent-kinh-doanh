/* ========================================================
   EUREKA LOGISTICS — Zero-Trust Vault Gatekeeper
   vault-gate.js — Giải mã AES-256-GCM & Kích hoạt ứng dụng
   Hỗ trợ đa trình duyệt, đa thiết bị, điện thoại & Mini App
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
    if (!supabaseClient && window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
          auth: {
            storage: window.localStorage,
            persistSession: true,
            autoRefreshToken: true
          }
        });
      } catch (e) {
        console.warn('[Vault] Supabase SDK client init notice:', e);
      }
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

  // Dọn dẹp sạch sẽ toàn bộ dữ liệu nhạy cảm trong LocalStorage khi đăng xuất
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
      console.log('[Vault] Đã dọn dẹp sạch sẽ dữ liệu nhạy cảm khi đăng xuất.');
    } catch (e) {
      console.warn('[Vault] Lỗi dọn dẹp LocalStorage:', e);
    }
  }

  // Xử lý Đăng xuất triệt để
  window.vaultLogout = function () {
    localStorage.removeItem('eureka_logged_in_user');
    localStorage.removeItem('eureka_vault_session_token');
    sessionStorage.clear();
    purgeSensitiveStorage();

    const sb = getSB();
    if (sb && sb.auth) {
      try { sb.auth.signOut(); } catch (_) {}
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
      const { ip, details } = await detectIpInfo();
      const logEntry = {
        username: username || 'Unknown',
        status: status,
        ip: ip,
        details: details,
        timestamp: new Date().toISOString()
      };

      // 1. Ghi qua REST API trực tiếp (không phụ thuộc SDK)
      fetch(`${SUPABASE_URL}/rest/v1/ip_logs`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(logEntry)
      }).then(() => {
        console.log('[Vault] Đã ghi nhận IP log:', logEntry.username, logEntry.status, logEntry.ip);
      }).catch(err => {
        console.warn('[Vault] Lỗi gửi log:', err);
      });

      // 2. Cập nhật vào localStorage CHỈ KHI là tài khoản Admin (Lọc giữ lại đúng 7 ngày)
      try {
        if (username && username.toLowerCase() === 'admin') {
          const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
          let currentLogs = JSON.parse(localStorage.getItem('eureka_ip_logs') || '[]');
          currentLogs.unshift(logEntry);
          currentLogs = currentLogs.filter(l => {
            if (!l || !l.timestamp) return false;
            const t = new Date(l.timestamp).getTime();
            return !isNaN(t) && t >= sevenDaysAgo;
          });
          localStorage.setItem('eureka_ip_logs', JSON.stringify(currentLogs));
        } else {
          localStorage.removeItem('eureka_ip_logs');
        }
      } catch (_) {}

    } catch (e) {
      console.warn('[Vault] recordAuthLog failed:', e);
    }
  }

  // Xác thực đăng nhập qua Supabase SDK hoặc Native REST API trực tiếp
  async function performSignIn(email, password) {
    // 1. Thử qua Supabase SDK nếu đã tải xong
    try {
      const sb = getSB();
      if (sb && sb.auth && typeof sb.auth.signInWithPassword === 'function') {
        const { data, error } = await sb.auth.signInWithPassword({ email, password });
        if (!error && data && data.session) {
          return {
            user: data.user,
            accessToken: data.session.access_token
          };
        }
        if (error) {
          // Báo lỗi sai mật khẩu trực tiếp
          throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác!');
        }
      }
    } catch (sdkErr) {
      if (sdkErr.message && sdkErr.message.includes('chính xác')) {
        throw sdkErr;
      }
      console.warn('[Vault] Supabase SDK chưa sẵn sàng, tự động chuyển sang REST API trực tiếp:', sdkErr);
    }

    // 2. Dự phòng trực tiếp qua Native REST API (luôn chạy tốt 100% trên điện thoại & mini app)
    const resp = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!resp.ok) {
      throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác!');
    }

    const authData = await resp.json();
    return {
      user: authData.user,
      accessToken: authData.access_token
    };
  }

  // Lấy Chìa Khóa Két Sắt từ Supabase Server (Chỉ cấp cho người đã login)
  async function fetchSecretToken(accessToken) {
    try {
      const sb = getSB();
      if (sb && sb.rpc && typeof sb.rpc === 'function') {
        const { data, error } = await sb.rpc('get_secure_sheet_token');
        if (!error && data) return data;
      }
    } catch (_) {}

    // Dự phòng qua REST API
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_secure_sheet_token`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: '{}'
    });

    if (!resp.ok) {
      throw new Error('Không thể lấy chìa khóa bảo mật từ máy chủ.');
    }

    return await resp.json();
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
      const email = username.includes('@') ? username : `${username.toLowerCase()}@eureka.local`;

      // 1. Xác thực tài khoản với Supabase (Tự động fallback REST API chống lỗi 'reading auth')
      const authResult = await performSignIn(email, password);

      // Ghi log Thành công (chạy ngầm không chặn giải mã)
      recordAuthLog(username, 'Thành công');

      // 2. Lấy Chìa Khóa Két Sắt từ Supabase Server
      const secretToken = await fetchSecretToken(authResult.accessToken);
      if (!secretToken) {
        throw new Error('Không thể lấy chìa khóa bảo mật từ máy chủ.');
      }

      // 3. Giải mã Két sắt bằng Web Crypto API
      if (submitBtn) submitBtn.textContent = 'Đang mở khóa Két sắt...';
      const payload = await decryptVault(secretToken);

      // 4. Lưu phiên vào cả localStorage và sessionStorage (Duy trì bền vững trên mọi trình duyệt & mini app)
      const userObj = {
        username: username,
        displayName: (authResult.user && authResult.user.user_metadata && authResult.user.user_metadata.displayName) || username,
        role: (authResult.user && authResult.user.user_metadata && authResult.user.user_metadata.role) || (username.toLowerCase() === 'admin' ? 'admin' : 'user')
      };

      localStorage.setItem('eureka_logged_in_user', JSON.stringify(userObj));
      localStorage.setItem('eureka_vault_session_token', secretToken);
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
      recordAuthLog(username, 'Thất bại');
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

  // Khôi phục phiên làm việc (F5 tải lại trang, mở tab mới, mở trên điện thoại / mini app)
  async function checkExistingSession() {
    const savedUser = localStorage.getItem('eureka_logged_in_user') || sessionStorage.getItem('eureka_logged_in_user');
    const savedToken = localStorage.getItem('eureka_vault_session_token') || sessionStorage.getItem('eureka_vault_session_token');

    if (savedUser && savedToken) {
      try {
        console.log('[Vault] Khôi phục phiên làm việc từ bộ nhớ đệm (hỗ trợ đa trình duyệt & mini app)...');
        const payload = await decryptVault(savedToken);
        // Đồng bộ dữ liệu session cho cả 2 kho lưu trữ
        sessionStorage.setItem('eureka_logged_in_user', savedUser);
        sessionStorage.setItem('eureka_vault_session_token', savedToken);
        localStorage.setItem('eureka_logged_in_user', savedUser);
        localStorage.setItem('eureka_vault_session_token', savedToken);
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
        // Chưa đăng nhập: Chỉ hiển thị form đăng nhập, KHÔNG xóa oan dữ liệu localStorage
        const loginOverlay = document.getElementById('login-overlay');
        if (loginOverlay) loginOverlay.style.display = 'flex';
      }
    });

    // 2. Hỗ trợ nút làm mới / xóa cache cho điện thoại và mini app (không cần phím Ctrl+F5)
    const refreshBtn = document.getElementById('btn-force-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', async () => {
        try {
          if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
          }
          if ('serviceWorker' in navigator) {
            const regs = await navigator.serviceWorker.getRegistrations();
            for (let r of regs) await r.unregister();
          }
        } catch (_) {}
        window.location.reload(true);
      });
    }

    // 3. Lắng nghe form submit
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

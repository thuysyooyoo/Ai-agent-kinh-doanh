/* ============================================
   EUREKA LOGISTICS — Ước Tính 1 Sổ
   app.js — Core Calculation & Excel Export
   ============================================ */

(function () {
  'use strict';

  // ── Google Sheets API Config (Option 3) ──
  // Dán URL Apps Script Web App của bạn ở đây để đồng bộ giữa các máy tính
  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycby276KuLW2Pbnx0w3skIcifFzqSCcUS0UPGINMwCZXAAnmgYCWh5ZT-v28D1laEjByG/exec"; 

  let cachedData = {
    accounts: [],
    tariffs: null,
    history: []
  };

  let sheetLoadPromise = null;
  let activeCalculationContext = null;

  function getCurrentUsername() {
    const loggedUserStr = sessionStorage.getItem('eureka_logged_in_user');
    if (!loggedUserStr) return null;
    try {
      const u = JSON.parse(loggedUserStr);
      return u.username || null;
    } catch (e) {
      return null;
    }
  }

  function getPersonalSheetUrl() {
    const username = getCurrentUsername();
    if (username && localStorage.getItem(`eureka_personal_sheet_url_${username}`)) {
      return localStorage.getItem(`eureka_personal_sheet_url_${username}`);
    }
    return localStorage.getItem('eureka_personal_sheet_url') || '';
  }

  function setPersonalSheetUrl(url) {
    const username = getCurrentUsername();
    const cleanUrl = url ? url.trim() : '';
    if (username) {
      if (cleanUrl) {
        localStorage.setItem(`eureka_personal_sheet_url_${username}`, cleanUrl);
      } else {
        localStorage.removeItem(`eureka_personal_sheet_url_${username}`);
      }
    }
    if (cleanUrl) {
      localStorage.setItem('eureka_personal_sheet_url', cleanUrl);
    } else {
      localStorage.removeItem('eureka_personal_sheet_url');
    }
  }

  function isValidAppsScriptUrl(url) {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    return trimmed.startsWith('https://script.google.com/macros/s/') && trimmed.endsWith('/exec');
  }

  function getBuyers() {
    try {
      const buyers = localStorage.getItem('eureka_buyers');
      const parsed = buyers ? JSON.parse(buyers) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveBuyerLocally(buyer) {
    let buyers = getBuyers();
    const index = buyers.findIndex(b => b.name.toLowerCase() === buyer.name.toLowerCase());
    if (index !== -1) {
      buyers[index] = buyer;
    } else {
      buyers.push(buyer);
    }
    localStorage.setItem('eureka_buyers', JSON.stringify(buyers));

    // Đồng bộ lên Supabase Database riêng (nếu đã cấu hình)
    if (window.EurekaDB && window.EurekaDB.isConfigured()) {
      window.EurekaDB.syncBuyerToSupabase(buyer);
    }
  }

  function renderBuyerDropdown() {
    const select = document.getElementById('contract-buyer-select');
    if (!select) return;
    
    // Clear options but keep the first one
    select.innerHTML = '<option value="">-- Nhập Khách Hàng Mới --</option>';
    
    const buyers = getBuyers();
    buyers.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.name;
      opt.textContent = b.name;
      select.appendChild(opt);
    });
  }

  function renderAdminBuyersList() {
    const tbody = document.getElementById('admin-buyer-list-body');
    const countEl = document.getElementById('admin-buyer-count');
    if (!tbody) return;

    tbody.innerHTML = '';
    const buyers = getBuyers();
    const username = getCurrentUsername();
    
    // Check if role is admin
    let isAdmin = false;
    const loggedUserStr = sessionStorage.getItem('eureka_logged_in_user');
    if (loggedUserStr) {
      try {
        const u = JSON.parse(loggedUserStr);
        isAdmin = (u.role === 'admin' || u.username === 'admin');
      } catch (e) {}
    }

    if (countEl) {
      countEl.textContent = `${buyers.length} khách hàng được ghi nhận`;
    }

    if (buyers.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-secondary); padding: 15px;">Chưa có khách hàng nào trong danh bạ</td></tr>`;
      return;
    }

    buyers.forEach(b => {
      const tr = document.createElement('tr');
      const canEdit = isAdmin || (username && String(b.createdBy || '').toLowerCase() === username.toLowerCase());
      const actionHtml = canEdit ? `
        <div style="display:flex; gap:6px;">
          <button type="button" class="btn btn-secondary btn-sm btn-edit-buyer" style="padding:2px 8px; font-size:0.75rem;">Sửa</button>
          <button type="button" class="btn btn-danger btn-sm btn-delete-buyer" style="padding:2px 8px; font-size:0.75rem;">Xóa</button>
        </div>
      ` : `<span style="font-size:0.75rem; color:var(--text-secondary); font-style:italic;">Chỉ xem</span>`;

      tr.innerHTML = `
        <td style="font-weight:700; color:var(--text-primary);">${b.name}</td>
        <td>${b.taxCode || '-'}</td>
        <td>
          <div>${b.phone || '-'}</div>
          <div style="font-size:0.75rem; color:var(--text-secondary);">${b.email || '-'}</div>
        </td>
        <td>
          <div>${b.representative || '-'}</div>
          <div style="font-size:0.75rem; color:var(--text-secondary);">${b.position || '-'}</div>
        </td>
        <td><span class="history-badge" style="background:var(--bg-accent-light); color:var(--accent); font-size:0.7rem;">${b.createdBy || 'system'}</span></td>
        <td>${actionHtml}</td>
      `;

      // Bind events if can edit
      const btnEdit = tr.querySelector('.btn-edit-buyer');
      if (btnEdit) {
        btnEdit.addEventListener('click', () => {
          document.getElementById('admin-buyer-old-name').value = b.name;
          document.getElementById('admin-buyer-name').value = b.name;
          document.getElementById('admin-buyer-addr').value = b.address || '';
          document.getElementById('admin-buyer-tax').value = b.taxCode || '';
          document.getElementById('admin-buyer-phone').value = b.phone || '';
          document.getElementById('admin-buyer-email').value = b.email || '';
          document.getElementById('admin-buyer-rep').value = b.representative || '';
          document.getElementById('admin-buyer-position').value = b.position || '';

          document.getElementById('buyer-form-title').textContent = 'Sửa Thông Tin Khách Hàng';
          document.getElementById('btn-cancel-admin-buyer').style.display = 'inline-block';
          document.getElementById('admin-buyer-name').focus();
        });
      }

      const btnDelete = tr.querySelector('.btn-delete-buyer');
      if (btnDelete) {
        btnDelete.addEventListener('click', () => {
          if (confirm(`Bạn có chắc muốn xóa khách hàng "${b.name}" khỏi danh bạ trên hệ thống?`)) {
            // Remove from local storage
            let allBuyers = getBuyers();
            allBuyers = allBuyers.filter(x => x.name.toLowerCase() !== b.name.toLowerCase());
            localStorage.setItem('eureka_buyers', JSON.stringify(allBuyers));
            
            // Re-render
            renderAdminBuyersList();
            renderBuyerDropdown();

            // 1. Đồng bộ xóa lên Supabase Database riêng
            if (window.EurekaDB && window.EurekaDB.isConfigured()) {
              window.EurekaDB.deleteBuyerFromSupabase(b.name);
            }

            // 2. Tiếp tục đồng bộ xóa lên Google Sheet để theo dõi
            callSheetAPI({
              action: 'delete_buyer',
              name: b.name
            }).then(res => {
              if (res && res.success) {
                showToast(`Đã xóa khách hàng "${b.name}" thành công!`, 'success');
              } else {
                showToast(`Lỗi đồng bộ xóa lên Google Sheet: ${res ? res.error : 'Không phản hồi'}`, 'warning');
              }
            });
          }
        });
      }

      tbody.appendChild(tr);
    });
  }

  function getSheetToken() {
    const customToken = localStorage.getItem('eureka_sheet_token');
    if (customToken && customToken.trim().length > 0) {
      return customToken.trim();
    }
    return 'EUREKA_SECURE_TOKEN_2026_X9#mK!';
  }

  async function callSheetAPI(payload, targetUrl = null) {
    const url = targetUrl || GOOGLE_SHEET_URL;
    if (!url) return null;
    try {
      const enrichedPayload = Object.assign({}, payload, { token: getSheetToken() });
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(enrichedPayload)
      });
      return await response.json();
    } catch (e) {
      console.error("Sheet API error (" + url + "):", e);
      return null;
    }
  }

  async function loadDataFromSheet() {
    if (!GOOGLE_SHEET_URL) return;
    try {
      const loggedUser = getCurrentUsername();
      let queryUrl = GOOGLE_SHEET_URL + '?action=get_data&token=' + encodeURIComponent(getSheetToken());
      if (loggedUser) {
        queryUrl += '&username=' + encodeURIComponent(loggedUser);
      }
      const res = await fetch(queryUrl);
      const json = await res.json();
      if (json && json.success) {
        cachedData = json.data;
        if (cachedData.tariffs && typeof cachedData.tariffs === 'object') {
          const keys = Object.keys(cachedData.tariffs);
          const isCorrupted = keys.length === 1 && keys[0] === '400000';
          if (!isCorrupted && (cachedData.tariffs.phiUTBase !== undefined || cachedData.tariffs.vipRates)) {
            const currentTariffs = getTariffs();
            const mergedTariffs = {
              ...currentTariffs,
              ...cachedData.tariffs,
              vipRates: { ...(currentTariffs.vipRates || {}), ...(cachedData.tariffs.vipRates || {}) },
              flexibleM3: { ...(currentTariffs.flexibleM3 || {}), ...(cachedData.tariffs.flexibleM3 || {}) },
              flexibleKG: { ...(currentTariffs.flexibleKG || {}), ...(cachedData.tariffs.flexibleKG || {}) }
            };
            localStorage.setItem('eureka_tariffs', JSON.stringify(mergedTariffs));
          }
        }
        if (cachedData.accounts && cachedData.accounts.length > 0) {
          if (window.EurekaSecurity) {
            try {
              const secRes = await window.EurekaSecurity.migratePasswordsToHash(cachedData.accounts);
              localStorage.setItem('eureka_users', JSON.stringify(secRes.users));
            } catch (secErr) {
              localStorage.setItem('eureka_users', JSON.stringify(cachedData.accounts));
            }
          } else {
            localStorage.setItem('eureka_users', JSON.stringify(cachedData.accounts));
          }
        }
        if (cachedData.history && Array.isArray(cachedData.history)) {
          const normalizedHistory = cachedData.history.map(item => {
            const h = Object.assign({}, item);
            if (!h.shared || typeof h.shared !== 'object') h.shared = {};
            if (!Array.isArray(h.items)) {
              if (h.itemsJson && typeof h.itemsJson === 'string') {
                try { h.items = JSON.parse(h.itemsJson); } catch (e) { h.items = []; }
              } else {
                h.items = [];
              }
            }
            if (!h.totalValue && h.totalAmount) h.totalValue = Number(h.totalAmount) || 0;
            return h;
          });
          localStorage.setItem('eureka_1so_history', JSON.stringify(normalizedHistory));
        }
        if (cachedData.tools && Array.isArray(cachedData.tools) && cachedData.tools.length > 0) {
          localStorage.setItem('eureka_support_tools', JSON.stringify(cachedData.tools));
        }
        if (cachedData.buyers && Array.isArray(cachedData.buyers)) {
          localStorage.setItem('eureka_buyers', JSON.stringify(cachedData.buyers));
        }
        // Tải thông tin bên bán Bên A mặc định từ Sheets
        if (cachedData.seller && typeof cachedData.seller === 'object') {
          const s = cachedData.seller;
          if (s.name && String(s.name).toLowerCase().trim() !== 'address') {
            const currentSeller = getSellerInfo();
            const mergedSeller = { ...currentSeller, ...s };
            localStorage.setItem('eureka_contract_seller_info', JSON.stringify(mergedSeller));
            console.log('[Seller] Đã tải thông tin bên bán Bên A từ Google Sheets:', mergedSeller.name);
            
            // Cập nhật lại form trong tab Cài Đặt nếu đang hiển thị
            if (document.getElementById('cfg-seller-name')) document.getElementById('cfg-seller-name').value = mergedSeller.name || '';
            if (document.getElementById('cfg-seller-addr')) document.getElementById('cfg-seller-addr').value = mergedSeller.address || '';
            if (document.getElementById('cfg-seller-office')) document.getElementById('cfg-seller-office').value = mergedSeller.office || '';
            if (document.getElementById('cfg-seller-phone')) document.getElementById('cfg-seller-phone').value = mergedSeller.phone || '';
            if (document.getElementById('cfg-seller-tax')) document.getElementById('cfg-seller-tax').value = mergedSeller.taxCode || '';
            if (document.getElementById('cfg-seller-rep')) document.getElementById('cfg-seller-rep').value = mergedSeller.representative || '';
            if (document.getElementById('cfg-seller-position')) document.getElementById('cfg-seller-position').value = mergedSeller.position || '';
            if (document.getElementById('cfg-seller-bank')) document.getElementById('cfg-seller-bank').value = mergedSeller.bankAccount || '';
            if (document.getElementById('cfg-seller-bank-name')) document.getElementById('cfg-seller-bank-name').value = mergedSeller.bankName || '';
          }
        }
        // Tải template biểu mẫu hợp đồng mới nhất từ Sheets
        if (cachedData.templates) {
          const t = cachedData.templates;
          if (t.contract_nt)       localStorage.setItem('eureka_contract_nt_template_v4',       t.contract_nt);
          if (t.po)                localStorage.setItem('eureka_po_template_v4',                t.po);
          if (t.contract_mb)       localStorage.setItem('eureka_contract_mb_template_v4',       t.contract_mb);
          if (t.appendix_contract) localStorage.setItem('eureka_appendix_contract_template_v4', t.appendix_contract);
          if (t.appendix_po)       localStorage.setItem('eureka_appendix_po_template_v4',       t.appendix_po);
          console.log('[Templates] Đã tải mẫu biểu mới nhất từ Google Sheets (get_data)');
        }
      }
    } catch (e) {
      console.warn("Could not load from Google Sheets, using local storage cache:", e);
    }
    // Đã bỏ đồng bộ template lên Sheets

  }

  // ── [BẢO MẬT & ĐỒNG BỘ] Tải toàn bộ dữ liệu từ Google Sheets sau khi đăng nhập ──
  let _dataLoadedAfterLogin = false;

  async function _loadDataAfterLogin() {
    if (!GOOGLE_SHEET_URL) return;
    try {
      if (!_dataLoadedAfterLogin) {
        _dataLoadedAfterLogin = true;
        sheetLoadPromise = loadDataFromSheet();
        await sheetLoadPromise;
      }
      try {
        if (typeof renderUserList === 'function') renderUserList();
        if (typeof renderIpLogs === 'function') renderIpLogs();
        if (typeof renderAdminTariffs === 'function') renderAdminTariffs();
        if (typeof autoUpdateLCLFields === 'function') autoUpdateLCLFields();
        if (typeof updateAllConversionNotes === 'function') updateAllConversionNotes();
        if (typeof renderBuyerDropdown === 'function') renderBuyerDropdown();
        if (typeof renderAdminBuyersList === 'function') renderAdminBuyersList();
        if (typeof renderHistoryDetailList === 'function') renderHistoryDetailList();
        const s = getSellerInfo();
        if (document.getElementById('cfg-seller-name')) document.getElementById('cfg-seller-name').value = s.name || '';
        if (document.getElementById('cfg-seller-addr')) document.getElementById('cfg-seller-addr').value = s.address || '';
        if (document.getElementById('cfg-seller-office')) document.getElementById('cfg-seller-office').value = s.office || '';
        if (document.getElementById('cfg-seller-phone')) document.getElementById('cfg-seller-phone').value = s.phone || '';
        if (document.getElementById('cfg-seller-tax')) document.getElementById('cfg-seller-tax').value = s.taxCode || '';
        if (document.getElementById('cfg-seller-rep')) document.getElementById('cfg-seller-rep').value = s.representative || '';
        if (document.getElementById('cfg-seller-position')) document.getElementById('cfg-seller-position').value = s.position || '';
        if (document.getElementById('cfg-seller-bank')) document.getElementById('cfg-seller-bank').value = s.bankAccount || '';
        if (document.getElementById('cfg-seller-bank-name')) document.getElementById('cfg-seller-bank-name').value = s.bankName || '';
      } catch (e) {
        console.error("Error rendering synced data after login:", e);
      }
    } catch (err) {
      console.error("Failed to load sheet data after login:", err);
    }
  }

  // ── Utility: Format number to VND ──
  function formatVND(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return Math.round(num).toLocaleString('vi-VN');
  }

  // ── Utility: Parse number from input (remove dots/commas) ──
  function parseNum(str) {
    if (!str) return 0;
    return parseFloat(String(str).replace(/\./g, '').replace(/,/g, '.')) || 0;
  }

  // ── Utility: Mobile-safe file download (handles iOS Safari) ──
  function triggerMobileDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS || isSafari) {
      // iOS Safari: open blob URL in new tab, user can manually save from Share sheet
      const newTab = window.open(url, '_blank');
      if (!newTab) {
        // Popup blocked — fallback: tell user
        showToast('Vui lòng cho phép mở cửa sổ mới để tải file', 'warning');
      } else {
        showToast('Tệp đã mở trong tab mới — nhấn giữ hình ảnh hoặc dùng Share > Save để lưu', 'info');
      }
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } else {
      // Standard download (Chrome, Firefox, Android WebView)
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 200);
    }
  }

  // ── Utility: Get value from input and convert to VND if it's USD or RMB ──
  function getConvertedValueInVND(inputId) {
    const value = parseNum(document.getElementById(inputId)?.value) || 0;
    const currency = document.getElementById(inputId + '-currency')?.value || 'VND';
    const rateUSD = parseNum(document.getElementById('exchange-rate')?.value) || 25900;
    const rateRMB = parseNum(document.getElementById('exchange-rate-rmb')?.value) || 3600;
    if (currency === 'USD') return value * rateUSD;
    if (currency === 'RMB') return value * rateRMB;
    return value;
  }

  // ── Utility: Update real-time conversion notes below input fields ──
  function updateAllConversionNotes() {
    const rateUSD = parseNum(document.getElementById('exchange-rate')?.value) || 25900;
    const rateRMB = parseNum(document.getElementById('exchange-rate-rmb')?.value) || 3600;

    const fields = [
      // LCL fields
      { input: 'lcl-cuoc-vc', explain: 'lcl-cuoc-vc-explain', hasOverride: true },
      { input: 'lcl-phi-ut', explain: 'lcl-phi-ut-explain', hasOverride: true },
      { input: 'lcl-phi-rr', explain: 'lcl-phi-rr-explain', hasOverride: true },
      { input: 'lcl-phi-vc-tq', explain: 'lcl-phi-vc-tq-explain', hasOverride: true },
      { input: 'lcl-phi-khac-tq', explain: 'lcl-phi-khac-tq-explain' },
      { input: 'lcl-chiet-khau', explain: 'lcl-chiet-khau-explain' },
      { input: 'lcl-phi-khac-vn', explain: 'lcl-phi-khac-vn-explain' },
      
      // FCL fields
      { input: 'fcl-phi-nd-tq', explain: 'fcl-phi-nd-tq-explain' },
      { input: 'fcl-phi-nd-vn', explain: 'fcl-phi-nd-vn-explain' },
      { input: 'fcl-phi-ut', explain: 'fcl-phi-ut-explain' },
      { input: 'fcl-phi-qt', explain: 'fcl-phi-qt-explain' },
      { input: 'fcl-phi-vc-vn', explain: 'fcl-phi-vc-vn-explain' }
    ];

    fields.forEach(f => {
      const inputEl = document.getElementById(f.input);
      const currencyEl = document.getElementById(f.input + '-currency');
      const explainEl = document.getElementById(f.explain);
      if (!inputEl || !currencyEl || !explainEl) return;

      const value = parseNum(inputEl.value);
      const currency = currencyEl.value;

      // If it has override and override checkbox is NOT checked, we let calculations handle the explain div
      if (f.hasOverride) {
        const overrideCheck = document.getElementById(f.input.replace('lcl-', 'lcl-override-'));
        if (overrideCheck && !overrideCheck.checked) return;
      }

      if (currency !== 'VND' && value > 0) {
        const rate = currency === 'USD' ? rateUSD : rateRMB;
        explainEl.innerHTML = `<span>Quy đổi: ${value.toLocaleString('vi-VN')} ${currency} × ${formatVND(rate)} ₫ = <strong>${formatVND(value * rate)} ₫</strong></span>`;
        explainEl.style.display = 'flex';
      } else {
        explainEl.style.display = 'none';
      }
    });
  }

  // ── Utility: Render Currency Conversion Notes Summary below LCL results ──
  function renderLCLCurrencyNotes(items) {
    const rateUSD = parseNum(document.getElementById('exchange-rate')?.value) || 25900;
    const rateRMB = parseNum(document.getElementById('exchange-rate-rmb')?.value) || 3600;
    const convNotes = [];

    // Check items
    items.forEach((it, idx) => {
      if (it.currency !== 'VND' && it.rawValue > 0) {
        convNotes.push(`Mặt hàng ${idx + 1} (${it.name || 'Không tên'}): ${it.rawValue.toLocaleString('vi-VN')} ${it.currency} = <strong>${formatVND(it.value)} ₫</strong> (tỷ giá ${formatVND(it.currency === 'USD' ? rateUSD : rateRMB)})`);
     	 }
    });

    // Check LCL shared costs
    const sharedFields = [
      { id: 'lcl-cuoc-vc', label: '(2) Cước VC TQ-VN' },
      { id: 'lcl-phi-ut', label: '(3) Phí ủy thác' },
      { id: 'lcl-phi-rr', label: '(4) Phí rủi ro' },
      { id: 'lcl-phi-khac-tq', label: '(5) Phí khác TQ+VN' },
      { id: 'lcl-phi-vc-tq', label: '(6) Phí VC TQ' },
      { id: 'lcl-chiet-khau', label: 'Chiết khấu' },
      { id: 'lcl-phi-khac-vn', label: '(8) Phí khác VN' }
    ];

    sharedFields.forEach(f => {
      const val = parseNum(document.getElementById(f.id)?.value) || 0;
      const curr = document.getElementById(f.id + '-currency')?.value || 'VND';
      if (curr !== 'VND' && val > 0) {
        const rate = curr === 'USD' ? rateUSD : rateRMB;
        convNotes.push(`${f.label}: ${val.toLocaleString('vi-VN')} ${curr} = <strong>${formatVND(val * rate)} ₫</strong> (tỷ giá ${formatVND(rate)})`);
      }
    });

    const notesBox = document.getElementById('lcl-currency-notes');
    const notesList = document.getElementById('lcl-currency-notes-list');
    if (convNotes.length > 0) {
      notesList.innerHTML = convNotes.map(n => `• ${n}`).join('<br>');
      notesBox.style.display = 'block';
    } else {
      notesBox.style.display = 'none';
    }
  }

  // ── Utility: Render Currency Conversion Notes Summary below FCL results ──
  function renderFCLCurrencyNotes(items) {
    const rateUSD = parseNum(document.getElementById('exchange-rate')?.value) || 25900;
    const rateRMB = parseNum(document.getElementById('exchange-rate-rmb')?.value) || 3600;
    const convNotes = [];

    // Check items
    items.forEach((it, idx) => {
      if (it.currency !== 'VND' && it.rawValue > 0) {
        convNotes.push(`Mặt hàng ${idx + 1} (${it.name || 'Không tên'}): ${it.rawValue.toLocaleString('vi-VN')} ${it.currency} = <strong>${formatVND(it.value)} ₫</strong> (tỷ giá ${formatVND(it.currency === 'USD' ? rateUSD : rateRMB)})`);
      }
    });

    // Check FCL shared costs
    const sharedFields = [
      { id: 'fcl-phi-nd-tq', label: '(2) Phí nội địa TQ' },
      { id: 'fcl-phi-nd-vn', label: '(3) Phí nội địa VN' },
      { id: 'fcl-phi-ut', label: '(4) Phí ủy thác' },
      { id: 'fcl-phi-qt', label: '(5) Phí QT + VC QT' },
      { id: 'fcl-phi-vc-vn', label: '(6) Phí VC VN' }
    ];

    sharedFields.forEach(f => {
      const val = parseNum(document.getElementById(f.id)?.value) || 0;
      const curr = document.getElementById(f.id + '-currency')?.value || 'VND';
      if (curr !== 'VND' && val > 0) {
        const rate = curr === 'USD' ? rateUSD : rateRMB;
        convNotes.push(`${f.label}: ${val.toLocaleString('vi-VN')} ${curr} = <strong>${formatVND(val * rate)} ₫</strong> (tỷ giá ${formatVND(rate)})`);
      }
    });

    const notesBox = document.getElementById('fcl-currency-notes');
    const notesList = document.getElementById('fcl-currency-notes-list');
    if (convNotes.length > 0) {
      notesList.innerHTML = convNotes.map(n => `• ${n}`).join('<br>');
      notesBox.style.display = 'block';
    } else {
      notesBox.style.display = 'none';
    }
  }

  // ── Utility: Auto-format input on blur ──
  function autoFormatInput(input) {
    if (input.dataset.type === 'percent') return;
    const val = parseNum(input.value);
    if (val > 0) {
      input.value = formatVND(val);
    }
  }

  // ── Default Tariff Pricing (from chinh_sach_gia_2026.md) ──
  const DEFAULT_TARIFFS = {
    phiUTBase: 400000,
    riskThreshold: 100000000,
    riskRate: 0.01,
    cuerQTQC: 1000000,
    cuerQTBT: 700000,

    vipRates: {
      "QC-HN-M3":   [1850000, 1665000, 1480000, 1295000],
      "QC-HN-KG":   [9000,    8100,    7200,    6300],
      "QC-HCM-M3":  [2600000, 2340000, 2080000, 1820000],
      "QC-HCM-KG":  [12500,   11250,   10000,   8750],
      "BT-HN-M3":   [1450000, 1305000, 1160000, 1015000],
      "BT-HN-KG":   [9000,    8100,    7200,    6300],
      "BT-HCM-M3":  [2150000, 1935000, 1720000, 1505000],
      "BT-HCM-KG":  [12500,   11250,   10000,
   8750]
    },

    flexibleM3: {
      "QC-HN":  [1850000, 1700000, 1600000, 1500000, 1400000, 1300000, 1200000],
      "QC-HCM": [2600000, 2200000, 2100000, 2000000, 1900000, 1800000, 1700000],
      "BT-HN":  [1450000, 1400000, 1300000, 1200000, 1100000, 1000000, 900000],
      "BT-HCM": [2150000, 1900000, 1800000, 1700000, 1600000, 1500000, 1400000]
    },

    flexibleKG: {
      "QC-HN":  [9000, 8000, 7000, 6000, 5000, 4000],
      "QC-HCM": [12500, 11500, 10500, 9500, 8500, 7500],
      "BT-HN":  [9000, 8000, 7000, 6000, 5000, 4000],
      "BT-HCM": [12500, 11500, 10500, 9500, 8500, 7500]
    }
  };

  function getTariffs() {
    try {
      const data = localStorage.getItem('eureka_tariffs');
      if (!data) {
        localStorage.setItem('eureka_tariffs', JSON.stringify(DEFAULT_TARIFFS));
        return DEFAULT_TARIFFS;
      }
      const parsed = JSON.parse(data);
      if (!parsed || typeof parsed !== 'object') return DEFAULT_TARIFFS;

      const tariffs = {
        ...DEFAULT_TARIFFS,
        ...parsed,
        vipRates: { ...DEFAULT_TARIFFS.vipRates },
        flexibleM3: { ...DEFAULT_TARIFFS.flexibleM3 },
        flexibleKG: { ...DEFAULT_TARIFFS.flexibleKG }
      };

      // Safely merge vipRates
      if (parsed.vipRates && typeof parsed.vipRates === 'object') {
        Object.keys(DEFAULT_TARIFFS.vipRates).forEach(k => {
          if (Array.isArray(parsed.vipRates[k])) {
            tariffs.vipRates[k] = parsed.vipRates[k];
          }
        });
      }

      // Safely merge flexibleM3
      if (parsed.flexibleM3 && typeof parsed.flexibleM3 === 'object') {
        Object.keys(DEFAULT_TARIFFS.flexibleM3).forEach(k => {
          if (Array.isArray(parsed.flexibleM3[k])) {
            tariffs.flexibleM3[k] = parsed.flexibleM3[k];
          }
        });
      }

      // Safely merge flexibleKG
      if (parsed.flexibleKG && typeof parsed.flexibleKG === 'object') {
        Object.keys(DEFAULT_TARIFFS.flexibleKG).forEach(k => {
          if (Array.isArray(parsed.flexibleKG[k])) {
            tariffs.flexibleKG[k] = parsed.flexibleKG[k];
          }
        });
      }

      return tariffs;
    } catch (e) {
      console.error("Error loading tariffs:", e);
      return DEFAULT_TARIFFS;
    }
  }

  async function saveTariffs(tariffs) {
    localStorage.setItem('eureka_tariffs', JSON.stringify(tariffs));
    if (GOOGLE_SHEET_URL) {
      return await callSheetAPI({
        action: 'save_tariffs',
        phiUTBase: tariffs.phiUTBase,
        riskThreshold: tariffs.riskThreshold,
        riskRate: tariffs.riskRate,
        cuerQTQC: tariffs.cuerQTQC,
        cuerQTBT: tariffs.cuerQTBT,
        vipRates: tariffs.vipRates,
        flexibleM3: tariffs.flexibleM3,
        flexibleKG: tariffs.flexibleKG
      });
    }
    return { success: true };
  }

  function lookupFlexibleM3Rate(tariffs, route, cbm) {
    const rates = tariffs.flexibleM3[route];
    if (!rates) return 0;
    if (cbm < 1) return rates[0];
    if (cbm < 2) return rates[1];
    if (cbm < 5) return rates[2];
    if (cbm < 10) return rates[3];
    if (cbm < 20) return rates[4];
    if (cbm < 30) return rates[5];
    return rates[6] !== undefined ? rates[6] : rates[5];
  }

  function lookupFlexibleKGRate(tariffs, route, kg) {
    const rates = tariffs.flexibleKG[route];
    if (!rates) return 0;
    if (kg < 300) return rates[0];
    if (kg < 500) return rates[1];
    if (kg < 1500) return rates[2];
    if (kg < 5000) return rates[3];
    if (kg < 10000) return rates[4];
    return rates[5] !== undefined ? rates[5] : rates[4];
  }

  function lookupVIPRate(tariffs, key, vipIndex) {
    const rates = tariffs.vipRates[key];
    if (!rates) return 0;
    return rates[vipIndex] || 0;
  }

  // ── Tab Switching ──
  function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const adminBtn = document.getElementById('header-admin-btn');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        if (adminBtn) adminBtn.classList.remove('active');
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
        
        if (btn.id === 'tab-btn-history') {
          renderHistoryDetailList();
        }
        if (btn.id === 'tab-btn-support') {
          renderSupportTools();
        }
        if (btn.id === 'tab-btn-buyers') {
          renderAdminBuyersList();
        }
      });
    });

    if (adminBtn) {
      adminBtn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        adminBtn.classList.add('active');
        document.getElementById('tab-admin').classList.add('active');
        renderAdminTariffs();
      });
    }

    // Admin subtabs
    const subtabBtns = document.querySelectorAll('.admin-subtab-btn');
    const subContents = document.querySelectorAll('.admin-subcontent');
    subtabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        subtabBtns.forEach(b => b.classList.remove('active'));
        subContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.subtab).classList.add('active');
        if (btn.dataset.subtab === 'admin-sub-tariff') {
          renderAdminTariffs();
        }
        if (btn.dataset.subtab === 'admin-sub-tools') {
          renderAdminTools();
        }
        if (btn.dataset.subtab === 'admin-sub-pwa') {
          updatePushPermissionStatus();
        }

      });
    });
  }

  // ── Dynamic Items Row Management ──
  let lclItemCount = 1;
  let fclItemCount = 1;

  function createLCLRow(index) {
    return `
      <tr data-index="${index}">
        <td><div class="row-number">${index}</div></td>
        <td><input type="text" class="item-input name-input" placeholder="Tên mặt hàng" data-field="name"></td>
        <td><input type="text" class="item-input small" placeholder="0" data-field="qty" inputmode="numeric"></td>
        <td>
          <div style="display:flex; gap:4px; align-items:center;">
            <input type="text" class="item-input" placeholder="0" data-field="value" inputmode="numeric" style="flex:1; min-width:80px;">
            <select class="item-input currency-select" data-field="currency" style="width:65px; padding:2px 4px; font-size:0.8rem; cursor:pointer;">
              <option value="VND">VND</option>
              <option value="USD">USD</option>
              <option value="RMB">RMB</option>
            </select>
          </div>
        </td>
        <td><input type="text" class="item-input small" placeholder="0" data-field="taxNK" data-type="percent" inputmode="decimal"></td>
        <td><input type="text" class="item-input small" placeholder="0" data-field="taxOther" data-type="percent" inputmode="decimal"></td>
        <td><input type="text" class="item-input small" value="8" data-field="vat" data-type="percent" inputmode="decimal"></td>
        <td><button type="button" class="btn btn-danger btn-icon remove-item-btn" title="Xóa">X</button></td>
      </tr>`;
  }

  function createFCLRow(index) {
    return `
      <tr data-index="${index}">
        <td><div class="row-number">${index}</div></td>
        <td><input type="text" class="item-input name-input" placeholder="Tên mặt hàng" data-field="name"></td>
        <td><input type="text" class="item-input small" placeholder="0" data-field="qty" inputmode="numeric"></td>
        <td>
          <div style="display:flex; gap:4px; align-items:center;">
            <input type="text" class="item-input" placeholder="0" data-field="value" inputmode="numeric" style="flex:1; min-width:80px;">
            <select class="item-input currency-select" data-field="currency" style="width:65px; padding:2px 4px; font-size:0.8rem; cursor:pointer;">
              <option value="VND">VND</option>
              <option value="USD">USD</option>
              <option value="RMB">RMB</option>
            </select>
          </div>
        </td>
        <td><input type="text" class="item-input small" placeholder="0" data-field="taxNK" data-type="percent" inputmode="decimal"></td>
        <td><input type="text" class="item-input small" placeholder="0" data-field="taxOther" data-type="percent" inputmode="decimal"></td>
        <td><input type="text" class="item-input small" value="8" data-field="vat" data-type="percent" inputmode="decimal"></td>
        <td><button type="button" class="btn btn-danger btn-icon remove-item-btn" title="Xóa">X</button></td>
      </tr>`;
  }

  function initItemManagement() {
    // LCL Add/Remove
    document.getElementById('lcl-add-item').addEventListener('click', () => {
      lclItemCount++;
      const tbody = document.getElementById('lcl-items-body');
      tbody.insertAdjacentHTML('beforeend', createLCLRow(lclItemCount));
      attachInputFormatters(tbody.lastElementChild);
      renumberRows('lcl-items-body');
      autoUpdateLCLFields();
    });

    // FCL Add/Remove
    document.getElementById('fcl-add-item').addEventListener('click', () => {
      fclItemCount++;
      const tbody = document.getElementById('fcl-items-body');
      tbody.insertAdjacentHTML('beforeend', createFCLRow(fclItemCount));
      attachInputFormatters(tbody.lastElementChild);
      renumberRows('fcl-items-body');
    });

    // Delegated remove
    document.addEventListener('click', (e) => {
      if (e.target.closest('.remove-item-btn')) {
        const row = e.target.closest('tr');
        const tbody = row.parentElement;
        if (tbody.children.length > 1) {
          row.remove();
          renumberRows(tbody.id);
          if (tbody.id === 'lcl-items-body') {
            autoUpdateLCLFields();
          }
        } else {
          showToast('Cần ít nhất 1 mặt hàng', 'error');
        }
      }
    });
  }

  function renumberRows(tbodyId) {
    const rows = document.querySelectorAll(`#${tbodyId} tr`);
    rows.forEach((row, i) => {
      const numEl = row.querySelector('.row-number');
      if (numEl) numEl.textContent = i + 1;
    });
  }

  function attachInputFormatters(container) {
    container.querySelectorAll('.item-input:not([data-type="percent"])').forEach(input => {
      if (input.dataset.field === 'name') return;
      input.addEventListener('blur', () => autoFormatInput(input));
    });
  }

  // ── Read Items from Table ──
  function readItems(tbodyId) {
    const rows = document.querySelectorAll(`#${tbodyId} tr`);
    const items = [];
    
    const rateUSD = parseNum(document.getElementById('exchange-rate')?.value) || 25900;
    const rateRMB = parseNum(document.getElementById('exchange-rate-rmb')?.value) || 3600;

    rows.forEach(row => {
      const name = row.querySelector('[data-field="name"]')?.value || '';
      const qty = parseNum(row.querySelector('[data-field="qty"]')?.value) || 0;
      const value = parseNum(row.querySelector('[data-field="value"]')?.value) || 0;
      const currency = row.querySelector('[data-field="currency"]')?.value || 'VND';
      const taxNK = parseNum(row.querySelector('[data-field="taxNK"]')?.value) / 100;
      const taxOther = parseNum(row.querySelector('[data-field="taxOther"]')?.value) / 100;
      const vat = parseNum(row.querySelector('[data-field="vat"]')?.value) / 100;
      
      let valueVND = value;
      if (currency === 'USD') {
        valueVND = value * rateUSD;
      } else if (currency === 'RMB') {
        valueVND = value * rateRMB;
      }

      items.push({ 
        name, 
        qty, 
        value: valueVND, 
        rawValue: value, 
        currency, 
        taxNK, 
        taxOther, 
        vat 
      });
    });
    return items;
  }

  // ── LCL Real-time Field Auto-calculations ──
  function autoUpdateLCLFields() {
    const tariffs = getTariffs();
    const cbm = parseFloat(String(document.getElementById('lcl-so-khoi').value).replace(/,/g, '.')) || 0;
    const kg = parseFloat(String(document.getElementById('lcl-so-kg').value).replace(/,/g, '.')) || 0;
    const duongVC = document.getElementById('lcl-duong-vc').value;
    const khoTQ = document.getElementById('lcl-kho-tq').value; 
    const khoVN = document.getElementById('lcl-kho-vn').value; 
    const vipLevel = document.getElementById('lcl-vip').value; 
    const chietKhau = getConvertedValueInVND('lcl-chiet-khau');
    const phiKhac = getConvertedValueInVND('lcl-phi-khac-tq');

    const vipMapping = { "Basic": 0, "Pro": 1, "Premium": 2, "Elite": 3 };
    const vipIndex = vipMapping[vipLevel] !== undefined ? vipMapping[vipLevel] : 1;

    // 1. Phí VC TQ (cước QT) (Field 6)
    const rateQT = (khoTQ === 'Quảng Châu') ? tariffs.cuerQTQC : tariffs.cuerQTBT;
    const calcPhiVCTQ = cbm * rateQT;
    const lclPhiVCTQInput = document.getElementById('lcl-phi-vc-tq');
    const overridePhiVCTQ = document.getElementById('lcl-override-phi-vc-tq').checked;
    
    if (!overridePhiVCTQ) {
      lclPhiVCTQInput.value = formatVND(calcPhiVCTQ);
    }
    const explainPhiVCTQ = document.getElementById('lcl-phi-vc-tq-explain');
    if (cbm > 0) {
      explainPhiVCTQ.textContent = `Tự tính: ${cbm} m³ × ${formatVND(rateQT)} ₫/m³ = ${formatVND(calcPhiVCTQ)} ₫`;
      explainPhiVCTQ.style.display = 'flex';
    } else {
      explainPhiVCTQ.style.display = 'none';
    }

    // 2. Tổng cước VC TQ-VN (Field 2)
    const routeCode = (khoTQ === 'Quảng Châu' ? 'QC' : 'BT') + '-' + (khoVN === 'Hà Nội' ? 'HN' : 'HCM');
    
    // Tra VIP
    const vipRateM3 = lookupVIPRate(tariffs, `${routeCode}-M3`, vipIndex);
    const vipRateKG = lookupVIPRate(tariffs, `${routeCode}-KG`, vipIndex);
    const costVIPM3 = vipRateM3 * cbm;
    const costVIPKG = vipRateKG * kg;
    const costVIP = (cbm > 0 && kg > 0) ? Math.max(costVIPM3, costVIPKG) : (cbm > 0 ? costVIPM3 : costVIPKG);
    
    // Tra Linh hoạt
    const lhRateM3 = lookupFlexibleM3Rate(tariffs, routeCode, cbm);
    const lhRateKG = lookupFlexibleKGRate(tariffs, routeCode, kg);
    const costLHM3 = lhRateM3 * cbm;
    const costLHKG = lhRateKG * kg;
    const costLH = (cbm > 0 && kg > 0) ? Math.max(costLHM3, costLHKG) : (cbm > 0 ? costLHM3 : costLHKG);

    // C22 = MIN(Giá_VIP, Giá_LinhHoat)
    const calcCuocVC = (cbm > 0 || kg > 0) ? Math.min(costVIP, costLH) : 0;
    const lclCuocVCInput = document.getElementById('lcl-cuoc-vc');
    const overrideCuocVC = document.getElementById('lcl-override-cuoc-vc').checked;

    if (!overrideCuocVC) {
      lclCuocVCInput.value = formatVND(calcCuocVC);
    }
    
    const explainCuocVC = document.getElementById('lcl-cuoc-vc-explain');
    if (cbm > 0 || kg > 0) {
      let explanation = '';
      if (costVIP <= costLH) {
        const isM3 = costVIPM3 >= costVIPKG;
        explanation = `Áp dụng cước VIP (${vipLevel}): tính theo ${isM3 ? 'm³' : 'kg'}, đơn giá: ${formatVND(isM3 ? vipRateM3 : vipRateKG)} ₫.`;
      } else {
        const isM3 = costLHM3 >= costLHKG;
        explanation = `Áp dụng cước Linh hoạt: tính theo ${isM3 ? 'm³' : 'kg'}, đơn giá: ${formatVND(isM3 ? lhRateM3 : lhRateKG)} ₫.`;
      }
      explainCuocVC.textContent = explanation + ` (VIP: ${formatVND(costVIP)} ₫ vs LH: ${formatVND(costLH)} ₫)`;
      explainCuocVC.style.display = 'flex';
    } else {
      explainCuocVC.style.display = 'none';
    }

    // 3. Phí ủy thác (Field 3)
    const items = readItems('lcl-items-body');
    const itemCount = items.length;
    const calcPhiUT = itemCount * tariffs.phiUTBase;
    const lclPhiUTInput = document.getElementById('lcl-phi-ut');
    const overridePhiUT = document.getElementById('lcl-override-phi-ut').checked;

    if (!overridePhiUT) {
      lclPhiUTInput.value = formatVND(calcPhiUT);
    }
    const explainPhiUT = document.getElementById('lcl-phi-ut-explain');
    explainPhiUT.textContent = `Tự tính: ${itemCount} mặt hàng × ${formatVND(tariffs.phiUTBase)} ₫ = ${formatVND(calcPhiUT)} ₫`;
    explainPhiUT.style.display = 'flex';

    // 4. Phí rủi ro (Field 4)
    // S = Tổng_giá_trị_hàng + Phí_ủy_thác + Phí_VC_TQ + Chi_phí_khác - Chiết_khấu
    const totalValue = items.reduce((sum, item) => sum + item.value, 0);
    const currentPhiUT = getConvertedValueInVND('lcl-phi-ut');
    const currentPhiVCTQ = getConvertedValueInVND('lcl-phi-vc-tq');
    
    const S = totalValue + currentPhiUT + currentPhiVCTQ + phiKhac - chietKhau;
    const K = Math.max(cbm, kg / 250);
    
    let calcPhiRR = 0;
    const threshold = tariffs.riskThreshold;
    const rateRR = tariffs.riskRate;
    
    if (K > 0 && (S / K) > threshold) {
      calcPhiRR = (S - K * threshold) * rateRR;
    }
    
    const lclPhiRRInput = document.getElementById('lcl-phi-rr');
    const overridePhiRR = document.getElementById('lcl-override-phi-rr').checked;
    
    if (!overridePhiRR) {
      lclPhiRRInput.value = formatVND(calcPhiRR);
    }
    
    const explainPhiRR = document.getElementById('lcl-phi-rr-explain');
    if (K > 0) {
      const avgVal = S / K;
      if (avgVal > threshold) {
        explainPhiRR.textContent = `Vượt mốc: ${formatVND(avgVal)} ₫/khối > ${formatVND(threshold)} ₫. Phí rủi ro: ${formatVND(calcPhiRR)} ₫`;
      } else {
        explainPhiRR.textContent = `Bình quân: ${formatVND(avgVal)} ₫/khối <= ${formatVND(threshold)} ₫. Phí rủi ro: 0 ₫`;
      }
      explainPhiRR.style.display = 'flex';
    } else {
      explainPhiRR.style.display = 'none';
    }

    // 5. Default Cost Price Calculation & UI Update (R3)
    const baseFreightCost = cbm * rateQT;
    const baseTrusteeCost = itemCount * tariffs.phiUTBase;
    
    const phiKhacVN = getConvertedValueInVND('lcl-phi-khac-vn');
    const lclAccs = window._lclAccumulations || [];
    
    let accBaoGia = {
      'lcl-cuoc-vc': 0, 'lcl-phi-ut': 0, 'lcl-phi-rr': 0, 'lcl-phi-khac-tq': 0, 'lcl-phi-khac-vn': 0
    };
    let accGiaNen = {
      'lcl-cuoc-vc': 0, 'lcl-phi-ut': 0, 'lcl-phi-rr': 0, 'lcl-phi-khac-tq': 0, 'lcl-phi-khac-vn': 0
    };
    
    lclAccs.forEach(a => {
      if (accBaoGia[a.targetId] !== undefined) {
        accBaoGia[a.targetId] += a.amount || 0;
        accGiaNen[a.targetId] += a.baseAmountVND || a.amount || 0;
      }
    });

    const costFreight = baseFreightCost + accGiaNen['lcl-cuoc-vc'];
    const costTrustee = baseTrusteeCost + accGiaNen['lcl-phi-ut'];
    const costRisk = accGiaNen['lcl-phi-rr'];
    const costPhiKhacTQ = Math.max(0, phiKhac - accBaoGia['lcl-phi-khac-tq'] + accGiaNen['lcl-phi-khac-tq']);
    const costPhiKhacVN = Math.max(0, phiKhacVN - accBaoGia['lcl-phi-khac-vn'] + accGiaNen['lcl-phi-khac-vn']);
    
    const defaultCostLCL = costFreight + costTrustee + costRisk + costPhiKhacTQ + costPhiKhacVN;

    const lclManualCostInput = document.getElementById('lcl-manual-cost-input');
    const overrideCostLCL = document.getElementById('lcl-override-cost-check') ? document.getElementById('lcl-override-cost-check').checked : false;

    if (!overrideCostLCL && lclManualCostInput) {
      lclManualCostInput.value = formatVND(defaultCostLCL);
    }

    const explainCostLCL = document.getElementById('lcl-manual-cost-explain');
    if (explainCostLCL) {
      explainCostLCL.textContent = `Tự tính: ${cbm} m³ × ${formatVND(rateQT)} ₫ + UT gốc (${itemCount} mục × ${formatVND(tariffs.phiUTBase)} ₫) = ${formatVND(defaultCostLCL)} ₫`;
      explainCostLCL.style.display = 'flex';
    }

    updateAllConversionNotes();
  }

  function autoUpdateFCLFields() {
    const tariffs = getTariffs();
    const items = readItems('fcl-items-body');
    const itemCount = items.length;
    const totalPhiNDTQ = getConvertedValueInVND('fcl-phi-nd-tq');
    const totalPhiNDVN = getConvertedValueInVND('fcl-phi-nd-vn');
    const totalPhiQT = getConvertedValueInVND('fcl-phi-qt');
    const totalPhiVCVN = getConvertedValueInVND('fcl-phi-vc-vn');

    // Calculate cost prices for FCL fees (adjusting for accumulated base prices)
    const totalPhiUT = getConvertedValueInVND('fcl-phi-ut');
    const fclAccs = window._fclAccumulations || [];
    
    let accBaoGiaFCL = {
      'fcl-phi-nd-tq': 0, 'fcl-phi-nd-vn': 0, 'fcl-phi-ut': 0, 'fcl-phi-qt': 0, 'fcl-phi-vc-vn': 0
    };
    let accGiaNenFCL = {
      'fcl-phi-nd-tq': 0, 'fcl-phi-nd-vn': 0, 'fcl-phi-ut': 0, 'fcl-phi-qt': 0, 'fcl-phi-vc-vn': 0
    };
    
    fclAccs.forEach(a => {
      if (accBaoGiaFCL[a.targetId] !== undefined) {
        accBaoGiaFCL[a.targetId] += a.amount || 0;
        accGiaNenFCL[a.targetId] += a.baseAmountVND || a.amount || 0;
      }
    });

    const costNDTQ = Math.max(0, totalPhiNDTQ - accBaoGiaFCL['fcl-phi-nd-tq'] + accGiaNenFCL['fcl-phi-nd-tq']);
    const costNDVN = Math.max(0, totalPhiNDVN - accBaoGiaFCL['fcl-phi-nd-vn'] + accGiaNenFCL['fcl-phi-nd-vn']);
    const costQT = Math.max(0, totalPhiQT - accBaoGiaFCL['fcl-phi-qt'] + accGiaNenFCL['fcl-phi-qt']);
    const costVCVN = Math.max(0, totalPhiVCVN - accBaoGiaFCL['fcl-phi-vc-vn'] + accGiaNenFCL['fcl-phi-vc-vn']);
    const costTrusteeFCL = Math.max(0, totalPhiUT - accBaoGiaFCL['fcl-phi-ut'] + accGiaNenFCL['fcl-phi-ut']);

    const defaultCostFCL = costNDTQ + costNDVN + costTrusteeFCL + costQT + costVCVN;
    const fclManualCostInput = document.getElementById('fcl-manual-cost-input');
    const overrideCostFCL = document.getElementById('fcl-override-cost-check') ? document.getElementById('fcl-override-cost-check').checked : false;

    if (!overrideCostFCL && fclManualCostInput) {
      fclManualCostInput.value = formatVND(defaultCostFCL);
    }

    const explainCostFCL = document.getElementById('fcl-manual-cost-explain');
    if (explainCostFCL) {
      explainCostFCL.textContent = `Tự tính: Tổng phí NĐ + UT gốc (${itemCount} mục × ${formatVND(tariffs.phiUTBase)} ₫) + Phí QT/VC = ${formatVND(defaultCostFCL)} ₫`;
      explainCostFCL.style.display = 'flex';
    }
  }

  function initOverrideToggles() {
    const overrides = [
      { check: 'lcl-override-cuoc-vc', input: 'lcl-cuoc-vc' },
      { check: 'lcl-override-phi-ut', input: 'lcl-phi-ut' },
      { check: 'lcl-override-phi-rr', input: 'lcl-phi-rr' },
      { check: 'lcl-override-phi-vc-tq', input: 'lcl-phi-vc-tq' },
      { check: 'lcl-override-cost-check', input: 'lcl-manual-cost-input' },
      { check: 'fcl-override-cost-check', input: 'fcl-manual-cost-input' }
    ];

    overrides.forEach(item => {
      const checkEl = document.getElementById(item.check);
      const inputEl = document.getElementById(item.input);
      if (checkEl && inputEl) {
        checkEl.addEventListener('change', () => {
          inputEl.disabled = !checkEl.checked;
          const currencySelect = document.getElementById(item.input + '-currency');
          if (currencySelect) {
            currencySelect.disabled = !checkEl.checked;
            if (!checkEl.checked) {
              currencySelect.value = 'VND';
            }
          }
          if (item.check.startsWith('lcl-')) {
            autoUpdateLCLFields();
          } else if (item.check.startsWith('fcl-')) {
            autoUpdateFCLFields();
          }
        });
      }
    });
  }

  // ══════════════════════════════════════
  //  LCL CALCULATION (Chức năng 2.1 C2)
  // ══════════════════════════════════════
  function calculateLCL() {
    const items = readItems('lcl-items-body');
    if (items.length === 0 || items.every(i => i.value === 0)) {
      showToast('Vui lòng nhập giá trị hàng hóa cho ít nhất 1 mặt hàng', 'error');
      return;
    }

    const exchangeRate = parseNum(document.getElementById('exchange-rate').value);
    if (exchangeRate <= 0) {
      showToast('Vui lòng nhập tỷ giá hợp lệ', 'error');
      return;
    }

    // Force update auto fields to ensure correct values
    autoUpdateLCLFields();

    // Read shared costs
    const totalCuocVC = getConvertedValueInVND('lcl-cuoc-vc');
    const totalPhiUT = getConvertedValueInVND('lcl-phi-ut');
    const totalPhiRR = getConvertedValueInVND('lcl-phi-rr');
    const totalPhiKhacTQ = getConvertedValueInVND('lcl-phi-khac-tq');
    const totalPhiVCTQ = getConvertedValueInVND('lcl-phi-vc-tq');
    const totalPhiKhacVN = getConvertedValueInVND('lcl-phi-khac-vn');
    const totalChietKhau = getConvertedValueInVND('lcl-chiet-khau');

    // Total value for C2 allocation
    const totalValue = items.reduce((s, i) => s + i.value, 0);
    if (totalValue === 0) {
      showToast('Tổng giá trị hàng phải lớn hơn 0', 'error');
      return;
    }

    const itemCount = items.length;

    const results = items.map(item => {
      const ratio = item.value / totalValue;
      const c1 = item.value;                           // (1) Giá trị hàng
      const c2 = Math.max(0, totalCuocVC - totalChietKhau) * ratio; // (2) Cước VC TQ-VN (đã trừ chiết khấu)
      const c3 = totalPhiUT / itemCount;                // (3) Phí ủy thác — chia đều mỗi mục hàng
      const c4 = totalPhiRR * ratio;                    // (4) Phí rủi ro
      const c5 = totalPhiKhacTQ * ratio;                // (5) Phí khác TQ+VN
      const c6 = totalPhiVCTQ * ratio;                  // (6) Phí VC TQ (quốc tế)
      const c7 = c2 - c6;                               // (7) Phí VC VN
      const c8 = totalPhiKhacVN * ratio;                // (8) Phí khác VN


      const c9 = c1 + c3 + c5 + c6;                    // (9) Giá CIF/DAP (Loại bỏ c4 - Phí rủi ro)

      // Tax rates from item
      const taxNK = item.taxNK;                         // (10)
      const taxOther = item.taxOther;                   // (11)
      const vatRate = item.vat;                         // (12)

      // (13) Thuế trực tiếp = (9)*(10) + [(9)+(9)*(10)]*(11)
      const c13 = c9 * taxNK + (c9 + c9 * taxNK) * taxOther;

      // (14) Tiền thuế VAT = [(13)+(9)]*(12) + [(7)+(8)+(c4)]*(12)
      const c14 = (c13 + c9) * vatRate + (c7 + c8 + c4) * vatRate; // (Thêm c4 vào nhóm chịu thuế VAT dịch vụ nội địa)

      // (15) Tổng CP chưa VAT + Thuế TT = (2)+(3)+(4)+(5)+(8)+(13)
      const c15 = c2 + c3 + c4 + c5 + c8 + c13;

      // (16) Giá trị xuất HĐ (đã VAT) = (14)/(12) + (14)
      const c16 = vatRate > 0 ? (c14 / vatRate + c14) : 0;

      // (17) Số tiền chuyển thêm = (16) - (1)
      const c17 = c16 - c1;

      // Đơn giá khai báo (DAP) = (9) / SL / Tỷ giá
      const unitDAP = (item.qty > 0 && exchangeRate > 0) ? c9 / item.qty / exchangeRate : 0;

      // Đơn giá xuất HĐ (chưa VAT) = [(16)-(14)] / SL
      const unitInvoice = item.qty > 0 ? (c16 - c14) / item.qty : 0;

      return {
        name: item.name || `Mặt hàng`,
        qty: item.qty,
        ratio,
        c1, c2, c3, c4, c5, c6, c7, c8, c9,
        taxNK, taxOther, vatRate,
        c13, c14, c15, c16, c17,
        unitDAP, unitInvoice
      };
    });

    // Milestone M3 (R3) Expected Profit Metrics Calculation
    const tariffs = getTariffs();
    const cbm = parseFloat(String(document.getElementById('lcl-so-khoi').value).replace(/,/g, '.')) || 0;
    const khoTQ = document.getElementById('lcl-kho-tq').value;
    const rateQT = (khoTQ === 'Quảng Châu') ? tariffs.cuerQTQC : tariffs.cuerQTBT;
    const baseFreightCost = cbm * rateQT;
    const baseTrusteeCost = itemCount * tariffs.phiUTBase;
    
    const lclAccs = window._lclAccumulations || [];
    
    let accBaoGia = {
      'lcl-cuoc-vc': 0, 'lcl-phi-ut': 0, 'lcl-phi-rr': 0, 'lcl-phi-khac-tq': 0, 'lcl-phi-khac-vn': 0
    };
    let accGiaNen = {
      'lcl-cuoc-vc': 0, 'lcl-phi-ut': 0, 'lcl-phi-rr': 0, 'lcl-phi-khac-tq': 0, 'lcl-phi-khac-vn': 0
    };
    
    lclAccs.forEach(a => {
      if (accBaoGia[a.targetId] !== undefined) {
        accBaoGia[a.targetId] += a.amount || 0;
        accGiaNen[a.targetId] += a.baseAmountVND || a.amount || 0;
      }
    });

    const costFreight = baseFreightCost + accGiaNen['lcl-cuoc-vc'];
    const costTrustee = baseTrusteeCost + accGiaNen['lcl-phi-ut'];
    const costRisk = accGiaNen['lcl-phi-rr'];
    const costPhiKhacTQ = Math.max(0, totalPhiKhacTQ - accBaoGia['lcl-phi-khac-tq'] + accGiaNen['lcl-phi-khac-tq']);
    const costPhiKhacVN = Math.max(0, totalPhiKhacVN - accBaoGia['lcl-phi-khac-vn'] + accGiaNen['lcl-phi-khac-vn']);
    
    const defaultCostLCL = costFreight + costTrustee + costRisk + costPhiKhacTQ + costPhiKhacVN;

    const isCostOverridden = document.getElementById('lcl-override-cost-check') ? document.getElementById('lcl-override-cost-check').checked : false;
    const rawCostVal = parseNum(document.getElementById('lcl-manual-cost-input')?.value);
    const costPrice = (isCostOverridden && rawCostVal > 0) ? rawCostVal : defaultCostLCL;

    const sellingPrice = Math.max(0, totalCuocVC - totalChietKhau) + totalPhiUT + totalPhiRR + totalPhiKhacTQ + totalPhiKhacVN;
    const expectedProfit = sellingPrice - costPrice;
    const profitMargin = sellingPrice > 0 ? (expectedProfit / sellingPrice) * 100 : 0;

    window._lclProfitMetrics = {
      costPrice,
      isCostOverridden,
      expectedProfit,
      profitMargin
    };

    activeCalculationContext = {
      type: 'LCL',
      items: results,
      exchangeRate,
      exchangeRateRMB: parseNum(document.getElementById('exchange-rate-rmb')?.value) || 3600,
      totalAmount: results.reduce((sum, item) => sum + item.c16, 0)
    };

    renderLCLResults(results, exchangeRate);
    renderLCLCurrencyNotes(items);
    showToast('Tính toán thành công!', 'success');
    saveCalculation('LCL');
  }

  // ══════════════════════════════════════
  //  FCL CALCULATION (Chức năng 2.2 C2)
  // ══════════════════════════════════════
  function calculateFCL() {
    const items = readItems('fcl-items-body');
    if (items.length === 0 || items.every(i => i.value === 0)) {
      showToast('Vui lòng nhập giá trị hàng hóa cho ít nhất 1 mặt hàng', 'error');
      return;
    }

    const exchangeRate = parseNum(document.getElementById('exchange-rate').value);
    if (exchangeRate <= 0) {
      showToast('Vui lòng nhập tỷ giá hợp lệ', 'error');
      return;
    }

    // Read shared costs
    const totalPhiNDTQ = getConvertedValueInVND('fcl-phi-nd-tq');
    const totalPhiNDVN = getConvertedValueInVND('fcl-phi-nd-vn');
    const totalPhiUT = getConvertedValueInVND('fcl-phi-ut');
    const totalPhiQT = getConvertedValueInVND('fcl-phi-qt');
    const totalPhiVCVN = getConvertedValueInVND('fcl-phi-vc-vn');

    const totalValue = items.reduce((s, i) => s + i.value, 0);
    if (totalValue === 0) {
      showToast('Tổng giá trị hàng phải lớn hơn 0', 'error');
      return;
    }

    const results = items.map(item => {
      const ratio = item.value / totalValue;
      const c1 = item.value;                           // (1) Giá trị hàng
      const c2 = totalPhiNDTQ * ratio;                  // (2) Phí nội địa TQ
      const c3 = totalPhiNDVN * ratio;                  // (3) Phí nội địa VN
      const c4 = totalPhiUT * ratio;                    // (4) Phí ủy thác
      const c5 = totalPhiQT * ratio;                    // (5) Phí QT + VC QT
      const c6 = totalPhiVCVN * ratio;                  // (6) Phí VC VN

      // (7) Giá EXW = (1)+(2)+(3)+(4)
      const c7 = c1 + c2 + c3 + c4;

      // (8) Giá CIF = (7)+(5)
      const c8 = c7 + c5;

      // Tax rates
      const taxNK = item.taxNK;                         // (9)
      const taxOther = item.taxOther;                   // (10)
      const vatRate = item.vat;                         // (11)

      // (12) Thuế trực tiếp = (8)*(9) + [(8)+(8)*(9)]*(10)
      const c12 = c8 * taxNK + (c8 + c8 * taxNK) * taxOther;

      // (13) VAT = [(12)+(8)]*(11) + (6)*(11)
      const c13 = (c12 + c8) * vatRate + c6 * vatRate;

      // (14) Tổng CP chưa VAT + Thuế TT = (2)+(3)+(4)+(5)+(6)+(12)
      const c14 = c2 + c3 + c4 + c5 + c6 + c12;

      // (15) Giá trị xuất HĐ (đã VAT) = (13)/(11) + (13)
      const c15 = vatRate > 0 ? (c13 / vatRate + c13) : 0;

      // (16) Số tiền chuyển thêm = (15) - (1)
      const c16 = c15 - c1;

      // Đơn giá khai báo (EXW) = (7) / SL / Tỷ giá
      const unitEXW = (item.qty > 0 && exchangeRate > 0) ? c7 / item.qty / exchangeRate : 0;

      // Đơn giá xuất HĐ (chưa VAT) = [(15)-(13)] / SL
      const unitInvoice = item.qty > 0 ? (c15 - c13) / item.qty : 0;

      return {
        name: item.name || `Mặt hàng`,
        qty: item.qty,
        ratio,
        c1, c2, c3, c4, c5, c6, c7, c8,
        taxNK, taxOther, vatRate,
        c12, c13, c14, c15, c16,
        unitEXW, unitInvoice
      };
    });

    // Milestone M3 (R3) FCL Cost & Profit Calculation
    const tariffs = getTariffs();
    const itemCount = items.length;
    
    const fclAccs = window._fclAccumulations || [];
    
    let accBaoGiaFCL = {
      'fcl-phi-nd-tq': 0, 'fcl-phi-nd-vn': 0, 'fcl-phi-ut': 0, 'fcl-phi-qt': 0, 'fcl-phi-vc-vn': 0
    };
    let accGiaNenFCL = {
      'fcl-phi-nd-tq': 0, 'fcl-phi-nd-vn': 0, 'fcl-phi-ut': 0, 'fcl-phi-qt': 0, 'fcl-phi-vc-vn': 0
    };
    
    fclAccs.forEach(a => {
      if (accBaoGiaFCL[a.targetId] !== undefined) {
        accBaoGiaFCL[a.targetId] += a.amount || 0;
        accGiaNenFCL[a.targetId] += a.baseAmountVND || a.amount || 0;
      }
    });

    const costNDTQ = Math.max(0, totalPhiNDTQ - accBaoGiaFCL['fcl-phi-nd-tq'] + accGiaNenFCL['fcl-phi-nd-tq']);
    const costNDVN = Math.max(0, totalPhiNDVN - accBaoGiaFCL['fcl-phi-nd-vn'] + accGiaNenFCL['fcl-phi-nd-vn']);
    const costQT = Math.max(0, totalPhiQT - accBaoGiaFCL['fcl-phi-qt'] + accGiaNenFCL['fcl-phi-qt']);
    const costVCVN = Math.max(0, totalPhiVCVN - accBaoGiaFCL['fcl-phi-vc-vn'] + accGiaNenFCL['fcl-phi-vc-vn']);
    const costTrusteeFCL = Math.max(0, totalPhiUT - accBaoGiaFCL['fcl-phi-ut'] + accGiaNenFCL['fcl-phi-ut']);

    const defaultCostFCL = costNDTQ + costNDVN + costTrusteeFCL + costQT + costVCVN;

    const isCostOverridden = document.getElementById('fcl-override-cost-check') ? document.getElementById('fcl-override-cost-check').checked : false;
    const rawCostVal = parseNum(document.getElementById('fcl-manual-cost-input')?.value);
    const costPrice = (isCostOverridden && rawCostVal > 0) ? rawCostVal : defaultCostFCL;

    const sellingPrice = totalPhiNDTQ + totalPhiNDVN + totalPhiUT + totalPhiQT + totalPhiVCVN;
    const expectedProfit = sellingPrice - costPrice;
    const profitMargin = sellingPrice > 0 ? (expectedProfit / sellingPrice) * 100 : 0;

    window._fclProfitMetrics = {
      costPrice,
      isCostOverridden,
      expectedProfit,
      profitMargin
    };

    activeCalculationContext = {
      type: 'FCL',
      items: results,
      exchangeRate,
      exchangeRateRMB: parseNum(document.getElementById('exchange-rate-rmb')?.value) || 3600,
      totalAmount: results.reduce((sum, item) => sum + item.c15, 0)
    };

    renderFCLResults(results, exchangeRate);
    renderFCLCurrencyNotes(items);
    showToast('Tính toán thành công!', 'success');
    saveCalculation('FCL');
  }

  // ── RENDER LCL RESULTS ──
  function renderLCLResults(results, exchangeRate) {
    const section = document.getElementById('lcl-results');
    section.classList.add('visible');

    let bodyHTML = '';
    const totals = { c1:0, c2:0, c3:0, c4:0, c5:0, c6:0, c7:0, c8:0, c9:0, c13:0, c14:0, c15:0, c16:0, c17:0 };

    results.forEach((r, i) => {
      Object.keys(totals).forEach(k => { totals[k] += r[k]; });
      bodyHTML += `
        <tr>
          <td>${i + 1}. ${r.name}</td>
          <td>${r.qty}</td>
          <td>${(r.ratio * 100).toFixed(2)}%</td>
          <td>${formatVND(r.c1)}</td>
          <td>${formatVND(r.c2)}</td>
          <td>${formatVND(r.c3)}</td>
          <td>${formatVND(r.c4)}</td>
          <td>${formatVND(r.c5)}</td>
          <td>${formatVND(r.c6)}</td>
          <td>${formatVND(r.c7)}</td>
          <td>${formatVND(r.c8)}</td>
          <td class="col-highlight">${formatVND(r.c9)}</td>
          <td>${(r.taxNK * 100).toFixed(1)}%</td>
          <td>${(r.taxOther * 100).toFixed(1)}%</td>
          <td>${(r.vatRate * 100).toFixed(1)}%</td>
          <td>${formatVND(r.c13)}</td>
          <td>${formatVND(r.c14)}</td>
          <td>${formatVND(r.c15)}</td>
          <td class="col-highlight">${formatVND(r.c16)}</td>
          <td>${formatVND(r.c17)}</td>
          <td>${r.unitDAP.toFixed(4)}</td>
          <td>${formatVND(r.unitInvoice)}</td>
        </tr>`;
    });

    bodyHTML += `
      <tr class="total-row">
        <td>TỔNG CỘNG</td>
        <td></td>
        <td>100%</td>
        <td>${formatVND(totals.c1)}</td>
        <td>${formatVND(totals.c2)}</td>
        <td>${formatVND(totals.c3)}</td>
        <td>${formatVND(totals.c4)}</td>
        <td>${formatVND(totals.c5)}</td>
        <td>${formatVND(totals.c6)}</td>
        <td>${formatVND(totals.c7)}</td>
        <td>${formatVND(totals.c8)}</td>
        <td class="col-highlight">${formatVND(totals.c9)}</td>
        <td></td><td></td><td></td>
        <td>${formatVND(totals.c13)}</td>
        <td>${formatVND(totals.c14)}</td>
        <td>${formatVND(totals.c15)}</td>
        <td class="col-highlight">${formatVND(totals.c16)}</td>
        <td>${formatVND(totals.c17)}</td>
        <td></td><td></td>
      </tr>`;

    document.getElementById('lcl-results-body').innerHTML = bodyHTML;

    document.getElementById('lcl-sum-total-value').textContent = formatVND(totals.c1) + ' ₫';
    document.getElementById('lcl-sum-cif').textContent = formatVND(totals.c9) + ' ₫';
    document.getElementById('lcl-sum-tax').textContent = formatVND(totals.c13) + ' ₫';
    document.getElementById('lcl-sum-invoice').textContent = formatVND(totals.c16) + ' ₫';
    document.getElementById('lcl-sum-extra').textContent = formatVND(totals.c17) + ' ₫';

    const profitMetricsLCL = window._lclProfitMetrics || {
      costPrice: 0,
      isCostOverridden: false,
      expectedProfit: 0,
      profitMargin: 0
    };

    const elCostPriceLCL = document.getElementById('lcl-sum-cost-price');
    const elCostTypeLCL = document.getElementById('lcl-sum-cost-type');
    const elProfitLCL = document.getElementById('lcl-sum-expected-profit');
    const elMarginLCL = document.getElementById('lcl-sum-profit-margin');

    if (elCostPriceLCL) elCostPriceLCL.textContent = formatVND(profitMetricsLCL.costPrice) + ' ₫';
    if (elCostTypeLCL) elCostTypeLCL.textContent = profitMetricsLCL.isCostOverridden ? 'Ghi đè thủ công' : 'Tự động từ hệ thống';
    if (elProfitLCL) {
      const prefix = profitMetricsLCL.expectedProfit >= 0 ? '+' : '';
      elProfitLCL.textContent = prefix + formatVND(profitMetricsLCL.expectedProfit) + ' ₫';
    }
    if (elMarginLCL) elMarginLCL.textContent = profitMetricsLCL.profitMargin.toFixed(2) + '%';

    section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    window._lclResults = results;
    window._lclTotals = totals;
    window._lclExchangeRate = exchangeRate;
  }

  // ── RENDER FCL RESULTS ──
  function renderFCLResults(results, exchangeRate) {
    const section = document.getElementById('fcl-results');
    section.classList.add('visible');

    let bodyHTML = '';
    const totals = { c1:0, c2:0, c3:0, c4:0, c5:0, c6:0, c7:0, c8:0, c12:0, c13:0, c14:0, c15:0, c16:0 };

    results.forEach((r, i) => {
      Object.keys(totals).forEach(k => { totals[k] += r[k]; });
      bodyHTML += `
        <tr>
          <td>${i + 1}. ${r.name}</td>
          <td>${r.qty}</td>
          <td>${(r.ratio * 100).toFixed(2)}%</td>
          <td>${formatVND(r.c1)}</td>
          <td>${formatVND(r.c2)}</td>
          <td>${formatVND(r.c3)}</td>
          <td>${formatVND(r.c4)}</td>
          <td>${formatVND(r.c5)}</td>
          <td>${formatVND(r.c6)}</td>
          <td class="col-highlight">${formatVND(r.c7)}</td>
          <td class="col-highlight">${formatVND(r.c8)}</td>
          <td>${(r.taxNK * 100).toFixed(1)}%</td>
          <td>${(r.taxOther * 100).toFixed(1)}%</td>
          <td>${(r.vatRate * 100).toFixed(1)}%</td>
          <td>${formatVND(r.c12)}</td>
          <td>${formatVND(r.c13)}</td>
          <td>${formatVND(r.c14)}</td>
          <td class="col-highlight">${formatVND(r.c15)}</td>
          <td>${formatVND(r.c16)}</td>
          <td>${r.unitEXW.toFixed(4)}</td>
          <td>${formatVND(r.unitInvoice)}</td>
        </tr>`;
    });

    bodyHTML += `
      <tr class="total-row">
        <td>TỔNG CỘNG</td>
        <td></td>
        <td>100%</td>
        <td>${formatVND(totals.c1)}</td>
        <td>${formatVND(totals.c2)}</td>
        <td>${formatVND(totals.c3)}</td>
        <td>${formatVND(totals.c4)}</td>
        <td>${formatVND(totals.c5)}</td>
        <td>${formatVND(totals.c6)}</td>
        <td class="col-highlight">${formatVND(totals.c7)}</td>
        <td class="col-highlight">${formatVND(totals.c8)}</td>
        <td></td><td></td><td></td>
        <td>${formatVND(totals.c12)}</td>
        <td>${formatVND(totals.c13)}</td>
        <td>${formatVND(totals.c14)}</td>
        <td class="col-highlight">${formatVND(totals.c15)}</td>
        <td>${formatVND(totals.c16)}</td>
        <td></td><td></td>
      </tr>`;

    document.getElementById('fcl-results-body').innerHTML = bodyHTML;

    document.getElementById('fcl-sum-total-value').textContent = formatVND(totals.c1) + ' ₫';
    document.getElementById('fcl-sum-exw').textContent = formatVND(totals.c7) + ' ₫';
    document.getElementById('fcl-sum-cif').textContent = formatVND(totals.c8) + ' ₫';
    document.getElementById('fcl-sum-invoice').textContent = formatVND(totals.c15) + ' ₫';
    document.getElementById('fcl-sum-extra').textContent = formatVND(totals.c16) + ' ₫';

    const profitMetricsFCL = window._fclProfitMetrics || {
      costPrice: 0,
      isCostOverridden: false,
      expectedProfit: 0,
      profitMargin: 0
    };

    const elCostPriceFCL = document.getElementById('fcl-sum-cost-price');
    const elCostTypeFCL = document.getElementById('fcl-sum-cost-type');
    const elProfitFCL = document.getElementById('fcl-sum-expected-profit');
    const elMarginFCL = document.getElementById('fcl-sum-profit-margin');

    if (elCostPriceFCL) elCostPriceFCL.textContent = formatVND(profitMetricsFCL.costPrice) + ' ₫';
    if (elCostTypeFCL) elCostTypeFCL.textContent = profitMetricsFCL.isCostOverridden ? 'Ghi đè thủ công' : 'Tự động từ hệ thống';
    if (elProfitFCL) {
      const prefix = profitMetricsFCL.expectedProfit >= 0 ? '+' : '';
      elProfitFCL.textContent = prefix + formatVND(profitMetricsFCL.expectedProfit) + ' ₫';
    }
    if (elMarginFCL) elMarginFCL.textContent = profitMetricsFCL.profitMargin.toFixed(2) + '%';

    section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    window._fclResults = results;
    window._fclTotals = totals;
    window._fclExchangeRate = exchangeRate;
  }

  // ── EXCEL EXPORT (SheetJS - Khai Báo Hải Quan dựa theo muchangmau.xlsx) ──
  async function exportDeclarationExcel(type) {
    const results = type === 'LCL' ? window._lclResults : window._fclResults;
    if (!results) {
      showToast('Chưa có kết quả để xuất', 'error');
      return;
    }
    
    if (typeof XLSX === 'undefined') {
      showToast('Đang tải thư viện Excel...', 'error');
      return;
    }

    try {
      showToast('Đang chuẩn bị xuất file khai báo...', 'info');
      
      const EXCEL_TEMPLATE_BASE64 = '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';
      
      // Giải mã base64 thành ArrayBuffer trực tiếp (không dùng fetch để tránh lỗi CORS khi chạy offline file://)
      const binaryString = atob(EXCEL_TEMPLATE_BASE64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const arrayBuffer = bytes.buffer;
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      if (!worksheet) {
        throw new Error('Tệp mẫu trống hoặc không đúng định dạng');
      }

      // Xóa tất cả các dòng dữ liệu cũ bên dưới dòng 1 (giữ nguyên tiêu đề và metadata !cols, !ref...)
      Object.keys(worksheet).forEach(key => {
        if (key.indexOf('!') === 0) return;
        const rowNum = parseInt(key.replace(/^[A-Z]+/, ''), 10);
        if (rowNum > 1) {
          delete worksheet[key];
        }
      });

      // Hàm bổ trợ ghi dữ liệu ô tính
      function writeCell(ws, colIndex, rowIndex, value) {
        const colLetter = XLSX.utils.encode_col(colIndex);
        const cellRef = colLetter + (rowIndex + 1);
        ws[cellRef] = { v: value, t: typeof value === 'number' ? 'n' : 's' };
      }

      // Điền dữ liệu các mặt hàng bắt đầu từ dòng 2 (rowIndex = 1)
      results.forEach((r, index) => {
        const rowIndex = index + 1;
        const unitPrice = type === 'LCL' ? (r.unitDAP || 0) : (r.unitEXW || 0);
        const qty = r.qty || 0;
        const totalPrice = qty * unitPrice;

        writeCell(worksheet, 1, rowIndex, r.name || '');                                // Cột 2 (B): Tên hàng
        writeCell(worksheet, 9, rowIndex, qty);                                         // Cột 10 (J): Số lượng S/P
        writeCell(worksheet, 13, rowIndex, parseFloat(parseFloat(unitPrice).toFixed(4)));  // Cột 14 (N): Giá khai Thực tế (USD)
        writeCell(worksheet, 14, rowIndex, parseFloat(parseFloat(totalPrice).toFixed(4))); // Cột 15 (O): Thành tiền (USD)
        writeCell(worksheet, 15, rowIndex, (r.name || '').substring(0, 100));            // Cột 16 (P): Tên yêu cầu xuất hóa đơn
      });

      // Cập nhật lại phạm vi ô hiển thị của Sheet
      worksheet['!ref'] = `A1:P${results.length + 1}`;

      const fileName = `Khai_bao_hai_quan_${type}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      triggerMobileDownload(blob, fileName);
      showToast(`Đã xuất file ${fileName} thành công!`, 'success');
    } catch (err) {
      console.error(err);
      showToast(`Lỗi xuất Excel: ${err.message}`, 'error');
    }
  }

  function exportLCLExcel() {
    exportDeclarationExcel('LCL');
  }

  function exportFCLExcel() {
    exportDeclarationExcel('FCL');
  }

  // ── History Database & Actions ──
  function getHistory() {
    try {
      const history = localStorage.getItem('eureka_1so_history');
      if (!history) return [];
      const parsed = JSON.parse(history);
      if (!Array.isArray(parsed)) return [];
      const tenDaysMs = 10 * 24 * 60 * 60 * 1000;
      const filtered = parsed.filter(item => item && typeof item === 'object' && item.id && (Date.now() - item.id < tenDaysMs));
      filtered.sort((a, b) => b.id - a.id);
      return filtered;
    } catch (e) {
      return [];
    }
  }

  async function saveCalculation(type) {
    const exchangeRate = document.getElementById('exchange-rate').value;
    const exchangeRateRMB = document.getElementById('exchange-rate-rmb').value;

    const profitMetrics = (type === 'LCL' ? window._lclProfitMetrics : window._fclProfitMetrics) || {
      costPrice: 0,
      isCostOverridden: false,
      expectedProfit: 0,
      profitMargin: 0
    };

    let data = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: type,
      exchangeRate: exchangeRate,
      exchangeRateRMB: exchangeRateRMB,
      // Milestone M3 R3 Expected Profit Metrics
      costPrice: profitMetrics.costPrice,
      isCostOverridden: profitMetrics.isCostOverridden,
      expectedProfit: profitMetrics.expectedProfit,
      profitMargin: profitMetrics.profitMargin,
    };

    if (type === 'LCL') {
      data.shared = {
        cuocVC: document.getElementById('lcl-cuoc-vc').value,
        cuocVCCurrency: document.getElementById('lcl-cuoc-vc-currency').value,
        phiUT: document.getElementById('lcl-phi-ut').value,
        phiUTCurrency: document.getElementById('lcl-phi-ut-currency').value,
        phiRR: document.getElementById('lcl-phi-rr').value,
        phiRRCurrency: document.getElementById('lcl-phi-rr-currency').value,
        phiKhacTQ: document.getElementById('lcl-phi-khac-tq').value,
        phiKhacTQCurrency: document.getElementById('lcl-phi-khac-tq-currency').value,
        phiVC: document.getElementById('lcl-phi-vc-tq').value,
        phiVCCurrency: document.getElementById('lcl-phi-vc-tq-currency').value,
        soKhoi: document.getElementById('lcl-so-khoi').value,
        soKg: document.getElementById('lcl-so-kg').value,
        duongVC: document.getElementById('lcl-duong-vc').value,
        khoTQ: document.getElementById('lcl-kho-tq').value,
        khoVN: document.getElementById('lcl-kho-vn').value,
        vipLevel: document.getElementById('lcl-vip').value,
        chietKhau: document.getElementById('lcl-chiet-khau').value,
        chietKhauCurrency: document.getElementById('lcl-chiet-khau-currency').value,
        phiKhacVN: document.getElementById('lcl-phi-khac-vn').value,
        phiKhacVNCurrency: document.getElementById('lcl-phi-khac-vn-currency').value,
        overrideCostPrice: document.getElementById('lcl-override-cost-check') ? document.getElementById('lcl-override-cost-check').checked : false,
        manualCostPrice: document.getElementById('lcl-manual-cost-input') ? document.getElementById('lcl-manual-cost-input').value : '',
      };
      data.items = readItems('lcl-items-body');
      data.totalValue = data.items.reduce((s, i) => s + i.value, 0);
    } else {
      data.shared = {
        phiNDTQ: document.getElementById('fcl-phi-nd-tq').value,
        phiNDTQCurrency: document.getElementById('fcl-phi-nd-tq-currency').value,
        phiNDVN: document.getElementById('fcl-phi-nd-vn').value,
        phiNDVNCurrency: document.getElementById('fcl-phi-nd-vn-currency').value,
        phiUT: document.getElementById('fcl-phi-ut').value,
        phiUTCurrency: document.getElementById('fcl-phi-ut-currency').value,
        phiQT: document.getElementById('fcl-phi-qt').value,
        phiQTCurrency: document.getElementById('fcl-phi-qt-currency').value,
        phiVCVN: document.getElementById('fcl-phi-vc-vn').value,
        phiVCVNCurrency: document.getElementById('fcl-phi-vc-vn-currency').value,
        overrideCostPrice: document.getElementById('fcl-override-cost-check') ? document.getElementById('fcl-override-cost-check').checked : false,
        manualCostPrice: document.getElementById('fcl-manual-cost-input') ? document.getElementById('fcl-manual-cost-input').value : '',
      };
      data.items = readItems('fcl-items-body');
      data.totalValue = data.items.reduce((s, i) => s + i.value, 0);
    }

    const buyerNameVal = (document.getElementById('contract-buyer-name') ? document.getElementById('contract-buyer-name').value.trim() : '') || (document.getElementById('contract-buyer-select') ? document.getElementById('contract-buyer-select').value.trim() : '') || '';

    data.buyerName = buyerNameVal;
    data.createdBy = getCurrentUsername() || 'system';
    data.totalAmount = data.totalValue;

    let history = getHistory();
    history.unshift(data);
    const tenDaysMs = 10 * 24 * 60 * 60 * 1000;
    history = history.filter(item => Date.now() - item.id < tenDaysMs);

    localStorage.setItem('eureka_1so_history', JSON.stringify(history));

    // 1. Đồng bộ lên Supabase Database riêng (nếu đã cấu hình)
    if (window.EurekaDB && window.EurekaDB.isConfigured()) {
      window.EurekaDB.syncHistoryToSupabase({
        id: data.id,
        type: data.type,
        timestamp: data.timestamp,
        customerName: buyerNameVal,
        data_payload: data,
        creator: data.createdBy
      });
    }

    // 2. Đồng bộ lên Google Sheets (hỗ trợ cả Apps Script mới và cũ)
    const calcData = {
      id: data.id,
      timestamp: data.timestamp,
      type: data.type,
      buyerName: buyerNameVal,
      totalAmount: data.totalValue,
      totalValue: data.totalValue,
      costPrice: data.costPrice || 0,
      expectedProfit: data.expectedProfit || 0,
      profitMargin: data.profitMargin || 0,
      exchangeRate: data.exchangeRate,
      exchangeRateRMB: data.exchangeRateRMB,
      itemsJson: JSON.stringify(data.items || []),
      createdBy: data.createdBy,
      shared: data.shared,
      items: data.items
    };

    const payload = {
      action: 'save_calculation',
      calc: calcData,
      data: calcData,
      calculation: calcData
    };

    const personalUrl = getPersonalSheetUrl();
    const hasPersonalSheet = isValidAppsScriptUrl(personalUrl);

    const syncPromises = [];

    // Target 1: Company Master Sheet
    if (GOOGLE_SHEET_URL) {
      syncPromises.push(
        callSheetAPI(payload, GOOGLE_SHEET_URL)
          .then(res => ({ target: 'company', success: !!(res && (res.success || res.status === 'success' || res.result === 'success')) }))
          .catch(() => ({ target: 'company', success: false }))
      );
    }

    // Target 2: User Personal Sheet
    if (hasPersonalSheet) {
      syncPromises.push(
        callSheetAPI(payload, personalUrl)
          .then(res => ({ target: 'personal', success: !!(res && (res.success || res.status === 'success' || res.result === 'success')) }))
          .catch(() => ({ target: 'personal', success: false }))
      );
    }

    if (syncPromises.length > 0) {
      const results = await Promise.allSettled(syncPromises);

      let companySuccess = false;
      let personalSuccess = false;

      results.forEach(res => {
        if (res.status === 'fulfilled' && res.value) {
          if (res.value.target === 'company') companySuccess = res.value.success;
          if (res.value.target === 'personal') personalSuccess = res.value.success;
        }
      });

      if (hasPersonalSheet) {
        if (companySuccess && personalSuccess) {
          showToast('Đã đồng bộ Sheet công ty & Sheet cá nhân', 'success');
        } else if (companySuccess && !personalSuccess) {
          showToast('Đã lưu Sheet công ty (Sheet cá nhân lỗi đồng bộ)', 'warning');
        } else if (!companySuccess && personalSuccess) {
          showToast('Đã lưu Sheet cá nhân (Sheet công ty lỗi đồng bộ)', 'warning');
        } else {
          showToast('Lịch sử đã lưu local (Lỗi kết nối cả 2 Sheet)', 'warning');
        }
      } else {
        if (companySuccess) {
          showToast('Đã đồng bộ lịch sử lên Sheet công ty', 'success');
        } else {
          showToast('Đã lưu lịch sử vào bộ nhớ máy', 'info');
        }
      }
    }
    
    // Auto refresh the history detail page if open
    if (document.getElementById('tab-btn-history').classList.contains('active')) {
      renderHistoryDetailList();
    }
  }

  function renderHistoryDetailList() {
    let history = getHistory();
    const loggedInUserStr = sessionStorage.getItem('eureka_logged_in_user');
    let loggedInUser = null;
    let isAdmin = false;
    if (loggedInUserStr) {
      try {
        loggedInUser = JSON.parse(loggedInUserStr);
        isAdmin = (loggedInUser.role === 'admin' || loggedInUser.username === 'admin');
      } catch (e) {}
    }

    // Phân quyền: Admin xem toàn bộ, User thường chỉ xem lịch sử do chính mình tạo
    if (!isAdmin) {
      const currentUsername = (loggedInUser && loggedInUser.username ? loggedInUser.username : getCurrentUsername() || '').toLowerCase();
      history = history.filter(item => {
        const creator = String(item.createdBy || item.creator || item.Username || item.user || '').toLowerCase();
        return creator === currentUsername;
      });
    }

    const listEl = document.getElementById('history-detail-list');
    if (!listEl) return;
    if (history.length === 0) {
      listEl.innerHTML = `
        <div style="color:var(--text-muted); font-size:0.9rem; font-style:italic; padding:32px; text-align:center;">
          ${isAdmin ? 'Chưa có lịch sử tính toán nào được lưu.' : 'Bạn chưa có lịch sử tính toán nào do chính mình tạo.'} Bấm "Tính toán phân bổ" ở tab LCL hoặc FCL để lưu tự động.
        </div>`;
      return;
    }

    listEl.innerHTML = history.map(item => {
      let date = 'Không rõ';
      if (item.timestamp) {
        const d = new Date(item.timestamp);
        if (!isNaN(d.getTime())) {
          date = d.toLocaleString('vi-VN', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
          });
        }
      }
      const typeLabel = item.type === 'LCL' ? 'Gom Cont (LCL)' : 'Nguyên Cont (FCL)';
      const badgeClass = item.type === 'LCL' ? 'lcl' : 'fcl';

      let detailsHTML = '';
      const shared = item.shared || {};
      const items = Array.isArray(item.items) ? item.items : [];
      const totalVal = item.totalValue || item.totalAmount || 0;

      if (item.type === 'LCL') {
        detailsHTML = `
          <div class="history-detail-grid">
            <div class="history-detail-item">
              <span class="history-detail-label">Thể tích (CBM)</span>
              <span class="history-detail-value">${shared.soKhoi || 0} m³</span>
            </div>
            <div class="history-detail-item">
              <span class="history-detail-label">Cân nặng (KG)</span>
              <span class="history-detail-value">${shared.soKg || 0} kg</span>
            </div>
            <div class="history-detail-item">
              <span class="history-detail-label">Tuyến vận chuyển</span>
              <span class="history-detail-value">${shared.duongVC || 'Biển'} (${shared.khoTQ || 'QC'} -> ${shared.khoVN || 'HN'})</span>
            </div>
            <div class="history-detail-item">
              <span class="history-detail-label">Hạng VIP</span>
              <span class="history-detail-value">${shared.vipLevel || 'Pro'}</span>
            </div>
            <div class="history-detail-item">
              <span class="history-detail-label">Tổng cước VC (2)</span>
              <span class="history-detail-value">${formatVND(parseNum(shared.cuocVC))} ₫</span>
            </div>
            <div class="history-detail-item">
              <span class="history-detail-label">Phí ủy thác (3)</span>
              <span class="history-detail-value">${formatVND(parseNum(shared.phiUT))} ₫</span>
            </div>
            <div class="history-detail-item">
              <span class="history-detail-label">Phí rủi ro (4)</span>
              <span class="history-detail-value">${formatVND(parseNum(shared.phiRR))} ₫</span>
            </div>
            <div class="history-detail-item">
              <span class="history-detail-label">Trị giá hàng hóa</span>
              <span class="history-detail-value">${formatVND(totalVal)} ₫</span>
            </div>
            <div class="history-detail-item profit-item">
              <span class="history-detail-label">Giá vốn (${item.isCostOverridden ? 'Ghi đè' : 'Hệ thống'})</span>
              <span class="history-detail-value">${formatVND(item.costPrice || 0)} ₫</span>
            </div>
            <div class="history-detail-item profit-item highlight">
              <span class="history-detail-label">Lợi nhuận dự kiến</span>
              <span class="history-detail-value">
                ${(item.expectedProfit || 0) >= 0 ? '+' : ''}${formatVND(item.expectedProfit || 0)} ₫ (${(item.profitMargin || 0).toFixed(2)}%)
              </span>
            </div>
          </div>
        `;
      } else {
        detailsHTML = `
          <div class="history-detail-grid">
            <div class="history-detail-item">
              <span class="history-detail-label">Nội địa TQ (2)</span>
              <span class="history-detail-value">${formatVND(parseNum(shared.phiNDTQ))} ₫</span>
            </div>
            <div class="history-detail-item">
              <span class="history-detail-label">Nội địa VN (3)</span>
              <span class="history-detail-value">${formatVND(parseNum(shared.phiNDVN))} ₫</span>
            </div>
            <div class="history-detail-item">
              <span class="history-detail-label">Phí ủy thác (4)</span>
              <span class="history-detail-value">${formatVND(parseNum(shared.phiUT))} ₫</span>
            </div>
            <div class="history-detail-item">
              <span class="history-detail-label">Phí QT + VC QT (5)</span>
              <span class="history-detail-value">${formatVND(parseNum(shared.phiQT))} ₫</span>
            </div>
            <div class="history-detail-item">
              <span class="history-detail-label">Phí VC VN (6)</span>
              <span class="history-detail-value">${formatVND(parseNum(shared.phiVCVN))} ₫</span>
            </div>
            <div class="history-detail-item">
              <span class="history-detail-label">Trị giá hàng hóa</span>
              <span class="history-detail-value">${formatVND(totalVal)} ₫</span>
            </div>
            <div class="history-detail-item profit-item">
              <span class="history-detail-label">Giá vốn (${item.isCostOverridden ? 'Ghi đè' : 'Hệ thống'})</span>
              <span class="history-detail-value">${formatVND(item.costPrice || 0)} ₫</span>
            </div>
            <div class="history-detail-item profit-item highlight">
              <span class="history-detail-label">Lợi nhuận dự kiến</span>
              <span class="history-detail-value">
                ${(item.expectedProfit || 0) >= 0 ? '+' : ''}${formatVND(item.expectedProfit || 0)} ₫ (${(item.profitMargin || 0).toFixed(2)}%)
              </span>
            </div>
          </div>
        `;
      }

      const itemsList = items.length > 0
        ? items.map(it => `• ${it.name || 'Mặt hàng'} (SL: ${it.qty || 0}, Trị giá: ${formatVND(it.value || 0)} ₫)`).join('<br>')
        : (item.buyerName ? `Khách hàng: <strong>${item.buyerName}</strong>` : 'Chi tiết đơn hàng đã lưu hệ thống');

      const buyerBadge = item.buyerName ? `<span class="history-badge" style="background:var(--bg-accent-light); color:var(--accent); font-size:0.75rem; margin-left:8px;">${item.buyerName}</span>` : '';
      const creatorBadge = (isAdmin && item.createdBy) ? `<span class="history-badge" style="background:#e0e7ff; color:#3730a3; font-size:0.7rem; margin-left:6px;">@${item.createdBy}</span>` : '';

      return `
        <div class="history-detail-card" data-id="${item.id}">
          <div class="history-detail-card-header">
            <div>
              <span class="history-badge ${badgeClass}">${typeLabel}</span>
              ${buyerBadge}
              ${creatorBadge}
              <span class="history-time" style="margin-left: 10px;">${date}</span>
            </div>
            <div style="display:flex; gap:8px;">
              <button type="button" class="btn btn-secondary btn-restore" onclick="window._restoreHistory(${item.id})">Xem lại & Khôi phục</button>
              <button type="button" class="btn btn-danger" onclick="window._deleteHistory(${item.id}, event)" style="padding: 6px 12px; font-size:0.75rem;">Xóa</button>
            </div>
          </div>
          ${detailsHTML}
          <div style="font-size:0.8rem; color:var(--text-secondary); background:var(--bg-page); padding:10px; border-radius:6px; max-height:100px; overflow-y:auto; line-height:1.5;">
            <strong>Mặt hàng (${items.length}):</strong><br>
            ${itemsList}
          </div>
        </div>
      `;
    }).join('');
  }

  window._restoreHistory = function(id) {
    const history = getHistory();
    const entry = history.find(item => item.id === id);
    if (!entry) return;

    // Kiểm tra phân quyền xem lại
    const loggedInUserStr = sessionStorage.getItem('eureka_logged_in_user');
    let loggedInUser = null;
    let isAdmin = false;
    if (loggedInUserStr) {
      try {
        loggedInUser = JSON.parse(loggedInUserStr);
        isAdmin = (loggedInUser.role === 'admin' || loggedInUser.username === 'admin');
      } catch (e) {}
    }

    if (!isAdmin) {
      const currentUsername = (loggedInUser && loggedInUser.username ? loggedInUser.username : getCurrentUsername() || '').toLowerCase();
      const creator = String(entry.createdBy || entry.creator || entry.Username || entry.user || '').toLowerCase();
      if (creator && creator !== currentUsername) {
        showToast('Bạn không có quyền xem lại lịch sử của người khác!', 'error');
        return;
      }
    }

    const shared = entry.shared || {};
    const items = Array.isArray(entry.items) ? entry.items : [];

    // Restore exchange rates
    document.getElementById('exchange-rate').value = entry.exchangeRate || '25.400';
    document.getElementById('exchange-rate-rmb').value = entry.exchangeRateRMB || '3.600';

    // Switch to correct tab
    if (entry.type === 'LCL') {
      document.getElementById('tab-btn-lcl').click();
      
      // Restore parameters
      document.getElementById('lcl-duong-vc').value = shared.duongVC || 'Biển';
      document.getElementById('lcl-kho-tq').value = shared.khoTQ || 'Quảng Châu';
      document.getElementById('lcl-kho-vn').value = shared.khoVN || 'Hà Nội';
      document.getElementById('lcl-vip').value = shared.vipLevel || 'Pro';
      document.getElementById('lcl-so-khoi').value = shared.soKhoi || '';
      document.getElementById('lcl-so-kg').value = shared.soKg || '';
      document.getElementById('lcl-chiet-khau').value = shared.chietKhau || '';
      document.getElementById('lcl-chiet-khau-currency').value = shared.chietKhauCurrency || 'VND';
      document.getElementById('lcl-phi-khac-tq').value = shared.phiKhacTQ || '';
      document.getElementById('lcl-phi-khac-tq-currency').value = shared.phiKhacTQCurrency || 'VND';
      document.getElementById('lcl-phi-khac-vn').value = shared.phiKhacVN || '';
      document.getElementById('lcl-phi-khac-vn-currency').value = shared.phiKhacVNCurrency || 'VND';

      // Force enable override state to restore calculated numbers exactly as saved
      document.getElementById('lcl-override-cuoc-vc').checked = true;
      document.getElementById('lcl-override-phi-ut').checked = true;
      document.getElementById('lcl-override-phi-rr').checked = true;
      document.getElementById('lcl-override-phi-vc-tq').checked = true;

      document.getElementById('lcl-cuoc-vc').disabled = false;
      document.getElementById('lcl-phi-ut').disabled = false;
      document.getElementById('lcl-phi-rr').disabled = false;
      document.getElementById('lcl-phi-vc-tq').disabled = false;

      document.getElementById('lcl-cuoc-vc-currency').disabled = false;
      document.getElementById('lcl-phi-ut-currency').disabled = false;
      document.getElementById('lcl-phi-rr-currency').disabled = false;
      document.getElementById('lcl-phi-vc-tq-currency').disabled = false;

      document.getElementById('lcl-cuoc-vc').value = shared.cuocVC || '0';
      document.getElementById('lcl-cuoc-vc-currency').value = shared.cuocVCCurrency || 'VND';
      document.getElementById('lcl-phi-ut').value = shared.phiUT || '0';
      document.getElementById('lcl-phi-ut-currency').value = shared.phiUTCurrency || 'VND';
      document.getElementById('lcl-phi-rr').value = shared.phiRR || '0';
      document.getElementById('lcl-phi-rr-currency').value = shared.phiRRCurrency || 'VND';
      document.getElementById('lcl-phi-vc-tq').value = shared.phiVC || '0';
      document.getElementById('lcl-phi-vc-tq-currency').value = shared.phiVCCurrency || 'VND';

      // Restore items table
      const tbody = document.getElementById('lcl-items-body');
      tbody.innerHTML = '';
      items.forEach((item, index) => {
        tbody.insertAdjacentHTML('beforeend', createLCLRow(index + 1));
        const row = tbody.lastElementChild;
        row.querySelector('[data-field="name"]').value = item.name || '';
        row.querySelector('[data-field="qty"]').value = item.qty ? item.qty.toLocaleString('vi-VN') : '';
        
        // Restore currency and value
        if (item.currency) {
          row.querySelector('[data-field="currency"]').value = item.currency;
        }
        const valToSet = item.rawValue !== undefined ? item.rawValue : item.value;
        if (item.currency === 'VND' || !item.currency) {
          row.querySelector('[data-field="value"]').value = valToSet ? formatVND(valToSet) : '';
        } else {
          row.querySelector('[data-field="value"]').value = valToSet ? valToSet.toLocaleString('vi-VN') : '';
        }

        row.querySelector('[data-field="taxNK"]').value = ((item.taxNK || 0) * 100).toFixed(1).replace('.', ',');
        row.querySelector('[data-field="taxOther"]').value = ((item.taxOther || 0) * 100).toFixed(1).replace('.', ',');
        row.querySelector('[data-field="vat"]').value = ((item.vat || 0) * 100).toFixed(1).replace('.', ',');
        attachInputFormatters(row);
      });
      lclItemCount = items.length;
      calculateLCL();
    } else {
      document.getElementById('tab-btn-fcl').click();

      // Restore shared inputs
      document.getElementById('fcl-phi-nd-tq').value = shared.phiNDTQ || '0';
      document.getElementById('fcl-phi-nd-tq-currency').value = shared.phiNDTQCurrency || 'VND';
      
      document.getElementById('fcl-phi-nd-vn').value = shared.phiNDVN || '0';
      document.getElementById('fcl-phi-nd-vn-currency').value = shared.phiNDVNCurrency || 'VND';
      
      document.getElementById('fcl-phi-ut').value = shared.phiUT || '0';
      document.getElementById('fcl-phi-ut-currency').value = shared.phiUTCurrency || 'VND';
      
      document.getElementById('fcl-phi-qt').value = shared.phiQT || '0';
      document.getElementById('fcl-phi-qt-currency').value = shared.phiQTCurrency || 'VND';
      
      document.getElementById('fcl-phi-vc-vn').value = shared.phiVCVN || '0';
      document.getElementById('fcl-phi-vc-vn-currency').value = shared.phiVCVNCurrency || 'VND';

      // Restore items table
      const tbody = document.getElementById('fcl-items-body');
      tbody.innerHTML = '';
      items.forEach((item, index) => {
        tbody.insertAdjacentHTML('beforeend', createFCLRow(index + 1));
        const row = tbody.lastElementChild;
        row.querySelector('[data-field="name"]').value = item.name || '';
        row.querySelector('[data-field="qty"]').value = item.qty ? item.qty.toLocaleString('vi-VN') : '';
        
        // Restore currency and value
        if (item.currency) {
          row.querySelector('[data-field="currency"]').value = item.currency;
        }
        const valToSet = item.rawValue !== undefined ? item.rawValue : item.value;
        if (item.currency === 'VND' || !item.currency) {
          row.querySelector('[data-field="value"]').value = valToSet ? formatVND(valToSet) : '';
        } else {
          row.querySelector('[data-field="value"]').value = valToSet ? valToSet.toLocaleString('vi-VN') : '';
        }

        row.querySelector('[data-field="taxNK"]').value = ((item.taxNK || 0) * 100).toFixed(1).replace('.', ',');
        row.querySelector('[data-field="taxOther"]').value = ((item.taxOther || 0) * 100).toFixed(1).replace('.', ',');
        row.querySelector('[data-field="vat"]').value = ((item.vat || 0) * 100).toFixed(1).replace('.', ',');
        attachInputFormatters(row);
      });
      fclItemCount = items.length;
      calculateFCL();
    }
    showToast('Đã khôi phục dữ liệu tính toán!', 'success');
  };

  window._deleteHistory = async function(id, e) {
    if (e) e.stopPropagation();
    let history = getHistory();
    const itemToDelete = history.find(item => item.id === id);
    if (!itemToDelete) return;

    // Kiểm tra phân quyền xóa
    const loggedInUserStr = sessionStorage.getItem('eureka_logged_in_user');
    let loggedInUser = null;
    let isAdmin = false;
    if (loggedInUserStr) {
      try {
        loggedInUser = JSON.parse(loggedInUserStr);
        isAdmin = (loggedInUser.role === 'admin' || loggedInUser.username === 'admin');
      } catch (e) {}
    }

    if (!isAdmin) {
      const currentUsername = (loggedInUser && loggedInUser.username ? loggedInUser.username : getCurrentUsername() || '').toLowerCase();
      const creator = String(itemToDelete.createdBy || itemToDelete.creator || itemToDelete.Username || itemToDelete.user || '').toLowerCase();
      if (creator && creator !== currentUsername) {
        showToast('Bạn chỉ được phép xóa lịch sử do chính mình tạo!', 'error');
        return;
      }
    }

    history = history.filter(item => item.id !== id);
    localStorage.setItem('eureka_1so_history', JSON.stringify(history));
    
    // Refresh history panel
    renderHistoryDetailList();
    showToast('Đã xóa bản ghi lịch sử', 'success');

    // 1. Đồng bộ xóa lên Supabase Database riêng
    if (window.EurekaDB && window.EurekaDB.isConfigured()) {
      window.EurekaDB.deleteHistoryFromSupabase(id);
    }

    // 2. Đồng bộ xóa lên Google Sheet
    if (GOOGLE_SHEET_URL) {
      await callSheetAPI({ action: 'delete_calculation', id: id });
    }
  };

  window._lclAccumulations = [];
  window._fclAccumulations = [];

  function renderAccumulatedList(type) {
    const listEl = document.getElementById(type === 'LCL' ? 'lcl-acc-list' : 'fcl-acc-list');
    const containerEl = document.getElementById(type === 'LCL' ? 'lcl-acc-list-container' : 'fcl-acc-list-container');
    const items = type === 'LCL' ? window._lclAccumulations : window._fclAccumulations;

    if (!listEl || !containerEl) return;

    if (items.length === 0) {
      containerEl.style.display = 'none';
      listEl.innerHTML = '';
      return;
    }

    containerEl.style.display = 'block';
    
    const targetMap = type === 'LCL' ? {
      'lcl-cuoc-vc': 'Tổng cước VC TQ → VN',
      'lcl-phi-ut': 'Tổng phí ủy thác',
      'lcl-phi-rr': 'Tổng phí rủi ro',
      'lcl-phi-khac-tq': 'Tổng phí khác TQ + VN',
      'lcl-phi-khac-vn': 'Tổng phí khác VN'
    } : {
      'fcl-phi-nd-tq': 'Tổng phí nội địa TQ',
      'fcl-phi-nd-vn': 'Tổng phí nội địa VN',
      'fcl-phi-ut': 'Tổng phí ủy thác',
      'fcl-phi-qt': 'Tổng phí QT + phí VC quốc tế',
      'fcl-phi-vc-vn': 'Tổng phí VC VN'
    };

    listEl.innerHTML = items.map((item, idx) => {
      const targetName = targetMap[item.targetId] || item.targetId;
      const noteStr = item.note ? ` (${item.note})` : '';
      const currencyStr = item.accCurrency !== 'VND' 
        ? `${item.accAmount.toLocaleString('vi-VN', {maximumFractionDigits:2})} ${item.accCurrency} (${formatVND(item.amount)}₫)` 
        : `${formatVND(item.amount)}₫`;
      
      const hasBase = item.baseAmount && item.baseAmount !== item.accAmount;
      let baseStr = '';
      if (hasBase) {
        baseStr = item.accCurrency !== 'VND'
          ? ` [Vốn: ${item.baseAmount.toLocaleString('vi-VN', {maximumFractionDigits:2})} ${item.accCurrency} (${formatVND(item.baseAmountVND)}₫)]`
          : ` [Vốn: ${formatVND(item.baseAmountVND)}₫]`;
      } else if (item.baseAmountVND) {
        baseStr = ` [Vốn: ${formatVND(item.baseAmountVND)}₫]`;
      }

      return `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#ffffff; border:1px solid var(--border-light); border-radius:6px; padding:6px 12px; font-size:0.8rem; margin-bottom:4px;">
          <div style="color:var(--text-primary); text-align:left;">
            <strong>${targetName}</strong>: <span style="color:var(--accent); font-weight:700;">+${currencyStr}</span>
            <span style="color:#10b981; font-weight:600; font-size:0.75rem;">${baseStr}</span>
            <span style="color:var(--text-secondary); font-style:italic; font-size:0.75rem;">${noteStr}</span>
          </div>
          <button type="button" class="btn btn-danger btn-icon" style="padding:2px 6px; font-size:0.7rem; border-radius:4px; height:auto; width:auto; line-height:1;" onclick="deleteSubFee('${type}', ${idx})">X</button>
        </div>
      `;
    }).join('');
  }

  window.deleteSubFee = function(type, idx) {
    const items = type === 'LCL' ? window._lclAccumulations : window._fclAccumulations;
    if (idx < 0 || idx >= items.length) return;

    const item = items[idx];
    const targetInput = document.getElementById(item.targetId);
    const targetCurrencySelect = document.getElementById(item.targetId + '-currency');

    if (targetInput) {
      const currentVal = parseNum(targetInput.value);
      let amountToSubtract = item.amount;

      if (targetCurrencySelect && targetCurrencySelect.value !== 'VND') {
        const rateUSD = parseNum(document.getElementById('exchange-rate')?.value) || 25900;
        const rateRMB = parseNum(document.getElementById('exchange-rate-rmb')?.value) || 3600;
        if (targetCurrencySelect.value === 'USD') {
          amountToSubtract = item.amount / rateUSD;
        } else if (targetCurrencySelect.value === 'RMB') {
          amountToSubtract = item.amount / rateRMB;
        }
      }

      const newVal = Math.max(0, currentVal - amountToSubtract);
      if (targetCurrencySelect && targetCurrencySelect.value !== 'VND') {
        targetInput.value = newVal > 0 ? newVal.toLocaleString('vi-VN', { maximumFractionDigits: 2 }) : '0';
      } else {
        targetInput.value = newVal > 0 ? formatVND(newVal) : '0';
      }
    }

    items.splice(idx, 1);
    renderAccumulatedList(type);
    showToast('Đã xóa phí con thành công', 'success');

    if (type === 'LCL') {
      autoUpdateLCLFields();
    } else {
      autoUpdateFCLFields();
      updateAllConversionNotes();
    }
  };

  function initAccumulators() {
    // LCL Accumulator
    document.getElementById('lcl-acc-btn').addEventListener('click', () => {
      const amountInput = document.getElementById('lcl-acc-amount');
      const baseInput = document.getElementById('lcl-acc-base');
      const currencySelect = document.getElementById('lcl-acc-currency');
      const noteInput = document.getElementById('lcl-acc-note');
      const amountVal = parseNum(amountInput.value);
      if (amountVal <= 0) {
        showToast('Vui lòng nhập số tiền hợp lệ để cộng dồn', 'error');
        return;
      }
      const baseVal = baseInput ? parseNum(baseInput.value) : 0;
      const finalBaseVal = baseVal > 0 ? baseVal : amountVal;

      const accCurrency = currencySelect ? currencySelect.value : 'VND';
      const targetId = document.getElementById('lcl-acc-target').value;
      const targetInput = document.getElementById(targetId);
      const targetCurrencySelect = document.getElementById(targetId + '-currency');
      const noteVal = noteInput ? noteInput.value.trim() : '';

      if (targetInput) {
        const rateUSD = parseNum(document.getElementById('exchange-rate')?.value) || 25900;
        const rateRMB = parseNum(document.getElementById('exchange-rate-rmb')?.value) || 3600;

        let amountInVND = amountVal;
        let baseInVND = finalBaseVal;
        if (accCurrency === 'USD') {
          amountInVND = amountVal * rateUSD;
          baseInVND = finalBaseVal * rateUSD;
        } else if (accCurrency === 'RMB') {
          amountInVND = amountVal * rateRMB;
          baseInVND = finalBaseVal * rateRMB;
        }

        if (targetInput.disabled) {
          const overrideCheckId = targetId === 'lcl-cuoc-vc' ? 'lcl-override-cuoc-vc' :
                                  targetId === 'lcl-phi-ut' ? 'lcl-override-phi-ut' :
                                  targetId === 'lcl-phi-rr' ? 'lcl-override-phi-rr' : '';
          const checkEl = document.getElementById(overrideCheckId);
          if (checkEl) {
            checkEl.checked = true;
            targetInput.disabled = false;
            if (targetCurrencySelect) targetCurrencySelect.disabled = false;
          }
        }
        
        const currentVal = parseNum(targetInput.value);
        let amountToAdd = amountInVND;
        const targetCurrency = targetCurrencySelect ? targetCurrencySelect.value : 'VND';
        
        if (targetCurrency === 'USD') {
          amountToAdd = amountInVND / rateUSD;
        } else if (targetCurrency === 'RMB') {
          amountToAdd = amountInVND / rateRMB;
        }

        const newVal = currentVal + amountToAdd;
        if (targetCurrency !== 'VND') {
          targetInput.value = newVal.toLocaleString('vi-VN', { maximumFractionDigits: 2 });
        } else {
          targetInput.value = formatVND(newVal);
        }

        window._lclAccumulations.push({
          amount: amountInVND,
          targetId,
          note: noteVal,
          accAmount: amountVal,
          accCurrency,
          baseAmount: finalBaseVal,
          baseAmountVND: baseInVND
        });
        
        renderAccumulatedList('LCL');

        amountInput.value = '';
        if (baseInput) baseInput.value = '';
        if (noteInput) noteInput.value = '';
        showToast(`Đã cộng dồn ${amountVal.toLocaleString('vi-VN')} ${accCurrency} vào mục phí`, 'success');
        autoUpdateLCLFields();
      }
    });

    // FCL Accumulator
    document.getElementById('fcl-acc-btn').addEventListener('click', () => {
      const amountInput = document.getElementById('fcl-acc-amount');
      const baseInput = document.getElementById('fcl-acc-base');
      const currencySelect = document.getElementById('fcl-acc-currency');
      const noteInput = document.getElementById('fcl-acc-note');
      const amountVal = parseNum(amountInput.value);
      if (amountVal <= 0) {
        showToast('Vui lòng nhập số tiền hợp lệ để cộng dồn', 'error');
        return;
      }
      const baseVal = baseInput ? parseNum(baseInput.value) : 0;
      const finalBaseVal = baseVal > 0 ? baseVal : amountVal;

      const accCurrency = currencySelect ? currencySelect.value : 'VND';
      const targetId = document.getElementById('fcl-acc-target').value;
      const targetInput = document.getElementById(targetId);
      const targetCurrencySelect = document.getElementById(targetId + '-currency');
      const noteVal = noteInput ? noteInput.value.trim() : '';

      if (targetInput) {
        const rateUSD = parseNum(document.getElementById('exchange-rate')?.value) || 25900;
        const rateRMB = parseNum(document.getElementById('exchange-rate-rmb')?.value) || 3600;

        let amountInVND = amountVal;
        let baseInVND = finalBaseVal;
        if (accCurrency === 'USD') {
          amountInVND = amountVal * rateUSD;
          baseInVND = finalBaseVal * rateUSD;
        } else if (accCurrency === 'RMB') {
          amountInVND = amountVal * rateRMB;
          baseInVND = finalBaseVal * rateRMB;
        }

        const currentVal = parseNum(targetInput.value);
        let amountToAdd = amountInVND;
        const targetCurrency = targetCurrencySelect ? targetCurrencySelect.value : 'VND';

        if (targetCurrency === 'USD') {
          amountToAdd = amountInVND / rateUSD;
        } else if (targetCurrency === 'RMB') {
          amountToAdd = amountInVND / rateRMB;
        }

        const newVal = currentVal + amountToAdd;
        if (targetCurrency !== 'VND') {
          targetInput.value = newVal.toLocaleString('vi-VN', { maximumFractionDigits: 2 });
        } else {
          targetInput.value = formatVND(newVal);
        }

        window._fclAccumulations.push({
          amount: amountInVND,
          targetId,
          note: noteVal,
          accAmount: amountVal,
          accCurrency,
          baseAmount: finalBaseVal,
          baseAmountVND: baseInVND
        });
        
        renderAccumulatedList('FCL');

        amountInput.value = '';
        if (baseInput) baseInput.value = '';
        if (noteInput) noteInput.value = '';
        showToast(`Đã cộng dồn ${amountVal.toLocaleString('vi-VN')} ${accCurrency} vào mục phí`, 'success');
        autoUpdateFCLFields();
        updateAllConversionNotes();
      }
    });
  }

  // ── Toast Notification ──
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    let prefix = 'Thành công: ';
    if (type === 'error') prefix = 'Lỗi: ';
    else if (type === 'warning') prefix = 'Cảnh báo: ';
    else if (type === 'info') prefix = 'Thông báo: ';

    toast.textContent = prefix + message;
    toast.className = 'toast show ' + type;

    if (window._toastTimeout) clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
      toast.className = 'toast';
    }, 4000);
  }

  // ── Offline Voice Input (Trợ Lý Giọng Nói Tiếng Việt) ──
  function parseVietnameseVoiceCommand(transcript, activeTab = 'LCL') {
    if (!transcript || typeof transcript !== 'string') return;
    const text = transcript.toLowerCase();
    const results = [];

    // 1. Tab switching command
    if (/(?:hàng\s*gom|\blcl\b)/i.test(text)) {
      const tabBtn = document.getElementById('tab-btn-lcl');
      if (tabBtn) {
        tabBtn.click();
        results.push('Tab LCL');
      }
    } else if (/(?:nguyên\s*cont|\bfcl\b)/i.test(text)) {
      const tabBtn = document.getElementById('tab-btn-fcl');
      if (tabBtn) {
        tabBtn.click();
        results.push('Tab FCL');
      }
    }

    // 2. Parse Volume (Khối / CBM / m3 / m³ / mét khối)
    const cbmMatch = text.match(/(\d+(?:[\.,]\d+)?)\s*(?:khối|cbm|m3|m³|mét\s*khối)/i) ||
                     text.match(/(?:khối|cbm|m3|m³|mét\s*khối)\s*(\d+(?:[\.,]\d+)?)/i);
    if (cbmMatch) {
      const rawVal = cbmMatch[1].replace(',', '.');
      const val = parseFloat(rawVal);
      if (!isNaN(val) && val >= 0) {
        const el = document.getElementById('lcl-so-khoi');
        if (el) {
          el.value = val;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          results.push(`Thể tích: ${val} m³`);
        }
      }
    }

    // 3. Parse Weight (KG / Cân / Kí / Kílô / Tấn)
    const tonMatch = text.match(/(\d+(?:[\.,]\d+)?)\s*(?:tấn|tan)/i) ||
                      text.match(/(?:tấn|tan)\s*(\d+(?:[\.,]\d+)?)/i);
    if (tonMatch) {
      const rawVal = tonMatch[1].replace(',', '.');
      const val = parseFloat(rawVal) * 1000;
      if (!isNaN(val) && val >= 0) {
        const el = document.getElementById('lcl-so-kg');
        if (el) {
          const formatted = typeof formatVND === 'function' ? formatVND(val) : val;
          el.value = formatted;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
          results.push(`Trọng lượng: ${formatted} kg`);
        }
      }
    } else {
      const kgMatch = text.match(/(\d+(?:[\.,]\d+)?)\s*(?:kg|kí|ki|cân|can|kílô|kilo)/i) ||
                      text.match(/(?:kg|kí|ki|cân|can|kílô|kilo)\s*(\d+(?:[\.,]\d+)?)/i);
      if (kgMatch) {
        const rawVal = kgMatch[1].replace(',', '.');
        const val = parseFloat(rawVal);
        if (!isNaN(val) && val >= 0) {
          const el = document.getElementById('lcl-so-kg');
          if (el) {
            const formatted = typeof formatVND === 'function' ? formatVND(val) : val;
            el.value = formatted;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            results.push(`Trọng lượng: ${formatted} kg`);
          }
        }
      }
    }

    // 4. Parse Origin (Kho TQ)
    if (/(quảng\s*châu|quang\s*chau|\bqc\b)/i.test(text)) {
      const el = document.getElementById('lcl-kho-tq');
      if (el) {
        el.value = 'Quảng Châu';
        el.dispatchEvent(new Event('change', { bubbles: true }));
        results.push('Kho TQ: Quảng Châu');
      }
    } else if (/(bằng\s*tường|bang\s*tuong|\bbt\b)/i.test(text)) {
      const el = document.getElementById('lcl-kho-tq');
      if (el) {
        el.value = 'Bằng Tường';
        el.dispatchEvent(new Event('change', { bubbles: true }));
        results.push('Kho TQ: Bằng Tường');
      }
    }

    // 5. Parse Destination (Kho VN)
    if (/(hà\s*nội|ha\s*noi|\bhn\b)/i.test(text)) {
      const el = document.getElementById('lcl-kho-vn');
      if (el) {
        el.value = 'Hà Nội';
        el.dispatchEvent(new Event('change', { bubbles: true }));
        results.push('Kho VN: Hà Nội');
      }
    } else if (/(hồ\s*chí\s*minh|ho\s*chi\s*minh|\btphcm\b|\bhcm\b|sài\s*gòn|sai\s*gon)/i.test(text)) {
      const el = document.getElementById('lcl-kho-vn');
      if (el) {
        el.value = 'HCM';
        el.dispatchEvent(new Event('change', { bubbles: true }));
        results.push('Kho VN: HCM');
      }
    }

    // 6. Parse Shipping Mode (Đường VC)
    if (/(biển|đi\s*biển|sea|đường\s*biển)/i.test(text)) {
      const el = document.getElementById('lcl-duong-vc');
      if (el) {
        el.value = 'Biển';
        el.dispatchEvent(new Event('change', { bubbles: true }));
        results.push('Đường VC: Biển');
      }
    } else if (/(bộ|đi\s*bộ|road|đường\s*bộ)/i.test(text)) {
      const el = document.getElementById('lcl-duong-vc');
      if (el) {
        el.value = 'Bộ';
        el.dispatchEvent(new Event('change', { bubbles: true }));
        results.push('Đường VC: Bộ');
      }
    }

    // Trigger recalculation hook
    if (typeof autoUpdateLCLFields === 'function') {
      autoUpdateLCLFields();
    }

    // Toast Notification
    if (results.length > 0) {
      showToast(`Đã tự động điền: ${results.join(' • ')}`, 'success');
    } else {
      showToast(`Không nhận diện được tham số từ: "${transcript}"`, 'warning');
    }
  }
  window.parseVietnameseVoiceCommand = parseVietnameseVoiceCommand;

  function initVoiceAssistant() {
    const btnLCL = document.getElementById('btn-voice-lcl');
    const btnFCL = document.getElementById('btn-voice-fcl');

    if (!btnLCL && !btnFCL) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const handleUnsupported = (btn) => {
        if (!btn) return;
        btn.addEventListener('click', () => {
          showToast('Trình duyệt không hỗ trợ Web Speech API (Vui lòng dùng Chrome, Edge, Safari mới nhất).', 'error');
        });
      };
      handleUnsupported(btnLCL);
      handleUnsupported(btnFCL);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let activeBtn = null;

    function startListening(btn, tabName) {
      if (activeBtn) {
        stopListening();
      }
      activeBtn = btn;
      btn.classList.add('listening');
      const label = btn.querySelector('.voice-label');
      if (label) label.textContent = 'Đang nghe...';

      showToast('Đang lắng nghe câu lệnh giọng nói...', 'info');

      try {
        recognition.start();
      } catch (err) {
        console.warn('Speech recognition start error:', err);
        stopListening();
      }
    }

    function stopListening() {
      if (activeBtn) {
        activeBtn.classList.remove('listening');
        const label = activeBtn.querySelector('.voice-label');
        if (label) label.textContent = 'Giọng nói';
        activeBtn = null;
      }
      try {
        recognition.stop();
      } catch (e) {}
    }

    recognition.onresult = function(event) {
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        const currentActiveTab = document.querySelector('.tab-btn.active')?.getAttribute('data-tab') === 'tab-fcl' ? 'FCL' : 'LCL';
        parseVietnameseVoiceCommand(transcript, currentActiveTab);
      }
      stopListening();
    };

    recognition.onerror = function(event) {
      stopListening();
      let msg = 'Lỗi nhận diện giọng nói: ' + (event.error || 'không xác định');
      if (event.error === 'no-speech') {
        msg = 'Không nghe thấy giọng nói, vui lòng thử lại.';
      } else if (event.error === 'not-allowed') {
        msg = 'Chưa cấp quyền sử dụng Micro cho trình duyệt.';
      }
      showToast(msg, 'warning');
    };

    recognition.onend = function() {
      stopListening();
    };

    if (btnLCL) {
      btnLCL.addEventListener('click', (e) => {
        e.stopPropagation();
        if (btnLCL.classList.contains('listening')) {
          stopListening();
        } else {
          startListening(btnLCL, 'LCL');
        }
      });
    }

    if (btnFCL) {
      btnFCL.addEventListener('click', (e) => {
        e.stopPropagation();
        if (btnFCL.classList.contains('listening')) {
          stopListening();
        } else {
          startListening(btnFCL, 'FCL');
        }
      });
    }
  }

  // ── Authentication & Admin Management ──
  const DEFAULT_ACCOUNTS = [
    { 
      username: 'admin', 
      password: '$sha256$00c88ff9fda448818fee2d9d338fef509afe5a2d92b01583c3521342b70085b0', 
      role: 'admin', 
      displayName: 'Quản trị viên' 
    }
  ];

  function getUsers() {
    try {
      const users = localStorage.getItem('eureka_users');
      if (!users) {
        localStorage.setItem('eureka_users', JSON.stringify(DEFAULT_ACCOUNTS));
        return DEFAULT_ACCOUNTS;
      }
      const parsed = JSON.parse(users);
      if (!Array.isArray(parsed)) return DEFAULT_ACCOUNTS;
      
      // Filter out non-object or null elements to avoid TypeError during mapping
      const validUsers = parsed.filter(u => u && typeof u === 'object');

      // Chuẩn hóa thuộc tính phòng khi người dùng viết hoa/thường hoặc tiếng Việt trong Google Sheets
      const normalized = validUsers.map(u => {
        const username = u.username || u.Username || u['username '] || u['Tên đăng nhập'] || u['tên đăng nhập'] || '';
        const password = u.password || u.Password || u['password '] || u['Mật khẩu'] || u['mật khẩu'] || '';
        const role = u.role || u.Role || u['role '] || u['Quyền'] || u['quyền'] || 'sale';
        const displayName = u.displayName || u.DisplayName || u['Tên hiển thị'] || u['tên hiển thị'] || username || '';
        return {
          username: String(username).trim().toLowerCase(),
          password: String(password).trim(),
          role: String(role).trim().toLowerCase(),
          displayName: String(displayName).trim()
        };
      }).filter(u => u.username && u.password);
      
      // Đảm bảo luôn có tài khoản admin mặc định dự phòng
      if (!normalized.some(u => u.username === 'admin')) {
        normalized.unshift(DEFAULT_ACCOUNTS[0]);
      }
      return normalized;
    } catch (e) {
      return DEFAULT_ACCOUNTS;
    }
  }

  function saveUsers(users) {
    localStorage.setItem('eureka_users', JSON.stringify(users));
  }

  function getIpLogs() {
    try {
      const logs = localStorage.getItem('eureka_ip_logs');
      const parsed = logs ? JSON.parse(logs) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(l => l && typeof l === 'object');
    } catch (e) {
      return [];
    }
  }

  function renderUserList() {
    const users = getUsers();
    const tbody = document.getElementById('user-list-body');
    if (!tbody) return;

    // Xác định tài khoản hiện tại đang đăng nhập có phải là admin tối cao (admin) hay không
    const loggedInUserStr = sessionStorage.getItem('eureka_logged_in_user');
    let isSuperAdmin = false;
    if (loggedInUserStr) {
      try {
        const loggedInUser = JSON.parse(loggedInUserStr);
        if (loggedInUser.username === 'admin') {
          isSuperAdmin = true;
        }
      } catch (e) {}
    }

    tbody.innerHTML = users.map(user => {
      const isMainAdmin = user.username === 'admin';
      const editBtn = `<button type="button" class="btn btn-secondary" onclick="window._editUser('${user.username}')" style="padding: 4px 8px; font-size:0.75rem; margin-right:6px;">Sửa</button>`;
      const deleteBtn = isMainAdmin 
        ? '<span style="color:var(--text-muted); font-size:0.8rem; font-style:italic;">Mặc định</span>'
        : `<button type="button" class="btn btn-danger" onclick="window._deleteUser('${user.username}')" style="padding: 4px 8px; font-size:0.75rem;">Xóa</button>`;
      
      const roleBadge = user.role === 'admin' 
        ? '<span class="history-badge lcl" style="padding:2px 6px; font-size:0.65rem;">Admin</span>' 
        : '<span class="history-badge fcl" style="padding:2px 6px; font-size:0.65rem;">Sales</span>';

      // Chỉ hiển thị mật khẩu thực tế nếu người đang xem là super admin (admin)
      // Các tài khoản admin khác chỉ hiện ••••••••
      const passwordDisplay = isSuperAdmin ? `<code>${user.password}</code>` : '••••••••';

      return `
        <tr>
          <td><strong>${user.username}</strong></td>
          <td>${user.displayName || user.username}</td>
          <td>${roleBadge}</td>
          <td>${passwordDisplay}</td>
          <td>${editBtn}${isMainAdmin ? '' : deleteBtn}</td>
        </tr>`;
    }).join('');
  }

  function renderIpLogs() {
    const logs = getIpLogs();
    const tbody = document.getElementById('ip-log-body');
    const countEl = document.getElementById('ip-log-count');
    if (countEl) countEl.textContent = `${logs.length} lượt truy cập được ghi nhận`;
    if (!tbody) return;
    if (logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-muted); font-style:italic;">Chưa có nhật ký truy cập</td></tr>';
      return;
    }
    tbody.innerHTML = logs.map(log => {
      let date = 'Không rõ';
      if (log.timestamp) {
        const d = new Date(log.timestamp);
        if (!isNaN(d.getTime())) {
          date = d.toLocaleString('vi-VN', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit'
          });
        }
      }
      const statusColor = log.status === 'Thành công' ? 'color:var(--success);' : 'color:var(--danger);';
      return `
        <tr>
          <td>${date}</td>
          <td><strong>${log.username}</strong> <span style="${statusColor} font-size:0.7rem; font-weight:700;">(${log.status})</span></td>
          <td><code style="font-size:0.75rem;">${log.ip}</code></td>
          <td title="${log.details}" style="max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${log.details}</td>
        </tr>`;
    }).join('');
  }

  async function recordLoginIp(username, success) {
    let ip = 'Unknown';
    let details = 'Unknown';

    // Chuỗi các API lấy IP và thông tin địa lý dự phòng để tránh bị chặn AdBlock/Rate-limit
    const endpoints = [
      { 
        url: 'https://api.ipify.org?format=json', 
        parse: (d) => d.ip,
        getDetails: () => `IP thuần / Trình duyệt: ${navigator.platform}`
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
        const res = await fetch(ep.url);
        if (res.ok) {
          const data = await res.json();
          const detectedIp = ep.parse(data);
          if (detectedIp && detectedIp !== 'Unknown') {
            ip = detectedIp;
            details = ep.getDetails(data);
            break;
          }
        }
      } catch (e) {
        // Lỗi thì chuyển sang API tiếp theo
      }
    }

    if (details === 'Unknown') {
      details = `Không xác định / ${navigator.platform}`;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      username: username,
      ip: ip,
      details: details,
      status: success ? 'Thành công' : 'Thất bại'
    };

    let logs = getIpLogs();
    logs.unshift(logEntry);
    localStorage.setItem('eureka_ip_logs', JSON.stringify(logs));
    renderIpLogs();

    // 1. Đồng bộ lên Supabase Database riêng
    if (window.EurekaDB && window.EurekaDB.isConfigured()) {
      window.EurekaDB.syncIpLogToSupabase(logEntry);
    }

    // 2. Tiếp tục đồng bộ lên Google Sheet để theo dõi
    if (GOOGLE_SHEET_URL) {
      await callSheetAPI({
        action: 'record_ip',
        timestamp: logEntry.timestamp,
        username: logEntry.username,
        ip: logEntry.ip,
        details: logEntry.details,
        status: logEntry.status
      });
    }
  }

  function initAuth() {
    const loginOverlay = document.getElementById('login-overlay');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error-msg');
    const profileSection = document.getElementById('user-profile-section');
    const currentUsername = document.getElementById('current-username');
    const logoutBtn = document.getElementById('logout-btn');
    const adminBtn = document.getElementById('header-admin-btn');

    window._deleteUser = async function(username) {
      if (username === 'admin') return;
      let users = getUsers();
      users = users.filter(u => u.username !== username);
      saveUsers(users);
      renderUserList();
      showToast(`Đã xóa tài khoản ${username}`, 'success');

      // 1. Đồng bộ xóa lên Supabase (nếu có cấu hình)
      if (window.EurekaDB && window.EurekaDB.isConfigured()) {
        await window.EurekaDB.deleteUserFromSupabase(username);
      }

      // 2. Tiếp tục đồng bộ xóa lên Google Sheet để theo dõi
      if (GOOGLE_SHEET_URL) {
        await callSheetAPI({ action: 'delete_user', username: username });
      }
    };

    const createUserForm = document.getElementById('create-user-form');
    if (createUserForm) {
      createUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById('new-username');
        const displayNameInput = document.getElementById('new-displayname');
        const passwordInput = document.getElementById('new-password');
        const roleSelect = document.getElementById('new-role');

        const username = usernameInput.value.trim().toLowerCase();
        const displayName = displayNameInput.value.trim();
        const rawPassword = passwordInput.value;
        const role = roleSelect.value;

        if (!username || !rawPassword || !displayName) {
          showToast('Vui lòng điền đầy đủ thông tin', 'error');
          return;
        }

        let users = getUsers();
        if (users.some(u => u.username === username)) {
          showToast('Tài khoản đã tồn tại!', 'error');
          return;
        }

        // Băm mật khẩu an toàn SHA-256
        const hashedPassword = window.EurekaSecurity 
          ? await window.EurekaSecurity.hashPassword(rawPassword) 
          : rawPassword;

        const newUserObj = { username, displayName, password: hashedPassword, role };
        users.push(newUserObj);
        saveUsers(users);
        
        usernameInput.value = '';
        displayNameInput.value = '';
        passwordInput.value = '';
        renderUserList();
        showToast(`Tạo thành công tài khoản ${username}!`, 'success');

        // 1. Đồng bộ tài khoản lên Supabase Auth & Database
        if (window.EurekaDB && window.EurekaDB.isConfigured()) {
          const client = window.EurekaDB.getClient();
          if (client) {
            const virtualEmail = username.includes('@') ? username : `${username}@eureka.local`;
            // Tạo Auth user qua RPC an toàn
            const { error: rpcError } = await client.rpc('admin_create_user', {
              email: virtualEmail,
              password: rawPassword,
              user_metadata: { displayName, role }
            });
            if (rpcError) {
              console.error("Lỗi tạo user trên Supabase Auth:", rpcError);
              showToast("Lỗi tạo user Auth: " + rpcError.message, 'error');
            }
          }
          // Vẫn ghi vào bảng users (public)
          await window.EurekaDB.syncUserToSupabase(newUserObj);
        }

        // 2. Đồng bộ lên Google Sheet để chủ doanh nghiệp tiện theo dõi
        if (GOOGLE_SHEET_URL) {
          await callSheetAPI({
            action: 'create_user',
            username: username,
            displayName: displayName,
            password: hashedPassword, // Lưu mật khẩu đã hash lên sheet
            role: role
          });
        }
      });
    }

    const clearLogsBtn = document.getElementById('clear-ip-logs-btn');
    if (clearLogsBtn) {
      clearLogsBtn.addEventListener('click', async () => {
        localStorage.removeItem('eureka_ip_logs');
        renderIpLogs();
        showToast('Đã xóa toàn bộ nhật ký truy cập', 'success');

        if (GOOGLE_SHEET_URL) {
          await callSheetAPI({ action: 'clear_ip_logs' });
        }
      });
    }

    const loggedInUser = sessionStorage.getItem('eureka_logged_in_user');
    if (loggedInUser) {
      try {
        const userObj = JSON.parse(loggedInUser);
        setupSession(userObj);
        // ── [BẢO MẬT] Tải dữ liệu khi khôi phục phiên đăng nhập ──
        _loadDataAfterLogin();
      } catch (e) {
        showLoginOverlay();
      }
    } else {
      showLoginOverlay();
    }

    function showLoginOverlay() {
      loginOverlay.style.display = 'flex';
      profileSection.style.display = 'none';
      adminBtn.style.display = 'none';
    }

    function setupSession(user) {
      loginOverlay.style.display = 'none';
      profileSection.style.display = 'flex';
      currentUsername.textContent = user.displayName || user.username;
      
      const isAdmin = (user.role === 'admin' || user.username === 'admin');
      if (isAdmin) {
        adminBtn.style.display = 'inline-flex';
        try {
          renderUserList();
          renderIpLogs();
          renderAdminTariffs();
        } catch (e) {
          console.error("Error rendering admin panel:", e);
        }
      } else {
        adminBtn.style.display = 'none';
        if (adminBtn.classList.contains('active')) {
          document.getElementById('tab-btn-lcl').click();
        }
      }

      try {
        renderBuyerDropdown();
        renderAdminBuyersList();
        renderHistoryDetailList();
      } catch (e) {
        console.error("Error rendering user data in setupSession:", e);
      }
    }

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Kiểm tra Rate Limiting (chặn brute-force tấn công mật khẩu)
      if (window.EurekaSecurity) {
        const rateLimit = window.EurekaSecurity.checkRateLimit();
        if (rateLimit.locked) {
          const waitStr = window.EurekaSecurity.formatLockoutTime(rateLimit.remainingMs);
          loginError.textContent = `Hệ thống tạm khóa do nhập sai nhiều lần. Vui lòng thử lại sau ${waitStr}.`;
          loginError.style.display = 'block';
          return;
        }
      }

      const username = document.getElementById('login-username').value.trim().toLowerCase();
      const password = document.getElementById('login-password').value;

      // ── [BẢO MẬT & ĐỒNG BỘ] Xác thực tài khoản với Google Sheets / Local Storage ──
      loginError.textContent = 'Đang xác thực bảo mật...';
      loginError.style.display = 'block';

      let isPasswordValid = false;
      let user = null;
      let users = getUsers();

      user = users.find(u => u.username === username);

      // Nếu tài khoản chưa có trong localStorage (máy mới / trình duyệt mới), tải nhanh từ Google Sheets
      if (!user && GOOGLE_SHEET_URL) {
        try {
          const res = await fetch(`${GOOGLE_SHEET_URL}?action=get_data&token=${encodeURIComponent(getSheetToken())}`);
          const json = await res.json();
          if (json && json.success && json.data && json.data.accounts) {
            let fetchedAccounts = json.data.accounts;
            if (window.EurekaSecurity) {
              const secRes = await window.EurekaSecurity.migratePasswordsToHash(fetchedAccounts);
              fetchedAccounts = secRes.users;
            }
            localStorage.setItem('eureka_users', JSON.stringify(fetchedAccounts));
            users = getUsers();
            user = users.find(u => u.username === username);
          }
        } catch (fetchErr) {
          console.warn('Lỗi kết nối kiểm tra tài khoản từ Google Sheets:', fetchErr);
        }
      }

      if (user) {
        if (window.EurekaSecurity) {
          isPasswordValid = await window.EurekaSecurity.verifyPassword(password, user.password);
        } else {
          isPasswordValid = (String(password).trim() === String(user.password).trim());
        }
      }

      // Hỗ trợ bổ sung: Nếu cấu hình Supabase Auth và đăng nhập bằng Supabase
      if (!isPasswordValid && window.EurekaDB && window.EurekaDB.isConfigured()) {
        try {
          const client = window.EurekaDB.getClient();
          if (client) {
            const virtualEmail = username.includes('@') ? username : `${username}@eureka.local`;
            const { data, error } = await client.auth.signInWithPassword({
              email: virtualEmail,
              password: password
            });
            if (!error && data && data.user) {
              isPasswordValid = true;
              if (!user) {
                user = {
                  username: username,
                  displayName: data.user.user_metadata?.displayName || username,
                  role: data.user.user_metadata?.role || (username === 'admin' ? 'admin' : 'sale')
                };
              }
            }
          }
        } catch (supaErr) {
          console.warn('Supabase auth check error:', supaErr);
        }
      }

      if (isPasswordValid) {
        loginError.style.display = 'none';

        // Reset bộ đếm số lần nhập sai
        if (window.EurekaSecurity) {
          window.EurekaSecurity.resetRateLimit();
        }

        sessionStorage.setItem('eureka_logged_in_user', JSON.stringify(user));
        setupSession(user);
        showToast(`Chào mừng trở lại, ${user.displayName || user.username}!`, 'success');
        recordLoginIp(user.username, true);

        // ── [BẢO MẬT] Tải dữ liệu từ Google Sheets SAU KHI đăng nhập thành công ──
        showToast('Đang đồng bộ dữ liệu từ máy chủ...', 'info');
        _loadDataAfterLogin().then(() => {
          showToast('Đã đồng bộ dữ liệu thành công!', 'success');
        }).catch(() => {
          showToast('Không thể đồng bộ dữ liệu, dùng dữ liệu ngoại tuyến', 'error');
        });
      } else {
        let attemptsMsg = '';
        if (window.EurekaSecurity) {
          const failState = window.EurekaSecurity.recordFailedAttempt();
          if (failState.locked) {
            attemptsMsg = ' (Bạn đã nhập sai 5 lần, tài khoản bị tạm khóa 15 phút)';
            loginForm.querySelector('button[type="submit"]').disabled = true;
            setTimeout(() => {
              loginForm.querySelector('button[type="submit"]').disabled = false;
            }, failState.remainingMs);
          } else {
            const left = window.EurekaSecurity.MAX_ATTEMPTS - failState.attempts;
            attemptsMsg = ` (Còn ${left} lần thử)`;
          }
        }
        loginError.textContent = 'Tên đăng nhập hoặc mật khẩu không chính xác' + attemptsMsg;
        loginError.style.display = 'block';
        recordLoginIp(username, false);
      }
    });

    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('eureka_logged_in_user');
      showToast('Đã đăng xuất', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    });

    // --- Edit User Modal Handlers ---
    const editUserModal = document.getElementById('edit-user-modal');
    const editUserForm = document.getElementById('edit-user-form');
    const editUserCancelBtn = document.getElementById('edit-user-cancel-btn');

    if (editUserCancelBtn) {
      editUserCancelBtn.addEventListener('click', () => {
        editUserModal.style.display = 'none';
      });
    }

    if (editUserForm) {
      editUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const oldUsername = document.getElementById('edit-old-username').value;
        const newUsername = document.getElementById('edit-username').value.trim().toLowerCase();
        const newDisplayName = document.getElementById('edit-displayname').value.trim();
        let newPassword = document.getElementById('edit-password').value;
        const newRole = document.getElementById('edit-role').value;

        if (!newUsername || !newPassword || !newDisplayName) return;

        let users = getUsers();
        
        // Trùng lặp tài khoản khác
        if (newUsername !== oldUsername && users.some(u => u.username === newUsername)) {
          showToast('Tên tài khoản này đã tồn tại!', 'error');
          return;
        }

        // Lấy mật khẩu cũ nếu mật khẩu mới là dấu ẩn
        if (newPassword === '••••••••') {
          const existingUser = users.find(u => u.username === oldUsername);
          if (existingUser) {
            newPassword = existingUser.password;
          }
        } else if (window.EurekaSecurity && !window.EurekaSecurity.isHashed(newPassword)) {
          // Băm mật khẩu mới nếu người dùng nhập mật khẩu mới
          newPassword = await window.EurekaSecurity.hashPassword(newPassword);
        }

        // Cập nhật mảng local
        users = users.filter(u => u.username !== oldUsername);
        const updatedUser = { username: newUsername, displayName: newDisplayName, password: newPassword, role: newRole };
        users.push(updatedUser);
        saveUsers(users);

        // 1. Đồng bộ lên Supabase Auth & Database riêng
        if (window.EurekaDB && window.EurekaDB.isConfigured()) {
          const client = window.EurekaDB.getClient();
          if (client && newPassword) {
            const virtualEmail = newUsername.includes('@') ? newUsername : `${newUsername}@eureka.local`;
            // Cập nhật mật khẩu trên Supabase Auth
            const { error: rpcError } = await client.rpc('admin_update_user_password', {
              user_email: virtualEmail,
              new_password: newPassword
            });
            if (rpcError) console.error("Lỗi cập nhật mật khẩu Auth:", rpcError);
          }

          if (oldUsername !== newUsername) {
            await window.EurekaDB.deleteUserFromSupabase(oldUsername);
          }
          await window.EurekaDB.syncUserToSupabase(updatedUser);
        }

        // 2. Tiếp tục lưu lên Google Sheets để theo dõi tiện lợi
        if (GOOGLE_SHEET_URL) {
          showToast('Đang cập nhật tài khoản lên máy chủ...', 'info');
          await callSheetAPI({ action: 'delete_user', username: oldUsername });
          await callSheetAPI({
            action: 'create_user',
            username: newUsername,
            displayName: newDisplayName,
            password: newPassword,
            role: newRole
          });
        }

        editUserModal.style.display = 'none';
        renderUserList();
        showToast(`Đã sửa tài khoản ${newUsername} thành công`, 'success');
      });
    }

    window._editUser = function(username) {
      const users = getUsers();
      const user = users.find(u => u.username === username);
      if (!user) return;

      // Check if current user is super admin
      const loggedInUserStr = sessionStorage.getItem('eureka_logged_in_user');
      let isSuperAdmin = false;
      if (loggedInUserStr) {
        try {
          const loggedInUser = JSON.parse(loggedInUserStr);
          if (loggedInUser.username === 'admin') {
            isSuperAdmin = true;
          }
        } catch (e) {}
      }

      document.getElementById('edit-old-username').value = user.username;
      document.getElementById('edit-username').value = user.username;
      document.getElementById('edit-displayname').value = user.displayName || user.username;
      document.getElementById('edit-password').value = isSuperAdmin ? user.password : '••••••••';
      document.getElementById('edit-role').value = user.role;

      // Tài khoản mặc định 'admin' không được đổi tên hoặc quyền
      if (user.username === 'admin') {
        document.getElementById('edit-username').disabled = true;
        document.getElementById('edit-role').disabled = true;
      } else {
        document.getElementById('edit-username').disabled = false;
        document.getElementById('edit-role').disabled = false;
      }

      editUserModal.style.display = 'flex';
    };

    // --- Edit Support Tool Modal Handlers ---
    const editToolModal = document.getElementById('edit-tool-modal');
    const editToolForm = document.getElementById('edit-tool-form');
    const editToolCancelBtn = document.getElementById('edit-tool-cancel-btn');

    if (editToolCancelBtn) {
      editToolCancelBtn.addEventListener('click', () => {
        editToolModal.style.display = 'none';
      });
    }

    if (editToolForm) {
      editToolForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const index = parseInt(document.getElementById('edit-tool-index').value);
        const name = document.getElementById('edit-tool-name').value.trim();
        const url = document.getElementById('edit-tool-url').value.trim();
        const desc = document.getElementById('edit-tool-desc').value.trim();

        if (!name || !url) return;

        const tools = getSupportTools();
        if (index >= 0 && index < tools.length) {
          tools[index] = { name, url, desc };
          await saveSupportTools(tools);
          
          editToolModal.style.display = 'none';
          renderAdminTools();
          renderSupportTools();
          showToast(`Đã cập nhật công cụ "${name}" thành công`, 'success');
        }
      });
    }

    window._editSupportTool = function(index) {
      const tools = getSupportTools();
      if (index < 0 || index >= tools.length) return;
      const tool = tools[index];

      document.getElementById('edit-tool-index').value = index;
      document.getElementById('edit-tool-name').value = tool.name;
      document.getElementById('edit-tool-url').value = tool.url;
      document.getElementById('edit-tool-desc').value = tool.desc || '';

      editToolModal.style.display = 'flex';
    };
  }

  // ── Render editable tariff tables in Admin Panel ──
  function renderAdminTariffs() {
    const tariffs = getTariffs();

    document.getElementById('cfg-phi-ut-base').value = formatVND(tariffs.phiUTBase);
    document.getElementById('cfg-risk-threshold').value = formatVND(tariffs.riskThreshold);
    document.getElementById('cfg-risk-rate').value = tariffs.riskRate * 100;
    document.getElementById('cfg-phi-vc-tq-qc').value = formatVND(tariffs.cuerQTQC);
    document.getElementById('cfg-phi-vc-tq-bt').value = formatVND(tariffs.cuerQTBT);

    // 1. Render VIP Table
    const vipBody = document.getElementById('table-vip-rates').querySelector('tbody');
    const vipKeys = [
      { key: 'QC-HN', label: 'Quảng Châu - Hà Nội' },
      { key: 'QC-HCM', label: 'Quảng Châu - HCM' },
      { key: 'BT-HN', label: 'Bằng Tường - Hà Nội' },
      { key: 'BT-HCM', label: 'Bằng Tường - HCM' }
    ];
    let vipHTML = '';
    vipKeys.forEach(item => {
      const m3Rates = tariffs.vipRates[`${item.key}-M3`].map(r => Math.round(r));
      const kgRates = tariffs.vipRates[`${item.key}-KG`].map(r => Math.round(r));

      vipHTML += `
        <tr>
          <td><strong>${item.label} (m³)</strong></td>
          <td><input type="text" class="config-input" data-vip-key="${item.key}-M3" data-idx="0" value="${formatVND(m3Rates[0])}"></td>
          <td><input type="text" class="config-input" data-vip-key="${item.key}-M3" data-idx="1" value="${formatVND(m3Rates[1])}"></td>
          <td><input type="text" class="config-input" data-vip-key="${item.key}-M3" data-idx="2" value="${formatVND(m3Rates[2])}"></td>
          <td><input type="text" class="config-input" data-vip-key="${item.key}-M3" data-idx="3" value="${formatVND(m3Rates[3])}"></td>
        </tr>
        <tr>
          <td><strong>${item.label} (kg)</strong></td>
          <td><input type="text" class="config-input" data-vip-key="${item.key}-KG" data-idx="0" value="${formatVND(kgRates[0])}"></td>
          <td><input type="text" class="config-input" data-vip-key="${item.key}-KG" data-idx="1" value="${formatVND(kgRates[1])}"></td>
          <td><input type="text" class="config-input" data-vip-key="${item.key}-KG" data-idx="2" value="${formatVND(kgRates[2])}"></td>
          <td><input type="text" class="config-input" data-vip-key="${item.key}-KG" data-idx="3" value="${formatVND(kgRates[3])}"></td>
        </tr>
      `;
    });
    vipBody.innerHTML = vipHTML;

    // 2. Render Flexible M3 Table
    const flexM3Body = document.getElementById('table-flexible-m3-rates').querySelector('tbody');
    const flexKeys = [
      { key: 'QC-HN', label: 'QC - HN (m³)' },
      { key: 'QC-HCM', label: 'QC - HCM (m³)' },
      { key: 'BT-HN', label: 'BT - HN (m³)' },
      { key: 'BT-HCM', label: 'BT - HCM (m³)' }
    ];
    let flexM3HTML = '';
    flexKeys.forEach(item => {
      const rates = tariffs.flexibleM3[item.key].map(r => Math.round(r));
      flexM3HTML += `
        <tr>
          <td><strong>${item.label}</strong></td>
          <td><input type="text" class="config-input" data-flex-m3-key="${item.key}" data-idx="0" value="${formatVND(rates[0])}"></td>
          <td><input type="text" class="config-input" data-flex-m3-key="${item.key}" data-idx="1" value="${formatVND(rates[1])}"></td>
          <td><input type="text" class="config-input" data-flex-m3-key="${item.key}" data-idx="2" value="${formatVND(rates[2])}"></td>
          <td><input type="text" class="config-input" data-flex-m3-key="${item.key}" data-idx="3" value="${formatVND(rates[3])}"></td>
          <td><input type="text" class="config-input" data-flex-m3-key="${item.key}" data-idx="4" value="${formatVND(rates[4])}"></td>
          <td><input type="text" class="config-input" data-flex-m3-key="${item.key}" data-idx="5" value="${formatVND(rates[5])}"></td>
          <td><input type="text" class="config-input" data-flex-m3-key="${item.key}" data-idx="6" value="${formatVND(rates[6])}"></td>
        </tr>
      `;
    });
    flexM3Body.innerHTML = flexM3HTML;

    // 3. Render Flexible KG Table
    const flexKGBody = document.getElementById('table-flexible-kg-rates').querySelector('tbody');
    const flexKGKeys = [
      { key: 'QC-HN', label: 'QC - HN (kg)' },
      { key: 'QC-HCM', label: 'QC - HCM (kg)' },
      { key: 'BT-HN', label: 'BT - HN (kg)' },
      { key: 'BT-HCM', label: 'BT - HCM (kg)' }
    ];
    let flexKGHTML = '';
    flexKGKeys.forEach(item => {
      const rates = tariffs.flexibleKG[item.key].map(r => Math.round(r));
      flexKGHTML += `
        <tr>
          <td><strong>${item.label}</strong></td>
          <td><input type="text" class="config-input" data-flex-kg-key="${item.key}" data-idx="0" value="${formatVND(rates[0])}"></td>
          <td><input type="text" class="config-input" data-flex-kg-key="${item.key}" data-idx="1" value="${formatVND(rates[1])}"></td>
          <td><input type="text" class="config-input" data-flex-kg-key="${item.key}" data-idx="2" value="${formatVND(rates[2])}"></td>
          <td><input type="text" class="config-input" data-flex-kg-key="${item.key}" data-idx="3" value="${formatVND(rates[3])}"></td>
          <td><input type="text" class="config-input" data-flex-kg-key="${item.key}" data-idx="4" value="${formatVND(rates[4])}"></td>
          <td><input type="text" class="config-input" data-flex-kg-key="${item.key}" data-idx="5" value="${formatVND(rates[5])}"></td>
        </tr>
      `;
    });
    flexKGBody.innerHTML = flexKGHTML;

    // Format money on blur
    document.querySelectorAll('.config-input').forEach(input => {
      input.addEventListener('blur', () => {
        const val = parseNum(input.value);
        const key = input.getAttribute('data-vip-key') || input.getAttribute('data-flex-kg-key');
        if (key && key.includes('KG')) {
          input.value = val.toLocaleString('vi-VN');
        } else {
          input.value = formatVND(val);
        }
      });
    });
  }

  async function saveAdminTariffs() {
    const tariffs = {
      phiUTBase: parseNum(document.getElementById('cfg-phi-ut-base').value),
      riskThreshold: parseNum(document.getElementById('cfg-risk-threshold').value),
      riskRate: parseFloat(document.getElementById('cfg-risk-rate').value) / 100,
      cuerQTQC: parseNum(document.getElementById('cfg-phi-vc-tq-qc').value),
      cuerQTBT: parseNum(document.getElementById('cfg-phi-vc-tq-bt').value),
      vipRates: {},
      flexibleM3: {},
      flexibleKG: {}
    };

    // Save VIP
    document.querySelectorAll('[data-vip-key]').forEach(input => {
      const key = input.getAttribute('data-vip-key');
      const idx = parseInt(input.getAttribute('data-idx'));
      if (!tariffs.vipRates[key]) tariffs.vipRates[key] = [];
      tariffs.vipRates[key][idx] = parseNum(input.value);
    });

    // Save Flexible M3
    document.querySelectorAll('[data-flex-m3-key]').forEach(input => {
      const key = input.getAttribute('data-flex-m3-key');
      const idx = parseInt(input.getAttribute('data-idx'));
      if (!tariffs.flexibleM3[key]) tariffs.flexibleM3[key] = [];
      tariffs.flexibleM3[key][idx] = parseNum(input.value);
    });

    // Save Flexible KG
    document.querySelectorAll('[data-flex-kg-key]').forEach(input => {
      const key = input.getAttribute('data-flex-kg-key');
      const idx = parseInt(input.getAttribute('data-idx'));
      if (!tariffs.flexibleKG[key]) tariffs.flexibleKG[key] = [];
      tariffs.flexibleKG[key][idx] = parseNum(input.value);
    });

    const res = await saveTariffs(tariffs);
    if (res && res.success) {
      showToast('Đã lưu cấu hình bảng phí và đồng bộ Google Sheet thành công!', 'success');
    } else {
      const err = res ? (res.error || res.message) : 'Không kết nối được Google Sheet';
      showToast('Đã lưu nội bộ (Chưa đồng bộ Google Sheet: ' + err + ')', 'warning');
    }
    autoUpdateLCLFields();
  }

  // ── Print PDF Quotation ──
  function getSharedCostsWithComments(type) {
    const rateUSD = parseNum(document.getElementById('exchange-rate')?.value) || 25900;
    const rateRMB = parseNum(document.getElementById('exchange-rate-rmb')?.value) || 3600;

    const items = [];
    if (type === 'LCL') {
      const rows = [
        { id: 'lcl-cuoc-vc', name: '2. Tổng cước VC TQ → VN' },
        { id: 'lcl-phi-ut', name: '3. Tổng phí ủy thác' },
        { id: 'lcl-phi-rr', name: '4. Tổng phí rủi ro' },
        { id: 'lcl-phi-khac-tq', name: '5. Tổng phí khác TQ + VN (không VAT)' },
        { id: 'lcl-chiet-khau', name: 'Chiết khấu (giảm trừ)' },
        { id: 'lcl-phi-khac-vn', name: '8. Tổng phí khác VN (có HĐ, chưa VAT)' }
      ];
      rows.forEach(r => {
        const valInput = document.getElementById(r.id);
        const currSelect = document.getElementById(`${r.id}-currency`);
        const commentInput = document.getElementById(`${r.id}-comment`);
        
        const rawVal = parseNum(valInput?.value);
        const curr = currSelect?.value || 'VND';
        const comment = commentInput?.value || '';
        
        let valVND = rawVal;
        if (curr === 'USD') valVND = rawVal * rateUSD;
        else if (curr === 'RMB') valVND = rawVal * rateRMB;

        if (rawVal !== 0) { // Keep even negative discounts
          items.push({ id: r.id, name: r.name, rawVal, curr, valVND, comment });
        }
      });
    } else {
      const rows = [
        { id: 'fcl-phi-nd-tq', name: '2. Tổng phí nội địa TQ (không HĐ)' },
        { id: 'fcl-phi-nd-vn', name: '3. Tổng phí nội địa VN (không HĐ)' },
        { id: 'fcl-phi-ut', name: '4. Tổng phí ủy thác' },
        { id: 'fcl-phi-qt', name: '5. Tổng phí QT có HĐ + phí VC quốc tế' },
        { id: 'fcl-phi-vc-vn', name: '6. Tổng phí VC VN có HĐ (chưa VAT)' }
      ];
      rows.forEach(r => {
        const valInput = document.getElementById(r.id);
        const currSelect = document.getElementById(`${r.id}-currency`);
        const commentInput = document.getElementById(`${r.id}-comment`);
        
        const rawVal = parseNum(valInput?.value);
        const curr = currSelect?.value || 'VND';
        const comment = commentInput?.value || '';
        
        let valVND = rawVal;
        if (curr === 'USD') valVND = rawVal * rateUSD;
        else if (curr === 'RMB') valVND = rawVal * rateRMB;

        if (rawVal !== 0) {
          items.push({ id: r.id, name: r.name, rawVal, curr, valVND, comment });
        }
      });
    }
    return items;
  }

  function generateQuotationPDF(type) {
    const results = type === 'LCL' ? window._lclResults : window._fclResults;
    const totals = type === 'LCL' ? window._lclTotals : window._fclTotals;
    
    if (!results || results.length === 0) {
      showToast('Vui lòng thực hiện tính toán phân bổ trước khi xuất báo giá', 'error');
      return;
    }

    const rateUSD = parseNum(document.getElementById('exchange-rate')?.value) || 25900;
    const rateRMB = parseNum(document.getElementById('exchange-rate-rmb')?.value) || 3600;

    const loggedUser = sessionStorage.getItem('eureka_logged_in_user');
    let creator = 'Quản trị viên';
    if (loggedUser) {
      try {
        const u = JSON.parse(loggedUser);
        creator = u.displayName || u.username || 'Quản trị viên';
      } catch (e) {}
    }
    const today = new Date().toLocaleDateString('vi-VN');
    const quoteNo = `BG-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(100 + Math.random()*900)}`;

    // Read route info
    let routeInfoHTML = '';
    if (type === 'LCL') {
      const getSelectText = (id) => {
        const el = document.getElementById(id);
        return el ? (el.options[el.selectedIndex]?.text || el.value) : '';
      };
      const method = getSelectText('lcl-duong-vc');
      const whCn = getSelectText('lcl-kho-tq');
      const whVn = getSelectText('lcl-kho-vn');
      const vip = getSelectText('lcl-vip');
      const cbm = document.getElementById('lcl-so-khoi')?.value || '0';
      const kg = document.getElementById('lcl-so-kg')?.value || '0';

      routeInfoHTML = `
        <div>
          <p><strong>Hình thức vận chuyển:</strong> Hàng gom cont (LCL)</p>
          <p><strong>Tuyến đường:</strong> ${whCn} &rarr; ${whVn} (${method})</p>
          <p><strong>Hạng VIP khách hàng:</strong> ${vip}</p>
        </div>
        <div>
          <p><strong>Thể tích hàng hóa:</strong> ${cbm} m³</p>
          <p><strong>Trọng lượng hàng hóa:</strong> ${kg} kg</p>
          <p><strong>Tỷ giá áp dụng:</strong> ${rateUSD.toLocaleString('vi-VN')} USD | ${rateRMB.toLocaleString('vi-VN')} RMB</p>
        </div>
      `;
    } else {
      routeInfoHTML = `
        <div>
          <p><strong>Hình thức vận chuyển:</strong> Hàng nguyên cont (FCL)</p>
          <p><strong>Tỷ giá áp dụng:</strong> ${rateUSD.toLocaleString('vi-VN')} USD | ${rateRMB.toLocaleString('vi-VN')} RMB</p>
        </div>
        <div>
          <p><strong>Ngày lập báo giá:</strong> ${today}</p>
        </div>
      `;
    }

    // Read items table rows
    const originalItems = readItems(type === 'LCL' ? 'lcl-items-body' : 'fcl-items-body');

    let itemsHTML = '';
    results.forEach((r, idx) => {
      const orig = originalItems[idx] || {};
      const rawValStr = `${orig.rawValue?.toLocaleString('vi-VN')} ${orig.currency}`;
      
      const totalInvoice = type === 'LCL' ? r.c16 : r.c15; // LCL invoice total is c16, FCL is c15
      const unitInvoice = r.unitInvoice; // Đơn giá xuất hóa đơn (chưa VAT)
      
      const taxNKPercent = `${(r.taxNK * 100).toFixed(0)}%`;
      const taxNKVal = formatVND(type === 'LCL' ? r.c9 * r.taxNK : r.c8 * r.taxNK);
      
      const taxOtherPercent = `${(r.taxOther * 100).toFixed(0)}%`;
      const taxOtherVal = formatVND(type === 'LCL' ? (r.c9 + r.c9*r.taxNK)*r.taxOther : (r.c8 + r.c8*r.taxNK)*r.taxOther);
      
      const vatPercent = `${(r.vatRate * 100).toFixed(0)}%`;
      const vatVal = formatVND(type === 'LCL' ? r.c14 : r.c13); // LCL VAT amount is c14, FCL VAT amount is c13
      
      itemsHTML += `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td><strong>${r.name}</strong></td>
          <td style="text-align:right;">${r.qty}</td>
          <td style="text-align:right;">${rawValStr}</td>
          <td style="text-align:right;">${taxNKPercent}<br><span style="font-size:0.7rem; color:var(--text-muted);">${taxNKVal}</span></td>
          <td style="text-align:right;">${taxOtherPercent}<br><span style="font-size:0.7rem; color:var(--text-muted);">${taxOtherVal}</span></td>
          <td style="text-align:right;">${vatPercent}<br><span style="font-size:0.7rem; color:var(--text-muted);">${vatVal}</span></td>
          <td style="text-align:right;"><strong>${formatVND(totalInvoice)}</strong></td>
          <td style="text-align:right;">${formatVND(unitInvoice)}</td>
        </tr>
      `;
    });

    // Read shared costs with comments
    const sharedCosts = getSharedCostsWithComments(type);
    let sharedCostsHTML = '';
    const accumulations = type === 'LCL' ? (window._lclAccumulations || []) : (window._fclAccumulations || []);

    sharedCosts.forEach((sc) => {
      // Find sub-fees belonging to this category
      const subFees = accumulations.filter(item => item.targetId === sc.id);
      
      let subFeesHTML = '';
      if (subFees.length > 0) {
        subFeesHTML += `<div style="margin-left: 14px; margin-top: 4px; border-left: 2px solid var(--primary-light); padding-left: 8px; font-size: 0.76rem; color: var(--text-secondary);">`;
        subFees.forEach(sf => {
          const sfValStr = sf.accCurrency && sf.accCurrency !== 'VND' 
            ? `+${sf.accAmount.toLocaleString('vi-VN', {maximumFractionDigits:2})} ${sf.accCurrency} (${formatVND(sf.amount)}₫)` 
            : `+${formatVND(sf.amount)}₫`;
          subFeesHTML += `
            <div style="display:flex; justify-content:space-between; margin-bottom: 2px;">
              <span>• ${sf.note || 'Chi tiết'}</span>
              <span>${sfValStr}</span>
            </div>
          `;
        });
        subFeesHTML += `</div>`;
      }

      const noteStr = sc.comment ? `<div style="font-size:0.72rem; color:var(--primary-dark); font-style:italic; margin-top:2px;">Ghi chú: ${sc.comment}</div>` : '';
      sharedCostsHTML += `
        <div class="summary-row" style="flex-direction: column; align-items: stretch; border-bottom: 1px dashed #e9ecef; padding: 10px 0;">
          <div style="display:flex; justify-content:space-between; align-items: flex-start;">
            <span>
              <strong>${sc.name}</strong>
              ${noteStr}
            </span>
            <strong>${formatVND(sc.valVND)}</strong>
          </div>
          ${subFeesHTML}
        </div>
      `;
    });

    // Invoice values
    const totalGoodsVND = totals.c1;
    const totalTaxNK = type === 'LCL' ? results.reduce((sum, r) => sum + r.c9 * r.taxNK, 0) : results.reduce((sum, r) => sum + r.c8 * r.taxNK, 0);
    const totalTaxOther = type === 'LCL' ? results.reduce((sum, r) => sum + (r.c9 + r.c9*r.taxNK)*r.taxOther, 0) : results.reduce((sum, r) => sum + (r.c8 + r.c8*r.taxNK)*r.taxOther, 0);
    const totalVat = type === 'LCL' ? totals.c14 : totals.c13;
    const totalInvoiceVal = type === 'LCL' ? totals.c16 : totals.c15;
    const totalCostAndTax = type === 'LCL' ? totals.c15 : totals.c14;
    
    // Create print container
    const existingSection = document.getElementById('print-section');
    if (existingSection) existingSection.remove();

    const printDiv = document.createElement('div');
    printDiv.id = 'print-section';
    printDiv.innerHTML = `
      <style>
        @media screen {
          #print-section {
            display: none !important;
          }
        }
        @media print {
          body > *:not(#print-section) {
            display: none !important;
          }
          body {
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          #print-section {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 20px !important;
          }
        }

        #print-section {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: #2b2d42;
          line-height: 1.5;
          background: #ffffff;
        }
        #print-section .header {
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #e76f51;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        #print-section .company-info h1 {
          color: #e76f51;
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        #print-section .company-info p {
          font-size: 0.85rem;
          color: #6c757d;
          margin-bottom: 3px;
        }
        #print-section .company-info .hotline {
          font-weight: 700;
          color: #d85a3b;
          font-size: 0.9rem;
          margin-top: 5px;
        }
        #print-section .quote-meta {
          text-align: right;
          font-size: 0.85rem;
        }
        #print-section .quote-meta h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2b2d42;
          margin-bottom: 5px;
        }
        #print-section .quote-meta p {
          margin-bottom: 3px;
          color: #6c757d;
        }
        #print-section .section-title {
          font-size: 1rem;
          font-weight: 700;
          color: #e76f51;
          text-transform: uppercase;
          border-left: 3px solid #e76f51;
          padding-left: 10px;
          margin-bottom: 15px;
          margin-top: 25px;
          letter-spacing: 0.5px;
        }
        #print-section .grid-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 20px;
          border: 1px solid #dee2e6;
        }
        #print-section .grid-info div p { margin-bottom: 5px; }
        #print-section .grid-info div p strong { color: #2b2d42; }
        #print-section table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
          margin-bottom: 25px;
        }
        #print-section th {
          background: #fdf0ed;
          color: #d85a3b;
          font-weight: 700;
          text-align: left;
          padding: 10px;
          border-bottom: 2px solid #dee2e6;
        }
        #print-section td {
          padding: 10px;
          border-bottom: 1px solid #dee2e6;
        }
        #print-section tr:nth-child(even) td { background: #fdfdfd; }
        #print-section .text-right { text-align: right; }
        #print-section .summary-container {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin-top: 20px;
        }
        #print-section .summary-column {
          flex: 1;
        }
        #print-section .summary-box {
          width: 100%;
          font-size: 0.85rem;
          border-top: 1px solid #dee2e6;
          padding-top: 15px;
        }
        #print-section .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px dashed #f0f0f0;
          align-items: flex-start;
        }
        #print-section .summary-row.highlight {
          background: #fdf0ed;
          border: 1px solid #d85a3b;
          padding: 12px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 1rem;
          color: #d85a3b;
          margin-top: 12px;
        }
        #print-section .notes {
          font-size: 0.78rem;
          color: #6c757d;
          margin-top: 35px;
          border-top: 1px solid #dee2e6;
          padding-top: 15px;
        }
        #print-section .notes p { margin-bottom: 5px; }
        #print-section .signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 50px;
          font-size: 0.85rem;
          text-align: center;
        }
        #print-section .signatures div { width: 200px; }
        #print-section .signatures div p.sign-title { font-weight: 700; margin-bottom: 60px; }
      </style>

      <!-- Header -->
      <div class="header">
        <div class="company-info">
          <h1>Eureka Logistics</h1>
          <p>Văn phòng: Tầng 3, PC1, 44 Triều Khúc, Thanh Liệt, Hà Nội</p>
          <p>Website: erktransport.com | Email: cskh@erktransport.com</p>
          <p class="hotline">Hotline: 0898.586.622</p>
        </div>
        <div class="quote-meta">
          <h2>BÁO GIÁ DỊCH VỤ</h2>
          <p>Số: <strong>${quoteNo}</strong></p>
          <p>Ngày lập: ${today}</p>
          <p>Người tạo: <strong>${creator}</strong></p>
        </div>
      </div>

      <!-- Thông tin lô hàng -->
      <div class="section-title">Thông Tin Lô Hàng & Tuyến Đường</div>
      <div class="grid-info">
        ${routeInfoHTML}
      </div>

      <!-- Bảng chi tiết mặt hàng -->
      <div class="section-title">Chi Tiết Mặt Hàng Phân Bổ</div>
      <table>
        <thead>
          <tr>
            <th style="width: 50px; text-align:center;">STT</th>
            <th>Tên mặt hàng</th>
            <th class="text-right" style="width: 70px;">Số lượng</th>
            <th class="text-right" style="width: 115px;">Giá trị gốc</th>
            <th class="text-right" style="width: 110px;">Thuế NK</th>
            <th class="text-right" style="width: 110px;">Thuế Khác</th>
            <th class="text-right" style="width: 110px;">VAT</th>
            <th class="text-right" style="width: 120px;">Giá xuất HĐ</th>
            <th class="text-right" style="width: 120px;">Đơn giá xuất HĐ</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <!-- Bảng tổng hợp chi phí lô hàng -->
      <div class="summary-container">
        <div class="summary-column">
          <div class="section-title">Chi Tiết Phí Theo Lô</div>
          <div class="summary-box">
            ${sharedCostsHTML}
          </div>
        </div>
        <div class="summary-column" style="max-width: 400px;">
          <div class="section-title">Tổng Hợp Phân Bổ</div>
          <div class="summary-box">
            <div class="summary-row">
              <span>1. Tổng trị giá hàng hóa (Invoice):</span>
              <strong>${formatVND(totalGoodsVND)}</strong>
            </div>
            <div class="summary-row">
              <span>Tổng thuế nhập khẩu:</span>
              <strong>${formatVND(totalTaxNK)}</strong>
            </div>
            <div class="summary-row">
              <span>Tổng thuế khác:</span>
              <strong>${formatVND(totalTaxOther)}</strong>
            </div>
            <div class="summary-row" style="background: #f8f9fa; font-weight: 600; padding: 6px; border-radius: 4px;">
              <span>2. Tổng chi phí + thuế trực tiếp:</span>
              <strong>${formatVND(totalCostAndTax)}</strong>
            </div>
            <div class="summary-row">
              <span>3. Tổng thuế VAT hàng hóa:</span>
              <strong>${formatVND(totalVat)}</strong>
            </div>
            <div class="summary-row highlight">
              <span>Giá trị xuất HĐ (đã VAT):</span>
              <span>${formatVND(totalInvoiceVal)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="notes">
        <p><strong>* Ghi chú & Điều khoản:</strong></p>
        <p>- Báo giá trên có hiệu lực trong vòng 15 ngày kể từ ngày ban hành.</p>
        <p>- Số tiền thanh toán thực tế đã bao gồm thuế nhập khẩu và thuế GTGT hàng hóa nộp hộ.</p>
        <p>- Báo giá được tính toán tự động dựa trên biểu phí hiện hành của Eureka Logistics.</p>
      </div>

      <!-- Signatures -->
      <div class="signatures">
        <div>
          <p class="sign-title">Khách hàng xác nhận</p>
          <p style="color:#ccc; font-style:italic;">(Ký, ghi rõ họ tên)</p>
        </div>
        <div>
          <p class="sign-title">Người lập báo giá</p>
          <p style="font-weight:bold;">${creator}</p>
        </div>
      </div>
    `;

    document.body.appendChild(printDiv);
    
    // Register afterprint cleanup
    window.addEventListener('afterprint', () => {
      printDiv.remove();
    }, { once: true });

    // Trigger print
    setTimeout(() => {
      window.print();
    }, 100);
  }

  // ── Import & Export Excel Mat Hang ──
  function downloadExcelTemplate() {
    const headers = [
      "Tên mặt hàng",
      "Số lượng",
      "Trị giá",
      "Tiền tệ",
      "Thuế NK (%)",
      "Thuế khác (%)",
      "VAT (%)"
    ];
    const data = [
      headers,
      ["Mặt hàng mẫu A", 100, 5000000, "VND", 0, 0, 8],
      ["Mặt hàng mẫu B", 5, 250, "USD", 10, 0, 8],
      ["Mặt hàng mẫu C", 12, 1800, "RMB", 5, 0, 8]
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Mẫu nhập hàng");
    const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    triggerMobileDownload(blob, 'Mau_nhap_lieu_mat_hang.xlsx');
    showToast("Đã tải tệp mẫu Excel thành công!", "success");
  }

  function handleExcelImport(file, type) {
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (rows.length < 2) {
          showToast("File Excel trống hoặc không có dòng dữ liệu", "error");
          return;
        }

        // Parse headers to find column mappings
        const headers = rows[0].map(h => String(h || '').trim().toLowerCase());
        
        let colName = -1;
        let colQty = -1;
        let colVal = -1;
        let colCurr = -1;
        let colTaxNK = -1;
        let colTaxOther = -1;
        let colVat = -1;

        headers.forEach((h, idx) => {
          if (h.includes('tên') || h.includes('mặt') || h.includes('name') || h.includes('item') || h.includes('product')) {
            if (colName === -1) colName = idx;
          } else if (h.includes('số lượng') || h.includes('sl') || h.includes('qty') || h.includes('quantity')) {
            if (colQty === -1) colQty = idx;
          } else if (h.includes('trị giá') || h.includes('giá trị') || h.includes('đơn giá') || h.includes('thành tiền') || h.includes('value') || h.includes('amount') || h.includes('price')) {
            if (colVal === -1) colVal = idx;
          } else if (h.includes('tiền tệ') || h.includes('loại tiền') || h.includes('currency')) {
            if (colCurr === -1) colCurr = idx;
          } else if (h.includes('thuế nk') || h.includes('thuế nhập khẩu') || h.includes('nk') || h.includes('import') || h.includes('taxnk')) {
            if (colTaxNK === -1) colTaxNK = idx;
          } else if (h.includes('thuế khác') || h.includes('bảo vệ') || h.includes('other') || h.includes('taxother')) {
            if (colTaxOther === -1) colTaxOther = idx;
          } else if (h.includes('vat') || h.includes('gtgt') || h.includes('valueadded')) {
            if (colVat === -1) colVat = idx;
          }
        });

        if (colName === -1 || colQty === -1 || colVal === -1) {
          showToast("File Excel thiếu các cột bắt buộc: Tên mặt hàng, Số lượng, Trị giá", "error");
          return;
        }

        // Process data rows
        const tbodyId = type === 'LCL' ? 'lcl-items-body' : 'fcl-items-body';
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;

        // Clear existing rows
        tbody.innerHTML = '';
        
        let loadedCount = 0;
        let itemIndex = 1;

        for (let i = 1; i < rows.length; i++) {
          const rowData = rows[i];
          if (!rowData || rowData.length === 0) continue;
          
          const name = String(rowData[colName] || '').trim();
          if (!name) continue; // Skip empty rows
          
          const qty = parseNum(rowData[colQty]);
          const value = parseNum(rowData[colVal]);
          
          // Determine currency safely
          let currency = 'VND';
          if (colCurr !== -1 && rowData[colCurr]) {
            const rawCurr = String(rowData[colCurr]).trim().toUpperCase();
            if (['VND', 'USD', 'RMB'].includes(rawCurr)) {
              currency = rawCurr;
            }
          }
          
          const taxNK = colTaxNK !== -1 && rowData[colTaxNK] !== undefined ? parseNum(rowData[colTaxNK]) : 0;
          const taxOther = colTaxOther !== -1 && rowData[colTaxOther] !== undefined ? parseNum(rowData[colTaxOther]) : 0;
          const vat = colVat !== -1 && rowData[colVat] !== undefined ? parseNum(rowData[colVat]) : 8;

          // Insert new row
          const rowHTML = type === 'LCL' ? createLCLRow(itemIndex) : createFCLRow(itemIndex);
          tbody.insertAdjacentHTML('beforeend', rowHTML);
          const newRow = tbody.lastElementChild;
          
          // Fill values
          newRow.querySelector('[data-field="name"]').value = name;
          newRow.querySelector('[data-field="qty"]').value = qty ? qty.toLocaleString('vi-VN') : '';
          newRow.querySelector('[data-field="value"]').value = value ? value.toLocaleString('vi-VN') : '';
          newRow.querySelector('[data-field="currency"]').value = currency;
          newRow.querySelector('[data-field="taxNK"]').value = taxNK;
          newRow.querySelector('[data-field="taxOther"]').value = taxOther;
          newRow.querySelector('[data-field="vat"]').value = vat;
          
          attachInputFormatters(newRow);
          
          itemIndex++;
          loadedCount++;
        }

        if (type === 'LCL') {
          lclItemCount = loadedCount;
          autoUpdateLCLFields();
        } else {
          fclItemCount = loadedCount;
          updateAllConversionNotes();
        }

        showToast(`Đã nhập thành công ${loadedCount} mặt hàng từ file Excel!`, "success");
      } catch (err) {
        console.error(err);
        showToast("Lỗi khi đọc file Excel. Vui lòng kiểm tra lại cấu trúc file.", "error");
      }
    };
    reader.readAsArrayBuffer(file);
  }

  async function resetAdminTariffs() {
    if (confirm('Bạn có chắc muốn khôi phục bảng phí về mặc định ban đầu?')) {
      localStorage.removeItem('eureka_tariffs');
      if (GOOGLE_SHEET_URL) {
        await saveTariffs(DEFAULT_TARIFFS);
      }
      renderAdminTariffs();
      showToast('Đã khôi phục bảng phí mặc định', 'success');
      autoUpdateLCLFields();
    }
  }

  const DEFAULT_SUPPORT_TOOLS = [
    { name: 'Tra cứu mã HS & Biểu thuế', url: 'https://hqs.customs.gov.vn/', desc: 'Trang thông tin Tổng cục Hải quan Việt Nam.' },
    { name: 'Tra cứu hải quan Việt Nam', url: 'https://www.customs.gov.vn/', desc: 'Cổng thông tin điện tử Hải quan.' },
    { name: 'Tra cứu lịch tàu & Container Tracking', url: 'https://www.searates.com/', desc: 'Công cụ kiểm tra lịch trình, tracking container.' },
    { name: 'Tính CBM & Quy đổi kích thư�&�c', url: 'https://www.cbmcalculator.com/', desc: 'Tính thể tích và quy đổi trọng lượng hàng hóa.' }
  ];

  function getSupportTools() {
    try {
      const tools = localStorage.getItem('eureka_support_tools');
      if (!tools) {
        localStorage.setItem('eureka_support_tools', JSON.stringify(DEFAULT_SUPPORT_TOOLS));
        return DEFAULT_SUPPORT_TOOLS;
      }
      return JSON.parse(tools);
    } catch (e) {
      return DEFAULT_SUPPORT_TOOLS;
    }
  }

  async function saveSupportTools(tools) {
    localStorage.setItem('eureka_support_tools', JSON.stringify(tools));
    if (GOOGLE_SHEET_URL) {
      try {
        const res = await callSheetAPI({
          action: 'save_tools',
          tools: tools
        });
        return res;
      } catch (e) {
        console.error("Failed to save tools to sheet:", e);
        return null;
      }
    }
    return { success: true };
  }

  function renderSupportTools() {
    const gridEl = document.getElementById('support-tools-grid');
    if (!gridEl) return;

    const tools = getSupportTools();
    if (tools.length === 0) {
      gridEl.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary); background: var(--bg-light); border-radius: 8px; border: 1px dashed var(--border);">
          Chưa có công cụ hỗ trợ nào được cấu hình.
        </div>
      `;
      return;
    }

    gridEl.innerHTML = tools.map(t => {
      return `
        <a href="${t.url}" target="_blank" class="section-card animate-in" style="text-decoration:none; display:flex; flex-direction:column; justify-content:space-between; transition:transform 0.2s, box-shadow 0.2s; cursor:pointer; height:100%; border:1px solid var(--border-light); margin:0;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='var(--shadow-md)'" onmouseout="this.style.transform='none'; this.style.boxShadow='none'">
          <div class="section-header" style="border-bottom:none; padding:16px 20px 8px 20px;">
            <div style="flex:1; min-width:0;">
              <div class="section-title" style="font-size:0.9rem; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--text-primary);">${t.name}</div>
              <div class="section-desc" style="font-size:0.75rem; margin-top:4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; text-overflow:ellipsis; height:34px; line-height:1.2; color:var(--text-secondary);">${t.desc || 'Liên kết tiện ích tra cứu nhanh'}</div>
            </div>
          </div>
          <div style="padding:0 20px 16px 20px; display:flex; align-items:center; justify-content:flex-end; font-size:0.75rem; font-weight:600; color:var(--accent);">
            Truy cập ↗
          </div>
        </a>
      `;
    }).join('');
  }

  function renderAdminTools() {
    const tbodyEl = document.getElementById('admin-tools-tbody');
    if (!tbodyEl) return;

    const tools = getSupportTools();
    if (tools.length === 0) {
      tbodyEl.innerHTML = `
        <tr>
          <td colspan="3" style="text-align:center; padding:20px; color:var(--text-secondary);">Chưa có công cụ hỗ trợ nào.</td>
        </tr>
      `;
      return;
    }

    tbodyEl.innerHTML = tools.map((t, idx) => {
      return `
        <tr>
          <td><strong>${t.name}</strong><br><span style="font-size:0.7rem; color:var(--text-secondary);">${t.desc || ''}</span></td>
          <td><a href="${t.url}" target="_blank" style="color:var(--accent); font-size:0.8rem; word-break:break-all;">${t.url}</a></td>
          <td style="text-align:center; white-space:nowrap;">
            <button type="button" class="btn btn-secondary" style="padding:4px 8px; font-size:0.75rem; margin-right:6px;" onclick="window._editSupportTool(${idx})">Sửa</button>
            <button type="button" class="btn btn-danger btn-icon" style="padding:4px 8px; font-size:0.75rem;" onclick="deleteSupportTool(${idx})">X Xóa</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.deleteSupportTool = async function(idx) {
    const tools = getSupportTools();
    if (idx < 0 || idx >= tools.length) return;
    
    const deletedTool = tools[idx];
    tools.splice(idx, 1);
    await saveSupportTools(tools);
    renderAdminTools();
    renderSupportTools();
    showToast(`Đã xóa liên kết "${deletedTool.name}" thành công`, 'success');
  };

  // ── Init User Profile & Personal Sheet Settings ──
  function initUserProfile() {
    const profileBtn = document.getElementById('profile-settings-btn');
    const modal = document.getElementById('user-profile-modal');
    const closeBtn = document.getElementById('profile-modal-close-btn');
    const form = document.getElementById('personal-sheet-form');
    const urlInput = document.getElementById('personal-sheet-url');
    const statusBadge = document.getElementById('personal-sheet-status-badge');
    const toggleGuideBtn = document.getElementById('toggle-guide-btn');
    const guideBox = document.getElementById('apps-script-guide-box');
    const copyCodeBtn = document.getElementById('copy-script-code-btn');

    if (!profileBtn || !modal) return;

    // Open Modal
    profileBtn.addEventListener('click', () => {
      const username = getCurrentUsername() || 'sales';
      const loggedUserStr = sessionStorage.getItem('eureka_logged_in_user');
      let displayName = username;
      let role = 'user';
      if (loggedUserStr) {
        try {
          const u = JSON.parse(loggedUserStr);
          displayName = u.displayName || u.username;
          role = u.role || 'user';
        } catch (e) {}
      }

      const userDisplayEl = document.getElementById('profile-user-display');
      if (userDisplayEl) {
        userDisplayEl.textContent = `${displayName} (@${username})`;
      }

      const roleBadge = document.getElementById('profile-role-badge');
      if (roleBadge) {
        roleBadge.textContent = role === 'admin' ? 'Admin' : 'Sales';
        roleBadge.className = role === 'admin' ? 'history-badge lcl' : 'history-badge fcl';
      }

      const currentUrl = getPersonalSheetUrl();
      if (urlInput) urlInput.value = currentUrl;
      updateStatusBadge(currentUrl);

      // Điền thông tin Supabase (nếu có)
      const supaUrlInput = document.getElementById('supabase-url-input');
      const supaKeyInput = document.getElementById('supabase-key-input');
      const supaBadge = document.getElementById('supabase-status-badge');
      if (window.EurekaDB && supaUrlInput && supaKeyInput) {
        const supaCfg = window.EurekaDB.getSupabaseConfig();
        supaUrlInput.value = supaCfg.url;
        supaKeyInput.value = supaCfg.key;
        if (supaBadge) {
          if (supaCfg.url && supaCfg.key) {
            supaBadge.textContent = 'Đã kết nối';
            supaBadge.style.background = 'var(--success-bg)';
            supaBadge.style.color = 'var(--success)';
            supaBadge.style.display = 'inline-block';
          } else {
            supaBadge.textContent = 'Chưa cấu hình';
            supaBadge.style.background = 'var(--accent-light)';
            supaBadge.style.color = 'var(--accent)';
            supaBadge.style.display = 'inline-block';
          }
        }
      }

      modal.style.display = 'flex';
    });

    // Close Modal
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    // Close Modal on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    // Toggle Guide Accordion
    if (toggleGuideBtn && guideBox) {
      toggleGuideBtn.addEventListener('click', () => {
        const isHidden = guideBox.style.display === 'none' || !guideBox.style.display;
        guideBox.style.display = isHidden ? 'block' : 'none';
        toggleGuideBtn.textContent = isHidden ? '🔼 Ẩn hướng dẫn' : '📖 Hướng dẫn lấy Link';
      });
    }

    // Update Status Badge
    function updateStatusBadge(url) {
      if (!statusBadge) return;
      const clean = url ? url.trim() : '';
      if (!clean) {
        statusBadge.textContent = 'Chưa cấu hình';
        statusBadge.style.background = 'var(--accent-light)';
        statusBadge.style.color = 'var(--accent)';
        statusBadge.style.display = 'inline-block';
      } else if (isValidAppsScriptUrl(clean)) {
        statusBadge.textContent = 'Link hợp lệ';
        statusBadge.style.background = 'var(--success-bg)';
        statusBadge.style.color = 'var(--success)';
        statusBadge.style.display = 'inline-block';
      } else {
        statusBadge.textContent = 'Link không hợp lệ';
        statusBadge.style.background = 'var(--danger-bg)';
        statusBadge.style.color = 'var(--danger)';
        statusBadge.style.display = 'inline-block';
      }
    }

    if (urlInput) {
      urlInput.addEventListener('input', (e) => {
        updateStatusBadge(e.target.value);
      });
    }

    // Form Submit Save
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = urlInput ? urlInput.value.trim() : '';
        if (url && !isValidAppsScriptUrl(url)) {
          showToast('URL Apps Script không hợp lệ! Phải có dạng https://script.google.com/macros/s/.../exec', 'error');
          return;
        }
        setPersonalSheetUrl(url);
        updateStatusBadge(url);

        // Lưu cấu hình Supabase
        const supaUrlInput = document.getElementById('supabase-url-input');
        const supaKeyInput = document.getElementById('supabase-key-input');
        if (window.EurekaDB && supaUrlInput && supaKeyInput) {
          window.EurekaDB.setSupabaseConfig(supaUrlInput.value, supaKeyInput.value);
        }

        showToast('Đã lưu cấu hình Google Sheet & Supabase thành công!', 'success');
        modal.style.display = 'none';
      });
    }

    // Copy Code Snippet Handler
    if (copyCodeBtn) {
      copyCodeBtn.addEventListener('click', () => {
        const codeSnippet = document.getElementById('apps-script-code-snippet')?.textContent;
        if (codeSnippet) {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(codeSnippet).then(() => {
              showToast('Đã copy mã Apps Script vào bộ nhớ tạm!', 'success');
            }).catch(() => {
              fallbackCopyText(codeSnippet);
            });
          } else {
            fallbackCopyText(codeSnippet);
          }
        }
      });
    }

    function fallbackCopyText(text) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Đã copy mã Apps Script vào bộ nhớ tạm!', 'success');
      } catch (err) {
        showToast('Không thể copy tự động, vui lòng chọn và copy thủ công', 'warning');
      }
    }
  }

  // ── Contract & PO Generation (Agent 4) ──
  const DEFAULT_SELLER_INFO = {
    name: "CÔNG TY TNHH XNK và THƯƠNG MẠI EUREKA",
    address: "Số 3, ngách 56, ngõ An Sơn, đường Đại La, Phường Tương Mai, Thành phố Hà Nội, Việt Nam",
    office: "Tầng 3, Tòa PCC1, số 44 đường Triều Khúc, Phường Thanh Liệt, TP. Hà Nội.",
    phone: "0898586633",
    taxCode: "0107792615",
    representative: "Ông Vũ Minh Tú",
    position: "Tổng giám đốc",
    bankAccount: "555559668888",
    bankName: "ACB chi nhánh Đông Đô"
  };

        const DEFAULT_CONTRACT_NT_TEMPLATE = `<h1 style="text-align: center; font-size: 13pt;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
<p style="text-align: center; font-weight: bold; margin-bottom: 2pt;">Độc lập – Tự do – Hạnh phúc</p>
<p style="text-align: center; margin-top: 0; margin-bottom: 18pt;">---o.0.o---</p>

<h1 style="text-align: center; font-size: 14pt; margin-bottom: 3pt;">HỢP ĐỒNG NGUYÊN TẮC MUA BÁN HÀNG HÓA</h1>
<p style="text-align: center; font-style: italic; margin-bottom: 18pt;">Số: {SO_HD}</p>

<p>- Căn cứ Bộ luật Dân sự của Quốc Hội nước CHXHCN Việt Nam năm 2015;</p>
<p>- Căn cứ vào Luật Thương mại số 36/2005/QH 11 ngày 14/06/2005 của Quốc Hội nước Cộng hòa Xã hội Chủ Nghĩa Việt Nam;</p>
<p>- Căn cứ vào đơn chào hàng (đặt hàng hoặc sự thực hiện thỏa thuận của hai bên).</p>

<p style="margin-top: 12pt;">Hôm nay ngày {NGAY_KY}, tại Văn phòng CÔNG TY TNHH XUẤT NHẬP KHẨU VÀ THƯƠNG MẠI EUREKA, chúng tôi gồm:</p>

<p class="bold" style="margin-top: 12pt; text-transform: uppercase;">Bên A: BÊN BÁN</p>
<p><span class="bold">Công ty:</span> {SELLER_NAME}</p>
<p><span class="bold">Địa chỉ trụ sở chính:</span> {SELLER_ADDR}</p>
<p><span class="bold">Địa chỉ văn phòng giao dịch:</span> {SELLER_OFFICE}</p>
<p><span class="bold">Điện thoại:</span> {SELLER_PHONE} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="bold">Mã số thuế:</span> {SELLER_TAX}</p>
<p><span class="bold">Số tài khoản:</span> {SELLER_BANK} - Ngân hàng: {SELLER_BANK_NAME}</p>
<p><span class="bold">Người đại diện:</span> {SELLER_REP} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="bold">Chức vụ:</span> {SELLER_POSITION}</p>

<p class="bold" style="margin-top: 12pt; text-transform: uppercase;">Bên B: BÊN MUA</p>
<p><span class="bold">Cá nhân/Công ty:</span> {BUYER_NAME}</p>
<p><span class="bold">Địa chỉ:</span> {BUYER_ADDR}</p>
<p><span class="bold">Điện thoại:</span> {BUYER_PHONE} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="bold">Mã số thuế:</span> {BUYER_TAX}</p>
<p><span class="bold">Người đại diện:</span> {BUYER_REP} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="bold">Chức vụ:</span> {BUYER_POSITION}</p>
<p><span class="bold">Email:</span> {BUYER_EMAIL}</p>

<p style="margin-top: 12pt;">Hai bên thống nhất thỏa thuận nội dung hợp đồng như sau:</p>

<h2>ĐIỀU I: NỘI DUNG CÔNG VIỆC GIAO DỊCH</h2>
<p>- Đối tượng của Hợp Đồng là các hàng hóa được nêu chi tiết các thông tin về số lượng, đơn giá, tiêu chuẩn… tại Phụ lục Hợp Đồng hoặc Đơn Đặt Hàng;</p>
<p>- Số lượng hàng hóa trên thực tế căn cứ vào Đơn đặt hàng của Bên B. Đơn đặt hàng được coi là có hiệu lực khi và chỉ khi hàng hóa được Bên A cung cấp theo Đơn đặt hàng đáp ứng đủ các điều kiện quy định tại Phụ lục Hợp Đồng hoặc Đơn Đặt Hàng.</p>

<h2>ĐIỀU II: CHẤT LƯỢNG HÀNG HÓA VÀ ĐỊA ĐIỂM GIAO HÀNG</h2>
<p>- Chất lượng hàng hóa: đảm bảo chất lượng theo yêu cầu của người mua.</p>
<p>- Địa điểm giao hàng: Cây xăng dầu Vạn Xuân, Đường Phan Trọng Tuệ, Thanh Trì, Hà Nội.</p>
<p>- Chi phí vận chuyển đến nơi giao hàng sẽ do bên B thanh toán.</p>

<h2>ĐIỀU III: PHƯƠNG THỨC THANH TOÁN</h2>
<p>- Thời hạn thanh toán của từng đơn hàng (trước, trong hoặc sau khi giao hàng) sẽ do hai bên thỏa thuận và điều chỉnh linh hoạt dựa trên điểm tín dụng và lịch sử thanh toán thực tế của khách hàng.</p>
<p>- Phương thức thanh toán: chuyển khoản hoặc tiền mặt.</p>
<p>- Chuyển khoản cho người hưởng lợi dưới đây:</p>
<p style="margin-left: 20pt; margin-bottom: 2pt;"><b>Công ty TNHH Xuất nhập khẩu và Thương mại EUREKA</b></p>
<p style="margin-left: 20pt; margin-bottom: 2pt;">Số tài khoản {SELLER_BANK} - Tại {SELLER_BANK_NAME}</p>
<p style="margin-left: 20pt; margin-bottom: 2pt;">Đại diện là ông: {SELLER_REP}</p>

<h2>ĐIỀU IV: QUYỀN VÀ TRÁCH NHIỆM CỦA CÁC BÊN TRONG VIỆC THỰC HIỆN HỢP ĐỒNG</h2>
<p class="bold">1. Quyền và trách nhiệm của bên A:</p>
<p>- Bên A có trách nhiệm giao hàng theo thỏa thuận về số lượng chất lượng đã thỏa thuận với người mua theo từng lần đặt hàng.</p>
<p>- Bên A nhận được thanh toán như trong điều kiện của hợp đồng và đơn đặt hàng từ bên B.</p>
<p>- Bên A có trách nhiệm giao hóa đơn tài chính cho bên B, đảm bảo đúng chất lượng của nhà sản xuất.</p>
<p>- Bên A đảm bảo số lượng, chất lượng hàng hóa theo thỏa thuận với bên B đáp ứng nhu cầu của khách hàng.</p>
<p>- Bên A đảm bảo lợi ích của bên B trong việc hợp tác, không bán cho các bên khác dưới giá đã thỏa thuận gây thiệt hại cho bên B.</p>
<p>- Đảm bảo quyền lợi của bên B trong việc tiến hành triển khai xây dựng thị trường cho sản phẩm mà hai bên đã hợp tác.</p>
<p class="bold">2. Quyền và trách nhiệm của bên B:</p>
<p>- Bên B nhận được đầy đủ hàng hóa, hóa đơn giao nhận từ bên A như thỏa thuận.</p>
<p>- Có trách nhiệm thanh toán cho bên A tiền hàng ngay khi hai bên đã ký biên bản giao nhận hàng hóa và cam kết nhận hàng khi bên A giao đến kho.</p>
<p>- Bên B có trách nhiệm với số lượng cam kết với bên A trong từng đơn đặt hàng.</p>

<h2>ĐIỀU V: ĐIỀU KHOẢN PHỤ VÀ PHẠT VI PHẠM HỢP ĐỒNG</h2>
<p>- Bên vi phạm hợp đồng phải chịu phạt và bồi thường thiệt hại trực tiếp cho bên kia do sự vi phạm hợp đồng gây ra.</p>
<p>- Nếu bên B thanh toán chậm hơn so với thời gian quy định trong hợp đồng thì Bên B phải trả cho bên A số tiền phạt bằng 0,05% tổng giá trị thanh toán chậm cho mỗi ngày chậm thanh toán tính thời điểm tính chậm thanh toán xác định theo ngày, tháng ký vào biên bản giao hàng.</p>
<p>Nếu quá hạn thanh toán 15 ngày, Bên A có quyền:</p>
<p>Tạm giữ các khoản tạm ứng bên B đã chuyển.</p>
<p>Tiến hành các biện pháp pháp lý để thu hồi công nợ.</p>
<p>Yêu cầu Bên B bồi thường các chi phí liên quan đến việc thu hồi nợ.</p>
<p>(Khoản phạt chỉ được xem là “phát sinh thực tế” khi Bên Bán đã phát hành Yêu cầu thanh toán bằng văn bản kèm Biên bản/Chứng từ xác định số tiền phạt.)</p>
<p>-Việc miễn, giảm hoặc không thu khoản phạt do bên bị thiệt hại quyết định. Quyết định này có hiệu lực khi bị thiệt hại gửi thông báo xác nhận bằng một trong những hình thức được pháp luật chấp nhận.</p>
<p>- Nếu một trong hai bên không thực hiện hoặc thực hiện không đầy đủ các điều khoản quy định trong hợp đồng mà gây thiệt hại cho bên kia, bên bị thiệt hại có quyền yêu cầu phía bên kia bồi hoàn các khoản thiệt hại theo quy định của pháp luật.</p>

<h2>ĐIỀU VI: THỦ TỤC GIẢI QUYẾT TRANH CHẤP HỢP ĐỒNG</h2>
<p>- Hai bên chủ động thông báo cho nhau tiến độ thực hiện đặt hàng. Nếu có vấn đề gì bất lợi phát sinh các bên phải kịp thời thông báo cho nhau biết và tích cực bàn bạc giải quyết (cần lập biên bản ghi toàn bộ nội dung).</p>
<p>- Mọi tranh chấp phát sinh trong quá trình thực hiện hợp đồng sẽ được hai bên ưu tiên giải quyết bằng thương lượng. Trường hợp các bên không tự giải quyết được mới đưa ra tòa án kinh tế Hà Nội để giải quyết và phán quyết của Tòa án là quyết định cuối cùng buộc hai bên phải thực hiện.</p>

<h2>ĐIỀU VII: HIỆU LỰC CỦA HỢP ĐỒNG</h2>
<p>Hợp đồng này có hiệu lực từ ngày {NGAY_KY} đến ngày .... tháng ... năm ....... Sau thời hạn này nếu không bên nào có khiếu nại nào , hợp đồng sẽ tự động được thanh lý.</p>
<p>Hợp đồng này được làm thành 02 bản, có giá trị như nhau. Mỗi bên giữ 01 bản.</p>

<table style="border: none; margin-top: 24pt; width: 100%;">
  <tr style="border: none;">
    <td style="border: none; width: 50%; text-align: center; font-weight: bold; font-size: 12pt;">ĐẠI DIỆN BÊN A</td>
    <td style="border: none; width: 50%; text-align: center; font-weight: bold; font-size: 12pt;">ĐẠI DIỆN BÊN B</td>
  </tr>
  <tr style="border: none;">
    <td style="border: none; text-align: center; font-style: italic; font-size: 10pt; height: 70pt; vertical-align: top;">(Ký, ghi rõ họ tên và đóng dấu)</td>
    <td style="border: none; text-align: center; font-style: italic; font-size: 10pt; height: 70pt; vertical-align: top;">(Ký, ghi rõ họ tên và đóng dấu)</td>
  </tr>
</table>`;

    const DEFAULT_PO_TEMPLATE = `<h1 style="text-align: center; font-size: 13pt;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
<p style="text-align: center; font-weight: bold; margin-bottom: 2pt;">Độc lập – Tự do – Hạnh phúc</p>
<p style="text-align: center; margin-top: 0; margin-bottom: 18pt;">---o.0.o---</p>

<h1 style="text-align: center; font-size: 14pt; margin-bottom: 3pt;">ĐƠN ĐẶT HÀNG</h1>
<p style="text-align: center; font-style: italic; margin-bottom: 12pt;">Số: {SO_PO}</p>
<p style="text-align: center; font-style: italic; margin-bottom: 18pt;">(căn cứ theo Hợp đồng số: {SO_HD} ngày {NGAY_KY})</p>

<p class="bold" style="margin-bottom: 8pt;">Kính gửi: {SELLER_NAME}</p>
<p>Tôi/Chúng tôi là: {BUYER_NAME} có nhu cầu đặt hàng tại quý công ty theo yêu cầu.</p>

<p style="margin-top: 12pt;">Nội dung đặt hàng như sau:</p>
{ITEMS_TABLE}

<p style="margin-top: 12pt;"><span class="bold">Địa điểm giao hàng:</span> Cây xăng dầu Vạn Xuân, Đường Phan Trọng Tuệ, Thanh Trì, Hà Nội</p>
<p><span class="bold">Phương thức thanh toán:</span><br>
<p>- Thanh toán bằng hình thức tiền mặt hoặc chuyển khoản</p>
<p>- Thời hạn thanh toán: theo điều khoản trong hợp đồng</p>

<p><span class="bold">Điều khoản chung:</span> Đơn đặt hàng này là một phần không thể tách rời của Hợp đồng số {SO_HD} và có giá trị kể từ ngày ký.</p>

<p style="text-align: right; font-style: italic; margin-top: 18pt;">Hà Nội, ngày {NGAY_KY}</p>

<table style="border: none; margin-top: 12pt; width: 100%;">
  <tr style="border: none;">
    <td style="border: none; width: 50%; text-align: center; font-weight: bold; font-size: 12pt;">Bên bán</td>
    <td style="border: none; width: 50%; text-align: center; font-weight: bold; font-size: 12pt;">Bên mua</td>
  </tr>
  <tr style="border: none;">
    <td style="border: none; text-align: center; font-style: italic; font-size: 10pt; height: 70pt; vertical-align: top;">(Ký, đóng dấu)</td>
    <td style="border: none; text-align: center; font-style: italic; font-size: 10pt; height: 70pt; vertical-align: top;">(Ký tên, đóng dấu)</td>
  </tr>
</table>`;

    const DEFAULT_CONTRACT_MB_TEMPLATE = `<h1 style="text-align: center; font-size: 13pt;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
<p style="text-align: center; font-weight: bold; margin-bottom: 2pt;">Độc lập – Tự do – Hạnh phúc</p>
<p style="text-align: center; margin-top: 0; margin-bottom: 18pt;">---o.0.o---</p>

<h1 style="text-align: center; font-size: 14pt; margin-bottom: 3pt;">HỢP ĐỒNG MUA BÁN HÀNG HÓA</h1>
<p style="text-align: center; font-style: italic; margin-bottom: 18pt;">Số: {SO_HD}</p>

<p>- Căn cứ Bộ luật Dân sự của Quốc Hội nước CHXHCN Việt Nam năm 2015;</p>
<p>- Căn cứ vào Luật Thương mại số 36/2005/QH 11 ngày 14/06/2005 của Quốc Hội nước Cộng hòa Xã hội Chủ Nghĩa Việt Nam;</p>
<p>- Căn cứ vào đơn chào hàng (đặt hàng hoặc sự thực hiện thỏa thuận của hai bên).</p>

<p style="margin-top: 12pt;">Hôm nay ngày {NGAY_KY}, tại Văn phòng {SELLER_NAME}</p>
<p>Chúng tôi gồm:</p>

<p class="bold" style="margin-top: 12pt; text-transform: uppercase;">Bên A: BÊN BÁN</p>
<p><span class="bold">Công ty:</span> {SELLER_NAME}</p>
<p><span class="bold">Địa chỉ trụ sở chính:</span> {SELLER_ADDR}</p>
<p><span class="bold">Địa chỉ văn phòng giao dịch:</span> {SELLER_OFFICE}</p>
<p><span class="bold">Điện thoại:</span> {SELLER_PHONE} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="bold">Mã số thuế:</span> {SELLER_TAX}</p>
<p><span class="bold">Số tài khoản:</span> {SELLER_BANK} - Ngân hàng: {SELLER_BANK_NAME}</p>
<p><span class="bold">Người đại diện:</span> {SELLER_REP} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="bold">Chức vụ:</span> {SELLER_POSITION}</p>

<p class="bold" style="margin-top: 12pt; text-transform: uppercase;">Bên B: BÊN MUA</p>
<p><span class="bold">Cá nhân/Công ty:</span> {BUYER_NAME}</p>
<p><span class="bold">Địa chỉ:</span> {BUYER_ADDR}</p>
<p><span class="bold">Điện thoại:</span> {BUYER_PHONE} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="bold">Mã số thuế:</span> {BUYER_TAX}</p>
<p><span class="bold">Người đại diện:</span> {BUYER_REP} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="bold">Chức vụ:</span> {BUYER_POSITION}</p>
<p><span class="bold">Email:</span> {BUYER_EMAIL}</p>

<p style="margin-top: 12pt;">Hai bên thống nhất thỏa thuận nội dung hợp đồng như sau:</p>

<h2>ĐIỀU I: NỘI DUNG CÔNG VIỆC GIAO DỊCH</h2>
<p>Bên A nhận cung cấp cho bên B một số lượng hàng hóa với các thông tin về hàng hóa như sau:</p>
<p>Nội dung đặt hàng như sau:</p>
{ITEMS_TABLE}

<h2>ĐIỀU II: CHẤT LƯỢNG HÀNG HÓA VÀ ĐỊA ĐIỂM GIAO HÀNG</h2>
<p>- Chất lượng hàng hóa : đảm bảo chất lượng theo yêu cầu của người mua</p>
<p>- Địa điểm giao hàng: Cây xăng dầu Vạn Xuân, Đường Phan Trọng Tuệ, Thanh Trì, Hà Nội</p>
<p>- Chi phí vận chuyển đến nơi giao hàng sẽ do bên B thanh toán.</p>

<h2>ĐIỀU III: PHƯƠNG THỨC THANH TOÁN</h2>
<p>- Thời hạn thanh toán của từng đơn hàng (trước, trong hoặc sau khi giao hàng) sẽ do hai bên thỏa thuận và điều chỉnh linh hoạt dựa trên điểm tín dụng và lịch sử thanh toán thực tế của khách hàng.</p>
<p>- Phương thức thanh toán: chuyển khoản hoặc tiền mặt.</p>
<p>- Chuyển khoản cho người hưởng lợi dưới đây:</p>
<p style="margin-left: 20pt; margin-bottom: 2pt;"><b>Công ty TNHH Xuất nhập khẩu và Thương mại EUREKA</b></p>
<p style="margin-left: 20pt; margin-bottom: 2pt;">Số tài khoản {SELLER_BANK} - Tại {SELLER_BANK_NAME}</p>
<p style="margin-left: 20pt; margin-bottom: 2pt;">Đại diện là ông: {SELLER_REP}</p>

<h2>ĐIỀU IV: QUYỀN VÀ TRÁCH NHIỆM CỦA CÁC BÊN TRONG VIỆC THỰC HIỆN HỢP ĐỒNG</h2>
<p class="bold">1. Quyền và trách nhiệm của bên A:</p>
<p>- Bên A có trách nhiệm giao hàng theo thỏa thuận về số lượng chất lượng đã thỏa thuận với người mua theo từng lần đặt hàng.</p>
<p>- Bên A nhận được thanh toán như trong điều kiện của hợp đồng và đơn đặt hàng từ bên B.</p>
<p>- Bên A có trách nhiệm giao hóa đơn tài chính cho bên B, đảm bảo đúng chất lượng của nhà sản xuất.</p>
<p>- Bên A đảm bảo số lượng, chất lượng hàng hóa theo thỏa thuận với bên B đáp ứng nhu cầu của khách hàng.</p>
<p>- Bên A đảm bảo lợi ích của bên B trong việc hợp tác, không bán cho các bên khác dưới giá đã thỏa thuận gây thiệt hại cho bên B.</p>
<p>- Đảm bảo quyền lợi của bên B trong việc tiến hành triển khai xây dựng thị trường cho sản phẩm mà hai bên đã hợp tác.</p>
<p class="bold">2. Quyền và trách nhiệm của bên B:</p>
<p>- Bên B nhận được đầy đủ hàng hóa, hóa đơn giao nhận từ bên A như thỏa thuận.</p>
<p>- Có trách nhiệm thanh toán cho bên A tiền hàng ngay khi hai bên đã ký biên bản giao nhận hàng hóa và cam kết nhận hàng khi bên A giao đến kho.</p>
<p>- Bên B có trách nhiệm với số lượng cam kết với bên A trong từng đơn đặt hàng.</p>

<h2>ĐIỀU V: ĐIỀU KHOẢN PHỤ VÀ PHẠT VI PHẠM HỢP ĐỒNG</h2>
<p>- Bên vi phạm hợp đồng phải chịu phạt và bồi thường thiệt hại trực tiếp cho bên kia do sự vi phạm hợp đồng gây ra.</p>
<p>- Nếu bên B thanh toán chậm hơn so với thời gian quy định trong hợp đồng thì Bên B phải trả cho bên A số tiền phạt bằng 0,05% tổng giá trị thanh toán chậm cho mỗi ngày chậm thanh toán tính thời điểm tính chậm thanh toán xác định theo ngày, tháng ký vào biên bản giao hàng.</p>
<p>Nếu quá hạn thanh toán 15 ngày, Bên A có quyền:</p>
<p>Tạm giữ các khoản tạm ứng bên B đã chuyển.</p>
<p>Tiến hành các biện pháp pháp lý để thu hồi công nợ.</p>
<p>Yêu cầu Bên B bồi thường các chi phí liên quan đến việc thu hồi nợ.</p>
<p>(Khoản phạt chỉ được xem là “phát sinh thực tế” khi Bên Bán đã phát hành Yêu cầu thanh toán bằng văn bản kèm Biên bản/Chứng từ xác định số tiền phạt.)</p>
<p>-Việc miễn, giảm hoặc không thu khoản phạt do bên bị thiệt hại quyết định. Quyết định này có hiệu lực khi bị thiệt hại gửi thông báo xác nhận bằng một trong những hình thức được pháp luật chấp nhận.</p>
<p>- Nếu một trong hai bên không thực hiện hoặc thực hiện không đầy đủ các điều khoản quy định trong hợp đồng mà gây thiệt hại cho bên kia, bên bị thiệt hại có quyền yêu cầu phía bên kia bồi hoàn các khoản thiệt hại theo quy định của pháp luật.</p>

<h2>ĐIỀU VI: THỦ TỤC GIẢI QUYẾT TRANH CHẤP HỢP ĐỒNG</h2>
<p>- Hai bên chủ động thông báo cho nhau tiến độ thực hiện đặt hàng. Nếu có vấn đề gì bất lợi phát sinh các bên phải kịp thời thông báo cho nhau biết và tích cực bàn bạc giải quyết (cần lập biên bản ghi toàn bộ nội dung).</p>
<p>- Mọi tranh chấp phát sinh trong quá trình thực hiện hợp đồng sẽ được hai bên ưu tiên giải quyết bằng thương lượng. Trường hợp các bên không tự giải quyết được mới đưa ra tòa án kinh tế Hà Nội để giải quyết và phán quyết của Tòa án là quyết định cuối cùng buộc hai bên phải thực hiện.</p>

<h2>ĐIỀU VII: HIỆU LỰC CỦA HỢP ĐỒNG</h2>
<p>Hợp đồng này có hiệu lực từ ngày {NGAY_KY} đến ngày .... tháng ... năm ....... Sau thời hạn này nếu không bên nào có khiếu nại nào , hợp đồng sẽ tự động được thanh lý.</p>
<p>Hợp đồng này được làm thành 02 bản, có giá trị như nhau. Mỗi bên giữ 01 bản.</p>

<table style="border: none; margin-top: 24pt; width: 100%;">
  <tr style="border: none;">
    <td style="border: none; width: 50%; text-align: center; font-weight: bold; font-size: 12pt;">ĐẠI DIỆN BÊN A</td>
    <td style="border: none; width: 50%; text-align: center; font-weight: bold; font-size: 12pt;">ĐẠI DIỆN BÊN B</td>
  </tr>
  <tr style="border: none;">
    <td style="border: none; text-align: center; font-style: italic; font-size: 10pt; height: 70pt; vertical-align: top;">(Ký, ghi rõ họ tên và đóng dấu)</td>
    <td style="border: none; text-align: center; font-style: italic; font-size: 10pt; height: 70pt; vertical-align: top;">(Ký, ghi rõ họ tên và đóng dấu)</td>
  </tr>
</table>`;

  const DEFAULT_APPENDIX_CONTRACT_TEMPLATE = `<h1 style="text-align: center; font-size: 13pt;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
<p style="text-align: center; font-weight: bold; margin-bottom: 2pt;">Độc lập – Tự do – Hạnh phúc</p>
<p style="text-align: center; margin-top: 0; margin-bottom: 18pt;">---o.0.o---</p>

<h1 style="text-align: center; font-size: 14pt; margin-bottom: 3pt;">PHỤ LỤC HỢP ĐỒNG MUA BÁN HÀNG HÓA</h1>
<p style="text-align: center; font-style: italic; margin-bottom: 18pt;">Số: {SO_HD}/PLĐC</p>

<p>- Căn cứ Bộ luật Dân sự của Quốc Hội nước CHXHCN Việt Nam năm 2015;</p>
<p>- Căn cứ Hợp đồng mua bán / Hợp đồng nguyên tắc số: {SO_HD} đã ký giữa hai bên;</p>
<p>- Căn cứ nhu cầu và sự thỏa thuận thống nhất thực tế giữa hai bên đối với trị giá xuất hóa đơn thực tế của lô hàng.</p>

<p style="margin-top: 12pt;">Hôm nay ngày {NGAY_KY}, chúng tôi gồm:</p>

<p style="margin-top: 12pt; text-transform: uppercase; font-weight: bold;">Bên A: BÊN BÁN</p>
<p><b>Công ty:</b> {SELLER_NAME}</p>
<p><b>Địa chỉ trụ sở chính:</b> {SELLER_ADDR}</p>
<p><b>Địa chỉ văn phòng giao dịch:</b> {SELLER_OFFICE}</p>
<p><b>Điện thoại:</b> {SELLER_PHONE} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Mã số thuế:</b> {SELLER_TAX}</p>
<p><b>Người đại diện:</b> {SELLER_REP} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Chức vụ:</b> {SELLER_POSITION}</p>

<p style="margin-top: 12pt; text-transform: uppercase; font-weight: bold;">Bên B: BÊN MUA</p>
<p><b>Cá nhân/Công ty:</b> {BUYER_NAME}</p>
<p><b>Địa chỉ:</b> {BUYER_ADDR}</p>
<p><b>Điện thoại:</b> {BUYER_PHONE} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Mã số thuế:</b> {BUYER_TAX}</p>
<p><b>Người đại diện:</b> {BUYER_REP} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Chức vụ:</b> {BUYER_POSITION}</p>

<p style="margin-top: 12pt;">Sau khi thảo luận, hai bên cùng thống nhất ký kết Phụ lục này để điều chỉnh danh mục hàng hóa và trị giá thanh toán thực tế của đơn hàng như sau:</p>

<h2>ĐIỀU 1: NỘI DUNG ĐIỀU CHỈNH CHI TIẾT HÀNG HÓA VÀ TRỊ GIÁ</h2>
<p>Hai bên đồng ý điều chỉnh danh sách mặt hàng, đơn giá, thuế giá trị gia tăng (VAT) và tổng giá trị xuất hóa đơn thanh toán của Hợp đồng số {SO_HD} theo bảng chi tiết dưới đây:</p>
{ITEMS_TABLE}

<h2>ĐIỀU 2: ĐIỀU KHOẢN HIỆU LỰC</h2>
<p>- Phụ lục này điều chỉnh trực tiếp trị giá xuất hóa đơn thực tế của Hợp đồng số {SO_HD}. Các nội dung khác không được đề cập trong Phụ lục này vẫn giữ nguyên hiệu lực theo Hợp đồng gốc.</p>
<p>- Phụ lục này được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản để thực hiện.</p>

<table style="border: none; margin-top: 24pt; width: 100%;">
  <tr style="border: none;">
    <td style="border: none; width: 50%; text-align: center; font-weight: bold; font-size: 12pt;">ĐẠI DIỆN BÊN A</td>
    <td style="border: none; width: 50%; text-align: center; font-weight: bold; font-size: 12pt;">ĐẠI DIỆN BÊN B</td>
  </tr>
  <tr style="border: none;">
    <td style="border: none; text-align: center; font-style: italic; font-size: 10pt; height: 70pt; vertical-align: top;">(Ký, ghi rõ họ tên và đóng dấu)</td>
    <td style="border: none; text-align: center; font-style: italic; font-size: 10pt; height: 70pt; vertical-align: top;">(Ký, ghi rõ họ tên và đóng dấu)</td>
  </tr>
</table>`;

  const DEFAULT_APPENDIX_PO_TEMPLATE = `<h1 style="text-align: center; font-size: 13pt;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
<p style="text-align: center; font-weight: bold; margin-bottom: 2pt;">Độc lập – Tự do – Hạnh phúc</p>
<p style="text-align: center; margin-top: 0; margin-bottom: 18pt;">---o.0.o---</p>

<h1 style="text-align: center; font-size: 14pt; margin-bottom: 3pt;">PHỤ LỤC ĐƠN ĐẶT HÀNG</h1>
<p style="text-align: center; font-style: italic; margin-bottom: 18pt;">Số: PLĐC-{SO_PO}</p>

<p>- Căn cứ Bộ luật Dân sự của Quốc Hội nước CHXHCN Việt Nam năm 2015;</p>
<p>- Căn cứ Đơn đặt hàng (PO) số: {SO_PO} đã thống nhất giữa hai bên;</p>
<p>- Căn cứ nhu cầu và sự thỏa thuận thống nhất thực tế giữa hai bên đối với trị giá xuất hóa đơn thực tế của lô hàng.</p>

<p style="margin-top: 12pt;">Hôm nay ngày {NGAY_KY}, chúng tôi gồm:</p>

<p style="margin-top: 12pt; text-transform: uppercase; font-weight: bold;">Bên A: BÊN BÁN</p>
<p><b>Công ty:</b> {SELLER_NAME}</p>
<p><b>Địa chỉ trụ sở chính:</b> {SELLER_ADDR}</p>
<p><b>Địa chỉ văn phòng giao dịch:</b> {SELLER_OFFICE}</p>
<p><b>Điện thoại:</b> {SELLER_PHONE} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Mã số thuế:</b> {SELLER_TAX}</p>
<p><b>Người đại diện:</b> {SELLER_REP} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Chức vụ:</b> {SELLER_POSITION}</p>

<p style="margin-top: 12pt; text-transform: uppercase; font-weight: bold;">Bên B: BÊN MUA</p>
<p><b>Cá nhân/Công ty:</b> {BUYER_NAME}</p>
<p><b>Địa chỉ:</b> {BUYER_ADDR}</p>
<p><b>Điện thoại:</b> {BUYER_PHONE} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Mã số thuế:</b> {BUYER_TAX}</p>
<p><b>Người đại diện:</b> {BUYER_REP} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Chức vụ:</b> {BUYER_POSITION}</p>

<p style="margin-top: 12pt;">Sau khi thảo luận, hai bên cùng thống nhất ký kết Phụ lục này để điều chỉnh danh mục hàng hóa và trị giá thanh toán thực tế của đơn hàng như sau:</p>

<h2>ĐIỀU 1: NỘI DUNG ĐIỀU CHỈNH CHI TIẾT HÀNG HÓA VÀ TRỊ GIÁ</h2>
<p>Hai bên đồng ý điều chỉnh danh sách mặt hàng, đơn giá, thuế giá trị gia tăng (VAT) và tổng giá trị xuất hóa đơn thanh toán của Đơn đặt hàng số {SO_PO} theo bảng chi tiết dưới đây:</p>
{ITEMS_TABLE}

<h2>ĐIỀU 2: ĐIỀU KHOẢN HIỆU LỰC</h2>
<p>- Phụ lục này điều chỉnh trực tiếp trị giá xuất hóa đơn thực tế của Đơn đặt hàng số {SO_PO}. Các nội dung khác không được đề cập trong Phụ lục này vẫn giữ nguyên hiệu lực theo Đơn đặt hàng gốc.</p>
<p>- Phụ lục này được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản để thực hiện.</p>

<table style="border: none; margin-top: 24pt; width: 100%;">
  <tr style="border: none;">
    <td style="border: none; width: 50%; text-align: center; font-weight: bold; font-size: 12pt;">ĐẠI DIỆN BÊN A</td>
    <td style="border: none; width: 50%; text-align: center; font-weight: bold; font-size: 12pt;">ĐẠI DIỆN BÊN B</td>
  </tr>
  <tr style="border: none;">
    <td style="border: none; text-align: center; font-style: italic; font-size: 10pt; height: 70pt; vertical-align: top;">(Ký, ghi rõ họ tên và đóng dấu)</td>
    <td style="border: none; text-align: center; font-style: italic; font-size: 10pt; height: 70pt; vertical-align: top;">(Ký, ghi rõ họ tên và đóng dấu)</td>
  </tr>
</table>`;

  function getSellerInfo() {
    try {
      const data = localStorage.getItem('eureka_contract_seller_info');
      if (!data) return DEFAULT_SELLER_INFO;
      const parsed = JSON.parse(data);
      return { ...DEFAULT_SELLER_INFO, ...parsed };
    } catch (e) {
      return DEFAULT_SELLER_INFO;
    }
  }

  async function saveSellerInfo(info) {
    localStorage.setItem('eureka_contract_seller_info', JSON.stringify(info));
    if (GOOGLE_SHEET_URL) {
      try {
        const res = await callSheetAPI({
          action: 'save_seller',
          seller: info
        });
        if (res && res.success) {
          showToast('Đã lưu thông tin Bên A và đồng bộ lên Google Sheet!', 'success');
        } else {
          const err = res ? (res.error || res.message) : 'Không kết nối được Google Sheet';
          showToast('Đã lưu nội bộ (Chưa đồng bộ Google Sheet: ' + err + ')', 'warning');
        }
        return res;
      } catch (e) {
        console.warn('[Seller] Lỗi đồng bộ Bên A lên Google Sheets:', e);
        showToast('Đã lưu nội bộ (Lỗi kết nối Google Sheet)', 'warning');
        return null;
      }
    } else {
      showToast('Đã lưu thông tin Bên A thành công!', 'success');
      return { success: true };
    }
  }

  // ── Contract Template: Get / Save (local + Sheets sync) ──

  function getContractNTTemplate() {
    return localStorage.getItem('eureka_contract_nt_template_v4') || DEFAULT_CONTRACT_NT_TEMPLATE;
  }
  function saveContractNTTemplate(tpl) {
    localStorage.setItem('eureka_contract_nt_template_v4', tpl);
  }

  function getPOTemplate() {
    return localStorage.getItem('eureka_po_template_v4') || DEFAULT_PO_TEMPLATE;
  }
  function savePOTemplate(tpl) {
    localStorage.setItem('eureka_po_template_v4', tpl);
  }

  function getContractMBTemplate() {
    return localStorage.getItem('eureka_contract_mb_template_v4') || DEFAULT_CONTRACT_MB_TEMPLATE;
  }
  function saveContractMBTemplate(tpl) {
    localStorage.setItem('eureka_contract_mb_template_v4', tpl);
  }

  function getAppendixContractTemplate() {
    return localStorage.getItem('eureka_appendix_contract_template_v4') || DEFAULT_APPENDIX_CONTRACT_TEMPLATE;
  }
  function saveAppendixContractTemplate(tpl) {
    localStorage.setItem('eureka_appendix_contract_template_v4', tpl);
  }

  function getAppendixPOTemplate() {
    return localStorage.getItem('eureka_appendix_po_template_v4') || DEFAULT_APPENDIX_PO_TEMPLATE;
  }
  function saveAppendixPOTemplate(tpl) {
    localStorage.setItem('eureka_appendix_po_template_v4', tpl);
  }

  // ── Sync templates TO Google Sheets ──
  async function syncTemplatesToSheet() {
    if (!GOOGLE_SHEET_URL) return;
    const templates = {
      contract_nt: getContractNTTemplate(),
      po:          getPOTemplate(),
      contract_mb: getContractMBTemplate(),
      appendix_contract: getAppendixContractTemplate(),
      appendix_po: getAppendixPOTemplate()
    };
    try {
      const res = await callSheetAPI({ action: 'save_templates', templates });
      if (res && res.success) {
        console.log('[Templates] Đã đồng bộ lên Google Sheets thành công');
      } else {
        console.warn('[Templates] Đồng bộ thất bại:', res);
      }
    } catch (e) {
      console.warn('[Templates] Lỗi khi đồng bộ lên Sheets:', e);
    }
  }

  // ── Load templates FROM Google Sheets → localStorage ──
  async function loadTemplatesFromSheet() {
    if (!GOOGLE_SHEET_URL) return;
    try {
      const res = await fetch(GOOGLE_SHEET_URL + '?action=get_templates');
      const json = await res.json();
      if (json && json.success && json.templates) {
        const t = json.templates;
        if (t.contract_nt)       { localStorage.setItem('eureka_contract_nt_template_v4',       t.contract_nt); }
        if (t.po)                { localStorage.setItem('eureka_po_template_v4',                t.po); }
        if (t.contract_mb)       { localStorage.setItem('eureka_contract_mb_template_v4',       t.contract_mb); }
        if (t.appendix_contract) { localStorage.setItem('eureka_appendix_contract_template_v4', t.appendix_contract); }
        if (t.appendix_po)       { localStorage.setItem('eureka_appendix_po_template_v4',       t.appendix_po); }
        console.log('[Templates] Đã tải mẫu biểu mới nhất từ Google Sheets');
      }
    } catch (e) {
      console.warn('[Templates] Không thể tải mẫu từ Sheets, dùng cache local:', e);
    }
  }


  function docSoTiengViet(number) {
    if (number === 0) return 'Không đồng';
    const units = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
    const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    
    function docBlock(n, showZero) {
      let s = '';
      const h = Math.floor(n / 100);
      const c = Math.floor((n % 100) / 10);
      const u = n % 10;
      
      if (h > 0 || showZero) {
        s += digits[h] + ' trăm ';
      }
      
      if (c > 0) {
        if (c === 1) s += 'mười ';
        else s += digits[c] + ' mươi ';
      } else if (u > 0 && (h > 0 || showZero)) {
        s += 'lẻ ';
      }
      
      if (u > 0) {
        if (u === 1 && c > 1) s += 'mốt ';
        else if (u === 5 && c > 0) s += 'lăm ';
        else s += digits[u] + ' ';
      }
      return s;
    }

    let str = '';
    let temp = Math.round(number);
    let blockIndex = 0;
    
    while (temp > 0) {
      const block = temp % 1000;
      if (block > 0) {
        const blockStr = docBlock(block, temp > 999);
        str = blockStr + units[blockIndex] + ' ' + str;
      }
      temp = Math.floor(temp / 1000);
      blockIndex++;
    }
    
    str = str.trim().replace(/\s+/g, ' ');
    if (str.length > 0) {
      str = str.charAt(0).toUpperCase() + str.slice(1) + ' đồng';
    }
    return str;
  }

  function generateItemsHTMLTable(items, type) {
    let html = `<table style="width:100%; border-collapse:collapse; margin:12pt 0; font-family:'Times New Roman', Times, serif; font-size:11pt; border: 1px solid black;">`;
    html += `<thead>
      <tr style="background-color:#f2f2f2;">
        <th style="border: 1px solid black; padding: 6px; text-align: center; font-weight: bold; width: 8%;">STT</th>
        <th style="border: 1px solid black; padding: 6px; text-align: left; font-weight: bold; width: 42%;">Tên mặt hàng</th>
        <th style="border: 1px solid black; padding: 6px; text-align: center; font-weight: bold; width: 10%;">ĐVT</th>
        <th style="border: 1px solid black; padding: 6px; text-align: center; font-weight: bold; width: 10%;">Số lượng</th>
        <th style="border: 1px solid black; padding: 6px; text-align: right; font-weight: bold; width: 15%;">Đơn giá (chưa VAT)</th>
        <th style="border: 1px solid black; padding: 6px; text-align: right; font-weight: bold; width: 15%;">Thành tiền (chưa VAT)</th>
      </tr>
    </thead>
    <tbody>`;
    
    let totalBeforeVAT = 0;
    let totalVAT = 0;
    let totalAfterVAT = 0;

    items.forEach((item, index) => {
      const qty = item.qty || 0;
      // Đơn giá xuất HĐ (chưa VAT) = ĐG HĐ (VND)
      const unitPriceNoVAT = item.unitInvoice || 0;
      const rowTotalNoVAT = qty * unitPriceNoVAT;

      // Phân bổ LCL vs FCL khác nhau
      let rowVAT = 0;
      let rowTotalWithVAT = 0;

      if (type === 'LCL') {
        rowVAT = item.c14 || 0; // Cột (14) VAT
        rowTotalWithVAT = item.c16 || 0; // Cột (16) Giá XHĐ
      } else {
        rowVAT = item.c13 || 0; // Cột (13) VAT
        rowTotalWithVAT = item.c15 || 0; // Cột (15) Giá XHĐ
      }

      totalBeforeVAT += rowTotalNoVAT;
      totalVAT += rowVAT;
      totalAfterVAT += rowTotalWithVAT;

      html += `<tr>
        <td style="border: 1px solid black; padding: 6px; text-align: center;">${index + 1}</td>
        <td style="border: 1px solid black; padding: 6px; text-align: left;">${item.name || 'Hàng hóa'}</td>
        <td style="border: 1px solid black; padding: 6px; text-align: center;">Cái</td>
        <td style="border: 1px solid black; padding: 6px; text-align: center;">${qty.toLocaleString('vi-VN')}</td>
        <td style="border: 1px solid black; padding: 6px; text-align: right;">${formatVND(unitPriceNoVAT)} ₫</td>
        <td style="border: 1px solid black; padding: 6px; text-align: right;">${formatVND(rowTotalNoVAT)} ₫</td>
      </tr>`;
    });

    html += `<tr>
      <td colspan="4" style="border: 1px solid black; padding: 6px; text-align: right; font-weight: bold;">Cộng tiền hàng (chưa bao gồm thuế GTGT):</td>
      <td colspan="2" style="border: 1px solid black; padding: 6px; text-align: right; font-weight: bold;">${formatVND(totalBeforeVAT)} ₫</td>
    </tr>`;

    html += `<tr>
      <td colspan="4" style="border: 1px solid black; padding: 6px; text-align: right; font-weight: bold;">Thuế giá trị gia tăng (VAT):</td>
      <td colspan="2" style="border: 1px solid black; padding: 6px; text-align: right; font-weight: bold;">${formatVND(totalVAT)} ₫</td>
    </tr>`;

    html += `<tr>
      <td colspan="4" style="border: 1px solid black; padding: 6px; text-align: right; font-weight: bold;">Tổng cộng tiền thanh toán (đã bao gồm thuế & cước phân bổ):</td>
      <td colspan="2" style="border: 1px solid black; padding: 6px; text-align: right; font-weight: bold; color: #d4572a; font-size: 11.5pt;">${formatVND(totalAfterVAT)} ₫</td>
    </tr>`;

    html += `<tr>
      <td colspan="6" style="border: 1px solid black; padding: 6px; text-align: left; font-style: italic; font-weight: bold;">Số tiền viết bằng chữ: ${docSoTiengViet(totalAfterVAT)}</td>
    </tr>`;

    html += `</tbody></table>`;
    return html;
  }

  function exportContractOrPO(docType, config) {
    const seller = getSellerInfo();
    let template = '';
    let title = '';
    let filename = '';

    if (docType === 'contract_nt') {
      template = getContractNTTemplate();
      title = 'Hợp đồng nguyên tắc';
      filename = `Hop_Dong_Nguyen_Tac_${config.contractNo || 'ERK'}.docx`;
    } else if (docType === 'po') {
      template = getPOTemplate();
      title = 'Đơn đặt hàng';
      filename = `Don_Dat_Hang_${config.poNo || 'ERK'}.docx`;
    } else if (docType === 'contract_mb') {
      template = getContractMBTemplate();
      title = 'Hợp đồng mua bán';
      filename = `Hop_Dong_Mua_Ban_${config.contractNo || 'ERK'}.docx`;
    } else if (docType === 'appendix_contract') {
      template = getAppendixContractTemplate();
      title = 'Phụ lục hợp đồng';
      filename = `Phu_Luc_Hop_Dong_${config.contractNo || 'ERK'}.docx`;
    } else if (docType === 'appendix_po') {
      template = getAppendixPOTemplate();
      title = 'Phụ lục đơn hàng';
      filename = `Phu_Luc_Don_Dat_Hang_${config.poNo || 'ERK'}.docx`;
    }

    let dateStr = config.date || '';
    if (!dateStr) {
      const now = new Date();
      dateStr = `ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}`;
    }

    const tableHTML = generateItemsHTMLTable(config.items, config.type);
    const rateUSDStr = formatVND(config.exchangeRate || 25900) + ' ₫';
    const rateRMBStr = formatVND(config.exchangeRateRMB || 3600) + ' ₫';

    const replacements = {
      '{SO_HD}': config.contractNo || '______',
      '{SO_PO}': config.poNo || '______',
      '{NGAY_KY}': dateStr,
      '{SELLER_NAME}': seller.name || '',
      '{SELLER_ADDR}': seller.address || '',
      '{SELLER_OFFICE}': seller.office || '',
      '{SELLER_PHONE}': seller.phone || '',
      '{SELLER_TAX}': seller.taxCode || '',
      '{SELLER_REP}': seller.representative || '',
      '{SELLER_POSITION}': seller.position || '',
      '{SELLER_BANK}': seller.bankAccount || '',
      '{SELLER_BANK_NAME}': seller.bankName || '',
      '{BUYER_NAME}': config.buyerName || '',
      '{BUYER_ADDR}': config.buyerAddr || '',
      '{BUYER_TAX}': config.buyerTax || '',
      '{BUYER_REP}': config.buyerRep || '',
      '{BUYER_POSITION}': config.buyerPosition || '',
      '{BUYER_PHONE}': config.buyerPhone || '',
      '{BUYER_EMAIL}': config.buyerEmail || '',
      '{ITEMS_TABLE}': tableHTML,
      '{TOTAL_AMOUNT_VND}': formatVND(config.totalAmount),
      '{TOTAL_AMOUNT_WORDS_VND}': docSoTiengViet(config.totalAmount),
      '{EXCHANGE_RATE_USD}': rateUSDStr,
      '{EXCHANGE_RATE_RMB}': rateRMBStr
    };

    let content = template;
    Object.keys(replacements).forEach(key => {
      content = content.split(key).join(replacements[key]);
    });

    // HTML wrapper với CSS chuẩn cho .docx
    const docHTML = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>${title}</title>
<style>
  body {
    font-family: "Times New Roman", Times, serif;
    font-size: 12pt;
    line-height: 1.5;
    color: #000;
    margin: 0;
    padding: 0;
  }
  h1 {
    text-align: center;
    font-size: 13pt;
    font-weight: bold;
    text-transform: uppercase;
    margin: 0 0 6pt 0;
    line-height: 1.5;
  }
  h2 {
    font-size: 12pt;
    font-weight: bold;
    text-transform: uppercase;
    margin: 12pt 0 6pt 0;
    line-height: 1.5;
  }
  p {
    margin: 0 0 6pt 0;
    text-align: justify;
    line-height: 1.5;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 11pt;
  }
  th, td {
    border: 1px solid #000;
    padding: 4pt 6pt;
    text-align: left;
    vertical-align: top;
  }
  th {
    background-color: #f2f2f2;
    font-weight: bold;
    text-align: center;
  }
  .bold { font-weight: bold; }
  .italic { font-style: italic; }
  .center { text-align: center; }
  .right { text-align: right; }
</style>
</head>
<body>
${content}
</body>
</html>`;

    try {
      // Dùng html-docx-js để tạo file .docx thật (OOXML)
      if (typeof htmlDocx !== 'undefined' && htmlDocx.asBlob) {
        const blob = htmlDocx.asBlob(docHTML, {
          orientation: 'portrait',
          margins: { top: 1440, right: 1134, bottom: 1440, left: 1701 } // A4: lề chuẩn (twips: 2.54cm top/bot, 2cm right, 3cm left)
        });
        triggerMobileDownload(blob, filename);
        showToast(`Đã tải xuống file ${title} (.docx)!`, 'success');
      } else {
        // Fallback nếu thư viện chưa load: vẫn dùng Blob nhưng báo lỗi nhỏ
        showToast('Đang tải thư viện, vui lòng thử lại sau 2 giây...', 'warning');
        setTimeout(() => {
          if (typeof htmlDocx !== 'undefined' && htmlDocx.asBlob) {
            const blob = htmlDocx.asBlob(docHTML, { orientation: 'portrait' });
            triggerMobileDownload(blob, filename);
            showToast(`Đã tải xuống file ${title} (.docx)!`, 'success');
          } else {
            // Fallback cuối: xuất HTML-in-doc (cũ) nếu thư viện thực sự lỗi
            const blob = new Blob(['\ufeff' + docHTML], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            triggerMobileDownload(blob, filename);
            showToast(`Đã tải xuống ${title}!`, 'success');
          }
        }, 2000);
      }
    } catch(err) {
      console.error('Lỗi xuất docx:', err);
      showToast(`Lỗi xuất file: ${err.message}`, 'error');
    }
  }


  // Helper to generate initials from company name for suggestion
  function getBuyerInitials(name) {
    if (!name) return 'KH';
    // Remove accents and normalize
    var str = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // Replace non-alphanumeric with spaces
    str = str.replace(/[^a-z0-9\s]/g, ' ');
    // Split into words
    var words = str.split(/\s+/);
    // Ignore common vietnamese company words
    var ignoreList = ['tnhh', 'cong', 'ty', 'cp', 'co', 'phan', 'dich', 'vu', 'thuong', 'mai', 'xnk', 'vietnam', 'viet', 'nam', 'ld', 'mt', 'hop', 'tac', 'xa', 'private', 'ltd', 'jsc', 'group', 'mot', 'thanh', 'vien', 'mtv'];
    var filtered = [];
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (w && ignoreList.indexOf(w) === -1) {
        filtered.push(w);
      }
    }
    
    if (filtered.length === 0) {
      var fallback = [];
      for (var i = 0; i < words.length; i++) {
        if (words[i]) fallback.push(words[i]);
      }
      if (fallback.length === 0) return 'KH';
      var fallbackInitials = '';
      for (var i = 0; i < fallback.length; i++) {
        fallbackInitials += fallback[i].charAt(0).toUpperCase();
      }
      return fallbackInitials.substring(0, 4);
    }
    
    var initials = '';
    for (var i = 0; i < filtered.length; i++) {
      initials += filtered[i].charAt(0).toUpperCase();
    }
    return initials.substring(0, 4);
  }

  function updateContractSuggestions() {
    const buyerName = document.getElementById('contract-buyer-name').value.trim();
    const initials = getBuyerInitials(buyerName);
    const now = new Date();
    const d = now.getDate().toString().padStart(2, '0');
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    const y = now.getFullYear().toString().slice(-2);
    const ddmmyy = `${d}${m}${y}`;
    
    const suggestedHD = `ERK/${initials}-${ddmmyy}`;
    const suggestedPO = `01-ERK/${initials}-${ddmmyy}`;
    
    const contractNoInput = document.getElementById('contract-no');
    const contractPoNoInput = document.getElementById('contract-po-no');
    
    if (contractNoInput) {
      contractNoInput.placeholder = `VD: ${suggestedHD}`;
      if (!contractNoInput.value || (/^\d{8}-\d{3}$/.test(contractNoInput.value)) || contractNoInput.value.length < 15 || contractNoInput.value.includes('-')) {
        contractNoInput.value = suggestedHD;
      }
    }
    if (contractPoNoInput) {
      contractPoNoInput.placeholder = `VD: ${suggestedPO}`;
      if (!contractPoNoInput.value || (/^\d{8}-\d{3}$/.test(contractPoNoInput.value)) || contractPoNoInput.value.length < 15 || contractPoNoInput.value.includes('-')) {
        contractPoNoInput.value = suggestedPO;
      }
    }
  }

  function openContractConfigModal(type) {
    if (!activeCalculationContext || activeCalculationContext.type !== type) {
      showToast('Vui lòng bấm "Tính toán phân bổ" trước khi tạo hợp đồng', 'error');
      return;
    }

    const modal = document.getElementById('contract-config-modal');
    if (!modal) return;

    document.getElementById('contract-context-type').value = type;
    
    const now = new Date();
    document.getElementById('contract-date').value = `ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}`;

    // Load buyer dropdown list
    renderBuyerDropdown();

    const lastBuyerInfo = localStorage.getItem('eureka_last_buyer_info');
    if (lastBuyerInfo) {
      try {
        const buyer = JSON.parse(lastBuyerInfo);
        document.getElementById('contract-buyer-name').value = buyer.name || '';
        document.getElementById('contract-buyer-addr').value = buyer.address || '';
        document.getElementById('contract-buyer-tax').value = buyer.taxCode || '';
        document.getElementById('contract-buyer-phone').value = buyer.phone || '';
        document.getElementById('contract-buyer-email').value = buyer.email || '';
        document.getElementById('contract-buyer-rep').value = buyer.representative || '';
        document.getElementById('contract-buyer-position').value = buyer.position || '';
      } catch(e) {}
    } else {
      document.getElementById('contract-buyer-name').value = '';
      document.getElementById('contract-buyer-addr').value = '';
      document.getElementById('contract-buyer-tax').value = '';
      document.getElementById('contract-buyer-phone').value = '';
      document.getElementById('contract-buyer-email').value = '';
      document.getElementById('contract-buyer-rep').value = '';
      document.getElementById('contract-buyer-position').value = '';
    }

    // Reset values to generate new suggestion according to the buyer name
    document.getElementById('contract-no').value = '';
    document.getElementById('contract-po-no').value = '';
    updateContractSuggestions();

    modal.style.display = 'flex';
  }

  function triggerDocumentDownload(docType) {
    const type = document.getElementById('contract-context-type').value;
    if (!activeCalculationContext || activeCalculationContext.type !== type) {
      showToast('Đã xảy ra lỗi ngữ cảnh tính toán, vui lòng thực hiện lại', 'error');
      return;
    }

    const buyerName = document.getElementById('contract-buyer-name').value.trim();
    const buyerAddr = document.getElementById('contract-buyer-addr').value.trim();
    const buyerTax = document.getElementById('contract-buyer-tax').value.trim();
    const buyerPhone = document.getElementById('contract-buyer-phone').value.trim();
    const buyerEmail = document.getElementById('contract-buyer-email').value.trim();
    const buyerRep = document.getElementById('contract-buyer-rep').value.trim();
    const buyerPosition = document.getElementById('contract-buyer-position').value.trim();

    if (!buyerName || !buyerAddr) {
      showToast('Vui lòng điền tên và địa chỉ Bên Mua', 'warning');
      return;
    }

    const buyerInfo = {
      name: buyerName,
      address: buyerAddr,
      taxCode: buyerTax,
      phone: buyerPhone,
      email: buyerEmail,
      representative: buyerRep,
      position: buyerPosition,
      createdBy: getCurrentUsername() || 'system'
    };
    localStorage.setItem('eureka_last_buyer_info', JSON.stringify(buyerInfo));
    
    // Save to local cache list and push to Google Sheets
    saveBuyerLocally(buyerInfo);
    callSheetAPI({
      action: 'save_buyer',
      buyer: buyerInfo
    }).then(res => {
      if (res && res.success) {
        console.log(`[Buyer] Đã đồng bộ khách hàng "${buyerInfo.name}" lên Google Sheet`);
      } else {
        console.warn(`[Buyer] Chưa thể đồng bộ khách hàng lên Google Sheet:`, res?.error || res?.message);
      }
    });

    const config = {
      type: activeCalculationContext.type,
      items: activeCalculationContext.items,
      exchangeRate: activeCalculationContext.exchangeRate,
      exchangeRateRMB: activeCalculationContext.exchangeRateRMB,
      totalAmount: activeCalculationContext.totalAmount,
      contractNo: document.getElementById('contract-no').value.trim(),
      poNo: document.getElementById('contract-po-no').value.trim(),
      date: document.getElementById('contract-date').value.trim(),
      buyerName,
      buyerAddr,
      buyerTax,
      buyerPhone,
      buyerEmail,
      buyerRep,
      buyerPosition
    };

    exportContractOrPO(docType, config);
  }

  function initContractModule() {
    const seller = getSellerInfo();
    document.getElementById('cfg-seller-name').value = seller.name || '';
    document.getElementById('cfg-seller-addr').value = seller.address || '';
    document.getElementById('cfg-seller-office').value = seller.office || '';
    document.getElementById('cfg-seller-phone').value = seller.phone || '';
    document.getElementById('cfg-seller-tax').value = seller.taxCode || '';
    document.getElementById('cfg-seller-rep').value = seller.representative || '';
    document.getElementById('cfg-seller-position').value = seller.position || '';
    document.getElementById('cfg-seller-bank').value = seller.bankAccount || '';
    document.getElementById('cfg-seller-bank-name').value = seller.bankName || '';

    if (!localStorage.getItem('eureka_contract_nt_template_v4')) {
      localStorage.setItem('eureka_contract_nt_template_v4', DEFAULT_CONTRACT_NT_TEMPLATE);
    }
    if (!localStorage.getItem('eureka_po_template_v4')) {
      localStorage.setItem('eureka_po_template_v4', DEFAULT_PO_TEMPLATE);
    }
    const currentStoredMB = localStorage.getItem('eureka_contract_mb_template_v4');
    if (currentStoredMB && (currentStoredMB.includes('HỢP ĐỒNG NGUYÊN TẮC MUA BÁN HÀNG HÓA') || currentStoredMB.includes('Công ty TNHH Xuất nhập khẩu và Thương mại EUREKA'))) {
      localStorage.setItem('eureka_contract_mb_template_v4', DEFAULT_CONTRACT_MB_TEMPLATE);
    }
    if (!localStorage.getItem('eureka_contract_mb_template_v4')) {
      localStorage.setItem('eureka_contract_mb_template_v4', DEFAULT_CONTRACT_MB_TEMPLATE);
    }
    if (!localStorage.getItem('eureka_appendix_contract_template_v4')) {
      localStorage.setItem('eureka_appendix_contract_template_v4', DEFAULT_APPENDIX_CONTRACT_TEMPLATE);
    }
    if (!localStorage.getItem('eureka_appendix_po_template_v4')) {
      localStorage.setItem('eureka_appendix_po_template_v4', DEFAULT_APPENDIX_PO_TEMPLATE);
    }

    document.getElementById('cfg-contract-nt-template').value = getContractNTTemplate();
    document.getElementById('cfg-po-template').value = getPOTemplate();
    document.getElementById('cfg-contract-mb-template').value = getContractMBTemplate();
        document.getElementById('cfg-appendix-contract-template').value = getAppendixContractTemplate();
    document.getElementById('cfg-appendix-po-template').value = getAppendixPOTemplate();

    const sellerForm = document.getElementById('seller-info-form');
    if (sellerForm) {
      sellerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const info = {
          name: document.getElementById('cfg-seller-name').value.trim(),
          address: document.getElementById('cfg-seller-addr').value.trim(),
          office: document.getElementById('cfg-seller-office').value.trim(),
          phone: document.getElementById('cfg-seller-phone').value.trim(),
          taxCode: document.getElementById('cfg-seller-tax').value.trim(),
          representative: document.getElementById('cfg-seller-rep').value.trim(),
          position: document.getElementById('cfg-seller-position').value.trim(),
          bankAccount: document.getElementById('cfg-seller-bank').value.trim(),
          bankName: document.getElementById('cfg-seller-bank-name').value.trim()
        };
        await saveSellerInfo(info);
      });
    }

    const btnSaveTemplates = document.getElementById('btn-save-templates');
    if (btnSaveTemplates) {
      btnSaveTemplates.addEventListener('click', async () => {
        const contractNtTpl = document.getElementById('cfg-contract-nt-template').value;
        const poTpl = document.getElementById('cfg-po-template').value;
        const contractMbTpl = document.getElementById('cfg-contract-mb-template').value;
        const appendixContractTpl = document.getElementById('cfg-appendix-contract-template').value;
        const appendixPoTpl = document.getElementById('cfg-appendix-po-template').value;
        saveContractNTTemplate(contractNtTpl);
        savePOTemplate(poTpl);
        saveContractMBTemplate(contractMbTpl);
        saveAppendixContractTemplate(appendixContractTpl);
        saveAppendixPOTemplate(appendixPoTpl);
        showToast('Đang lưu và đồng bộ lên Google Sheets...', 'info');
        await syncTemplatesToSheet();
        showToast('Đã lưu mẫu HĐ/PO và đồng bộ lên Google Sheets thành công!', 'success');
      });
    }

    const btnResetContractNT = document.getElementById('btn-reset-contract-nt-tpl');
    if (btnResetContractNT) {
      btnResetContractNT.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn khôi phục mẫu hợp đồng nguyên tắc gốc?')) {
          document.getElementById('cfg-contract-nt-template').value = DEFAULT_CONTRACT_NT_TEMPLATE;
          saveContractNTTemplate(DEFAULT_CONTRACT_NT_TEMPLATE);
          showToast('Đã khôi phục mẫu HĐ nguyên tắc gốc!', 'success');
        }
      });
    }

    const btnResetPO = document.getElementById('btn-reset-po-tpl');
    if (btnResetPO) {
      btnResetPO.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn khôi phục mẫu đơn đặt hàng PO gốc?')) {
          document.getElementById('cfg-po-template').value = DEFAULT_PO_TEMPLATE;
          savePOTemplate(DEFAULT_PO_TEMPLATE);
          showToast('Đã khôi phục mẫu PO gốc!', 'success');
        }
      });
    }

    const btnResetContractMB = document.getElementById('btn-reset-contract-mb-tpl');
    if (btnResetContractMB) {
      btnResetContractMB.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn khôi phục mẫu hợp đồng mua bán hàng hóa gốc?')) {
          document.getElementById('cfg-contract-mb-template').value = DEFAULT_CONTRACT_MB_TEMPLATE;
          saveContractMBTemplate(DEFAULT_CONTRACT_MB_TEMPLATE);
          showToast('Đã khôi phục mẫu HĐ mua bán gốc!', 'success');
        }
      });
    }

    const btnResetAppendixContract = document.getElementById('btn-reset-appendix-contract-tpl');
    if (btnResetAppendixContract) {
      btnResetAppendixContract.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn khôi phục mẫu phụ lục hợp đồng gốc?')) {
          document.getElementById('cfg-appendix-contract-template').value = DEFAULT_APPENDIX_CONTRACT_TEMPLATE;
          saveAppendixContractTemplate(DEFAULT_APPENDIX_CONTRACT_TEMPLATE);
          showToast('Đã khôi phục mẫu phụ lục hợp đồng gốc!', 'success');
        }
      });
    }

    const btnResetAppendixPO = document.getElementById('btn-reset-appendix-po-tpl');
    if (btnResetAppendixPO) {
      btnResetAppendixPO.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn khôi phục mẫu phụ lục đơn đặt hàng gốc?')) {
          document.getElementById('cfg-appendix-po-template').value = DEFAULT_APPENDIX_PO_TEMPLATE;
          saveAppendixPOTemplate(DEFAULT_APPENDIX_PO_TEMPLATE);
          showToast('Đã khôi phục mẫu phụ lục đơn hàng gốc!', 'success');
        }
      });
    }

    const modal = document.getElementById('contract-config-modal');
    const closeBtn = document.getElementById('contract-modal-close-btn');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
      });
    }

    const lclContractBtn = document.getElementById('lcl-contract-btn');
    if (lclContractBtn) {
      lclContractBtn.addEventListener('click', () => {
        openContractConfigModal('LCL');
      });
    }

    const fclContractBtn = document.getElementById('fcl-contract-btn');
    if (fclContractBtn) {
      fclContractBtn.addEventListener('click', () => {
        openContractConfigModal('FCL');
      });
    }

    const btnDownloadContractNT = document.getElementById('btn-download-word-contract-nt');
    if (btnDownloadContractNT) {
      btnDownloadContractNT.addEventListener('click', () => {
        triggerDocumentDownload('contract_nt');
      });
    }

    // Buyer select dropdown change listener
    const buyerSelect = document.getElementById('contract-buyer-select');
    if (buyerSelect) {
      buyerSelect.addEventListener('change', (e) => {
        const selectedName = e.target.value;
        if (selectedName) {
          const buyers = getBuyers();
          const buyer = buyers.find(b => b.name === selectedName);
          if (buyer) {
            document.getElementById('contract-buyer-name').value = buyer.name || '';
            document.getElementById('contract-buyer-addr').value = buyer.address || '';
            document.getElementById('contract-buyer-tax').value = buyer.taxCode || '';
            document.getElementById('contract-buyer-phone').value = buyer.phone || '';
            document.getElementById('contract-buyer-email').value = buyer.email || '';
            document.getElementById('contract-buyer-rep').value = buyer.representative || '';
            document.getElementById('contract-buyer-position').value = buyer.position || '';
            
            // Tự động gợi ý Số hợp đồng & Số PO
            if (typeof updateContractSuggestions === 'function') {
              updateContractSuggestions();
            }
          }
        }
      });
    }

    // Tự động gợi ý Số hợp đồng/PO khi gõ trực tiếp tên khách hàng
    const buyerNameInput = document.getElementById('contract-buyer-name');
    if (buyerNameInput) {
      buyerNameInput.addEventListener('input', () => {
        if (typeof updateContractSuggestions === 'function') {
          updateContractSuggestions();
        }
      });
    }

    // Clear buyer form listener (Nhập mới button)
    const btnClearBuyer = document.getElementById('btn-clear-buyer-form');
    if (btnClearBuyer) {
      btnClearBuyer.addEventListener('click', () => {
        if (buyerSelect) buyerSelect.value = '';
        document.getElementById('contract-buyer-name').value = '';
        document.getElementById('contract-buyer-addr').value = '';
        document.getElementById('contract-buyer-tax').value = '';
        document.getElementById('contract-buyer-phone').value = '';
        document.getElementById('contract-buyer-email').value = '';
        document.getElementById('contract-buyer-rep').value = '';
        document.getElementById('contract-buyer-position').value = '';
        
        // Reset gợi ý số hợp đồng & PO
        if (typeof updateContractSuggestions === 'function') {
          updateContractSuggestions();
        }
        showToast('Form sẵn sàng để nhập khách hàng mới!', 'success');
      });
    }

    // --- ADMIN BUYERS DIRECTORY FORM ACTIONS ---
    const adminBuyerForm = document.getElementById('admin-buyer-form');
    if (adminBuyerForm) {
      adminBuyerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const oldName = document.getElementById('admin-buyer-old-name').value;
        const name = document.getElementById('admin-buyer-name').value.trim();
        const address = document.getElementById('admin-buyer-addr').value.trim();
        const taxCode = document.getElementById('admin-buyer-tax').value.trim();
        const phone = document.getElementById('admin-buyer-phone').value.trim();
        const email = document.getElementById('admin-buyer-email').value.trim();
        const representative = document.getElementById('admin-buyer-rep').value.trim();
        const position = document.getElementById('admin-buyer-position').value.trim();

        if (!name || !address) {
          showToast('Vui lòng điền tên và địa chỉ khách hàng!', 'error');
          return;
        }

        const buyer = {
          name: name,
          address: address,
          taxCode: taxCode,
          phone: phone,
          email: email,
          representative: representative,
          position: position,
          createdBy: getCurrentUsername() || 'system'
        };

        // If editing and changed name, delete the old name on Google Sheets first
        if (oldName && oldName.toLowerCase() !== name.toLowerCase()) {
          let allBuyers = getBuyers().filter(x => x.name.toLowerCase() !== oldName.toLowerCase());
          localStorage.setItem('eureka_buyers', JSON.stringify(allBuyers));
          
          callSheetAPI({
            action: 'delete_buyer',
            name: oldName
          });
        }

        // Save locally
        saveBuyerLocally(buyer);
        
        // Sync to Sheets
        callSheetAPI({
          action: 'save_buyer',
          buyer: buyer
        }).then(res => {
          if (res && res.success) {
            showToast(`Đã lưu khách hàng "${buyer.name}" và đồng bộ lên Google Sheet!`, 'success');
          } else {
            const err = res ? (res.error || res.message) : 'Không có phản hồi từ máy chủ';
            showToast(`Đã lưu nội bộ (Chưa đồng bộ Google Sheet: ${err})`, 'warning');
          }
        });

        // Reset form
        adminBuyerForm.reset();
        document.getElementById('admin-buyer-old-name').value = '';
        document.getElementById('buyer-form-title').textContent = 'Thêm Khách Hàng Mới';
        document.getElementById('btn-cancel-admin-buyer').style.display = 'none';

        // Re-render
        renderAdminBuyersList();
        renderBuyerDropdown();
      });
    }

    const btnCancelAdminBuyer = document.getElementById('btn-cancel-admin-buyer');
    if (btnCancelAdminBuyer) {
      btnCancelAdminBuyer.addEventListener('click', () => {
        if (adminBuyerForm) adminBuyerForm.reset();
        document.getElementById('admin-buyer-old-name').value = '';
        document.getElementById('buyer-form-title').textContent = 'Thêm Khách Hàng Mới';
        btnCancelAdminBuyer.style.display = 'none';
      });
    }

    // --- DIRECT MODAL SAVE BUYER BUTTON ACTION ---
    const btnModalSaveBuyer = document.getElementById('btn-modal-save-buyer');
    if (btnModalSaveBuyer) {
      btnModalSaveBuyer.addEventListener('click', () => {
        const name = document.getElementById('contract-buyer-name').value.trim();
        const address = document.getElementById('contract-buyer-addr').value.trim();
        const taxCode = document.getElementById('contract-buyer-tax').value.trim();
        const phone = document.getElementById('contract-buyer-phone').value.trim();
        const email = document.getElementById('contract-buyer-email').value.trim();
        const representative = document.getElementById('contract-buyer-rep').value.trim();
        const position = document.getElementById('contract-buyer-position').value.trim();

        if (!name || !address) {
          showToast('Vui lòng nhập tên và địa chỉ khách hàng trước khi lưu!', 'error');
          return;
        }

        const buyer = {
          name: name,
          address: address,
          taxCode: taxCode,
          phone: phone,
          email: email,
          representative: representative,
          position: position,
          createdBy: getCurrentUsername() || 'system'
        };

        // Save locally
        saveBuyerLocally(buyer);
        
        // Sync to Sheets
        callSheetAPI({
          action: 'save_buyer',
          buyer: buyer
        }).then(res => {
          if (res && res.success) {
            showToast(`Lưu khách hàng "${buyer.name}" vào danh bạ và đồng bộ Google Sheet thành công!`, 'success');
          } else {
            const err = res ? (res.error || res.message) : 'Không có phản hồi từ máy chủ';
            showToast(`Lưu nội bộ thành công (Chưa đồng bộ Google Sheet: ${err})`, 'warning');
          }
        });

        // Re-render dropdown and select the newly saved buyer
        renderBuyerDropdown();
        const select = document.getElementById('contract-buyer-select');
        if (select) select.value = name;
        
        // Render admin list if visible
        renderAdminBuyersList();
      });
    }

    const btnDownloadPO = document.getElementById('btn-download-word-po');
    if (btnDownloadPO) {
      btnDownloadPO.addEventListener('click', () => {
        triggerDocumentDownload('po');
      });
    }

    const btnDownloadContractMB = document.getElementById('btn-download-word-contract-mb');
    if (btnDownloadContractMB) {
      btnDownloadContractMB.addEventListener('click', () => {
        triggerDocumentDownload('contract_mb');
      });
    }

    const btnDownloadAppendixContract = document.getElementById('btn-download-word-appendix-contract');
    if (btnDownloadAppendixContract) {
      btnDownloadAppendixContract.addEventListener('click', () => {
        triggerDocumentDownload('appendix_contract');
      });
    }

    const btnDownloadAppendixPO = document.getElementById('btn-download-word-appendix-po');
    if (btnDownloadAppendixPO) {
      btnDownloadAppendixPO.addEventListener('click', () => {
        triggerDocumentDownload('appendix_po');
      });
    }
  }

  // ── Init ──
  function init() {
    initTabs();
    initItemManagement();
    initOverrideToggles();
    initVoiceAssistant();
    initContractModule();

    // Attach auto-format to all money inputs
    document.querySelectorAll('input[inputmode="numeric"]').forEach(input => {
      input.addEventListener('blur', () => autoFormatInput(input));
    });

    // Attach format to initial item rows
    document.querySelectorAll('#lcl-items-body tr, #fcl-items-body tr').forEach(row => {
      attachInputFormatters(row);
    });

    // ── LCL Field Events for Live-calculation ──
    const lclAutoFields = [
      'lcl-duong-vc', 'lcl-kho-tq', 'lcl-kho-vn', 'lcl-vip',
      'lcl-so-khoi', 'lcl-so-kg', 'lcl-chiet-khau', 'lcl-phi-khac-tq',
      'exchange-rate', 'exchange-rate-rmb',
      'lcl-cuoc-vc-currency', 'lcl-phi-ut-currency', 'lcl-phi-rr-currency',
      'lcl-phi-khac-tq-currency', 'lcl-phi-vc-tq-currency',
      'lcl-chiet-khau-currency', 'lcl-phi-khac-vn-currency'
    ];
    lclAutoFields.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', autoUpdateLCLFields);
        el.addEventListener('change', autoUpdateLCLFields);
      }
    });

    // Monitor item values and currency changes (affects risk fee)
    const lclTbody = document.getElementById('lcl-items-body');
    if (lclTbody) {
      lclTbody.addEventListener('input', (e) => {
        const field = e.target.getAttribute('data-field');
        if (field === 'value' || field === 'currency') {
          autoUpdateLCLFields();
        }
      });
      lclTbody.addEventListener('change', (e) => {
        const field = e.target.getAttribute('data-field');
        if (field === 'currency') {
          autoUpdateLCLFields();
        }
      });
    }

    // FCL Field Events for Live-updating conversion notes
    const fclAutoFields = [
      'fcl-phi-nd-tq', 'fcl-phi-nd-vn', 'fcl-phi-ut', 'fcl-phi-qt', 'fcl-phi-vc-vn',
      'fcl-phi-nd-tq-currency', 'fcl-phi-nd-vn-currency', 'fcl-phi-ut-currency',
      'fcl-phi-qt-currency', 'fcl-phi-vc-vn-currency',
      'exchange-rate', 'exchange-rate-rmb'
    ];
    fclAutoFields.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          autoUpdateFCLFields();
          updateAllConversionNotes();
        });
        el.addEventListener('change', () => {
          autoUpdateFCLFields();
          updateAllConversionNotes();
        });
      }
    });

    // Trigger initial calculation check
    autoUpdateLCLFields();
    updateAllConversionNotes();

    // Calculate buttons
    document.getElementById('lcl-calc-btn').addEventListener('click', calculateLCL);
    document.getElementById('fcl-calc-btn').addEventListener('click', calculateFCL);

    // Export buttons
    document.getElementById('lcl-export-btn').addEventListener('click', exportLCLExcel);
    document.getElementById('fcl-export-btn').addEventListener('click', exportFCLExcel);

    // PDF Quote buttons
    const lclPdfBtn = document.getElementById('lcl-pdf-btn');
    if (lclPdfBtn) lclPdfBtn.addEventListener('click', () => generateQuotationPDF('LCL'));
    const fclPdfBtn = document.getElementById('fcl-pdf-btn');
    if (fclPdfBtn) fclPdfBtn.addEventListener('click', () => generateQuotationPDF('FCL'));

    // Admin tariff configuration buttons
    const saveTariffsBtn = document.getElementById('save-tariffs-btn');
    if (saveTariffsBtn) {
      saveTariffsBtn.addEventListener('click', saveAdminTariffs);
    }
    const resetTariffsBtn = document.getElementById('reset-tariffs-btn');
    if (resetTariffsBtn) {
      resetTariffsBtn.addEventListener('click', resetAdminTariffs);
    }

    // ── Excel Template & Import Event Listeners ──
    // LCL Excel Event Listeners
    const lclImportBtn = document.getElementById('lcl-import-btn');
    const lclFileInput = document.getElementById('lcl-file-input');
    const lclTemplateBtn = document.getElementById('lcl-template-btn');
    
    if (lclImportBtn && lclFileInput) {
      lclImportBtn.addEventListener('click', () => lclFileInput.click());
      lclFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          handleExcelImport(e.target.files[0], 'LCL');
          e.target.value = ''; // Clear file input
        }
      });
    }
    if (lclTemplateBtn) {
      lclTemplateBtn.addEventListener('click', downloadExcelTemplate);
    }

    // FCL Excel Event Listeners
    const fclImportBtn = document.getElementById('fcl-import-btn');
    const fclFileInput = document.getElementById('fcl-file-input');
    const fclTemplateBtn = document.getElementById('fcl-template-btn');

    if (fclImportBtn && fclFileInput) {
      fclImportBtn.addEventListener('click', () => fclFileInput.click());
      fclFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          handleExcelImport(e.target.files[0], 'FCL');
          e.target.value = ''; // Clear file input
        }
      });
    }
    if (fclTemplateBtn) {
      fclTemplateBtn.addEventListener('click', downloadExcelTemplate);
    }

    // ── Init Accumulators ──
    initAccumulators();

    // ── Init Authentication & Admin Panel ──
    initAuth();

    // ── Init User Profile & Personal Sheet Settings ──
    initUserProfile();

    // Admin Support Tools form
    const createToolForm = document.getElementById('create-tool-form');
    if (createToolForm) {
      createToolForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('new-tool-name');
        const urlInput = document.getElementById('new-tool-url');
        const descInput = document.getElementById('new-tool-desc');

        const name = nameInput.value.trim();
        const url = urlInput.value.trim();
        const desc = descInput ? descInput.value.trim() : '';

        if (!name || !url) {
          showToast('Vui lòng điền đầy đủ tên và đường dẫn liên kết', 'error');
          return;
        }

        const tools = getSupportTools();
        tools.push({ name, url, desc });
        await saveSupportTools(tools);
        
        nameInput.value = '';
        urlInput.value = '';
        if (descInput) descInput.value = '';

        renderAdminTools();
        renderSupportTools();
        showToast(`Đã thêm công cụ "${name}" thành công`, 'success');
      });
    }

    // Render tools initial list
    renderSupportTools();
    renderAdminTools();

    // ── Animation Safety Net: Force show hidden animate-in cards if they get stuck ──
    setTimeout(() => {
      document.querySelectorAll('.animate-in').forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.opacity === '0') {
          el.style.opacity = '1';
          el.style.transform = 'none';
          el.style.animation = 'none';
        }
      });
    }, 800);

    // ── [BẢO MẬT] Dữ liệu từ Google Sheets được đồng bộ sau khi đăng nhập qua hàm _loadDataAfterLogin() ──

    // Initialize PWA Setup
    initPWA();
  }

  // ── PWA & Push Notifications Setup ──
  let deferredPrompt = null;

  function initPWA() {
    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => {
            console.log('[PWA] Service Worker registered successfully:', reg.scope);
          })
          .catch(err => {
            console.error('[PWA] Service Worker registration failed:', err);
          });
      });
    }

    // 2. Handle PWA Installation Prompt
    const installContainer = document.getElementById('pwa-install-container');
    const installBtn = document.getElementById('pwa-install-btn');
    const installedStatus = document.getElementById('pwa-installed-status');

    // Detect if already running in standalone mode (installed as PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) {
      if (installContainer) installContainer.style.display = 'none';
      if (installedStatus) installedStatus.style.display = 'block';
    } else {
      if (installedStatus) installedStatus.style.display = 'none';
      
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent default browser install dialog
        e.preventDefault();
        deferredPrompt = e;
        // Show our custom install button
        if (installContainer) installContainer.style.display = 'block';
      });
    }

    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        // Show install prompt
        deferredPrompt.prompt();
        // Wait for user choice
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`[PWA] Install prompt outcome: ${outcome}`);
        // Reset deferredPrompt
        deferredPrompt = null;
        if (installContainer) installContainer.style.display = 'none';
        if (installedStatus && outcome === 'accepted') {
          installedStatus.style.display = 'block';
        }
      });
    }

    // 3. Push Notifications Setup
    const requestBtn = document.getElementById('push-request-btn');
    const sendTestBtn = document.getElementById('push-send-test-btn');

    if (requestBtn) {
      requestBtn.addEventListener('click', requestPushPermission);
    }
    if (sendTestBtn) {
      sendTestBtn.addEventListener('click', sendLocalPushNotification);
    }

    updatePushPermissionStatus();
  }

  function updatePushPermissionStatus() {
    const statusLabel = document.getElementById('push-permission-status');
    if (!statusLabel) return;

    if (!('Notification' in window)) {
      statusLabel.textContent = 'Không hỗ trợ';
      statusLabel.style.background = 'var(--danger-bg)';
      statusLabel.style.color = 'var(--danger)';
      return;
    }

    const permission = Notification.permission;
    if (permission === 'granted') {
      statusLabel.textContent = 'Đã bật';
      statusLabel.style.background = 'var(--success-bg)';
      statusLabel.style.color = 'var(--success)';
    } else if (permission === 'denied') {
      statusLabel.textContent = 'Bị từ chối';
      statusLabel.style.background = 'var(--danger-bg)';
      statusLabel.style.color = 'var(--danger)';
    } else {
      statusLabel.textContent = 'Chưa cấp quyền';
      statusLabel.style.background = 'var(--accent-light)';
      statusLabel.style.color = 'var(--accent)';
    }
  }
  window.updatePushPermissionStatus = updatePushPermissionStatus; // Expose globally for tab click event

  async function requestPushPermission() {
    if (!('Notification' in window)) {
      showToast('Trình duyệt này không hỗ trợ nhận thông báo đẩy.', 'error');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      updatePushPermissionStatus();
      if (permission === 'granted') {
        showToast('Đăng ký nhận thông báo thành công!', 'success');
        // Test notification immediately on permission grant
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification('Eureka Logistics', {
            body: 'Bạn đã đăng ký nhận thông báo đẩy thành công!',
            icon: './logo.jpg',
            badge: './logo.jpg'
          });
        });
      } else {
        showToast('Bạn đã từ chối cấp quyền thông báo.', 'warning');
      }
    } catch (err) {
      console.error('[PWA] Permission request error:', err);
    }
  }

  function sendLocalPushNotification() {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      showToast('Vui lòng bật quyền nhận thông báo trước khi kiểm thử.', 'error');
      return;
    }

    const title = document.getElementById('push-test-title').value.trim() || 'Eureka Logistics';
    const body = document.getElementById('push-test-body').value.trim() || 'Chào mừng trở lại!';

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(title, {
          body: body,
          icon: './logo.jpg',
          badge: './logo.jpg',
          vibrate: [100, 50, 100],
          data: {
            url: './index.html'
          }
        });
        showToast('Đã gửi thông báo đẩy thử nghiệm!', 'success');
      });
    } else {
      new Notification(title, { body: body, icon: './logo.jpg' });
    }
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

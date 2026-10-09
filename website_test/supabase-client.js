/* ============================================
   EUREKA LOGISTICS — Supabase Client & Dual-Sync Module
   supabase-client.js — Database riêng + Đồng bộ Google Sheets
   ============================================ */

window.EurekaDB = (function () {
  'use strict';

  // Cấu hình Supabase mặc định (hoặc người dùng nhập qua giao diện Cài đặt)
  const STORAGE_KEY_URL = 'eureka_supabase_url';
  const STORAGE_KEY_KEY = 'eureka_supabase_anon_key';
  const DEFAULT_SUPABASE_URL = 'https://ilnthvhyzgqyfavgyeoa.supabase.co';
  const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsbnRodmh5emdxeWZhdmd5ZW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0MDkxNDUsImV4cCI6MjEwNjk4NTE0NX0.B8NgRNCa6QF5xDuR0YYm9JFsxdXzG_iNouSxwHAWdi4';

  let _client = null;

  function getSupabaseConfig() {
    return {
      url: localStorage.getItem(STORAGE_KEY_URL) || DEFAULT_SUPABASE_URL,
      key: localStorage.getItem(STORAGE_KEY_KEY) || DEFAULT_SUPABASE_KEY
    };
  }

  function setSupabaseConfig(url, key) {
    if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
    else localStorage.removeItem(STORAGE_KEY_URL);

    if (key) localStorage.setItem(STORAGE_KEY_KEY, key.trim());
    else localStorage.removeItem(STORAGE_KEY_KEY);

    _client = null; // Reset client instance
  }

  function getClient() {
    if (_client) return _client;
    const { url, key } = getSupabaseConfig();
    if (url && key && window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        _client = window.supabase.createClient(url, key);
        return _client;
      } catch (e) {
        console.error('[Supabase] Init error:', e);
      }
    }
    return null;
  }

  function isConfigured() {
    return getClient() !== null;
  }

  // ══════════════════════════════════════════════
  // DUAL-SYNC: Ghi vào Supabase + Google Sheet song song
  // ══════════════════════════════════════════════

  /**
   * Đồng bộ Buyer lên Supabase (nếu có cấu hình)
   */
  async function syncBuyerToSupabase(buyer) {
    const client = getClient();
    if (!client) return { skipped: true };

    try {
      const { data, error } = await client
        .from('buyers')
        .upsert({
          name: buyer.name,
          address: buyer.address || '',
          tax_code: buyer.taxCode || '',
          phone: buyer.phone || '',
          email: buyer.email || '',
          representative: buyer.representative || '',
          position: buyer.position || '',
          created_by: buyer.createdBy || buyer.creator || '',
          updated_at: new Date().toISOString()
        }, { onConflict: 'name' });

      if (error) {
        console.warn('[Supabase] Upsert buyer error:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (e) {
      console.warn('[Supabase] syncBuyer exception:', e);
      return { success: false, error: e.message };
    }
  }

  /**
   * Xóa Buyer trên Supabase
   */
  async function deleteBuyerFromSupabase(name) {
    const client = getClient();
    if (!client) return { skipped: true };

    try {
      const { error } = await client
        .from('buyers')
        .delete()
        .eq('name', name);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Đồng bộ User lên Supabase
   */
  async function syncUserToSupabase(user) {
    const client = getClient();
    if (!client) return { skipped: true };

    try {
      // Đảm bảo mật khẩu đã được hash
      const passwordHash = window.EurekaSecurity 
        ? await window.EurekaSecurity.hashPassword(user.password)
        : user.password;

      const { data, error } = await client
        .from('users')
        .upsert({
          username: user.username.toLowerCase(),
          display_name: user.displayName || user.username,
          password_hash: passwordHash,
          role: user.role || 'sale',
          updated_at: new Date().toISOString()
        }, { onConflict: 'username' });

      if (error) {
        console.warn('[Supabase] Upsert user error:', error.message);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Xóa User trên Supabase
   */
  async function deleteUserFromSupabase(username) {
    const client = getClient();
    if (!client) return { skipped: true };

    try {
      const { error } = await client
        .from('users')
        .delete()
        .eq('username', username.toLowerCase());

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Đồng bộ Lịch sử tính giá lên Supabase
   */
  async function syncHistoryToSupabase(historyEntry) {
    const client = getClient();
    if (!client) return { skipped: true };

    try {
      const payload = historyEntry.data_payload || historyEntry;
      const { data, error } = await client
        .from('calculation_history')
        .insert({
          type: historyEntry.type || payload.type || 'LCL',
          timestamp: historyEntry.timestamp || payload.timestamp || new Date().toISOString(),
          customer_name: historyEntry.customerName || payload.buyerName || '',
          data_payload: payload,
          created_by: historyEntry.creator || payload.createdBy || ''
        });

      if (error) {
        console.error('[Supabase] Lỗi lưu calculation_history:', error.message);
        return { success: false, error: error.message };
      }
      console.log('[Supabase] Đã lưu calculation_history thành công:', payload.id);
      return { success: true, data };
    } catch (e) {
      console.error('[Supabase] Ngoại lệ lưu calculation_history:', e);
      return { success: false, error: e.message };
    }
  }

  /**
   * Tải toàn bộ Lịch sử tính toán trong 30 ngày gần nhất từ Supabase về client
   */
  async function loadHistoryFromSupabase(days = 30) {
    const client = getClient();
    if (!client) return [];

    try {
      // Mốc thời gian 30 ngày gần nhất
      const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await client
        .from('calculation_history')
        .select('*')
        .gte('created_at', sinceDate)
        .order('created_at', { ascending: false })
        .limit(2000); // Đảm bảo lấy trọn vẹn toàn bộ các đơn trong 30 ngày

      if (error || !data) {
        console.error('[Supabase] Lỗi tải calculation_history:', error);
        return [];
      }
      return data.map(h => {
        let p = h.data_payload;
        if (p && p.data_payload) p = p.data_payload;
        return p || h;
      });
    } catch (e) {
      console.error('[Supabase] Lỗi tải calculation_history:', e);
      return [];
    }
  }

  /**
   * Xóa Lịch sử tính giá trên Supabase
   */
  async function deleteHistoryFromSupabase(id) {
    const client = getClient();
    if (!client) return { skipped: true };

    try {
      const { error } = await client
        .from('calculation_history')
        .delete()
        .filter('data_payload->>id', 'eq', String(id));

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Đồng bộ IP log lên Supabase
   */
  async function syncIpLogToSupabase(logEntry) {
    const client = getClient();
    if (!client) return { skipped: true };

    try {
      await client
        .from('ip_logs')
        .insert({
          username: logEntry.username,
          status: logEntry.status,
          ip: logEntry.ip,
          details: logEntry.details,
          timestamp: logEntry.timestamp || new Date().toISOString()
        });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  /**
   * Tải toàn bộ dữ liệu từ 7 bảng trên Supabase về Client (Nguồn sự thật duy nhất)
   */
  async function loadAllFromSupabase() {
    const client = getClient();
    if (!client) return null;

    try {
      const sinceDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      const [usersRes, buyersRes, historyRes, tariffsRes, sellerRes, toolsRes, logsRes] = await Promise.all([
        client.from('users').select('*'),
        client.from('buyers').select('*'),
        client.from('calculation_history').select('*').gte('created_at', sinceDate).order('created_at', { ascending: false }).limit(2000),
        client.from('tariffs').select('*').limit(1).maybeSingle(),
        client.from('seller').select('*').limit(1).maybeSingle(),
        client.from('cong_cu_ho_tro').select('*'),
        client.from('ip_logs').select('*').order('created_at', { ascending: false }).limit(100)
      ]);

      const sellerData = sellerRes.data ? {
        name: sellerRes.data.name || '',
        address: sellerRes.data.address || '',
        office: sellerRes.data.office || '',
        phone: sellerRes.data.phone || '',
        taxCode: sellerRes.data.tax_code || '',
        representative: sellerRes.data.representative || '',
        position: sellerRes.data.position || '',
        bankAccount: sellerRes.data.bank_account || '',
        bankName: sellerRes.data.bank_name || ''
      } : null;

      const toolsData = (toolsRes.data || []).map(t => ({
        name: t.name || '',
        url: t.url || '',
        description: t.description || ''
      }));

      const historyData = (historyRes.data || []).map(h => {
        let p = h.data_payload;
        if (p && p.data_payload) p = p.data_payload;
        return p || h;
      });

      return {
        accounts: (usersRes.data || []).map(u => ({
          username: u.username,
          displayName: u.display_name,
          password: u.password_hash,
          role: u.role
        })),
        buyers: (buyersRes.data || []).map(b => ({
          name: b.name,
          address: b.address,
          taxCode: b.tax_code,
          phone: b.phone,
          email: b.email,
          representative: b.representative,
          position: b.position,
          createdBy: b.created_by
        })),
        history: historyData,
        tariffs: tariffsRes.data ? tariffsRes.data.tariff_data : null,
        seller: sellerData,
        tools: toolsData,
        ip_logs: (logsRes.data || []).map(l => ({
          username: l.username,
          status: l.status,
          ip: l.ip,
          details: l.details,
          timestamp: l.timestamp || l.created_at
        }))
      };
    } catch (e) {
      console.warn('[Supabase] Failed to load data from Supabase:', e);
      return null;
    }
  }

    /**
     * Đồng bộ Bảng giá Tariffs lên Supabase theo thời gian thực
     */
    async function syncTariffsToSupabase(tariffs) {
      const client = getClient();
      if (!client) return { skipped: true };

      try {
        const { data, error } = await client
          .from('tariffs')
          .upsert({
            id: '00000000-0000-0000-0000-000000000001',
            version: 'v4',
            tariff_data: tariffs,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.warn('[Supabase Realtime] Upsert tariffs error:', error.message);
          return { success: false, error: error.message };
        }
        return { success: true, data };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }

    /**
     * Đồng bộ Thông tin Seller lên Supabase theo thời gian thực
     */
    async function syncSellerToSupabase(seller) {
      const client = getClient();
      if (!client) return { skipped: true };

      try {
        const { data, error } = await client
          .from('seller')
          .upsert({
            id: '00000000-0000-0000-0000-000000000001',
            name: seller.name || '',
            address: seller.address || '',
            office: seller.office || '',
            phone: String(seller.phone || ''),
            tax_code: String(seller.taxCode || ''),
            representative: seller.representative || '',
            position: seller.position || '',
            bank_account: String(seller.bankAccount || ''),
            bank_name: seller.bankName || '',
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.warn('[Supabase Realtime] Upsert seller error:', error.message);
          return { success: false, error: error.message };
        }
        return { success: true, data };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }

    /**
     * Đồng bộ Công cụ hỗ trợ lên Supabase theo thời gian thực
     */
    async function syncSupportToolsToSupabase(tools) {
      const client = getClient();
      if (!client) return { skipped: true };

      try {
        await client.from('cong_cu_ho_tro').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (tools && tools.length > 0) {
          const rows = tools.map(t => ({
            name: t.name || t.Name || '',
            url: t.url || t.URL || '',
            description: t.description || t.Description || ''
          }));
          const { data, error } = await client.from('cong_cu_ho_tro').insert(rows);
          if (error) return { success: false, error: error.message };
          return { success: true, data };
        }
        return { success: true };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }

    return {
      getSupabaseConfig,
      setSupabaseConfig,
      getClient,
      isConfigured,
      // Operations
      syncBuyerToSupabase,
      deleteBuyerFromSupabase,
      syncUserToSupabase,
      deleteUserFromSupabase,
      syncHistoryToSupabase,
      deleteHistoryFromSupabase,
      loadHistoryFromSupabase,
      syncIpLogToSupabase,
      syncTariffsToSupabase,
      syncSellerToSupabase,
      syncSupportToolsToSupabase,
      loadAllFromSupabase
    };
})();

console.log('[Supabase] Eureka DB & Dual-Sync Module loaded');

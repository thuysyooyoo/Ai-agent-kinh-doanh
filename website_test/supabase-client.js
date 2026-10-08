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
      const { data, error } = await client
        .from('calculation_history')
        .insert({
          type: historyEntry.type,
          timestamp: historyEntry.timestamp || new Date().toISOString(),
          customer_name: historyEntry.customerName || '',
          data_payload: historyEntry,
          created_by: historyEntry.creator || ''
        });

      if (error) return { success: false, error: error.message };
      return { success: true, data };
    } catch (e) {
      return { success: false, error: e.message };
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
   * Tải toàn bộ dữ liệu từ Supabase (nếu có kết nối)
   */
  async function loadAllFromSupabase() {
    const client = getClient();
    if (!client) return null;

    try {
      const [usersRes, buyersRes, historyRes, tariffsRes] = await Promise.all([
        client.from('users').select('*'),
        client.from('buyers').select('*'),
        client.from('calculation_history').select('*').order('created_at', { ascending: false }).limit(100),
        client.from('tariffs').select('*').limit(1).maybeSingle()
      ]);

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
        history: (historyRes.data || []).map(h => h.data_payload || h),
        tariffs: tariffsRes.data ? tariffsRes.data.tariff_data : null
      };
    } catch (e) {
      console.warn('[Supabase] Failed to load data:', e);
      return null;
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
    syncIpLogToSupabase,
    loadAllFromSupabase
  };
})();

console.log('[Supabase] Eureka DB & Dual-Sync Module loaded');

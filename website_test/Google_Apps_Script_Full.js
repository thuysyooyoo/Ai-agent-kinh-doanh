// ====================================================================================
// GOOGLE APPS SCRIPT FOR EUREKA LOGISTICS — FULL COMPATIBILITY & DUAL-SYNC VERSION (v3.0)
// Hướng dẫn cài đặt:
// 1. Mở Google Sheet trên Google Drive của bạn
// 2. Vào Extensions (Tiện ích mở rộng) -> Apps Script
// 3. XÓA TOÀN BỘ code cũ trong tệp Code.gs và DÁN TOÀN BỘ file này vào
// 4. Bấm Lưu (Ctrl+S) -> Bấm Deploy (Triển khai) -> Quản lý bản triển khai
// 5. Bấm icon Chỉnh sửa (Cây bút) -> Chọn "Phiên bản mới" (New version) -> Triển khai (Deploy)
// ====================================================================================

var SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();

var SHEETS = {
  seller: "Seller",
  nguoiDung: "NguoiDung",
  nhatKyIP: "NhatKyIP",
  lichSuTinhToan: "LichSuTinhToan",
  donGia: "DonGia",
  congCuHoTro: "CongCuHoTro",
  danhBaKhachHang: "DanhBaKhachHang"
};

// ── BỘ TÌM KIẾM ĐA DẠNG ALIASES CHO TỪNG SHEET ĐỂ KHÔNG BỊ LỆCH TÊN TAB ──
var SHEET_ALIASES = {
  seller: [
    "Seller", "seller", "Bên bán", "bên bán", "Bên A", "bên a", "ThongTinBenBan", "thongtinbenban"
  ],
  nguoiDung: [
    "NguoiDung", "nguoidung", "Người dùng", "người dùng", "Tài khoản", "tài khoản", "TaiKhoan", "Users", "users"
  ],
  nhatKyIP: [
    "NhatKyIP", "nhatkyip", "Nhật ký IP", "nhật ký ip", "Log IP", "log ip", "IPLogs", "iplogs", "Logs"
  ],
  lichSuTinhToan: [
    "LichSuTinhToan", "lichsutinhtoan", "Lịch sử tính toán", "lịch sử tính toán", "Lịch sử", "lichsu", "History", "history"
  ],
  donGia: [
    "setup dongia", "Setup DonGia", "Setup dongia", "setup_dongia", "DonGia", "dongia", "Đơn giá", "đơn giá", "Bảng phí", "bảng phí", "BangPhi", "Setup", "Cài đặt đơn giá"
  ],
  congCuHoTro: [
    "congcuhotro", "CongCuHoTro", "Công cụ hỗ trợ", "công cụ hỗ trợ", "Công cụ", "công cụ", "Tools", "tools", "SupportTools"
  ],
  danhBaKhachHang: [
    "danhbakhachhang", "DanhBaKhachHang", "Danh bạ khách hàng", "danh bạ khách hàng", "Khách hàng", "khách hàng", "Danh bạ", "danh bạ", "Buyers", "buyers"
  ]
};

var FIELD_MAPPINGS = {
  nguoiDung: {
    username: { aliases: ["Username", "username", "Tên đăng nhập", "tên đăng nhập", "Tên tài khoản", "tên tài khoản"], defaultHeader: "Username" },
    displayName: { aliases: ["DisplayName", "displayName", "Tên hiển thị", "tên hiển thị", "Tên", "tên"], defaultHeader: "DisplayName" },
    password: { aliases: ["Password", "password", "Mật khẩu", "mật khẩu", "Mật mã", "mật mã"], defaultHeader: "Password" },
    role: { aliases: ["Role", "role", "Quyền", "quyền", "Vai trò", "vai trò", "Chức vụ", "chức vụ"], defaultHeader: "Role" }
  },
  nhatKyIP: {
    timestamp: { aliases: ["Timestamp", "timestamp", "Thời gian", "thời gian", "Ngày tạo", "ngày tạo"], defaultHeader: "Timestamp" },
    username: { aliases: ["Username", "username", "Tên đăng nhập", "tên đăng nhập", "Tên tài khoản", "tên tài khoản"], defaultHeader: "Username" },
    ip: { aliases: ["IP Address", "IP", "ip", "Địa chỉ IP", "địa chỉ ip"], defaultHeader: "IP Address" },
    details: { aliases: ["Details", "details", "Chi tiết", "chi tiết", "Thiết bị", "thiết bị"], defaultHeader: "Details" },
    status: { aliases: ["Status", "status", "Trạng thái", "trạng thái"], defaultHeader: "Status" }
  },
  lichSuTinhToan: {
    id: { aliases: ["ID", "id", "Mã lịch sử", "mã lịch sử", "Mã", "mã"], defaultHeader: "ID" },
    timestamp: { aliases: ["Timestamp", "timestamp", "Thời gian", "thời gian", "Ngày tạo", "ngày tạo"], defaultHeader: "Timestamp" },
    type: { aliases: ["Type", "type", "Loại", "loại", "Loại hàng", "loại hàng"], defaultHeader: "Type" },
    createdBy: { aliases: ["Created By", "createdBy", "creator", "Người tạo", "người tạo", "Tài khoản", "tài khoản"], defaultHeader: "Created By" },
    totalValue: { aliases: ["Total Value", "totalValue", "Tổng trị giá", "tổng trị giá", "Trị giá", "trị giá"], defaultHeader: "Total Value" },
    costPrice: { aliases: ["Cost Price", "costPrice", "Giá vốn", "giá vốn"], defaultHeader: "Cost Price" },
    expectedProfit: { aliases: ["Expected Profit", "expectedProfit", "Lợi nhuận dự kiến", "lợi nhuận dự kiến", "Lợi nhuận", "lợi nhuận"], defaultHeader: "Expected Profit" },
    profitMargin: { aliases: ["Profit Margin", "profitMargin", "Tỷ suất lợi nhuận", "tỷ suất lợi nhuận", "Tỷ lệ lợi nhuận", "tỷ lệ lợi nhuận"], defaultHeader: "Profit Margin" },
    payload: { aliases: ["Payload", "payload", "Dữ liệu", "dữ liệu", "Mã JSON", "mã json"], defaultHeader: "Payload" }
  },
  donGia: {
    phiUTBase: { aliases: ["PhiUTBase", "phiutbase", "Phí ủy thác", "phí ủy thác", "Phí UT", "phiut", "Phí ủy thác cơ sở"], defaultHeader: "PhiUTBase" },
    riskThreshold: { aliases: ["RiskThreshold", "riskthreshold", "Mức rủi ro", "mức rủi ro", "Ngưỡng rủi ro", "ngưỡng rủi ro", "Hạn mức rủi ro"], defaultHeader: "RiskThreshold" },
    riskRate: { aliases: ["RiskRate", "riskrate", "Tỷ lệ rủi ro", "tỷ lệ rủi ro", "Tỷ lệ phí rủi ro", "% rủi ro"], defaultHeader: "RiskRate" },
    cuerQTQC: { aliases: ["CuerQTQC", "cuerqtqc", "Cược QTQC", "cược qtqc", "Cược Quảng Châu", "cuer_qtqc"], defaultHeader: "CuerQTQC" },
    cuerQTBT: { aliases: ["CuerQTBT", "cuerqtbt", "Cược QTBT", "cược qtbt", "Cược Bằng Tường", "cuer_qtbt"], defaultHeader: "CuerQTBT" },
    vipRates: { aliases: ["VipRates", "viprates", "Bảng phí VIP", "bảng phí vip", "Phí VIP"], defaultHeader: "VipRates" },
    flexibleM3: { aliases: ["FlexibleM3", "flexiblem3", "Bảng phí M3", "bảng phí m3", "Hàng nhẹ M3"], defaultHeader: "FlexibleM3" },
    flexibleKG: { aliases: ["FlexibleKG", "flexiblekg", "Bảng phí KG", "bảng phí kg", "Hàng nặng KG"], defaultHeader: "FlexibleKG" },
    payload: { aliases: ["Payload", "payload", "Dữ liệu", "dữ liệu", "Data", "data"], defaultHeader: "Payload" }
  },
  congCuHoTro: {
    name: { aliases: ["Name", "name", "Tên", "tên", "Tên công cụ", "tên công cụ"], defaultHeader: "Name" },
    url: { aliases: ["URL", "url", "Đường dẫn", "đường dẫn", "Liên kết", "liên kết"], defaultHeader: "URL" },
    desc: { aliases: ["Description", "description", "Mô tả", "mô tả", "Chi tiết công cụ", "chi tiết công cụ"], defaultHeader: "Description" }
  },
  danhBaKhachHang: {
    name: { aliases: ["Name", "name", "Tên", "tên", "Tên khách hàng", "tên khách hàng"], defaultHeader: "Name" },
    address: { aliases: ["Address", "address", "Địa chỉ", "địa chỉ"], defaultHeader: "Address" },
    taxCode: { aliases: ["Tax Code", "taxCode", "Mã số thuế", "mã số thuế", "MST", "mst"], defaultHeader: "Tax Code" },
    phone: { aliases: ["Phone", "phone", "Số điện thoại", "số điện thoại", "SĐT", "sđt"], defaultHeader: "Phone" },
    email: { aliases: ["Email", "email", "Thư điện tử", "thư điện tử"], defaultHeader: "Email" },
    representative: { aliases: ["Representative", "representative", "Người đại diện", "người đại diện", "Đại diện", "đại diện"], defaultHeader: "Representative" },
    position: { aliases: ["Position", "position", "Chức vụ", "chức vụ"], defaultHeader: "Position" },
    createdBy: { aliases: ["Created By", "createdBy", "creator", "Người tạo", "người tạo", "Tài khoản", "tài khoản"], defaultHeader: "Created By" }
  }
};

// ── TÌM SHEET THÔNG MINH THEO ALIAS VÀ CẤU TRÚC ĐANG CÓ ──
function getOrFindSheet(key) {
  var aliases = SHEET_ALIASES[key] || [SHEETS[key]];
  var sheets = SPREADSHEET.getSheets();
  
  // 1. Tìm chính xác tuyệt đối (exact match)
  for (var i = 0; i < sheets.length; i++) {
    var sheetName = sheets[i].getName();
    for (var j = 0; j < aliases.length; j++) {
      if (sheetName === aliases[j]) return sheets[i];
    }
  }
  
  // 2. Tìm không phân biệt hoa thường và bỏ khoảng trắng/dấu gạch thừa
  for (var i = 0; i < sheets.length; i++) {
    var normName = sheets[i].getName().toLowerCase().replace(/[\s_\-]+/g, '');
    for (var j = 0; j < aliases.length; j++) {
      var normAlias = aliases[j].toLowerCase().replace(/[\s_\-]+/g, '');
      if (normName === normAlias) return sheets[i];
    }
  }
  
  // 3. Tìm tương đối chứa chuỗi (contains)
  for (var i = 0; i < sheets.length; i++) {
    var normName = sheets[i].getName().toLowerCase();
    for (var j = 0; j < aliases.length; j++) {
      var normAlias = aliases[j].toLowerCase();
      if (normName.indexOf(normAlias) !== -1 || normAlias.indexOf(normName) !== -1) {
        return sheets[i];
      }
    }
  }
  
  // 4. Nếu chưa có trên Spreadsheet, tự động tạo mới với tên chuẩn mặc định
  var defaultName = SHEETS[key] || aliases[0];
  var newSheet = SPREADSHEET.insertSheet(defaultName);
  if (FIELD_MAPPINGS[key]) {
    var mapping = FIELD_MAPPINGS[key];
    var headers = Object.keys(mapping).map(function(k) { return mapping[k].defaultHeader; });
    newSheet.appendRow(headers);
    newSheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f3f3");
  }
  return newSheet;
}

function findColumnIndex(headers, aliases) {
  for (var i = 0; i < headers.length; i++) {
    var h = String(headers[i]).toLowerCase().trim();
    for (var j = 0; j < aliases.length; j++) {
      if (h === aliases[j].toLowerCase().trim()) {
        return i + 1;
      }
    }
  }
  return 0;
}

function getOrAddColumn(sheet, aliases, defaultHeader) {
  var lastCol = sheet.getLastColumn();
  var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  var colIdx = findColumnIndex(headers, aliases);
  if (colIdx > 0) return colIdx;
  var newCol = lastCol + 1;
  sheet.getRange(1, newCol).setValue(defaultHeader).setFontWeight("bold").setBackground("#f3f3f3");
  return newCol;
}

function getSheetDataMapped(sheetKey, mapping) {
  var sheet = getOrFindSheet(sheetKey);
  if (!sheet) return [];
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];
  
  var colMap = {};
  var keys = Object.keys(mapping);
  keys.forEach(function(k) {
    colMap[k] = getOrAddColumn(sheet, mapping[k].aliases, mapping[k].defaultHeader);
  });
  
  var rows = sheet.getDataRange().getValues();
  var data = [];
  
  for (var i = 1; i < rows.length; i++) {
    var obj = {};
    var hasData = false;
    keys.forEach(function(k) {
      var val = rows[i][colMap[k] - 1];
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        hasData = true;
      }
      obj[k] = (val !== undefined && val !== null) ? val : "";
    });
    if (hasData) data.push(obj);
  }
  return data;
}

// ── BẢO MẬT: Token bí mật ──
var SECURE_TOKEN = 'EUREKA_SECURE_TOKEN_2026_X9#mK!';

function validateToken(tokenFromRequest) {
  return tokenFromRequest === SECURE_TOKEN;
}

// ── GET HANDLER ──
function doGet(e) {
  try {
    var token = e && e.parameter ? e.parameter.token : "";
    if (!validateToken(token)) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Unauthorized: Invalid or missing token" 
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var action = e && e.parameter ? e.parameter.action : "";
    var username = e && e.parameter ? e.parameter.username : "";
    
    if (action === "get_data") {
      var allSheets = SPREADSHEET.getSheets().map(function(s) { 
        return { name: s.getName(), lastRow: s.getLastRow(), lastCol: s.getLastColumn() }; 
      });
      var data = {
        tariffs: loadTariffsMapped(),
        accounts: getAccountsMapped(),
        history: loadHistoryMapped(username),
        tools: getToolsMapped(),
        buyers: getBuyersMapped(),
        seller: loadSellerMapped(),
        ip_logs: getIpLogsMapped(),
        system_info: {
          available_sheets: allSheets,
          server_time: new Date().toISOString()
        }
      };
      return ContentService.createTextOutput(JSON.stringify({ success: true, data: data }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Eureka Apps Script is online" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── POST HANDLER ──
function doPost(e) {
  var result = { success: false, message: "" };
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    }
    
    if (!validateToken(payload.token)) {
      return ContentService.createTextOutput(JSON.stringify({ 
        success: false, 
        error: "Unauthorized: Invalid or missing token" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var action = payload.action;
    
    if (action === "save_buyer") {
      result.success = saveBuyerMapped(payload.buyer || payload.data || payload);
    }
    else if (action === "delete_buyer") {
      result.success = deleteBuyerMapped(payload.name);
    }
    else if (action === "save_calculation") {
      result.success = saveCalculationMapped(payload);
    }
    else if (action === "delete_calculation") {
      result.success = deleteCalculationMapped(payload.id);
    }
    else if (action === "create_user") {
      result.success = saveUserMapped(payload.user || payload.data || payload);
    }
    else if (action === "delete_user") {
      result.success = deleteUserMapped(payload.username);
    }
    else if (action === "record_ip") {
      result.success = recordIpLogMapped(payload);
    }
    else if (action === "clear_ip_logs") {
      result.success = clearIpLogsMapped();
    }
    else if (action === "save_tariffs") {
      result.success = saveTariffsMapped(payload);
    }
    else if (action === "save_tools") {
      result.success = saveToolsMapped(payload.tools || payload.data || payload);
    }
    else if (action === "save_seller") {
      result.success = saveSellerMapped(payload.seller || payload.data || payload);
    }
    else {
      result.success = true;
      result.message = "Đã nhận action: " + action;
    }
  } catch(err) {
    result.success = false;
    result.error = err.toString();
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── 1. DANH BẠ KHÁCH HÀNG ──
function getBuyersMapped() {
  var sheet = getOrFindSheet("danhBaKhachHang");
  if (!sheet) return [];
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];

  var mapping = FIELD_MAPPINGS.danhBaKhachHang;
  var colMap = {};
  var keys = Object.keys(mapping);
  keys.forEach(function(k) {
    colMap[k] = getOrAddColumn(sheet, mapping[k].aliases, mapping[k].defaultHeader);
  });

  var rows = sheet.getDataRange().getValues();
  var data = [];

  for (var i = 1; i < rows.length; i++) {
    var obj = {};
    var hasData = false;
    keys.forEach(function(k) {
      var val = rows[i][colMap[k] - 1];
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        hasData = true;
      }
      obj[k] = (val !== undefined && val !== null) ? val : "";
    });
    if (hasData && obj.name) {
      data.push(obj);
    }
  }
  return data;
}

function saveBuyerMapped(buyer) {
  if (!buyer || !buyer.name) return false;
  var sheet = getOrFindSheet("danhBaKhachHang");
  if (!sheet) return false;

  var mapping = FIELD_MAPPINGS.danhBaKhachHang;
  var colMap = {};
  Object.keys(mapping).forEach(function(k) {
    colMap[k] = getOrAddColumn(sheet, mapping[k].aliases, mapping[k].defaultHeader);
  });

  var nameCol = colMap.name;
  var lastRow = sheet.getLastRow();
  var targetRow = lastRow + 1;

  if (lastRow > 1) {
    var names = sheet.getRange(1, nameCol, lastRow, 1).getValues();
    for (var i = 1; i < names.length; i++) {
      if (String(names[i][0]).toLowerCase().trim() === String(buyer.name).toLowerCase().trim()) {
        targetRow = i + 1;
        break;
      }
    }
  }

  // Bảo toàn số 0 ở đầu cho SĐT và Mã số thuế
  var phoneVal = buyer.phone !== undefined ? String(buyer.phone).trim() : "";
  if (phoneVal && phoneVal.startsWith('0')) {
    phoneVal = "'" + phoneVal;
  }
  var taxVal = buyer.taxCode !== undefined ? String(buyer.taxCode).trim() : "";
  if (taxVal && taxVal.startsWith('0')) {
    taxVal = "'" + taxVal;
  }

  var formattedBuyer = Object.assign({}, buyer, {
    phone: phoneVal,
    taxCode: taxVal
  });

  Object.keys(colMap).forEach(function(k) {
    if (formattedBuyer[k] !== undefined) {
      sheet.getRange(targetRow, colMap[k]).setValue(formattedBuyer[k]);
    }
  });

  return true;
}

function deleteBuyerMapped(name) {
  if (!name) return false;
  var sheet = getOrFindSheet("danhBaKhachHang");
  if (!sheet) return true;
  var nameCol = getOrAddColumn(sheet, FIELD_MAPPINGS.danhBaKhachHang.name.aliases, FIELD_MAPPINGS.danhBaKhachHang.name.defaultHeader);
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return true;
  var vals = sheet.getRange(1, nameCol, lastRow, 1).getValues();
  for (var i = vals.length - 1; i >= 1; i--) {
    if (String(vals[i][0]).toLowerCase().trim() === String(name).toLowerCase().trim()) {
      sheet.deleteRow(i + 1);
    }
  }
  return true;
}

// ── 2. LỊCH SỬ TÍNH TOÁN ──
function saveCalculationMapped(payload) {
  var sheet = getOrFindSheet("lichSuTinhToan");
  if (!sheet) return false;
  var data = payload.data || payload;
  if (!data) return false;

  var mapping = FIELD_MAPPINGS.lichSuTinhToan;
  var colMap = {};
  Object.keys(mapping).forEach(function(k) {
    colMap[k] = getOrAddColumn(sheet, mapping[k].aliases, mapping[k].defaultHeader);
  });

  var newRowIdx = sheet.getLastRow() + 1;
  sheet.getRange(newRowIdx, colMap.id).setValue(data.id || Date.now());
  sheet.getRange(newRowIdx, colMap.timestamp).setValue(data.timestamp || new Date().toISOString());
  sheet.getRange(newRowIdx, colMap.type).setValue(data.type || "");
  sheet.getRange(newRowIdx, colMap.createdBy).setValue(data.createdBy || data.creator || "system");
  sheet.getRange(newRowIdx, colMap.totalValue).setValue(data.totalValue || 0);
  sheet.getRange(newRowIdx, colMap.costPrice).setValue(data.costPrice || 0);
  sheet.getRange(newRowIdx, colMap.expectedProfit).setValue(data.expectedProfit || 0);
  sheet.getRange(newRowIdx, colMap.profitMargin).setValue(data.profitMargin || 0);
  sheet.getRange(newRowIdx, colMap.payload).setValue(JSON.stringify(data));
  return true;
}

function deleteCalculationMapped(id) {
  if (!id) return false;
  var sheet = getOrFindSheet("lichSuTinhToan");
  if (!sheet) return true;
  var idCol = getOrAddColumn(sheet, FIELD_MAPPINGS.lichSuTinhToan.id.aliases, FIELD_MAPPINGS.lichSuTinhToan.id.defaultHeader);
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return true;
  var vals = sheet.getRange(1, idCol, lastRow, 1).getValues();
  for (var i = vals.length - 1; i >= 1; i--) {
    if (String(vals[i][0]).trim() === String(id).trim()) {
      sheet.deleteRow(i + 1);
    }
  }
  return true;
}

function loadHistoryMapped(username) {
  var sheet = getOrFindSheet("lichSuTinhToan");
  if (!sheet) return [];
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];

  var payloadCol = getOrAddColumn(sheet, FIELD_MAPPINGS.lichSuTinhToan.payload.aliases, FIELD_MAPPINGS.lichSuTinhToan.payload.defaultHeader);
  var createdByCol = getOrAddColumn(sheet, FIELD_MAPPINGS.lichSuTinhToan.createdBy.aliases, FIELD_MAPPINGS.lichSuTinhToan.createdBy.defaultHeader);
  var rows = sheet.getDataRange().getValues();
  var history = [];
  var isFilterUser = username && String(username).toLowerCase().trim() !== "admin";

  for (var i = 1; i < rows.length; i++) {
    try {
      var rowUser = String(rows[i][createdByCol - 1] || "").toLowerCase().trim();
      var calcObj = JSON.parse(rows[i][payloadCol - 1]);
      if (isFilterUser) {
        var objUser = String(calcObj.createdBy || calcObj.creator || rowUser).toLowerCase().trim();
        if (objUser !== String(username).toLowerCase().trim()) {
          continue;
        }
      }
      history.push(calcObj);
    } catch(e) {}
  }
  return history;
}

// ── 3. NGƯỜI DÙNG & TÀI KHOẢN ──
function getAccountsMapped() {
  return getSheetDataMapped("nguoiDung", FIELD_MAPPINGS.nguoiDung);
}

function saveUserMapped(user) {
  if (!user || !user.username) return false;
  var sheet = getOrFindSheet("nguoiDung");
  if (!sheet) return false;

  var mapping = FIELD_MAPPINGS.nguoiDung;
  var colMap = {};
  Object.keys(mapping).forEach(function(k) {
    colMap[k] = getOrAddColumn(sheet, mapping[k].aliases, mapping[k].defaultHeader);
  });

  var userCol = colMap.username;
  var lastRow = sheet.getLastRow();
  var targetRow = lastRow + 1;

  if (lastRow > 1) {
    var users = sheet.getRange(1, userCol, lastRow, 1).getValues();
    for (var i = 1; i < users.length; i++) {
      if (String(users[i][0]).toLowerCase().trim() === String(user.username).toLowerCase().trim()) {
        targetRow = i + 1;
        break;
      }
    }
  }

  Object.keys(colMap).forEach(function(k) {
    if (user[k] !== undefined) {
      sheet.getRange(targetRow, colMap[k]).setValue(user[k]);
    }
  });
  return true;
}

function deleteUserMapped(username) {
  if (!username) return false;
  var sheet = getOrFindSheet("nguoiDung");
  if (!sheet) return true;
  var userCol = getOrAddColumn(sheet, FIELD_MAPPINGS.nguoiDung.username.aliases, FIELD_MAPPINGS.nguoiDung.username.defaultHeader);
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return true;
  var vals = sheet.getRange(1, userCol, lastRow, 1).getValues();
  for (var i = vals.length - 1; i >= 1; i--) {
    if (String(vals[i][0]).toLowerCase().trim() === String(username).toLowerCase().trim()) {
      sheet.deleteRow(i + 1);
    }
  }
  return true;
}

// ── 4. NHẬT KÝ IP ──
function getIpLogsMapped() {
  return getSheetDataMapped("nhatKyIP", FIELD_MAPPINGS.nhatKyIP);
}

function recordIpLogMapped(log) {
  var sheet = getOrFindSheet("nhatKyIP");
  if (!sheet) return false;
  var mapping = FIELD_MAPPINGS.nhatKyIP;
  var colMap = {};
  Object.keys(mapping).forEach(function(k) {
    colMap[k] = getOrAddColumn(sheet, mapping[k].aliases, mapping[k].defaultHeader);
  });
  var newRowIdx = sheet.getLastRow() + 1;
  Object.keys(colMap).forEach(function(k) {
    if (log[k] !== undefined) {
      sheet.getRange(newRowIdx, colMap[k]).setValue(log[k]);
    }
  });
  return true;
}

function clearIpLogsMapped() {
  var sheet = getOrFindSheet("nhatKyIP");
  if (!sheet) return true;
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }
  return true;
}

// ── 5. THÔNG TIN BÊN BÁN (BÊN A) ──
function normalizeSellerKey(header) {
  var h = String(header || '').toLowerCase().trim();
  if (h === 'name' || h === 'tên' || h === 'tên công ty' || h === 'ten cong ty' || h === 'công ty' || h === 'cong ty') return 'name';
  if (h === 'address' || h === 'địa chỉ' || h === 'dia chi' || h === 'trụ sở' || h === 'tru so' || h === 'địa chỉ trụ sở') return 'address';
  if (h === 'office' || h === 'văn phòng' || h === 'van phong' || h === 'vpgd' || h === 'địa chỉ gd' || h === 'văn phòng gd') return 'office';
  if (h === 'phone' || h === 'số điện thoại' || h === 'so dien thoai' || h === 'sđt' || h === 'sdt' || h === 'điện thoại' || h === 'dien thoai' || h === 'hotline') return 'phone';
  if (h === 'taxcode' || h === 'tax code' || h === 'mã số thuế' || h === 'ma so thue' || h === 'mst') return 'taxCode';
  if (h === 'representative' || h === 'người đại diện' || h === 'nguoi dai dien' || h === 'đại diện' || h === 'dai dien') return 'representative';
  if (h === 'position' || h === 'chức vụ' || h === 'chuc vu') return 'position';
  if (h === 'bankaccount' || h === 'bank account' || h === 'số tài khoản' || h === 'so tai khoan' || h === 'stk' || h === 'tài khoản' || h === 'tai khoan') return 'bankAccount';
  if (h === 'bankname' || h === 'bank name' || h === 'ngân hàng' || h === 'ngan hang' || h === 'tên ngân hàng' || h === 'chi nhánh') return 'bankName';
  return h;
}

function loadSellerMapped() {
  var sheet = getOrFindSheet("seller");
  if (!sheet) return {};
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow === 0 || lastCol === 0) return {};
  
  var rows = sheet.getDataRange().getValues();
  if (rows.length === 0) return {};
  
  var seller = {};
  
  // Kiểm tra xem sheet là dạng hàng ngang (Row 1 Header, Row 2 Value)
  var isHorizontal = false;
  if (rows.length >= 2) {
    var firstCell = String(rows[0][0] || '').toLowerCase().trim();
    if (firstCell === 'name' || firstCell === 'tên' || firstCell === 'tên công ty' || firstCell === 'company') {
      isHorizontal = true;
    }
    if (!isHorizontal && rows[0].length >= 3) {
      var h2 = String(rows[0][1] || '').toLowerCase().trim();
      if (h2 === 'address' || h2 === 'địa chỉ' || h2 === 'dia chi') {
        isHorizontal = true;
      }
    }
  }
  
  if (isHorizontal) {
    var headers = rows[0];
    var dataRow = rows[1];
    for (var c = 0; c < headers.length; c++) {
      var rawH = String(headers[c] || '').trim();
      if (!rawH) continue;
      var normKey = normalizeSellerKey(rawH);
      seller[normKey] = (dataRow[c] !== undefined && dataRow[c] !== null) ? String(dataRow[c]).trim() : '';
    }
  } else {
    // Dạng dọc: Cột A là Key, Cột B là Value
    for (var i = 0; i < rows.length; i++) {
      var rawK = String(rows[i][0] || '').trim();
      if (rawK) {
        var normKey = normalizeSellerKey(rawK);
        seller[normKey] = (rows[i][1] !== undefined && rows[i][1] !== null) ? String(rows[i][1]).trim() : '';
      }
    }
  }

  // Đảm bảo không bị lỗi gán nhầm name = address do dữ liệu cũ
  if (seller.name && String(seller.name).toLowerCase().trim() === 'address') {
    seller.name = '';
  }

  var defaultKeys = ['name', 'address', 'office', 'phone', 'taxCode', 'representative', 'position', 'bankAccount', 'bankName'];
  defaultKeys.forEach(function(k) {
    if (!seller[k]) seller[k] = '';
  });
  
  return seller;
}

function saveSellerMapped(seller) {
  if (!seller) return false;
  var sheet = getOrFindSheet("seller");
  if (!sheet) return false;

  var headers = [
    "Name",
    "Address",
    "Office",
    "Phone",
    "Tax Code",
    "Representative",
    "Position",
    "Bank Account",
    "Bank Name"
  ];

  var phoneVal = seller.phone !== undefined ? String(seller.phone).trim() : "";
  if (phoneVal && phoneVal.startsWith('0')) phoneVal = "'" + phoneVal;

  var taxVal = seller.taxCode !== undefined ? String(seller.taxCode).trim() : "";
  if (taxVal && taxVal.startsWith('0')) taxVal = "'" + taxVal;

  var bankVal = seller.bankAccount !== undefined ? String(seller.bankAccount).trim() : "";
  if (bankVal && bankVal.startsWith('0')) bankVal = "'" + bankVal;

  var dataRow = [
    seller.name || "",
    seller.address || "",
    seller.office || "",
    phoneVal,
    taxVal,
    seller.representative || "",
    seller.position || "",
    bankVal,
    seller.bankName || ""
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold").setBackground("#f3f3f3");
  sheet.getRange(2, 1, 1, dataRow.length).setValues([dataRow]);

  var lastRow = sheet.getLastRow();
  if (lastRow > 2) {
    sheet.deleteRows(3, lastRow - 2);
  }
  return true;
}

// ── 6. ĐƠN GIÁ & BẢNG PHÍ (SETUP DONGIA) ──
function loadTariffsMapped() {
  var sheet = getOrFindSheet("donGia");
  if (!sheet) return null;
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  var rows = sheet.getDataRange().getValues();
  if (rows.length < 2) return null;

  var headers = rows[0];
  var dataRow = rows[1];

  // 1. Ưu tiên: Cột Payload chứa toàn bộ JSON cấu hình
  for (var c = 0; c < headers.length; c++) {
    var h = String(headers[c] || '').toLowerCase().trim();
    if (h === "payload" || h === "dữ liệu" || h === "data" || h === "json") {
      if (dataRow[c]) {
        try {
          var parsed = JSON.parse(dataRow[c]);
          if (parsed && typeof parsed === "object") {
            return parsed;
          }
        } catch(e) {}
      }
    }
  }

  // 2. Map dữ liệu theo từng cột ngang
  var tariffs = {};
  var foundAny = false;
  for (var c = 0; c < headers.length; c++) {
    var key = String(headers[c] || '').toLowerCase().trim();
    var val = dataRow[c];
    if (!key) continue;

    if (key.indexOf("phiutbase") !== -1 || key.indexOf("ủy thác") !== -1 || key.indexOf("uy thac") !== -1 || key === "phiut") {
      tariffs.phiUTBase = Number(val) || 400000;
      foundAny = true;
    } else if (key.indexOf("riskthreshold") !== -1 || key.indexOf("hạn mức rủi ro") !== -1 || key.indexOf("ngưỡng rủi ro") !== -1 || key.indexOf("mức rủi ro") !== -1) {
      tariffs.riskThreshold = Number(val) || 100000000;
      foundAny = true;
    } else if (key.indexOf("riskrate") !== -1 || key.indexOf("tỷ lệ rủi ro") !== -1 || key.indexOf("tỷ lệ phí") !== -1) {
      tariffs.riskRate = Number(val) || 0.01;
      foundAny = true;
    } else if (key.indexOf("cuerqtqc") !== -1 || key.indexOf("quảng châu") !== -1 || key.indexOf("quang chau") !== -1 || key.indexOf("cuer_qtqc") !== -1) {
      tariffs.cuerQTQC = Number(val) || 1000000;
      foundAny = true;
    } else if (key.indexOf("cuerqtbt") !== -1 || key.indexOf("bằng tường") !== -1 || key.indexOf("bang tuong") !== -1 || key.indexOf("cuer_qtbt") !== -1) {
      tariffs.cuerQTBT = Number(val) || 700000;
      foundAny = true;
    } else if (key.indexOf("vip") !== -1) {
      try { tariffs.vipRates = typeof val === 'string' ? JSON.parse(val) : val; foundAny = true; } catch(e) {}
    } else if (key.indexOf("m3") !== -1) {
      try { tariffs.flexibleM3 = typeof val === 'string' ? JSON.parse(val) : val; foundAny = true; } catch(e) {}
    } else if (key.indexOf("kg") !== -1) {
      try { tariffs.flexibleKG = typeof val === 'string' ? JSON.parse(val) : val; foundAny = true; } catch(e) {}
    }
  }

  if (foundAny && tariffs.phiUTBase) {
    return tariffs;
  }

  // 3. Fallback: Nếu bảng lưu dọc (Cột A là Key, Cột B là Value)
  for (var r = 0; r < rows.length; r++) {
    var k = String(rows[r][0] || '').trim();
    var v = rows[r][1];
    if (k) tariffs[k] = v;
  }

  return tariffs;
}

function saveTariffsMapped(payload) {
  if (!payload) return false;
  var sheet = getOrFindSheet("donGia");
  if (!sheet) return false;

  var headers = [
    "PhiUTBase", 
    "RiskThreshold", 
    "RiskRate", 
    "CuerQTQC", 
    "CuerQTBT", 
    "VipRates", 
    "FlexibleM3", 
    "FlexibleKG", 
    "Payload"
  ];

  var phiUTBase = payload.phiUTBase !== undefined ? Number(payload.phiUTBase) : 400000;
  var riskThreshold = payload.riskThreshold !== undefined ? Number(payload.riskThreshold) : 100000000;
  var riskRate = payload.riskRate !== undefined ? Number(payload.riskRate) : 0.01;
  var cuerQTQC = payload.cuerQTQC !== undefined ? Number(payload.cuerQTQC) : 1000000;
  var cuerQTBT = payload.cuerQTBT !== undefined ? Number(payload.cuerQTBT) : 700000;
  var vipRates = typeof payload.vipRates === "object" ? JSON.stringify(payload.vipRates) : (payload.vipRates || "{}");
  var flexibleM3 = typeof payload.flexibleM3 === "object" ? JSON.stringify(payload.flexibleM3) : (payload.flexibleM3 || "{}");
  var flexibleKG = typeof payload.flexibleKG === "object" ? JSON.stringify(payload.flexibleKG) : (payload.flexibleKG || "{}");
  var payloadJson = JSON.stringify(payload);

  var dataRow = [
    phiUTBase,
    riskThreshold,
    riskRate,
    cuerQTQC,
    cuerQTBT,
    vipRates,
    flexibleM3,
    flexibleKG,
    payloadJson
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold").setBackground("#f3f3f3");
  sheet.getRange(2, 1, 1, dataRow.length).setValues([dataRow]);

  var lastRow = sheet.getLastRow();
  if (lastRow > 2) {
    sheet.deleteRows(3, lastRow - 2);
  }
  return true;
}

// ── 7. CÔNG CỤ HỖ TRỢ (CONGCUHOTRO) ──
function getToolsMapped() {
  var sheet = getOrFindSheet("congCuHoTro");
  if (!sheet) return [];
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return [];

  var mapping = FIELD_MAPPINGS.congCuHoTro;
  var colMap = {};
  var keys = Object.keys(mapping);
  keys.forEach(function(k) {
    colMap[k] = getOrAddColumn(sheet, mapping[k].aliases, mapping[k].defaultHeader);
  });

  var rows = sheet.getDataRange().getValues();
  var data = [];

  for (var i = 1; i < rows.length; i++) {
    var obj = {};
    var hasData = false;
    keys.forEach(function(k) {
      var val = rows[i][colMap[k] - 1];
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        hasData = true;
      }
      obj[k] = (val !== undefined && val !== null) ? val : "";
    });
    if (hasData && (obj.name || obj.url)) {
      data.push(obj);
    }
  }
  return data;
}

function saveToolsMapped(tools) {
  if (!tools) return false;
  var toolList = tools;
  if (typeof toolList === "string") {
    try { toolList = JSON.parse(toolList); } catch(e) { return false; }
  }
  if (!Array.isArray(toolList)) return false;

  var sheet = getOrFindSheet("congCuHoTro");
  if (!sheet) return false;

  var headers = ["Name", "URL", "Description"];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold").setBackground("#f3f3f3");

  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }

  if (toolList.length === 0) return true;

  var rows = toolList.map(function(t) {
    return [
      t.name || "",
      t.url || "",
      t.desc || t.description || ""
    ];
  });

  sheet.getRange(2, 1, rows.length, 3).setValues(rows);
  return true;
}

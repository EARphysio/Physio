function doGet(e) { 
  // 如果前端是來詢問行事曆空檔的
  if (e.parameter.action === "getSchedule") { 
    var data = getWeeklySchedule(e.parameter.service); 
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON); 
  } 
  // 預設回傳
  return ContentService.createTextOutput("GAS API 正常運行中。"); 
}

function doPost(e) { 
  try { 
    var data = JSON.parse(e.postData.contents); 
    var props = PropertiesService.getScriptProperties(); 
    var sheetId = props.getProperty("SHEET_ID"); 
    var calId = props.getProperty("GOOGLE_CALENDAR_ID");

    var ss = SpreadsheetApp.openById(sheetId);
    var sheet = ss.getSheetByName("網頁預約表");
    
    if (!sheet) {
      sheet = ss.insertSheet("網頁預約表");
      sheet.appendRow([
        "提交時間","客源", "姓名", "電子郵件", "聯絡電話", "LINE名稱", 
        "生理性別", "生日", "服務項目", "預約日期", "預約時段", 
        "服務地點", "到府地址", "目前的身體狀況", "得知管道"
      ]);
      sheet.setFrozenRows(1);
    }
    
    var submitTime = Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy/MM/dd ah:mm:ss");
    var customerTypeStr = data.isOldCustomer ? "舊客" : "新客";
    var serviceNameMap = { "manual": "徒手", "gyrokinesis": "嬋柔" };
    var readableService = serviceNameMap[data.serviceType] || data.serviceType;
    var locationShort = data.location ? data.location.split("｜")[0] : "";

    var cal = CalendarApp.getCalendarById(calId) || CalendarApp.getDefaultCalendar();

    // ==========================================
    // 📍 支援多時段複選處理（請替換原本的單一時段寫入邏輯）
    // ==========================================
    var slots = data.appointmentSlots || []; // 取得前端傳過來的複選時段陣列
    var slotsSummaryText = []; // 用於 LINE 訊息彙整
    var slotsSummaryHtml = []; // 專門給 Email 用的 HTML 換行格式

    slots.forEach(function(slot) {
      sheet.appendRow([
        submitTime, customerTypeStr, data.name, data.email, data.phone, data.lineName || "",
        data.gender || "", data.birthday || "", readableService, slot.date,
        slot.time, data.location, data.address || "", data.bodyCondition || "", data.sourceChannel || ""
      ]);

      var timeParts = slot.time.split("-");
      var startP = timeParts[0].split(":");
      var endP = timeParts[1].split(":");
      var dateParts = slot.date.split("/"); 
      
      var startTime = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]), parseInt(startP[0]), parseInt(startP[1]));
      var endTime = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]), parseInt(endP[0]), parseInt(endP[1]));
      
      var eventTitle = "預約：" + data.name + " (" + readableService + ") - " + locationShort;
      var eventDesc = "客源：" + customerTypeStr + "\n電話：" + data.phone + "\n訴求：" + data.bodyCondition;
      cal.createEvent(eventTitle, startTime, endTime, { description: eventDesc });

      var dateLabel = formatDateLabel(slot.date);
      // 分別儲存一般文字與 HTML 格式
      slotsSummaryText.push("📅 " + dateLabel + " " + slot.time);
      // Email 用的時段不加 📅 圖示，符合您提供的圖片樣式
      slotsSummaryHtml.push(" " + dateLabel + " " + slot.time); 
    });

    // 📍 修正：確保 LINE 訊息字串組合安全，避免 undefined 錯誤
    var timeStringForLine = slotsSummaryText.length > 0 ? slotsSummaryText.join("\n") : "未提供時間";

    var lineMsg = "🔔 【收到預約囉！】\n" +
                  "🏷 客源：" + customerTypeStr + "\n" +
                  "👤 客戶：" + data.name + "\n" +
                  "💬 LINE名稱：" + (data.lineName || "未提供") + "\n" +
                  "------------------\n" +
                  timeStringForLine + "\n" +
                  "📍 地點：" + locationShort + "(" + readableService + ")\n" +
                  "------------------\n"+
                  "🕒 提交時間：" + submitTime;
                  
              
    sendLineNotify(lineMsg, props);

    if (data.email) {
      var emailSubject = "【EAR聆芯身體平衡】您的預約已成功送出";
      
      var timeStringForEmail = slotsSummaryHtml.length > 0 ? slotsSummaryHtml.join("<br>") : "未提供時間";

      var emailHtml = "親愛的 " + data.name + " 您好：<br><br>" +
                      "感謝您預約 EAR聆芯身體平衡！我們已經收到您的預約資訊，內容如下：<br><br>" +
                      "------------------------------------<br>" +
                      "服務項目：" + readableService + "<br>" +
                      "預約時段：<br>" + timeStringForEmail + "<br>" +
                      "服務地點：" + data.location + "<br>" +
                      "------------------------------------<br><br>" +
                      "期待為您服務！ <br>" +
                     "如有任何問題，歡迎隨時與我們連絡。<br>" + 
                      "此為系統自動發送信件，請勿直接回覆。<br>"+
                      "EAR聆芯身體平衡 敬上";
                      
      GmailApp.sendEmail(data.email, emailSubject, "", { htmlBody: emailHtml });
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    // 若發生錯誤，將錯誤訊息回傳，方便除錯
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 動態計算週次（以每個下週的星期日為第一天）
function getWeeklySchedule(serviceType) {
  var calId = PropertiesService.getScriptProperties().getProperty("GOOGLE_CALENDAR_ID");
  var cal = CalendarApp.getCalendarById(calId) || CalendarApp.getDefaultCalendar();
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  // 找尋下一個星期日作為第一週的第一天
  var nextSunday = new Date(today);
  var diffToSun = (7 - today.getDay()) % 7;
  if (diffToSun === 0 && today.getDay() !== 0) diffToSun = 7;
  nextSunday.setDate(today.getDate() + (today.getDay() === 0 ? 0 : diffToSun));

  var gridEndDate = new Date(nextSunday);
  gridEndDate.setDate(nextSunday.getDate() + 14);

  var events = cal.getEvents(nextSunday, gridEndDate);
  var weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  var timeSlots = (serviceType === "gyrokinesis") ?
    [{ h1: 11, m1: 0, h2: 11, m2: 55, label: "11:00-11:55" }, { h1: 20, m1: 0, h2: 20, m2: 55, label: "20:00-20:55" }] :
    [{ h1: 10, m1: 0, h2: 13, m2: 0, label: "10:00-13:00" }, { h1: 13, m1: 0, h2: 17, m2: 0, label: "13:00-17:00" }, { h1: 17, m1: 0, h2: 21, m2: 0, label: "17:00-21:00" }];

  function buildWeek(startD) {
    var days = [];
    for (var i = 0; i < 7; i++) {
      var d = new Date(startD);
      d.setDate(startD.getDate() + i);
      var dayOfWeek = d.getDay();
      var fullDate = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
      var dateLabel = (d.getMonth() + 1) + "/" + d.getDate() + "(" + weekDays[dayOfWeek] + ")";

      var slots = timeSlots.map(function(ts) {
        var sTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), ts.h1, ts.m1);
        var eTime = new Date(d.getFullYear(), d.getMonth(), d.getDate(), ts.h2, ts.m2);
        var status = "available";

        if (sTime < new Date()) {
          status = "expired";
        } else if (serviceType === "gyrokinesis") {
          // 嬋柔僅允許 週一 20:00 與 週三 11:00 可點選
          if (dayOfWeek === 1 && ts.h1 === 20) status = "available";
          else if (dayOfWeek === 3 && ts.h1 === 11) status = "available";
          else status = "disabled";
        }

        if (status === "available") {
          for (var k = 0; k < events.length; k++) {
            if (events[k].getStartTime() < eTime && events[k].getEndTime() > sTime) {
              status = "full"; break;
            }
          }
        }
        return { status: status };
      });

      days.push({ fullDate: fullDate, dateLabel: dateLabel, slots: slots });
    }
    
    var endD = new Date(startD); endD.setDate(startD.getDate() + 6);
    var rangeStr = "(" + (startD.getMonth() + 1) + "/" + startD.getDate() + "(" + weekDays[startD.getDay()] + ") ~ " + (endD.getMonth() + 1) + "/" + endD.getDate() + "(" + weekDays[endD.getDay()] + "))";
    return { days: days, dateRange: rangeStr };
  }

  var week2Start = new Date(nextSunday); week2Start.setDate(nextSunday.getDate() + 7);
  return {
    timeLabels: timeSlots.map(function(t) { return t.label; }),
    week1: buildWeek(nextSunday),
    week2: buildWeek(week2Start)
  };
}

function formatDateLabel(dateStr) {
  var days = ["日", "一", "二", "三", "四", "五", "六"];
  var parts = dateStr.split("/");
  var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return (d.getMonth() + 1) + "/" + d.getDate() + "(" + days[d.getDay()] + ")";
}

function sendLineNotify(msg, props) {
  var token = props.getProperty("LINE_ACCESS_TOKEN");
  var userId = props.getProperty("LINE_USER_ID");
  if (!token || !userId) return;
  // ==========================================
  // 📍 修正 1：確保 LINE Token 帶有 Bearer 授權字首
  // ==========================================
  var authHeader = token.indexOf("Bearer") === 0 ? token : "Bearer " + token;

  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", {
    method: "post",
    headers: { "Content-Type": "application/json", 
      "Authorization": authHeader  // 📍 修正：把 token 改成 authHeader
    }, 
    payload: JSON.stringify({ to: userId, messages: [{ type: "text", text: msg }] }), 
    muteHttpExceptions: true 
  });
}
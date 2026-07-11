let teachers = [];
let timetable = {};
let leaveHistory = [];
const periods = ["1st Period","2nd Period","3rd Period","4th Period","5th Period","6th Period"];

// Page Load
document.addEventListener('DOMContentLoaded', () => {
  loadHistory();
});

// TAB SWITCH - یہ فنکشن missing تھا
function showTab(tabId, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  btn.classList.add('active');
  if(tabId === 'leave') loadTeacherDropdown();
  if(tabId === 'substitute') loadHistory();
}

// SAMPLE DATA LOAD - یہ بھی missing تھا
function loadSampleData() {
  teachers = [
    {name: "Muhammad Ijaz", phone: "923414844580"},
    {name: "فاطمہ", phone: "923001111"},
    {name: "علی", phone: "923002222"},
    {name: "عائشہ", phone: "923003333"},
    {name: "سارا", phone: "923004444"},
    {name: "خالد", phone: "923005555"},
    {name: "مریم", phone: "923006666"},
    {name: "حسن", phone: "923007777"},
    {name: "زینب", phone: "923008888"}
  ];

  timetable = {};
  teachers.forEach(t => {
    timetable[t.name] = {};
    periods.forEach(p => {
      timetable[t.name][p] = Math.random() > 0.4? "Subject" : "FREE";
    });
  });

  localStorage.setItem('teachers', JSON.stringify(teachers));
  localStorage.setItem('timetable', JSON.stringify(timetable));
  renderTimetable();
  alert("✅ 9 Teachers Load ہو گئے۔ اب چھٹی لگائیں");
}

// TABLE RENDER
function renderTimetable() {
  let data = localStorage.getItem('timetable');
  let teach = localStorage.getItem('teachers');
  if(data) timetable = JSON.parse(data);
  if(teach) teachers = JSON.parse(teach);
  if(teachers.length === 0) {
    document.getElementById('timetableGrid').innerHTML = "<p>پہلے 'Sample Load کریں' بٹن دبائیں</p>";
    return;
  }

  let html = "<table><tr><th>Teacher</th>";
  periods.forEach(p => html += `<th>${p}</th>`);
  html += "</tr>";
  teachers.forEach(t => {
    html += `<tr><td><b>${t.name}</b></td>`;
    periods.forEach(p => {
      let cls = timetable[t.name][p] === "FREE"? "free" : "busy";
      html += `<td class="${cls}">${timetable[t.name][p]}</td>`;
    });
    html += "</tr>";
  });
  html += "</table>";
  document.getElementById('timetableGrid').innerHTML = html;
}

// DROPDOWN LOAD
function loadTeacherDropdown() {
  let data = localStorage.getItem('teachers');
  if(data) teachers = JSON.parse(data);
  let sel = document.getElementById('leaveTeacher');
  sel.innerHTML = "<option value=''>-- ٹیچر سلیکٹ کریں --</option>";
  teachers.forEach(t => sel.innerHTML += `<option>${t.name}</option>`);
}

// LEAVE SUBMIT
document.getElementById('leaveForm').addEventListener('submit', function(e){
  e.preventDefault();
  let teacher = document.getElementById('leaveTeacher').value;
  let date = document.getElementById('leaveDate').value;
  let period = document.getElementById('leavePeriod').value;
  let reason = document.getElementById('leaveReason').value;

  if(!teacher) return alert("ٹیچر سلیکٹ کریں");

  let freeTeachers = teachers.filter(t => t.name!== teacher && timetable[t.name][period] === "FREE");
  let substitute = freeTeachers.length > 0? freeTeachers[0] : null;

  let record = {date, absent: teacher, period, substitute: substitute? substitute.name : "کوئی نہیں", reason};
  leaveHistory.push(record);
  localStorage.setItem('leaveHistory', JSON.stringify(leaveHistory));

  let html = `<div class="substitute-box"><h3>✅ متبادل لگ گیا</h3>`;
  html += `<p><b>غیر حاضر:</b> ${teacher}</p><p><b>تاریخ:</b> ${date} | <b>Period:</b> ${period}</p>`;

  if(substitute){
    let message = `السلام علیکم ${substitute.name}\nمتبادل ڈیوٹی\nغیر حاضر: ${teacher}\nتاریخ: ${date}\nPeriod: ${period}`;
    let whatsappURL = `https://wa.me/${substitute.phone}?text=${encodeURIComponent(message)}`;
    html += `<p><b>متبادل ٹیچر:</b> ${substitute.name}</p><a href="${whatsappURL}" target="_blank" class="whatsapp-btn">📱 ${substitute.name} کو WhatsApp کریں</a>`;
  } else {
    html += `<p style="color:red;"><b>متبادل ٹیچر:</b> کوئی فری ٹیچر نہیں ملا</p>`;
  }
  html += `</div>`;
  document.getElementById('substituteResult').innerHTML = html;
  this.reset();
  loadHistory();
});

// HISTORY
function loadHistory() {
  leaveHistory = JSON.parse(localStorage.getItem('leaveHistory')) || [];
  let html = "";
  if(leaveHistory.length === 0) html = "<p>ابھی کوئی ریکارڈ نہیں</p>";
  else leaveHistory.reverse().forEach(r => {
    html += `<p>📅 <b>${r.date}</b> - ${r.absent} کی جگہ <b style="color:#2563eb">${r.substitute}</b></p>`;
  });
  document.getElementById('historyList').innerHTML = html;
}

// EXPORT
function exportData() {
  let data = {teachers, timetable, leaveHistory};
  let blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  let url = URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.href = url;
  a.download = "backup.json";
  a.click();
}

// PWA
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('sw.js');
    }

let teachers = [];
let timetable = {}; // {teacher: {period: subject}}
let leaveHistory = [];

const periods = ["1st Period","2nd Period","3rd Period","4th Period","5th Period","6th Period"];
const days = ["Mon","Tue","Wed","Thu","Fri","Sat"];

// Page Load پر Data Load کریں
document.addEventListener('DOMContentLoaded', () => {
  loadHistory();
});

// Tabs Switch
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
  if(tabId === 'leave') loadTeacherDropdown();
  if(tabId === 'substitute') loadHistory();
}

// Sample 9 Teachers Data - Phone کے ساتھ
function loadSampleData() {
  teachers = [
    {name: "Muhammad Ijaz", phone: "923414844580"},
    {name: "فاطمہ", phone: "923001111"},
    {name: "علی", phone: "923002222"},
    {name: "عائشہ", phone: "923003333"},
    {name: "سارا", phone: "923004444444"},
    {name: "خالد", phone: "923005555555"},
    {name: "مریم", phone: "923006666666"},
    {name: "حسن", phone: "923007777777"},
    {name: "زینب", phone: "923008888888"}
  ];

  timetable = {};
  teachers.forEach(t => {
    timetable[t.name] = {};
    periods.forEach(p => {
      // 60% chance busy, 40% chance free
      timetable[t.name][p] = Math.random() > 0.4? "Subject" : "FREE";
    });
  });

  localStorage.setItem('teachers', JSON.stringify(teachers));
  localStorage.setItem('timetable', JSON.stringify(timetable));

  renderTimetable();
  loadTeacherDropdown();
  alert("✅ 9 Teachers کا Sample Timetable Load ہو گیا");
}

// Timetable کو Table میں دکھائیں
function renderTimetable() {
  let data = localStorage.getItem('timetable');
  let teach = localStorage.getItem('teachers');
  if(data) timetable = JSON.parse(data);
  if(teach) teachers = JSON.parse(teach);

  let html = "<table><tr><th>Teacher</th>";
  periods.forEach(p => html += `<th>${p}</th>`);
  html += "</tr

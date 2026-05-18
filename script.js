const state = {
  connected: false,
  gestureCount: 0,
  battery: 85,
  packetsSent: 0,
  gestureHistory: [],
  messages: [],
  buzzerActive: false,
  emergencyActive: false,
  speakerConnected: false,
  uptime: 0,
  flexData: { thumb: [], index: [], middle: [] },
  currentGesture: null
};

const gestures = [
  { name: 'Hello', icon: 'fa-hand-paper', voice: 'Hello, how are you?' },
  { name: 'Yes', icon: 'fa-thumbs-up', voice: 'Yes, I agree.' },
  { name: 'No', icon: 'fa-thumbs-down', voice: 'No, thank you.' },
  { name: 'Thank You', icon: 'fa-hand-holding-heart', voice: 'Thank you very much.' },
  { name: 'Help', icon: 'fa-hand-point-up', voice: 'I need help, please.' },
  { name: 'Water', icon: 'fa-glass-water', voice: 'I would like some water.' },
  { name: 'Food', icon: 'fa-utensils', voice: 'I am hungry.' },
  { name: 'Emergency', icon: 'fa-exclamation-triangle', voice: 'Emergency! I need immediate help!' }
];

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

$$('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const section = item.dataset.section;
    $$('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    $$('.section').forEach(s => s.classList.remove('active'));
    $(`#${section}`).classList.add('active');
    const titles = { dashboard: 'Dashboard', monitoring: 'Monitoring', voice: 'Voice Output', alerts: 'Alerts', history: 'History', settings: 'Settings' };
    $('#pageTitle').textContent = titles[section] || 'Dashboard';
    if (window.innerWidth < 992) $('#sidebar').classList.remove('open');
  });
});

$('#menuToggle').addEventListener('click', () => $('#sidebar').classList.toggle('open'));

function toggleConnection() {
  state.connected = !state.connected;
  const btn = $('#connectBtn');
  const heroBtn = $('#heroConnectBtn');
  const statusDot = $('#sidebarStatus');
  const statusText = $('#sidebarStatusText');

  if (state.connected) {
    btn.classList.add('connected');
    btn.innerHTML = '<i class="fas fa-check"></i><span>Connected</span>';
    heroBtn.innerHTML = '<i class="fas fa-check"></i><span>Connected</span>';
    statusDot.classList.add('connected');
    statusText.textContent = 'Connected';
    $('#wifiStatus').textContent = 'ESP32 Online';
    $('#wifiStatusCard').textContent = 'Connected';
    $('#btStatus').textContent = 'Connected';
    $('#esp32Status').textContent = 'Running';
    $('#macAddress').textContent = 'A4:CF:12:8B:3E:7F';
    startSimulation();
  } else {
    btn.classList.remove('connected');
    btn.innerHTML = '<i class="fas fa-plug"></i><span>Connect Device</span>';
    heroBtn.innerHTML = '<i class="fas fa-link"></i><span>Connect Device</span>';
    statusDot.classList.remove('connected');
    statusText.textContent = 'Disconnected';
    $('#wifiStatus').textContent = 'ESP32 Offline';
    $('#wifiStatusCard').textContent = 'Offline';
    $('#btStatus').textContent = 'Disconnected';
    $('#esp32Status').textContent = 'Not Connected';
    $('#macAddress').textContent = '--:--:--:--:--:--';
    stopSimulation();
  }
}

$('#connectBtn').addEventListener('click', toggleConnection);
$('#heroConnectBtn').addEventListener('click', toggleConnection);
$('#quickReconnect').addEventListener('click', () => { if (!state.connected) toggleConnection(); });
$('#reconnectDevice').addEventListener('click', () => { if (!state.connected) toggleConnection(); });
$('#disconnectDevice').addEventListener('click', () => { if (state.connected) toggleConnection(); });

let intervals = [];

function startSimulation() {
  intervals.push(setInterval(updateBattery, 5000));
  intervals.push(setInterval(updateFlexSensors, 800));
  intervals.push(setInterval(updateESP32Metrics, 2000));
  intervals.push(setInterval(updateTransmission, 1000));
  intervals.push(setInterval(simulateGesture, 4000));
  intervals.push(setInterval(updateUptime, 1000));
  intervals.push(setInterval(drawGraph, 100));
}

function stopSimulation() {
  intervals.forEach(clearInterval);
  intervals = [];
}

function updateBattery() {
  state.battery = Math.max(20, state.battery - Math.random() * 2);
  const level = Math.round(state.battery);
  $('#batteryLevel').textContent = level + '%';
  $('#batteryFill').style.width = level + '%';
  $('#oledBattery').textContent = level + '%';
}

function updateFlexSensors() {
  const fingers = ['thumb', 'index', 'middle', 'ring', 'pinky'];
  fingers.forEach(f => {
    const value = Math.round(Math.random() * 900 + 100);
    const pct = Math.round((value / 1023) * 100);
    const fillEl = $(`#${f}Fill`);
    const valEl = $(`#${f}Value`);
    if (fillEl) fillEl.style.width = pct + '%';
    if (valEl) valEl.textContent = value;
  });
}

function updateESP32Metrics() {
  const cpu = Math.round(Math.random() * 40 + 20);
  const mem = Math.round(Math.random() * 30 + 40);
  $('#cpuFill').style.width = cpu + '%';
  $('#cpuValue').textContent = cpu + '%';
  $('#memFill').style.width = mem + '%';
  $('#memValue').textContent = mem + '%';
  $('#signalStrength').textContent = '-' + Math.round(Math.random() * 20 + 40) + 'dBm';
}

function updateTransmission() {
  state.packetsSent += Math.round(Math.random() * 5 + 1);
  $('#packetsSent').textContent = state.packetsSent;
  $('#latency').textContent = Math.round(Math.random() * 30 + 10) + 'ms';
  $('#dataRate').textContent = (Math.random() * 5 + 2).toFixed(1) + 'kbps';
}

function updateUptime() {
  state.uptime++;
  const h = String(Math.floor(state.uptime / 3600)).padStart(2, '0');
  const m = String(Math.floor((state.uptime % 3600) / 60)).padStart(2, '0');
  const s = String(state.uptime % 60).padStart(2, '0');
  $('#uptime').textContent = `${h}:${m}:${s}`;
}

function simulateGesture() {
  const gesture = gestures[Math.floor(Math.random() * gestures.length)];
  state.currentGesture = gesture;
  state.gestureCount++;
  $('#gestureCount').textContent = state.gestureCount;
  $('#gestureText').textContent = gesture.name;
  $('#gestureDisplay .gesture-icon-large i').className = 'fas ' + gesture.icon;
  $('#voiceOutput').textContent = gesture.voice;
  $('#confidence').textContent = (Math.random() * 8 + 92).toFixed(1) + '%';
  $('#oledGesture').textContent = gesture.name;

  const now = new Date();
  const timeStr = now.toLocaleTimeString();
  state.gestureHistory.unshift({ gesture: gesture.name, voice: gesture.voice, time: timeStr, icon: gesture.icon });
  updateTimeline();

  state.messages.unshift({ text: gesture.voice, time: timeStr });
  updateMessages();

  $('#ttsText').textContent = gesture.voice;

  if (gesture.name === 'Emergency') {
    triggerEmergency();
  }
}

function updateTimeline() {
  const timeline = $('#timeline');
  if (state.gestureHistory.length === 0) {
    timeline.innerHTML = '<div class="timeline-empty"><i class="fas fa-history"></i><p>No gesture history yet.</p></div>';
    return;
  }
  timeline.innerHTML = state.gestureHistory.slice(0, 20).map(item =>
    `<div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <div class="timeline-gesture"><i class="fas ${item.icon}"></i> ${item.gesture}</div>
        <div class="timeline-voice">"${item.voice}"</div>
      </div>
      <div class="timeline-time">${item.time}</div>
    </div>`
  ).join('');
}

function updateMessages() {
  const list = $('#messageList');
  if (state.messages.length === 0) {
    list.innerHTML = '<div class="message-empty"><i class="fas fa-inbox"></i><p>No messages yet</p></div>';
    return;
  }
  list.innerHTML = state.messages.slice(0, 10).map(msg =>
    `<div class="message-item">
      <span class="message-text">${msg.text}</span>
      <span class="message-time">${msg.time}</span>
    </div>`
  ).join('');
}

const canvas = $('#flexGraph');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = 200;
}

function drawGraph() {
  if (!state.connected) return;
  resizeCanvas();

  const w = canvas.width;
  const h = canvas.height;

  state.flexData.thumb.push(Math.random() * 800 + 100);
  state.flexData.index.push(Math.random() * 700 + 150);
  state.flexData.middle.push(Math.random() * 600 + 200);

  if (state.flexData.thumb.length > 60) {
    state.flexData.thumb.shift();
    state.flexData.index.shift();
    state.flexData.middle.shift();
  }

  ctx.clearRect(0, 0, w, h);

  const drawLine = (data, color) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    data.forEach((val, i) => {
      const x = (i / 59) * w;
      const y = h - (val / 1023) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  };

  drawLine(state.flexData.thumb, '#0066FF');
  drawLine(state.flexData.index, '#00D4FF');
  drawLine(state.flexData.middle, '#00C853');
}

window.addEventListener('resize', resizeCanvas);

$('#playVoice').addEventListener('click', () => {
  const text = $('#ttsText').textContent;
  if (text && text !== 'Connect device to begin voice communication...') {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = parseFloat($('#ttsSpeed').value);
    utterance.pitch = parseFloat($('#ttsPitch').value);
    speechSynthesis.speak(utterance);
  }
});

$('#stopVoice').addEventListener('click', () => speechSynthesis.cancel());

$('#clearTts').addEventListener('click', () => {
  $('#ttsText').textContent = 'Connect device to begin voice communication...';
});

$('#ttsSpeed').addEventListener('input', (e) => $('#ttsSpeedValue').textContent = parseFloat(e.target.value).toFixed(1) + 'x');
$('#ttsPitch').addEventListener('input', (e) => $('#ttsPitchValue').textContent = parseFloat(e.target.value).toFixed(1));
$('#volumeSlider').addEventListener('input', (e) => $('#volumeValue').textContent = e.target.value + '%');
$('#speechRate').addEventListener('input', (e) => $('#speechRateValue').textContent = parseFloat(e.target.value).toFixed(1) + 'x');
$('#voiceVolume').addEventListener('input', (e) => $('#voiceVolumeValue').textContent = e.target.value + '%');

$('#connectSpeaker').addEventListener('click', () => {
  state.speakerConnected = !state.speakerConnected;
  const btn = $('#connectSpeaker');
  const status = $('#speakerStatus');
  if (state.speakerConnected) {
    btn.innerHTML = '<i class="fas fa-check"></i>Connected';
    status.innerHTML = '<span class="status-text">Connected</span>';
    status.classList.add('connected');
  } else {
    btn.innerHTML = '<i class="fab fa-bluetooth-b"></i>Connect Bluetooth Speaker';
    status.innerHTML = '<span class="status-text">Not Connected</span>';
    status.classList.remove('connected');
  }
});

$('#quickVoice').addEventListener('click', () => {
  const utterance = new SpeechSynthesisUtterance('Multisense Glove system is ready.');
  speechSynthesis.speak(utterance);
});

$('#sendEmergency').addEventListener('click', () => $('#emergencyModal').classList.add('active'));
$('#quickEmergency').addEventListener('click', () => $('#emergencyModal').classList.add('active'));
$('#closeModal').addEventListener('click', () => $('#emergencyModal').classList.remove('active'));
$('#cancelEmergency').addEventListener('click', () => $('#emergencyModal').classList.remove('active'));

$('#confirmEmergency').addEventListener('click', () => {
  $('#emergencyModal').classList.remove('active');
  triggerEmergency();
});

function triggerEmergency() {
  state.emergencyActive = true;
  $('#emergencyIcon').style.animation = 'emergencyPulse 1s ease-in-out infinite';
  $('#buzzerIndicator').classList.add('active');
  $('#buzzerStatus').textContent = 'Active';
  $('#buzzerStatus').classList.add('active');

  $$('.step').forEach((step, i) => {
    setTimeout(() => step.classList.add('active'), i * 800);
  });

  setTimeout(() => {
    state.emergencyActive = false;
    $('#emergencyIcon').style.animation = '';
    $('#buzzerIndicator').classList.remove('active');
    $('#buzzerStatus').textContent = 'Inactive';
    $('#buzzerStatus').classList.remove('active');
  }, 5000);
}

$('#testBuzzer').addEventListener('click', () => {
  $('#buzzerIndicator').classList.add('active');
  $('#buzzerStatus').textContent = 'Active';
  $('#buzzerStatus').classList.add('active');
  setTimeout(() => {
    $('#buzzerIndicator').classList.remove('active');
    $('#buzzerStatus').textContent = 'Inactive';
    $('#buzzerStatus').classList.remove('active');
  }, 2000);
});

$('#stopBuzzer').addEventListener('click', () => {
  $('#buzzerIndicator').classList.remove('active');
  $('#buzzerStatus').textContent = 'Inactive';
  $('#buzzerStatus').classList.remove('active');
});

$('#thumbThreshold').addEventListener('input', (e) => $('#thumbThresholdValue').textContent = e.target.value);
$('#indexThreshold').addEventListener('input', (e) => $('#indexThresholdValue').textContent = e.target.value);
$('#middleThreshold').addEventListener('input', (e) => $('#middleThresholdValue').textContent = e.target.value);

$('#calibrateSensors').addEventListener('click', () => {
  $('#thumbThreshold').value = 512; $('#thumbThresholdValue').textContent = '512';
  $('#indexThreshold').value = 512; $('#indexThresholdValue').textContent = '512';
  $('#middleThreshold').value = 512; $('#middleThresholdValue').textContent = '512';
});

$('#quickCalibrate').addEventListener('click', () => {
  $$('.section').forEach(s => s.classList.remove('active'));
  $('#settings').classList.add('active');
  $$('.nav-item').forEach(n => n.classList.remove('active'));
  $('[data-section="settings"]').classList.add('active');
  $('#pageTitle').textContent = 'Settings';
  $('#calibrateSensors').click();
});

$('#searchHistory').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  $$('.timeline-item').forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(query) ? 'flex' : 'none';
  });
});

$('#filterHistory').addEventListener('change', (e) => {
  const filter = e.target.value;
  $$('.timeline-item').forEach(item => {
    const gesture = item.querySelector('.timeline-gesture').textContent.toLowerCase();
    if (filter === 'all') { item.style.display = 'flex'; return; }
    item.style.display = gesture.includes(filter) ? 'flex' : 'none';
  });
});

$('#clearHistory').addEventListener('click', () => {
  state.gestureHistory = [];
  state.messages = [];
  state.gestureCount = 0;
  $('#gestureCount').textContent = '0';
  updateTimeline();
  updateMessages();
});

$('#emergencyModal').addEventListener('click', (e) => {
  if (e.target === $('#emergencyModal')) $('#emergencyModal').classList.remove('active');
});

<?php
include "config.php";
include "auth.php";
include "quota_reset.php";
include "telegram.php";

$id = $_SESSION['donor_id'];
$donor = $conn->query("SELECT * FROM donors WHERE id=$id")->fetch_assoc();
$donor = resetQuota($donor);

$remaining = $donor['total_quota_gb'] - $donor['used_quota_gb'];
$percent = ($donor['total_quota_gb'] > 0)
            ? ($donor['used_quota_gb'] / $donor['total_quota_gb']) * 100
            : 0;

$nextResetText = 'N/A';
if (!empty($donor['last_reset'])) {
    $lastReset = new DateTime($donor['last_reset']);
    $nextReset = (clone $lastReset)->modify('+1 month');
    $nextResetText = $nextReset->format('d F Y');
    $now = new DateTime();
    $remainingDays = $now->diff($nextReset)->days;
}

$msg = '';

/* ================= SEND REQUEST ================= */
if (isset($_POST['send_request'])) {
    $request = trim($_POST['request_text']);

    if ($request !== '') {

        $stmt = $conn->prepare(
          "INSERT INTO requests (donor_id, request_text, created_by)
           VALUES (?, ?, 'donor')"
        );
        $stmt->bind_param("is", $id, $request);
        $stmt->execute();

        /* Telegram Notification */
        $tgMessage =
            "🔔 <b>New Donor Request</b>\n\n" .
            "👤 <b>Username:</b> {$donor['username']}\n" .
            "📧 <b>Email:</b> {$donor['email']}\n" .
            "💎 <b>Tier:</b> " . strtoupper($donor['tier']) . "\n\n" .
            "📝 <b>Request:</b>\n{$request}\n\n" .
            "⏰ <b>Time:</b> " . date("Y-m-d H:i:s");

        sendTelegram($tgMessage);

        $msg = "Your request has been sent successfully!";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dashboard | Motion Picture Mafia</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap" rel="stylesheet">
<link rel="icon" type="image/png" href="mpm logo.png">    

<!-- (YOUR EXISTING CSS UNCHANGED) -->
<style>
body{
    background: #000;
    color:#fff;
    min-height:100vh;
    font-family:'Poppins',sans-serif;
    margin:0;
    padding:0;
    overflow-x: hidden;
    position:relative;
}

/* Loading Animation - Same as others */
#loader {
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 1s ease, visibility 1s ease;
}
#loader.hidden {
  opacity: 0;
  visibility: hidden;
}
.loader-logo {
  font-size: clamp(2.5rem, 10vw, 4rem);
  font-weight: 800;
  background: linear-gradient(135deg, #ff3c3c, #ffb347, #ff7b00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 30px;
  animation: pulse 2s infinite;
}
.loader-spinner {
  width: 80px;
  height: 80px;
  border: 6px solid rgba(255,60,60,0.2);
  border-top: 6px solid #ff3c3c;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}
@keyframes pulse { 0%,100%{opacity:0.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }

.main-content {
  opacity: 0;
  transition: opacity 1.2s ease;
}
.main-content.loaded { opacity: 1; }

.container{
    padding:60px 20px 80px;
    position:relative;
    z-index:1;
    max-width: 1000px;
    margin: 0 auto;
}
h2{
    color:#ffb347;
    text-align:center;
    margin-bottom:40px;
    background:linear-gradient(135deg,#ff3c3c,#ffb347);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    font-weight:700;
    font-size: clamp(2rem, 6vw, 2.8rem);
    animation: fadeUp 0.8s ease;
}
.card{
    border-radius:20px;
    padding:25px;
    margin-bottom:25px;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(12px);
    border:1px solid rgba(255,255,255,0.05);
    box-shadow: 0 15px 40px rgba(0,0,0,0.7);
    animation: fadeUp 0.8s ease;
}
h5{ color:#ffb347; margin-bottom:15px; }
p{ color:#fff; margin-bottom:8px; font-size:1.05rem; }
.progress{
    height:25px;
    border-radius:15px;
    background: rgba(255,255,255,0.1);
    margin-top:15px;
}
.progress-bar{
    background: linear-gradient(135deg,#ff3c3c,#ff7b00);
    box-shadow: 0 0 15px rgba(255,60,60,0.4);
}
.btn-danger{
    border-radius:25px;
    padding:12px 30px;
    font-weight:600;
    background: linear-gradient(135deg,#ff3c3c,#ff1e1e);
    border:none;
    transition:.3s;
}
.btn-danger:hover{
    transform: scale(1.08);
    box-shadow:0 0 30px rgba(255,60,60,0.8);
}
@keyframes fadeUp{
    from{opacity:0; transform:translateY(30px);}
    to{opacity:1; transform:translateY(0);}
}

/* Background */
#particle-canvas, .background-animation {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.background-animation::before,
.background-animation::after {
  content: '';
  position: absolute;
  width: 800px;
  height: 800px;
  border-radius: 45% 55% 60% 40%;
  background: linear-gradient(135deg, #ff3c3c, #ff7b00, #7b00ff, #ff3c3c);
  opacity: 0.15;
  animation: float 25s infinite linear;
}
.background-animation::before { top: -200px; left: -200px; }
.background-animation::after { bottom: -300px; right: -200px; width: 1000px; height: 1000px; animation-delay: -12s; animation-duration: 30s; }
.orb { /* same as before */ }
@keyframes float { 0% { transform: translate(0,0) rotate(0deg); } 100% { transform: translate(100px,100px) rotate(360deg); } }
@keyframes drift { 0% { transform: translate(0,0); } 50% { transform: translate(150px,-100px); } 100% { transform: translate(0,0); } }
</style>
</head>
<body>

<!-- Loading Screen -->
<div id="loader">
  <div class="loader-logo">MPM</div>
  <div class="loader-spinner"></div>
</div>

<!-- Main Content -->
<div class="main-content">
  <canvas id="particle-canvas"></canvas>
  <div class="background-animation">
    <div class="orb"></div>
    <div class="orb"></div>
    <div class="orb"></div>
  </div>

  <div class="container">
      <h2 class="text-center mb-4">
        Welcome, <?= htmlspecialchars($donor['username']) ?>
      </h2>

      <div class="card">
          <h5>Data Quota</h5>
          <p>Total: <?= $donor['total_quota_gb'] ?> GB</p>
          <p>Used: <?= $donor['used_quota_gb'] ?> GB</p>
          <p>Remaining: <?= $remaining ?> GB</p>
          <div class="progress">
              <div class="progress-bar" style="width:<?= $percent ?>%"></div>
          </div>
      </div>

      <div class="card">
          <h5>Your Tier: <?= strtoupper($donor['tier']) ?></h5>
          <p>
            Next Reset: <?= $nextResetText ?>
            <?php if(isset($remainingDays)) echo " ({$remainingDays} days left)"; ?>
          </p>
      </div>

      <div class="card">
        <h5>📩 Send a Request</h5>

        <?php if($msg): ?>
          <div class="alert alert-success"><?= $msg ?></div>
        <?php endif; ?>

        <form method="post">
          <textarea
            name="request_text"
            class="form-control mb-3"
            rows="4"
            placeholder="Type your request here..."
            required></textarea>

          <button class="btn btn-warning w-100" name="send_request">
            Send Request
          </button>
        </form>
      </div>

      <div class="text-center">
          <a href="logout.php" class="btn btn-danger">Logout</a>
      </div>
  </div>
</div>

<!-- (YOUR EXISTING JS UNCHANGED) -->
<script>
const loader = document.getElementById('loader');
const mainContent = document.querySelector('.main-content');

window.addEventListener('load', () => {
  initParticles();
  setTimeout(() => {
    loader.classList.add('hidden');
    mainContent.classList.add('loaded');
  }, 800);
});

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const particleCount = window.innerWidth < 768 ? 50 : 80;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.color = Math.random() > 0.5 ? '#ff3c3c' : '#ff7b00';
    this.opacity = Math.random() * 0.4 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
    if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  animate();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
</script>

</body>
</html>

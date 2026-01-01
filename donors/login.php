<?php
include "config.php";
if(isset($_POST['login'])){
    $u = $_POST['username'];
    $p = $_POST['password'];
    $q = $conn->prepare("SELECT * FROM donors WHERE username=?");
    $q->bind_param("s",$u);
    $q->execute();
    $r = $q->get_result()->fetch_assoc();
    if($r && password_verify($p,$r['password'])){
        $_SESSION['donor_id'] = $r['id'];
        header("Location: dashboard.php");
        exit;
    }
    $error = "Invalid Login";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Donor Login | Motion Picture Mafia</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
<link rel="icon" type="image/png" href="mpm logo.png">    
<style>
*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:'Poppins',sans-serif;
}
body{
  min-height:100vh;
  background:#000;
  display:flex;
  align-items:center;
  justify-content:center;
  color:#fff;
  overflow:hidden;
  position:relative;
}

/* === PARTICLE CANVAS BACKGROUND === */
#particle-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
}

/* Existing floating blobs (kept for depth) */
.background-animation {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
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

.background-animation::before {
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.background-animation::after {
  bottom: -300px;
  right: -200px;
  width: 1000px;
  height: 1000px;
  animation-delay: -12s;
  animation-duration: 30s;
}

.orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #ff7b00, transparent);
  opacity: 0.1;
  filter: blur(40px);
  animation: drift linear infinite;
}

.orb:nth-child(1) { width: 400px; height: 400px; top: 10%; left: 15%; animation-duration: 40s; }
.orb:nth-child(2) { width: 600px; height: 600px; bottom: 10%; right: 10%; background: radial-gradient(circle at 30% 30%, #7b00ff, transparent); animation-duration: 50s; animation-delay: -15s; }
.orb:nth-child(3) { width: 300px; height: 300px; top: 50%; left: 70%; background: radial-gradient(circle at 30% 30%, #ff3c3c, transparent); animation-duration: 35s; animation-delay: -8s; }

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(100px, 100px) rotate(360deg); }
}

@keyframes drift {
  0% { transform: translate(0, 0); }
  50% { transform: translate(150px, -100px); }
  100% { transform: translate(0, 0); }
}

/* Login card */
.login-card{
  position:relative;
  width:100%;
  max-width:380px;
  background:rgba(0,0,0,0.85);
  padding:35px;
  border-radius:20px;
  box-shadow:0 25px 60px rgba(0,0,0,0.7);
  z-index:1;
  animation:fadeUp .8s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.05);
}
@keyframes fadeUp{
  from{opacity:0;transform:translateY(30px);}
  to{opacity:1;transform:translateY(0);}
}
.login-card h3{
  text-align:center;
  margin-bottom:25px;
  background:linear-gradient(135deg,#ff3c3c,#ffb347);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}
/* Inputs */
.login-card input{
  width:100%;
  padding:12px 15px;
  margin-bottom:15px;
  border-radius:25px;
  border:1px solid rgba(255,255,255,0.1);
  background:rgba(255,255,255,0.05);
  color:#fff;
  outline:none;
}
.login-card input::placeholder{
  color:#aaa;
}
/* Button */
.login-card button{
  width:100%;
  padding:12px;
  border-radius:25px;
  border:none;
  background:linear-gradient(135deg,#ff3c3c,#ff7b00);
  font-weight:700;
  cursor:pointer;
  transition:.3s;
}
.login-card button:hover{
  transform:scale(1.05);
  box-shadow:0 0 25px rgba(255,60,60,.7);
}
/* Links */
.links{
  text-align:center;
  margin-top:18px;
}
.links a{
  display:inline-block;
  margin:6px;
  font-size:.9rem;
  color:#ffb347;
  text-decoration:none;
}
.links a:hover{
  text-decoration:underline;
}
/* Error */
.alert{
  background:#ff3c3c;
  color:#000;
  padding:10px;
  border-radius:12px;
  text-align:center;
  margin-bottom:15px;
}
</style>
</head>
<body>

<!-- Particle Canvas -->
<canvas id="particle-canvas"></canvas>

<!-- Existing blob background (kept for extra depth) -->
<div class="background-animation">
  <div class="orb"></div>
  <div class="orb"></div>
  <div class="orb"></div>
</div>

<div class="login-card">
  <h3>Donor Login</h3>
  <?php if(isset($error)) echo "<div class='alert'>$error</div>"; ?>
  <form method="POST">
    <input name="username" placeholder="Username" required>
    <input type="password" name="password" placeholder="Password" required>
    <button name="login">Login</button>
  </form>
  <div class="links">
    <a href="https://mpm-donor.free.nf/donors/index.php">View Donor Benefits</a>
    <a href="http://motionpicturemafia.com/donation-faq.html">FAQ</a>
  </div>
</div>

<script>
// Lightweight particle system
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const particles = [];
const particleCount = 80;

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

function init() {
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}

init();
animate();
</script>

</body>
</html>
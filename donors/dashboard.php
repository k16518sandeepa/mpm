<?php
include "auth.php";
include "config.php";
$id = $_SESSION['donor_id'];
$d = $conn->query("SELECT * FROM donors WHERE id=$id")->fetch_assoc();
?>
<!DOCTYPE html>
<html>
<head>
<title>Donor Dashboard</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body { background-color:#121212; color:#f1f1f1; }
.card { border-radius:15px; margin-bottom:20px; }
</style>
</head>
<body>
<div class="container py-4">
<h2 class="mb-4 text-center">Welcome, <?= $d['username'] ?></h2>
<div class="row justify-content-center">
  <div class="col-md-6 col-sm-10">
    <div class="card bg-dark text-light shadow">
      <div class="card-header">Your Tier</div>
      <div class="card-body text-center">
        <h3>
        <span class="badge 
        <?php 
        switch($d['tier']){
          case 'basic': echo 'bg-secondary'; break;
          case 'silver': echo 'bg-info'; break;
          case 'gold': echo 'bg-warning text-dark'; break;
          case 'platinum': echo 'bg-primary'; break;
        } ?>">
        <?= strtoupper($d['tier']) ?>
        </span>
        </h3>
      </div>
    </div>
    <div class="card bg-dark text-light shadow">
      <div class="card-header">Data Quota</div>
      <div class="card-body text-center">
        <p>Total: <?= $d['total_quota_gb'] ?> GB</p>
        <p>Used: <?= $d['used_quota_gb'] ?> GB</p>
        <p>Remaining: <?= $d['total_quota_gb'] - $d['used_quota_gb'] ?> GB</p>
        <div class="progress">
          <div class="progress-bar bg-warning" role="progressbar" style="width: <?= ($d['used_quota_gb']/$d['total_quota_gb'])*100 ?>%"></div>
        </div>
      </div>
    </div>
    <a href="logout.php" class="btn btn-danger w-100">Logout</a>
  </div>
</div>
</div>
</body>
</html>

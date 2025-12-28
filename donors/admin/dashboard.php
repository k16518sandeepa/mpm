<?php
include "auth.php";
include "../config.php";
$donors = $conn->query("SELECT * FROM donors WHERE role='donor'");
?>
<!DOCTYPE html>
<html>
<head>
<title>Admin Dashboard</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body { background-color:#121212; color:#f1f1f1; }
.card-header { font-weight:bold; }
</style>
</head>
<body>
<div class="container py-4">
<h2 class="mb-4 text-center">Admin Dashboard</h2>
<div class="table-responsive">
<table class="table table-dark table-striped table-hover align-middle">
<thead class="table-secondary text-dark">
<tr>
<th>Username</th><th>Tier</th><th>Total GB</th><th>Used GB</th><th>Remaining</th><th>Action</th>
</tr>
</thead>
<tbody>
<?php while($d = $donors->fetch_assoc()): ?>
<tr>
<td><?= $d['username'] ?></td>
<td>
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
</td>
<td><?= $d['total_quota_gb'] ?></td>
<td><?= $d['used_quota_gb'] ?></td>
<td><?= $d['total_quota_gb'] - $d['used_quota_gb'] ?></td>
<td><a class="btn btn-sm btn-outline-warning" href="edit_donor.php?id=<?= $d['id'] ?>">Edit</a></td>
</tr>
<?php endwhile; ?>
</tbody>
</table>
</div>
<a href="logout.php" class="btn btn-danger mt-3">Logout</a>
</div>
</body>
</html>

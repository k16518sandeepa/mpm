<?php
include "auth.php";
include "../config.php";
$id = $_GET['id'];
$donor = $conn->query("SELECT * FROM donors WHERE id=$id")->fetch_assoc();
if(isset($_POST['update'])){
    $tier = $_POST['tier'];
    $total = $_POST['total'];
    $used = $_POST['used'];
    $conn->query("UPDATE donors SET tier='$tier', total_quota_gb=$total, used_quota_gb=$used WHERE id=$id");
    header("Location: dashboard.php"); exit;
}
?>
<!DOCTYPE html>
<html>
<head>
<title>Edit Donor</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body { background-color:#121212; color:#f1f1f1; }
.card { border-radius:15px; margin-top:30px; }
</style>
</head>
<body>
<div class="container d-flex justify-content-center">
<div class="col-md-5">
<div class="card bg-dark p-4 shadow">
<h3 class="text-center mb-4">Edit Donor: <?= $donor['username'] ?></h3>
<form method="post">
<div class="mb-3">
<label>Tier</label>
<select class="form-select" name="tier" required>
<option value="basic" <?= $donor['tier']=='basic'?'selected':'' ?>>Basic</option>
<option value="silver" <?= $donor['tier']=='silver'?'selected':'' ?>>Silver</option>
<option value="gold" <?= $donor['tier']=='gold'?'selected':'' ?>>Gold</option>
<option value="platinum" <?= $donor['tier']=='platinum'?'selected':'' ?>>Platinum</option>
</select>
</div>
<div class="mb-3">
<label>Total Quota GB</label>
<input type="number" name="total" class="form-control" value="<?= $donor['total_quota_gb'] ?>" required>
</div>
<div class="mb-3">
<label>Used Quota GB</label>
<input type="number" name="used" class="form-control" value="<?= $donor['used_quota_gb'] ?>" required>
</div>
<button class="btn btn-warning w-100" type="submit" name="update">Update</button>
<a href="dashboard.php" class="btn btn-secondary w-100 mt-2">Back</a>
</form>
</div>
</div>
</div>
</body>
</html>

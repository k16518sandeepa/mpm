<?php
include "auth.php";
include "../config.php";

$id = (int)$_GET['id'];
$donor = $conn->query("SELECT * FROM donors WHERE id=$id")->fetch_assoc();

if(isset($_POST['save'])){
    $name = $_POST['name'];
    $tier = $_POST['tier'];
    $total = $_POST['total'];
    $used = $_POST['used'];
    $note = $_POST['note'];

    $stmt = $conn->prepare(
        "UPDATE donors 
         SET name=?, tier=?, total_quota_gb=?, used_quota_gb=?, special_note=? 
         WHERE id=?"
    );
    $stmt->bind_param("ssiisi", $name, $tier, $total, $used, $note, $id);
    $stmt->execute();

    header("Location: dashboard.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<title>Edit Donor</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body class="bg-dark text-light">

<div class="container col-md-4 py-5">
<h3 class="mb-4">Edit Donor</h3>

<form method="POST">

<label>Name</label>
<input class="form-control mb-3" name="name"
       value="<?= htmlspecialchars($donor['name']) ?>" required>

<label>Tier</label>
<select name="tier" class="form-control mb-3">
<?php foreach(['basic','silver','gold','platinum'] as $t): ?>
<option value="<?= $t ?>" <?= $donor['tier']==$t?'selected':'' ?>>
<?= strtoupper($t) ?>
</option>
<?php endforeach; ?>
</select>

<label>Total Quota (GB)</label>
<input type="number" class="form-control mb-3" name="total"
       value="<?= $donor['total_quota_gb'] ?>" required>

<label>Used Quota (GB)</label>
<input type="number" step="0.01" class="form-control mb-3" name="used"
       value="<?= $donor['used_quota_gb'] ?>" required>

<label>Special Note (Admin only)</label>
<textarea class="form-control mb-3" name="note" rows="4"><?= htmlspecialchars($donor['special_note']) ?></textarea>

<button class="btn btn-warning w-100" name="save">Save Changes</button>

<a href="dashboard.php" class="btn btn-secondary w-100 mt-2">Cancel</a>
</form>
</div>

</body>
</html>

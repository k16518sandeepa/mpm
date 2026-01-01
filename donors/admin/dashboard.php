<?php
include "auth.php";
include "../config.php";

/* Donors */
$donors = $conn->query("SELECT * FROM donors WHERE role='donor'");

/* Requests */
$pendingRequests = $conn->query("
  SELECT r.*, d.username, d.name
  FROM requests r
  JOIN donors d ON r.donor_id = d.id
  WHERE r.status='pending'
  ORDER BY r.created_at DESC
");

$fulfilledRequests = $conn->query("
  SELECT r.*, d.username, d.name
  FROM requests r
  JOIN donors d ON r.donor_id = d.id
  WHERE r.status='fulfilled'
  ORDER BY r.fulfilled_at DESC
");
?>

<!DOCTYPE html>
<html lang="en">
<head>
<title>Admin Dashboard</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="bg-dark text-light">

<div class="container-fluid py-4">

<h2 class="mb-4">Admin Dashboard</h2>

<!-- ================= ADD REQUEST ================= -->
<h4 class="mt-4">➕ Add Request (Admin)</h4>

<form method="post" action="add_request_admin.php" class="row g-2 mb-4">
  <div class="col-md-3">
    <select name="donor_id" class="form-select" required>
      <option value="">Select Donor</option>
      <?php
      $donorList = $conn->query("SELECT id, username FROM donors WHERE role='donor'");
      while($d = $donorList->fetch_assoc()):
      ?>
      <option value="<?= $d['id'] ?>"><?= htmlspecialchars($d['username']) ?></option>
      <?php endwhile; ?>
    </select>
  </div>

  <div class="col-md-7">
    <input type="text" name="request_text" class="form-control" placeholder="Request details" required>
  </div>

  <div class="col-md-2">
    <button class="btn btn-primary w-100">Add</button>
  </div>
</form>

<!-- ================= PENDING REQUESTS ================= -->
<h4 class="mt-4">📩 Pending Requests</h4>

<div class="table-responsive">
<table class="table table-dark table-bordered align-middle">
<tr>
  <th>Donor</th>
  <th>Request</th>
  <th>Created By</th>
  <th>Date</th>
  <th>Action</th>
</tr>

<?php if($pendingRequests->num_rows == 0): ?>
<tr>
  <td colspan="5" class="text-center text-muted">No pending requests</td>
</tr>
<?php endif; ?>

<?php while($r = $pendingRequests->fetch_assoc()): ?>
<tr>
  <td><?= htmlspecialchars($r['username']) ?></td>
  <td><?= htmlspecialchars($r['request_text']) ?></td>
  <td><?= strtoupper($r['created_by']) ?></td>
  <td><?= date('Y-m-d', strtotime($r['created_at'])) ?></td>
  <td>
    <a href="mark_request_done.php?id=<?= $r['id'] ?>"
       class="btn btn-success btn-sm"
       onclick="return confirm('Mark this request as fulfilled?')">
       ✔ Done
    </a>
  </td>
</tr>
<?php endwhile; ?>
</table>
</div>

<!-- ================= FULFILLED REQUESTS ================= -->
<h4 class="mt-5 text-success">✅ Fulfilled Requests</h4>

<div class="table-responsive">
<table class="table table-dark table-bordered">
<tr>
  <th>Donor</th>
  <th>Request</th>
  <th>Completed On</th>
  <th>Action</th>
</tr>

<?php if($fulfilledRequests->num_rows == 0): ?>
<tr>
  <td colspan="3" class="text-center text-muted">No fulfilled requests yet</td>
</tr>
<?php endif; ?>

<?php while($r = $fulfilledRequests->fetch_assoc()): ?>
<tr>
  <td><?= htmlspecialchars($r['username']) ?></td>
  <td><?= htmlspecialchars($r['request_text']) ?></td>
  <td><?= date('Y-m-d', strtotime($r['fulfilled_at'])) ?></td>
  <td>
    <a href="delete_request.php?id=<?= $r['id'] ?>"
       class="btn btn-danger btn-sm"
       onclick="return confirm('Remove this fulfilled request?')">
       🗑 Remove
    </a>
  </td>
</tr>
<?php endwhile; ?>
</table>
</div>

<!-- ================= DONORS TABLE ================= -->
<h4 class="mt-5">👤 Donors</h4>

<div class="table-responsive">
<table class="table table-dark table-bordered align-middle">
<tr>
<th>Username</th>
<th>Name</th>
<th>Tier</th>
<th>Total GB</th>
<th>Used GB</th>
<th>Remaining GB</th>
<th>Remaining Time</th>
<th>Note</th>
<th>Action</th>
</tr>

<?php while($d = $donors->fetch_assoc()): ?>
<?php
$remainingGB = $d['total_quota_gb'] - $d['used_quota_gb'];
$remainingTime = "N/A";

if (!empty($d['last_reset'])) {
    $lastReset = new DateTime($d['last_reset']);
    $nextReset = (clone $lastReset)->modify('+1 month');
    $now = new DateTime();
    if ($now < $nextReset) {
        $diff = $now->diff($nextReset);
        $remainingTime = $diff->days . " days (Resets on " . $nextReset->format('Y-m-d') . ")";
    } else {
        $remainingTime = "Reset overdue";
    }
}
?>
<tr>
<td><?= htmlspecialchars($d['username']) ?></td>
<td><?= htmlspecialchars($d['name']) ?></td>
<td><?= strtoupper($d['tier']) ?></td>
<td><?= $d['total_quota_gb'] ?></td>
<td><?= $d['used_quota_gb'] ?></td>
<td><?= $remainingGB ?></td>
<td><?= $remainingTime ?></td>
<td><?= $d['special_note'] ? htmlspecialchars(substr($d['special_note'],0,40)).'...' : '<span class="text-muted">No note</span>' ?></td>
<td>
<a class="btn btn-sm btn-warning" href="edit_donor.php?id=<?= $d['id'] ?>">Edit</a>
</td>
</tr>
<?php endwhile; ?>
</table>
</div>

<a href="logout.php" class="btn btn-danger mt-4">Logout</a>

</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

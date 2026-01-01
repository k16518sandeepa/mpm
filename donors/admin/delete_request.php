<?php
include "auth.php";
include "../config.php";

if (!isset($_GET['id'])) {
    header("Location: dashboard.php");
    exit;
}

$id = (int)$_GET['id'];

// Only delete fulfilled requests (extra safety)
$conn->query("
  DELETE FROM requests
  WHERE id = $id AND status = 'fulfilled'
");

header("Location: dashboard.php");
exit;

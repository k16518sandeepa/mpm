<?php
include "auth.php";
include "../config.php";

$id = (int)$_GET['id'];

$conn->query("
  UPDATE requests
  SET status='fulfilled', fulfilled_at=NOW()
  WHERE id=$id
");

header("Location: dashboard.php");
exit;

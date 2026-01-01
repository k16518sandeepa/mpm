<?php
include "auth.php";
include "../config.php";

$donor_id = (int)$_POST['donor_id'];
$request = trim($_POST['request_text']);

if ($donor_id && $request) {
    $stmt = $conn->prepare(
      "INSERT INTO requests (donor_id, request_text, created_by)
       VALUES (?, ?, 'admin')"
    );
    $stmt->bind_param("is", $donor_id, $request);
    $stmt->execute();
}

header("Location: dashboard.php");
exit;

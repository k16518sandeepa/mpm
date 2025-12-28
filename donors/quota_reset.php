<?php
function resetQuota($donor){
    $currentMonth = date('Y-m');
    $lastReset = date('Y-m', strtotime($donor['last_reset']));

    if($currentMonth !== $lastReset){
        global $conn;
        $stmt = $conn->prepare("UPDATE donors SET used_quota_gb=0, last_reset=CURDATE() WHERE id=?");
        $stmt->bind_param("i",$donor['id']);
        $stmt->execute();
        $donor['used_quota_gb'] = 0;
    }
    return $donor;
}
?>

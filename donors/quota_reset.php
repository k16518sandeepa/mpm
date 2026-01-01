<?php
function resetQuota($donor){
    global $conn;

    if (empty($donor['last_reset'])) {
        // First-time initialization
        $stmt = $conn->prepare(
            "UPDATE donors SET last_reset=CURDATE() WHERE id=?"
        );
        $stmt->bind_param("i", $donor['id']);
        $stmt->execute();

        $donor['last_reset'] = date('Y-m-d');
        return $donor;
    }

    $lastReset = new DateTime($donor['last_reset']);
    $nextReset = (clone $lastReset)->modify('+1 month');
    $now = new DateTime();

    if ($now >= $nextReset) {
        // Reset used quota and update last_reset
        $stmt = $conn->prepare(
            "UPDATE donors SET used_quota_gb=0, last_reset=CURDATE() WHERE id=?"
        );
        $stmt->bind_param("i", $donor['id']);
        $stmt->execute();

        $donor['used_quota_gb'] = 0;
        $donor['last_reset'] = date('Y-m-d');
    }

    return $donor;
}
?>

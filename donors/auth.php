<?php
if(!isset($_SESSION['donor_id'])){
    header("Location: login.php");
    exit;
}
?>

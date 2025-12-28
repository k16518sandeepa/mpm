<?php
$conn = new mysqli("localhost","root","","motionpicturemafia");
if ($conn->connect_error) die("DB Error");
session_start();
?>

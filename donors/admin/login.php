<?php
include "../config.php";

if(isset($_POST['login'])){
    $u = $_POST['username'];
    $p = $_POST['password'];

    $q = $conn->prepare("SELECT * FROM donors WHERE username=? AND role='admin'");
    $q->bind_param("s",$u);
    $q->execute();
    $a = $q->get_result()->fetch_assoc();

    if($a && password_verify($p,$a['password'])){
        $_SESSION['admin_id'] = $a['id'];
        header("Location: dashboard.php");
        exit;
    }
    $error = "Invalid admin login";
}
?>
<!DOCTYPE html>
<html>
<head>
<title>Admin Login</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" type="image/png" href="mpm logo.png">
</head>
<body class="bg-dark text-light">

<div class="container col-md-4 py-5">
<h3 class="text-center">Admin Login</h3>

<?php if(isset($error)) echo "<div class='alert alert-danger'>$error</div>"; ?>

<form method="POST">
<input class="form-control mb-3" name="username" placeholder="Username" required>
<input class="form-control mb-3" type="password" name="password" placeholder="Password" required>
<button class="btn btn-warning w-100" name="login">Login</button>
</form>
</div>

</body>
</html>

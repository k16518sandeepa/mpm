<?php
include "config.php";
if(isset($_POST['login'])){
    $u = trim($_POST['username']);
    $p = $_POST['password'];
    $stmt = $conn->prepare("SELECT * FROM donors WHERE username=? AND role='donor'");
    $stmt->bind_param("s",$u);
    $stmt->execute();
    $donor = $stmt->get_result()->fetch_assoc();
    if($donor && password_verify($p,$donor['password'])){
        $_SESSION['donor_id'] = $donor['id'];
        header("Location: dashboard.php"); exit;
    } else {
        $error = "Invalid login";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
<title>Donor Login</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body { background-color:#121212; color:#f1f1f1; }
.card { border-radius:15px; }
</style>
</head>
<body>
<div class="container d-flex justify-content-center align-items-center vh-100">
<div class="col-md-5">
<div class="card bg-dark p-4 shadow">
<h3 class="text-center mb-4">Donor Login</h3>
<?php if(isset($error)): ?>
<div class="alert alert-danger"><?= $error ?></div>
<?php endif; ?>
<form method="post">
<div class="mb-3">
<input type="text" name="username" class="form-control" placeholder="Username" required>
</div>
<div class="mb-3">
<input type="password" name="password" class="form-control" placeholder="Password" required>
</div>
<button class="btn btn-info w-100" type="submit">Login</button>
</form>
</div>
</div>
</div>
</body>
</html>

<?php
require_once 'config/db.php';
require_once 'config/auth.php';
logoutUser();
header("Location: login.php?msg=logout");
exit();

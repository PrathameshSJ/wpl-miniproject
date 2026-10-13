<?php
require_once 'config/db.php';
require_once 'config/auth.php';

if (isLoggedIn()) {
    if ($_SESSION['role'] === 'admin') {
        header("Location: ../admin/dashboard.php");
    } else {
        header("Location: home.php");
    }
    exit();
}

$errors = [];
$email = '';
$values = ['full_name' => '', 'reg_email' => '', 'phone' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['auth_action'] ?? '';

    if ($action === 'login') {
        $email    = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['login_email'] = 'Enter a valid email address.';
        }
        
        if (!$errors) {
            $pdo = getDB();
            $stmt = $pdo->prepare("SELECT user_id, full_name, email, role, password_hash FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password_hash'])) {
                loginUser($user);
                
                if (isset($_POST['remember'])) {
                    setRememberMeCookie($user['user_id']);
                }

                if ($user['role'] === 'admin') {
                    header("Location: ../admin/dashboard.php");
                } else {
                    header("Location: home.php");
                }
                exit();
            } else {
                $errors['general'] = 'Invalid email or password.';
            }
        }
    } 
    
    elseif ($action === 'register') {
        $full_name = trim($_POST['full_name'] ?? '');
        $reg_email = trim($_POST['reg_email'] ?? '');
        $phone     = trim($_POST['phone'] ?? '');
        $password  = $_POST['reg_password'] ?? '';

        $values = ['full_name' => $full_name, 'reg_email' => $reg_email, 'phone' => $phone];

        if (strlen($full_name) < 2) $errors['reg_name'] = 'Name too short.';
        if (!filter_var($reg_email, FILTER_VALIDATE_EMAIL)) $errors['reg_email'] = 'Invalid email.';
        if (!preg_match('/^(\+91)?[6-9]\d{9}$/', $phone)) $errors['reg_phone'] = 'Invalid Indian mobile number.';
        if (strlen($password) < 8) $errors['reg_pass'] = 'Password must be 8+ characters.';

        if (empty($errors)) {
            $pdo = getDB();
            $stmt = $pdo->prepare("SELECT user_id FROM users WHERE email = ?");
            $stmt->execute([$reg_email]);
            if ($stmt->fetch()) {
                $errors['general'] = 'Email already registered.';
            } else {
                $hash = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, 'customer')");
                $stmt->execute([$full_name, $reg_email, $phone, $hash]);
                
                $newUserId = $pdo->lastInsertId();
                loginUser([
                    'user_id' => $newUserId, 
                    'full_name' => $full_name, 
                    'email' => $reg_email, 
                    'role' => 'customer'
                ]);
                header("Location: home.php?msg=welcome");
                exit();
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>BakeEase - Artisan Login</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms"></script>
    <script src="./js/tailwind-config.js"></script>
    <link href="./styles/login.css" rel="stylesheet"/>
</head>
<body class="min-h-screen bg-surface overflow-hidden">
    <div class="relative min-h-screen">
        <aside class="absolute top-0 left-0 w-1/2 h-screen hidden lg:block">
            <img alt="Artisan pastries" class="absolute inset-0 w-full h-full object-cover" src="./images/artisan-pastries.png"/>
            <div class="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-12 left-12 right-12 text-white">
                <blockquote class="text-3xl font-serif italic mb-2">"The secret ingredient is always love and a lot of butter."</blockquote>
                <p class="text-xs font-semibold tracking-widest uppercase opacity-80">— The BakeEase Artisan</p>
            </div>
        </aside>

        <main class="ml-0 lg:ml-[50%] flex flex-col items-center justify-center p-6 lg:p-16 h-screen overflow-y-auto">
            <div class="w-full max-w-[420px] space-y-8">
                <header class="text-center lg:text-left">
                    <h1 class="text-4xl font-bold text-primary font-serif cursor-pointer" onclick="window.location.href='home.php'">BakeEase</h1>
                    <p class="text-on-surface-variant italic mt-2">Crafting memories, one bite at a time.</p>
                </header>

                <nav class="flex border-b border-surface-variant">
                    <button id="tab-login" onclick="toggleAuth('login')" class="flex-1 py-3 text-sm font-semibold border-b-2 border-primary text-primary transition-all">Login</button>
                    <button id="tab-register" onclick="toggleAuth('register')" class="flex-1 py-3 text-sm font-semibold text-on-surface-variant hover:text-primary transition-all">Register</button>
                </nav>

                <?php if (isset($errors['general'])): ?>
                    <div class="p-3 bg-red-100 text-red-700 text-xs rounded-lg border border-red-200">
                        <?= clean($errors['general']) ?>
                    </div>
                <?php endif; ?>

                <section id="login-section" class="space-y-4">
                    <form class="space-y-4" method="POST">
                        <input type="hidden" name="auth_action" value="login">
                        <div class="space-y-1">
                            <label class="text-xs font-bold uppercase text-on-surface-variant ml-1">Email</label>
                            <input name="email" value="<?= clean($email) ?>" class="w-full bg-surface-low border-surface-variant rounded-lg px-4 py-3 text-sm focus:border-primary outline-none" type="email" placeholder="bakeease@example.com"/>
                            <?php if(isset($errors['login_email'])): ?>
                                <p class="text-[10px] text-red-600 px-1"><?= $errors['login_email'] ?></p>
                            <?php endif; ?>
                        </div>
                        <div class="space-y-1">
                            <div class="flex justify-between items-center px-1">
                                <label class="text-xs font-bold uppercase text-on-surface-variant">Password</label>
                                <a class="text-[10px] font-bold text-primary hover:underline" href="#">Forgot?</a>
                            </div>
                            <input name="password" class="w-full bg-surface-low border-surface-variant rounded-lg px-4 py-3 text-sm focus:border-primary outline-none" type="password" placeholder="••••••••"/>
                        </div>
                        
                        <div class="flex items-center gap-2 px-1">
                            <input type="checkbox" name="remember" id="remember" class="rounded border-gray-300 text-primary focus:ring-primary">
                            <label for="remember" class="text-[11px] font-semibold text-on-surface-variant uppercase">Remember me for 30 days</label>
                        </div>

                        <button class="w-full artisan-gradient text-white font-bold py-3 rounded-lg shadow hover:opacity-90 transition-all uppercase tracking-widest text-xs" type="submit">Login to Kitchen</button>
                    </form>
                    
                    <footer class="text-center mt-4">
                        <a class="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors" href="home.php">Browse as Guest</a>
                    </footer>
                </section>

                <section id="register-section" class="space-y-4 hidden">
                    <form class="space-y-4" method="POST">
                        <input type="hidden" name="auth_action" value="register">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1">
                                <label class="text-xs font-bold uppercase text-on-surface-variant ml-1">Full Name</label>
                                <input name="full_name" value="<?= clean($values['full_name']) ?>" class="w-full bg-surface-low border-surface-variant rounded-lg px-4 py-3 text-sm" placeholder="Strawberry Milkshake" type="text"/>
                                <?php if(isset($errors['reg_name'])): ?><p class="text-[10px] text-red-600 px-1"><?= $errors['reg_name'] ?></p><?php endif; ?>
                            </div>
                            <div class="space-y-1">
                                <label class="text-xs font-bold uppercase text-on-surface-variant ml-1">Phone</label>
                                <input name="phone" value="<?= clean($values['phone']) ?>" class="w-full bg-surface-low border-surface-variant rounded-lg px-4 py-3 text-sm" placeholder="+91 9876543210" type="tel"/>
                                <?php if(isset($errors['reg_phone'])): ?><p class="text-[10px] text-red-600 px-1"><?= $errors['reg_phone'] ?></p><?php endif; ?>
                            </div>
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-bold uppercase text-on-surface-variant ml-1">Email Address</label>
                            <input name="reg_email" value="<?= clean($values['reg_email']) ?>" class="w-full bg-surface-low border-surface-variant rounded-lg px-4 py-3 text-sm" placeholder="bakeease@example.com" type="email"/>
                            <?php if(isset($errors['reg_email'])): ?><p class="text-[10px] text-red-600 px-1"><?= $errors['reg_email'] ?></p><?php endif; ?>
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-bold uppercase text-on-surface-variant ml-1">Password</label>
                            <input name="reg_password" class="w-full bg-surface-low border-surface-variant rounded-lg px-4 py-3 text-sm" placeholder="••••••••" type="password"/>
                            <?php if(isset($errors['reg_pass'])): ?><p class="text-[10px] text-red-600 px-1"><?= $errors['reg_pass'] ?></p><?php endif; ?>
                        </div>
                        <button class="w-full artisan-gradient text-white font-bold py-3 rounded-lg shadow hover:opacity-90 transition-all uppercase tracking-widest text-xs" type="submit">Create Account</button>
                    </form>
                </section>

                <div class="relative flex items-center py-2">
                    <div class="flex-grow border-t border-surface-variant"></div>
                    <span class="px-3 text-[10px] uppercase text-on-surface-variant font-bold">Or continue with</span>
                    <div class="flex-grow border-t border-surface-variant"></div>
                </div>

                <button class="w-full flex items-center justify-center gap-3 bg-white border border-surface-variant hover:bg-surface-low py-3 rounded-lg transition-all text-sm font-semibold shadow-sm">
                    <img src="./images/google.png" class="w-5 h-5" alt="Google">
                    Google Account
                </button>
            </div>
        </main>
    </div>
    <script src="./js/login.js"></script>
</body>
</html>
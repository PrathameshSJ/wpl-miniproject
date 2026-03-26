// Select tab buttons
const loginBtn = document.querySelector('.login-desktop-thq-button-elm1');
const registerBtn = document.querySelector('.login-desktop-thq-button-elm2');

// Select forms
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

// Select error elements
const emailError = document.getElementById('email-error');
const registerEmailError = document.getElementById('register-email-error');
const fullnameError = document.getElementById('fullname-error');
const phoneError = document.getElementById('phone-error');
const passwordError = document.getElementById('password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');

// Switch to Login
loginBtn.addEventListener('click', () => {
  loginForm.style.display = 'flex';
  registerForm.style.display = 'none';

  loginBtn.style.borderBottom = '2px solid #914617';
  registerBtn.style.borderBottom = 'none';
  
  // Reset register form errors when switching
  hideAllErrors();
});

// Switch to Register
registerBtn.addEventListener('click', () => {
  loginForm.style.display = 'none';
  registerForm.style.display = 'flex';

  registerBtn.style.borderBottom = '2px solid #914617';
  loginBtn.style.borderBottom = 'none';
  
  // Reset register form errors when switching
  hideAllErrors();
});

// Login form validation
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email-input').value.trim();
  const password = document.getElementById('password-input').value.trim();
  
  let isValid = true;
  
  // Email validation
  if (!isValidEmail(email)) {
    emailError.style.display = 'flex';
    const emailInput = document.getElementById('email-input');
    if (emailInput && emailInput.parentElement) {
      emailInput.parentElement.style.borderColor = 'rgba(186, 26, 26, 1)';
      // Show the error icon for email field
      const errorIcon = emailInput.parentElement.querySelector('.login-desktop-thq-container-elm17');
      if (errorIcon) {
        errorIcon.style.display = 'block';
      }
    }
    isValid = false;
  } else {
    emailError.style.display = 'none';
    const emailInput = document.getElementById('email-input');
    if (emailInput && emailInput.parentElement) {
      emailInput.parentElement.style.borderColor = 'rgba(218, 193, 182, 0.30000001192092896)';
      // Hide the error icon for email field
      const errorIcon = emailInput.parentElement.querySelector('.login-desktop-thq-container-elm17');
      if (errorIcon) {
        errorIcon.style.display = 'none';
      }
    }
  }
  
  // Password validation
  if (password.length === 0) {
    // For login, we don't show password error, just prevent submission
    isValid = false;
  }
  
  if (isValid) {
    // Simulate login
    alert('Login successful!');
    // In a real application, you would submit the form here
    // loginForm.submit();
  }
});

// Register form validation
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const fullname = document.getElementById('fullname-input').value.trim();
  const email = document.getElementById('register-email-input').value.trim();
  const phone = document.getElementById('phone-input').value.trim();
  const password = document.getElementById('register-password-input').value.trim();
  const confirmPassword = document.getElementById('confirm-password-input').value.trim();
  
  let isValid = true;
  
  // Full name validation
  if (fullname.length < 2) {
    fullnameError.style.display = 'flex';
    isValid = false;
  } else {
    fullnameError.style.display = 'none';
  }
  
  // Email validation
  if (!isValidEmail(email)) {
    registerEmailError.style.display = 'flex';
    const emailInput = document.getElementById('register-email-input');
    if (emailInput && emailInput.parentElement) {
      emailInput.parentElement.style.borderColor = 'rgba(186, 26, 26, 1)';
      // Show the error icon for email field
      const errorIcon = emailInput.parentElement.querySelector('.login-desktop-thq-container-elm17');
      if (errorIcon) {
        errorIcon.style.display = 'block';
      }
    }
    isValid = false;
  } else {
    registerEmailError.style.display = 'none';
    const emailInput = document.getElementById('register-email-input');
    if (emailInput && emailInput.parentElement) {
      emailInput.parentElement.style.borderColor = 'rgba(218, 193, 182, 0.30000001192092896)';
      // Hide the error icon for email field
      const errorIcon = emailInput.parentElement.querySelector('.login-desktop-thq-container-elm17');
      if (errorIcon) {
        errorIcon.style.display = 'none';
      }
    }
  }
  
  // Phone validation
  if (!isValidPhone(phone)) {
    phoneError.style.display = 'flex';
    isValid = false;
  } else {
    phoneError.style.display = 'none';
  }
  
  // Password validation
  if (password.length < 8) {
    passwordError.style.display = 'flex';
    isValid = false;
  } else {
    passwordError.style.display = 'none';
  }
  
  // Confirm password validation
  if (password !== confirmPassword) {
    confirmPasswordError.style.display = 'flex';
    isValid = false;
  } else {
    confirmPasswordError.style.display = 'none';
  }
  
  if (isValid) {
    // Simulate registration
    alert('Registration successful!');
    // registerForm.submit();
  }
});

// Validation functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  // Check if it has at least 10 digits (basic phone validation)
  return digitsOnly.length >= 10;
}


function hideAllErrors() {
  emailError.style.display = 'none';
  registerEmailError.style.display = 'none';
  fullnameError.style.display = 'none';
  phoneError.style.display = 'none';
  passwordError.style.display = 'none';
  confirmPasswordError.style.display = 'none';
  
  document.querySelectorAll('.login-desktop-thq-container-elm17').forEach(icon => icon.style.display = 'none');
  
  const emailInput = document.getElementById('email-input');
  const registerEmailInput = document.getElementById('register-email-input');
  const fullnameInput = document.getElementById('fullname-input');
  const phoneInput = document.getElementById('phone-input');
  const passwordInput = document.getElementById('register-password-input');
  const confirmPasswordInput = document.getElementById('confirm-password-input');
  
  [emailInput, registerEmailInput, fullnameInput, phoneInput, passwordInput, confirmPasswordInput].forEach(input => {
    if (input) {
      input.parentElement.style.borderColor = 'rgba(218, 193, 182, 0.30000001192092896)';
    }
  });
}

// Helper function to show error with red border
function showErrorWithBorder(errorElement, inputElement) {
  errorElement.style.display = 'flex';
  if (inputElement && inputElement.parentElement) {
    inputElement.parentElement.style.borderColor = 'rgba(186, 26, 26, 1)';
  }
  
  // Show the error icon for email fields
  if (inputElement && (inputElement.id === 'email-input' || inputElement.id === 'register-email-input')) {
    const errorIcon = inputElement.parentElement.querySelector('.login-desktop-thq-container-elm17');
    if (errorIcon) {
      errorIcon.style.display = 'block';
    }
  }
}

function hideErrorWithBorder(errorElement, inputElement) {
  errorElement.style.display = 'none';
  if (inputElement && inputElement.parentElement) {
    inputElement.parentElement.style.borderColor = 'rgba(218, 193, 182, 0.30000001192092896)';
  }
  
  // Hide the error icon for email fields
  if (inputElement && (inputElement.id === 'email-input' || inputElement.id === 'register-email-input')) {
    const errorIcon = inputElement.parentElement.querySelector('.login-desktop-thq-container-elm17');
    if (errorIcon) {
      errorIcon.style.display = 'none';
    }
  }
}

// Real-time validation for better UX
document.getElementById('email-input').addEventListener('input', () => {
  const email = document.getElementById('email-input').value.trim();
  const emailInput = document.getElementById('email-input');
  if (isValidEmail(email)) {
    hideErrorWithBorder(emailError, emailInput);
  } else if (email.length > 0) {
    showErrorWithBorder(emailError, emailInput);
  }
});

document.getElementById('register-email-input').addEventListener('input', () => {
  const email = document.getElementById('register-email-input').value.trim();
  const emailInput = document.getElementById('register-email-input');
  if (isValidEmail(email)) {
    hideErrorWithBorder(registerEmailError, emailInput);
  } else if (email.length > 0) {
    showErrorWithBorder(registerEmailError, emailInput);
  }
});

document.getElementById('fullname-input').addEventListener('input', () => {
  const fullname = document.getElementById('fullname-input').value.trim();
  const fullnameInput = document.getElementById('fullname-input');
  if (fullname.length >= 2) {
    hideErrorWithBorder(fullnameError, fullnameInput);
  } else if (fullname.length > 0) {
    showErrorWithBorder(fullnameError, fullnameInput);
  }
});

document.getElementById('phone-input').addEventListener('input', () => {
  const phone = document.getElementById('phone-input').value.trim();
  const phoneInput = document.getElementById('phone-input');
  if (isValidPhone(phone)) {
    hideErrorWithBorder(phoneError, phoneInput);
  } else if (phone.length > 0) {
    showErrorWithBorder(phoneError, phoneInput);
  }
});

document.getElementById('register-password-input').addEventListener('input', () => {
  const password = document.getElementById('register-password-input').value.trim();
  const passwordInput = document.getElementById('register-password-input');
  if (password.length >= 8) {
    hideErrorWithBorder(passwordError, passwordInput);
  } else if (password.length > 0) {
    showErrorWithBorder(passwordError, passwordInput);
  }
  
  const confirmPassword = document.getElementById('confirm-password-input').value.trim();
  const confirmPasswordInput = document.getElementById('confirm-password-input');
  if (confirmPassword.length > 0) {
    if (password === confirmPassword) {
      hideErrorWithBorder(confirmPasswordError, confirmPasswordInput);
    } else {
      showErrorWithBorder(confirmPasswordError, confirmPasswordInput);
    }
  }
});

document.getElementById('confirm-password-input').addEventListener('input', () => {
  const password = document.getElementById('register-password-input').value.trim();
  const confirmPassword = document.getElementById('confirm-password-input').value.trim();
  const confirmPasswordInput = document.getElementById('confirm-password-input');
  
  if (password === confirmPassword && confirmPassword.length > 0) {
    hideErrorWithBorder(confirmPasswordError, confirmPasswordInput);
  } else if (confirmPassword.length > 0) {
    showErrorWithBorder(confirmPasswordError, confirmPasswordInput);
  }
});

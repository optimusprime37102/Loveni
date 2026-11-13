const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | undefined {
  const value = email.trim();
  if (!value) return 'Email is required';
  if (!EMAIL_REGEX.test(value)) return 'Enter a valid email address';
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return undefined;
}

export function validateName(name: string): string | undefined {
  const value = name.trim();
  if (!value) return 'Name is required';
  if (value.length < 2) return 'Name must be at least 2 characters';
  if (value.length > 40) return 'Name must be under 40 characters';
  return undefined;
}

export function validateNote(text: string): string | undefined {
  const value = text.trim();
  if (!value) return 'Write a little something first';
  if (value.length > 500) return 'Notes can be up to 500 characters';
  return undefined;
}

export function getAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/weak-password':
      return 'Choose a stronger password (6+ characters).';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again shortly.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

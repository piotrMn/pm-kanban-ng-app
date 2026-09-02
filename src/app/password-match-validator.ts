import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(passwordKey: string, password2Key: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey);
    const password2 = group.get(password2Key);

    if (!password || !password2) {
      return null;
    }

    if (password2.errors && !password2.errors['passwordMismatch']) {
      return null;
    }

    if (password.value !== password2.value) {
      password2.setErrors({ ...password2.errors, passwordMismatch: true });
      return { passwordMismatch: true };
    }

    const { passwordMismatch, ...remainingErrors } = password2.errors ?? {};
    password2.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
    return null;
  };
  
}

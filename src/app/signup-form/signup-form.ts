import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { passwordMatchValidator } from '../password-match-validator';
import { SignupRequest } from '../model/signup-request';

@Component({
  selector: 'app-signup-form',
  imports: [ReactiveFormsModule],
  templateUrl: './signup-form.html',
  styleUrl: './signup-form.css',
})
export class SignupForm implements OnInit {

    constructor(
    private readonly formBuilder: FormBuilder, 
    private authService: AuthService,
    private router: Router) {}

    signupForm: FormGroup = new FormGroup({})

    ngOnInit(): void {
    this.signupForm = this.formBuilder.group(
      { username: ['', Validators.minLength(6)],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required, Validators.minLength(8)]] }, 
      { validators: passwordMatchValidator('password', 'password2') });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Valid', this.signupForm.value)
      let signupFormValue = this.signupForm.value
      let signupRequest: SignupRequest = {
        username: signupFormValue.username,
        email: signupFormValue.email,
        password: signupFormValue.password
      }
      this.authService.postSignupRequest(signupRequest).subscribe({
        next: resp => {
          console.log('Signup successful', resp)
          this.router.navigate(['login'])
        },
        error: err => {
          console.log('Signup failed', err)
          this.signupForm.reset()
        }
      });
    }
  }

}

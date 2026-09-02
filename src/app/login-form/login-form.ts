import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest } from '../../../login-request';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  imports: [ ReactiveFormsModule ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
  standalone: true
})
export class LoginForm implements OnInit {

  constructor(private readonly formBuilder: FormBuilder, private authService: AuthService, private router: Router){}

  loginForm: FormGroup = new FormGroup({})

  showInvalidError = false

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  dismissLoginError(): void {
    this.loginForm.setErrors(null);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      let loginRequest: LoginRequest = this.loginForm.value
      this.authService.postLoginRequest(loginRequest).subscribe({
          next: resp => {
            this.authService.handleSuccessfulLogin(resp)
            this.router.navigate(['teams'])
          },
          error: err => {
            this.loginForm.reset()
            this.loginForm.setErrors({invalidUsernameOrPassword: true})
            this.showInvalidError = true
            setTimeout(() => {
              this.showInvalidError = false
            }, 5000)
          }
        }
      )

    } else {
      console.log('Invalid')

    }
  }

}

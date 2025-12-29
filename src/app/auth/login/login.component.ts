import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  error = '';
  loading = false;

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  submit(): void {
    this.error = '';
    if (this.form.invalid) {
      this.error = 'Completa usuario y contraseña.';
      return;
    }

    this.loading = true;
    const { username, password } = this.form.getRawValue();

    this.auth.login({ username, password }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/incidents']);
      },
      error: (e: Error) => {
        this.loading = false;
        this.error = e.message || 'No se pudo iniciar sesión';
      }
    });
  }
}

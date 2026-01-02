import { Component, inject, signal, NgZone, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/roadmap']);
    }
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const { username, email, password } = this.registerForm.value;

      this.authService.register({
        username: username!,
        email: email!,
        password: password!
      }).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.ngZone.run(() => {
            this.router.navigate(['/roadmap']);
          });
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set('Error al registrarse. Por favor intenta de nuevo.');
          console.error('Registration error:', err);
        }
      });
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service'
import { SnackBarService } from '../services/snackbar.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  public userForm!: FormGroup;
  public fieldType: 'password' | 'text' = 'password';

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private snackBarService: SnackBarService) { }

  ngOnInit(): void {
    this.setupUserForm();
  }

  login() {
    if (this.userForm.dirty && this.userForm.valid) {
      this.authService.login(this.userForm.value.email, this.userForm.value.password).subscribe({
        next: (response) => {
          this.router.navigate(['/main-section']);
        },
        error: (e) => {
          this.snackBarService.error('Invalid credentials')
        }
      });
    }
  }

  private setupUserForm() {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
}
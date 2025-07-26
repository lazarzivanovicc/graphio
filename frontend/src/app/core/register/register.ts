import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { SnackBarService } from '../services/snackbar.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})

export class Register {

  userForm!: FormGroup;
  fieldType: 'password' | 'text' = 'password';

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService, private snackBarService: SnackBarService) { }


  ngOnInit(): void {
    this.setupUserForm();
  }

  login() {
    if (this.userForm.dirty && this.userForm.valid) {
      this.authService.login(this.userForm.value.email, this.userForm.value.password).subscribe({
        next: (response) => {
          this.router.navigate(['/welcome']);
        },
        error: (e) => {
          this.snackBarService.error('Invalid credentials')
        }
      });
    }
  }

  private setupUserForm() {
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      repeat: ['', [Validators.required]],
    });
  }

}
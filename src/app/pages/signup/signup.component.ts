import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {

  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  onSignup() {
    this.authService.signup({
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        console.log('Signup success');
      },
      error: (err: any) => {
        console.error(err);
      }
    });
  }

}
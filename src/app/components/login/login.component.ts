import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from 'src/app/modules/shared/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  // List of valid username-password pairs
  validCredentials = [
  ];
  @Output() success = new EventEmitter<any>()

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public sharedService: SharedService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

   getUserProfileData() {
    this.sharedService.getUserProfile().subscribe((data) => {
      console.log('data--', data)
      localStorage.setItem('userProfile', JSON.stringify(data))
      this.success.emit(true);
      this.sharedService.loginSuccess.next(true);
      
    })
  }

  onLogin(): void {
    this.loading = true
    const { username, password } = this.loginForm.value;
    
    // const isValid = this.validCredentials.some(
    //   (cred) => cred.username === username && cred.password === password
    // );
    let req = {
      username: username,
      password: password
    }

  this.sharedService.performLogin(req).subscribe({
  next: (_res) => {
    this.loading = false;

    if (_res && _res.access_token) {
      
      localStorage.setItem('loginData', JSON.stringify(_res));
      localStorage.setItem('userEmail', username);
      this.getUserProfileData()
      
      
        
      
      

      this.snackBar.open('Login Successful!', 'X', {
        duration: 3000,
        panelClass: ['snackbar-success']
      });

    } else {

      this.sharedService.loginSuccess.next(false);

      this.snackBar.open('Invalid username or password', 'X', {
        duration: 8000,
        panelClass: ['snackbar-error']
      });

      this.router.navigate(['/logout']);
    }
  },

  error: (error) => {
    this.loading = false;
    this.sharedService.loginSuccess.next(false);

    console.error('Login error:', error);

    if (error.status === 401) {

      this.snackBar.open('Invalid username or password', 'X', {
        duration: 8000,
        panelClass: ['snackbar-error']
      });

      this.router.navigate(['/logout']);
       setTimeout(() => {
          this.router.navigate(['/']);
        }, 500)

    } else if (error.status === 500) {

      this.snackBar.open('Server error. Please try again later.', 'X', {
        duration: 8000,
        panelClass: ['snackbar-error']
      });
      this.router.navigate(['/logout']);
       setTimeout(() => {
          this.router.navigate(['/']);
        }, 500)

    } else {

      this.snackBar.open('Invalid username or password', 'X', {
        duration: 8000,
        panelClass: ['snackbar-error']
      });
      this.router.navigate(['/logout']);
       setTimeout(() => {
          this.router.navigate(['/']);
        }, 500)
    }
  }
});

    
  }
}

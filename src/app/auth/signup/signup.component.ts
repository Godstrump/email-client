import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatchPassword } from '../validators/match-password';
import { UniqueUsername } from '../validators/unique-username';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  authForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
      Validators.pattern(/^[a-z0-9]+$/)
    ], [this.uniqueUsername.validate]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20),
    ]),
    passwordConfirmation: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20),
    ])
  }, { validators: [this.matchPassword.validate] })

  constructor(
    private matchPassword: MatchPassword,
    private uniqueUsername: UniqueUsername,
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    this.authService.signup(this.authForm.value)
    .subscribe({
      next: (response) => { //This will be called anytime an observable emit a value
        // console.log(response);
        // console.log(this);
        //Navigate to some route
        this.router.navigateByUrl("/inbox");
      },
      complete: () => { //This will be called anytime the observable is complete

      },
      error: (err) => { //This will be called anytime the observable emit an error
        // if (err.status === 0)
        if (!err.status) this.authForm.setErrors({ noConnection: true });
        else this.authForm.setErrors({ unknownError: true });
      }      
    })
  }

}

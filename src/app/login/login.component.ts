import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, tap, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { AuthService } from '../auth.service';
import { BackendService } from '../backend.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  targetNames: string[];

  loginform: FormGroup;

  loginError: boolean = false;
  inProgress: boolean = false;

  unsubscribe$: Subject<null> = new Subject();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private backendService: BackendService,
    private router: Router) {

    this.loginform = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnInit() { }

  login() {
    const val = this.loginform.value;
    this.inProgress = true;
    this.loginError = false;
    if (val.username && val.password) {
      this.authService.login(val.username, val.password)
        .pipe(
          tap((result) => {
            this.inProgress = false;
            if (result) {
              this.router.navigateByUrl('/');
            }
          }),
          catchError(err => {
            this.inProgress = false;
            this.loginError = true;
            console.log(err);
            return of(null);
          }),
          takeUntil(this.unsubscribe$)
        )
        .subscribe(_ => { });
    }

  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

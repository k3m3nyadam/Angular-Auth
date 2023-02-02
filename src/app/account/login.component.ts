import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  form: FormGroup;
  loading = false;
  submitted = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // kényelmi getter az űrlapok könnyű eléréséhez
  get f() {return this.form.controls;}

  onSubmit(){
    this.submitted = true;
    this.alertService.clear();

    // stop
    if(this.form.invalid){return;}

    this.loading = true; 
    this.accountService.login(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe({
          next: () =>{
            // visszaküldési url kiszedése ha létezik
            // vagy kezdőlapra továbbítunk
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
            this.router.navigateByUrl(returnUrl); 
          },
          error: error =>{
            this.alertService.error(error);
            this.loading = false;
          }
        });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit{
  form: FormGroup;
  id: string;
  title: string;
  loading = false;
  submitting = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      // password nem kötelező szerkeztéskor
      password: ['', [
        Validators.minLength(6),
        ...(this.id ? [] : [Validators.required])
      ]]
    });

    this.title = 'Add User';
    if(this.id){
      // edit mode
      this.title = 'Edit User';
      this.loading = true;
      this.accountService.getById(this.id).pipe(first())
        .subscribe(x => {
          this.form.patchValue(x);
          this.loading = false;
        });
    }
  }

  // kényelmi getter az űrlapmezőkhöz
  get f(){return this.form.controls;}

  onSubmit(){
    this.submitted = true;
    this.alertService.clear();

    // stop
    if(this.form.invalid){return;}

    this.submitting = true;
    this.saveUser().pipe(first())
      .subscribe({
        next: () => {
          this.alertService.succes('User saved', {keppAfterRootChange: true});
          this.router.navigateByUrl('/users');
        },
        error: error => {
          this.alertService.error(error);
          this.submitting = false;
        }
      });
  }

  private saveUser(){
    return this.id 
      ? this.accountService.update(this.id, this.form.value)
      : this.accountService.register(this.form.value);
  }
}

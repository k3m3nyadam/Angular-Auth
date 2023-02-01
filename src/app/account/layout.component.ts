import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  constructor (private roter: Router, private accountService: AccountService){
    // Továbbítás az oldalra ha bevagyunk jelentkezve
    if(this.accountService.userValue){
      this.roter.navigate(['/']);
    }
  }
}

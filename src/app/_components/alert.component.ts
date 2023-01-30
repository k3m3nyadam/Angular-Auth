import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Alert, AlertType } from '@app/_models';
import { AlertService } from '@app/_services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy{
  @Input() id = 'defaul-alert';
  @Input() fade = 'true';

  alerts: Alert[] = [];
  alertsSubscriptions: Subscription; 
  routeSubscriptions: Subscription; 

  constructor(private router: Router, private alertservice: AlertService) {}

  ngOnInit(): void {
    // feliratkozás az új alertekre
    this.alertsSubscriptions = this.alertservice.onAlert(this.id)
      .subscribe(alert => {
        // alertek törlése, ha üres alert érkezik
        if(!alert.message){
          this.alerts = this.alerts.filter(x => x.keppAfterRootChange);

          // többiről eltávolítjuk a keppAfterRootChange-t
          this.alerts.forEach(x => delete x.keppAfterRootChange);
          return;
        }

        // alert hozzáadása a tömbhöz
        this.alerts.push(alert);

        if(alert.autoClose){
          setTimeout(() => this.removeAlert(alert), 3000);
        }
      });

      this.routeSubscriptions = this.router.events.subscribe(event => {
        if(event instanceof NavigationStart){
          this.alertservice.clear(this.id);
        }
      });
  }

  ngOnDestroy(): void {
    // memória túlcsordulást elkerülve íratkozzunk le
    this.alertsSubscriptions.unsubscribe();
    this.routeSubscriptions.unsubscribe();
  }

  removeAlert(alert: Alert){
    if(!this.alerts.includes(alert)) return;

    if(this.fade){
      alert.fade = true;

      setTimeout(() => {
        this.alerts = this.alerts.filter(x => x !== alert)
      }, 250);
    }else{
      this.alerts = this.alerts.filter(x => x !== alert);
    }
  }

  cssClass(alert: Alert){
    if(!alert) return "";

    const classes = ['alert', 'alert-dismissible', 'mt-4', 'container'];
    const alertTypeClass = {
      [AlertType.Succes]: 'alert-success',
      [AlertType.Error]: 'alert-danger',
      [AlertType.Info]: 'alert-info',
      [AlertType.Warning]: 'alert-warning'
    }

    if(alert.type !== undefined){
      classes.push(alertTypeClass[alert.type]);
    }

    if(alert.fade){
      classes.push('fade');
    }

    return classes.join(' ');
  }
}
 
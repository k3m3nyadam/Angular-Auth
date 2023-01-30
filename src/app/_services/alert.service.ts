import { Injectable } from '@angular/core';
import { Alert, AlertOptions, AlertType } from '@app/_models';
import { filter, Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AlertService {
    private subject = new Subject<Alert>;
    private defaultId = 'default-alert';

    // Lehetővé tesszük az observable alertekre a felíratkozást
    onAlert(id = this.defaultId): Observable<Alert>{
        return this.subject.asObservable().pipe(filter(x => x && x.id === id))
    }

    succes(message: string, options?: AlertOptions){
        this.alert(
            new Alert({ ...options, type: AlertType.Succes, message }));
    }

    error(message: string, options?: AlertOptions){
        this.alert(
            new Alert({ ...options, type: AlertType.Error, message }));
    }

    info(message: string, options?: AlertOptions){
        this.alert(
            new Alert({ ...options, type: AlertType.Info, message }));
    }

    warn(message: string, options?: AlertOptions){
        this.alert(
            new Alert({ ...options, type: AlertType.Warning, message }));
    }

    alert(alert: Alert){
        alert.id = alert.id || this.defaultId;
        this.subject.next(alert); 
    }
    
    clear(id = this.defaultId){
        this.subject.next(new Alert({ id }));
    }

}
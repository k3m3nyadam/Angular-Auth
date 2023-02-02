import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/_models/user';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(private router: Router, private http: HttpClient) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(){
    return this.userSubject.value;
  }

  login(username: string, password: string){
    return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, {username, password})
      .pipe(map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  logout(){
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  register(user: User){
    return this.http.post(`${environment.apiUrl}/users/register`, user);
  }

  getAll(){
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getById(id: string){
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  update(id: string, params: any){
    return this.http.put(`${environment.apiUrl}/users/${id}`, params)
      .pipe(map(x => {
        // tárolt felhasználó módosítása
        if(id == this.userValue.id){
          const user = {...this.userValue, ...params};
          localStorage.setItem('user', JSON.stringify(user));

          // frissített felhasználó közzététele
          this.userSubject.next(user);
        }

        return x;
      }));
  }

  delete(id: string){
    return this.http.delete(`${environment.apiUrl}/users/${id}`)
      .pipe(map(x => {
        //automatikus kijelentkezés ha saját adatokat töröltük
        if(id == this.userValue.id){
          this.logout;
        }

        return x;
      }));
  }
}

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { delay, dematerialize, materialize, Observable, throwError } from 'rxjs';
import { of } from 'rxjs';

const userKey = 'users';
let users: any[] = JSON.parse(localStorage.getItem(userKey)) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute(){
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'GET':
                    return getUserById();
                case url.match(/\/users\/\d+$/) && method === 'PUT':
                    return updateUser();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                default: 
                    return next.handle(request);
                
            }
        }

        function authenticate(){
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);

            if(!user) return error('Username or password is incorrect!');
            return ok({
                ...basicDetails(user), 
                token: 'fake-jwt-token'
            })
        }

        function register(){
            const user = body;

            if(users.find(x => x.username === user.username)){
                return error('Username "' + user.username + '" is already taken!');
            }

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem(userKey, JSON.stringify(users));
            return ok();
        }

        function error(message: string){
            return throwError(() => ({ error: { message } })).pipe(
                materialize(), delay(500), dematerialize()
            );
        }

        function ok(body?: any){
            return of(new HttpResponse({ status: 200, body })).pipe(
                delay(500)
            );
        }

        function basicDetails(user: any){
            const { id, username, firstName, lastName } = user;
            return { id, username, firstName, lastName };
        }
    }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './user';
import { environment } from 'src/environments/environment';

import { BaseResponse } from '../BaseResponse';
//import { MessageService } from './message.service';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    })
};

@Injectable({ providedIn: 'root' })
export class LoginService {

    private loginUrl = environment.apiurl +  'api/admin/Login';  // URL to web api
    private forgotPasswordUrl = environment.apiurl +  'api/admin/ForgotPassword'; 
    constructor(
        private http: HttpClient) { }

    /** POST:Login to the server */
    loginAccount(user: User): Observable<any>{
        return this.http.post(this.loginUrl, user, httpOptions).pipe(
            //map(BaseResponse => BaseResponse.message),
            tap((user: User) => this.log(`login w/ email=${user.Email}`)),
            catchError(this.handleError<User>('Login'))
        );
    }
    SendForgotPasswordEmail(email) {
        return this.http.post(this.forgotPasswordUrl + '?Email=' + email, httpOptions);
    }

    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        //this.messageService.add(`HeroService: ${message}`);
    }
}

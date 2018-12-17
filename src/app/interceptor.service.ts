import { Injectable } from '@angular/core';
import { 
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  urlsToIgnoreAuthorization = [
    "/login"
];
  constructor() { 
  }
  
  intercept(request : HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>>{
    let url = request.url.toLowerCase();
    let ignored = this.urlsToIgnoreAuthorization.find(item => url.indexOf(item) < 0);
    if(ignored != undefined){
      request = request.clone({
        setHeaders: {
          Authorization: `${sessionStorage.getItem('AccessToken')}`
        }
      });
    }
    return next.handle(request);
  }
}

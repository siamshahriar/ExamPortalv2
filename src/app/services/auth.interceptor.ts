import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpInterceptorFn } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { LoginService } from "./login.service";

const TOKEN_HEADER = 'Authorization';

// Functional interceptor for Angular 17+
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const loginService = inject(LoginService);

    console.log('🔒 Auth Interceptor triggered for:', req.url);

    // Add the jwt token (localStorage) to the request
    let authReq = req;
    const token = loginService.getToken();
    if (token != null) {
        console.log('✅ Token found, adding to request header');
        authReq = req.clone({
            setHeaders: {
                [TOKEN_HEADER]: `Bearer ${token}`
            }
        });
    } else {
        console.log('❌ No token found in localStorage');
    }
    return next(authReq);
};

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private login: LoginService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        //Add the jwt token (localStorage) to the request
        let authReq = req;
        console.log("inside interceptor");
        const token = this.login.getToken();
        if (token != null) {
            authReq = req.clone({
                setHeaders: {
                    [TOKEN_HEADER]: `Bearer ${token}`
                }
            });
        }
        return next.handle(authReq);


    }

}


export const authInterceptorProviders = [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
    }
];

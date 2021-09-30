import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator } from "@angular/forms";
import { map, catchError } from 'rxjs/operators';
import { of } from "rxjs";

import { AuthService } from "../auth.service";

@Injectable({
    providedIn: 'root'
})
export class UniqueUsername implements AsyncValidator {
    constructor(private authServie: AuthService) {}

    validate = (control: AbstractControl) => {
        const { value } = control;

        return this.authServie.usernameAvailable(value)
        .pipe(
            map((val) => {
                return null
            }),
            catchError((err) => {
                if (err.error.username) return of({ nonUniqueUsername: true });
                else return of({ noConnection: true })                
            })
        )
    }
}

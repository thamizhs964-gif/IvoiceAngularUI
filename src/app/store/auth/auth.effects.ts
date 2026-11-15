import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { login, loginSuccess, loginFailure, logout } from './auth.actions';
 
import { AuthService } from '../../services/auth.service';
@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
 
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((response) => {
            const token = response.token ?? response.data?.token;
            const expiration = response.expiration ?? response.data?.expiration;
            const user = response.user ?? response.data?.user;

            if (!token || !expiration || !user) {
              throw new Error(response.message || 'Login failed');
            }

            this.authService.setSession(token, expiration);

            return loginSuccess({
              token,
              expiration,
              user,
            });
          }),
          catchError((error) =>
            of(
              loginFailure({
                error:
                  error?.error?.message || error?.message || 'Login Failed',
              }),
            ),
          ),
        ),
      ),
    ),
  );
 
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        map(() => {
          this.authService.logout();
        }),
      ),
    { dispatch: false },
  );
}
 
 
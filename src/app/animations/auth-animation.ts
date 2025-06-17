import { trigger, transition, style, animate, query, group } from '@angular/animations';

export const authAnimations = trigger('routeAnimations', [
  // Login => Register (entra desde la derecha)
  transition('LoginPage => RegisterPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [
      style({ opacity: 0, transform: 'translateX(100%)' }),
    ]),
    group([
      query(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateX(-100%)' })),
      ]),
      query(':enter', [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ]),

  // Register => Login (entra desde la izquierda)
  transition('RegisterPage => LoginPage', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      }),
    ]),
    query(':enter', [
      style({ opacity: 0, transform: 'translateX(-100%)' }),
    ]),
    group([
      query(':leave', [
        animate('300ms ease-out', style({ opacity: 0, transform: 'translateX(100%)' })),
      ]),
      query(':enter', [
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ]),
]);

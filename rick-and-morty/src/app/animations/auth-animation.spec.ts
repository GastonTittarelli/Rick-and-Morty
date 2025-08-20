// import { authAnimations } from './auth-animation';
// import { trigger, transition } from '@angular/animations';

// describe('authAnimations', () => {
//   it('should define a trigger named "routeAnimations"', () => {
//     expect(authAnimations.name).toBe('routeAnimations');
//   });

//   it('should contain two transitions', () => {
//     expect((authAnimations.definitions as any).length).toBe(2);
//   });

//   it('should define LoginPage => RegisterPage transition', () => {
//     const loginToRegister = (authAnimations.definitions as any).find(
//       (t: any) => t.expr === 'LoginPage => RegisterPage'
//     );
//     expect(loginToRegister).toBeTruthy();
//     expect(loginToRegister.animation.steps.length).toBeGreaterThan(0);
//   });

//   it('should define RegisterPage => LoginPage transition', () => {
//     const registerToLogin = (authAnimations.definitions as any).find(
//       (t: any) => t.expr === 'RegisterPage => LoginPage'
//     );
//     expect(registerToLogin).toBeTruthy();
//     expect(registerToLogin.animation.steps.length).toBeGreaterThan(0);
//   });

//   it('LoginPage => RegisterPage should include enter/leave queries and group animations', () => {
//     const loginToRegister = (authAnimations.definitions as any).find(
//       (t: any) => t.expr === 'LoginPage => RegisterPage'
//     );

//     const steps = JSON.stringify(loginToRegister.animation);
//     expect(steps).toContain(':enter');
//     expect(steps).toContain(':leave');
//     expect(steps).toContain('group');
//     expect(steps).toContain('translateX(100%)');
//     expect(steps).toContain('translateX(-100%)');
//   });

//   it('RegisterPage => LoginPage should include enter/leave queries and group animations', () => {
//     const registerToLogin = (authAnimations.definitions as any).find(
//       (t: any) => t.expr === 'RegisterPage => LoginPage'
//     );

//     const steps = JSON.stringify(registerToLogin.animation);
//     expect(steps).toContain(':enter');
//     expect(steps).toContain(':leave');
//     expect(steps).toContain('group');
//     expect(steps).toContain('translateX(-100%)');
//     expect(steps).toContain('translateX(100%)');
//   });
// });

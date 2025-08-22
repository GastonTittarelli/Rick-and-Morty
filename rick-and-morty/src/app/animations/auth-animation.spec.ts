import { authAnimations } from './auth-animation';
import { trigger, transition } from '@angular/animations';

describe('authAnimations', () => {
  it('debería definir un trigger llamado "routeAnimations"', () => {
    expect(authAnimations.name).toBe('routeAnimations');
  });

  it('debería contener dos transiciones', () => {
    expect((authAnimations.definitions as any).length).toBe(2);
  });

  it('debería definir la transición de LoginPage a RegisterPage', () => {
    const loginToRegister = (authAnimations.definitions as any).find(
      (t: any) => t.expr === 'LoginPage => RegisterPage'
    );
    expect(loginToRegister).toBeTruthy();
    expect(loginToRegister.animation.length).toBeGreaterThan(0);
  });

  it('debería definir la transición de RegisterPage a LoginPage', () => {
    const registerToLogin = (authAnimations.definitions as any).find(
      (t: any) => t.expr === 'RegisterPage => LoginPage'
    );
    expect(registerToLogin).toBeTruthy();
    expect(registerToLogin.animation.length).toBeGreaterThan(0);
  });

  function collectSelectors(steps: any[]): string[] {
    let selectors: string[] = [];
    for (const s of steps) {
      if (s.type === 11 && s.selector) {
        selectors.push(s.selector);
      }
      if (s.steps) {
        selectors = selectors.concat(collectSelectors(s.steps));
      }
    }
    return selectors;
  }

  it('debería incluir consultas de entrada/salida y animaciones de grupo para LoginPage => RegisterPage', () => {
  const loginToRegister = (authAnimations.definitions as any).find(
    (t: any) => t.expr === 'LoginPage => RegisterPage'
  );

  // animación como estructura interna
  const steps = loginToRegister.animation;

  // Debe contener un group (type:3)
  const hasGroup = steps.some((s: any) => s.type === 3);
  expect(hasGroup).toBeTrue();

  const selectors = collectSelectors(steps);
    expect(selectors).toContain(':enter');
    expect(selectors).toContain(':leave');
  });


  it('debería incluir consultas de entrada/salida y animaciones de grupo para RegisterPage => LoginPage', () => {
  const registerToLogin = (authAnimations.definitions as any).find(
    (t: any) => t.expr === 'RegisterPage => LoginPage'
  );

  const steps = registerToLogin.animation;

  const hasGroup = steps.some((s: any) => s.type === 3);
  expect(hasGroup).toBeTrue();

  const selectors = collectSelectors(steps);
    expect(selectors).toContain(':enter');
    expect(selectors).toContain(':leave');

    // Buscar strings de transform en los estilos
    const styles = JSON.stringify(steps);
    expect(styles).toContain('translateX(-100%)');
    expect(styles).toContain('translateX(100%)');
  });
});

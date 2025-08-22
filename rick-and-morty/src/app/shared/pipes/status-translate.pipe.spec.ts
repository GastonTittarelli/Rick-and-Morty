import { StatusTranslatePipe } from './status-translate.pipe';

describe('StatusTranslatePipe', () => {
  let pipe: StatusTranslatePipe;

  beforeEach(() => {
    pipe = new StatusTranslatePipe();
  });

  it('debe crear el status-translate-pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('debe traducir "Alive" a "Vivo"', () => {
    expect(pipe.transform('Alive')).toBe('Vivo');
  });

  it('debe traducir "Dead" a "Muerto"', () => {
    expect(pipe.transform('Dead')).toBe('Muerto');
  });

  it('debe traducir "unknown" a "Desconocido"', () => {
    expect(pipe.transform('unknown')).toBe('Desconocido');
  });

  it('debe retornar el mismo valor para entradas no reconocidas', () => {
    const unknownValue = 'Other';
    expect(pipe.transform(unknownValue)).toBe(unknownValue);
  });
});

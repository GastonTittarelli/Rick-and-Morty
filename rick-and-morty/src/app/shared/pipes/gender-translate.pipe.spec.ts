import { GenderTranslatePipe } from './gender-translate.pipe';

describe('GenderTranslatePipe', () => {
  let pipe: GenderTranslatePipe;

  beforeEach(() => {
    pipe = new GenderTranslatePipe();
  });

  it('debe crear el gender-translate-pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('debe traducir "Male" a "Masculino"', () => {
    expect(pipe.transform('Male')).toBe('Masculino');
  });

  it('debe traducir "Female" a "Femenino"', () => {
    expect(pipe.transform('Female')).toBe('Femenino');
  });

  it('debe traducir "Genderless" a "Sin género"', () => {
    expect(pipe.transform('Genderless')).toBe('Sin género');
  });

  it('debe traducir "unknown" a "Desconocido"', () => {
    expect(pipe.transform('unknown')).toBe('Desconocido');
  });

  it('debe retornar el mismo valor para entradas no reconocidas', () => {
    const unknownValue = 'Other';
    expect(pipe.transform(unknownValue)).toBe(unknownValue);
  });
});

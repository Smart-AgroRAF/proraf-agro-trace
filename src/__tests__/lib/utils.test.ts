import { describe, it, expect } from 'vitest';
import { cn, formatNumber } from '@/lib/utils';

describe('cn (className utility)', () => {
  it('deve combinar classes simples', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('deve remover classes duplicadas', () => {
    expect(cn('px-4', 'px-2')).toBe('px-2');
  });

  it('deve aplicar classes condicionais', () => {
    expect(cn('base', true && 'conditional')).toBe('base conditional');
    expect(cn('base', false && 'conditional')).toBe('base');
  });

  it('deve lidar com undefined e null', () => {
    expect(cn('base', undefined, null, 'valid')).toBe('base valid');
  });

  it('deve combinar com objetos', () => {
    expect(
      cn('base', {
        active: true,
        disabled: false,
      })
    ).toBe('base active');
  });

  it('deve mesclar classes do Tailwind corretamente', () => {
    expect(cn('text-red-500 hover:text-blue-500', 'text-green-500')).toBe(
      'hover:text-blue-500 text-green-500'
    );
  });

  it('deve lidar com arrays', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
  });

  it('deve retornar string vazia para entrada vazia', () => {
    expect(cn()).toBe('');
  });
});

describe('formatNumber', () => {
  it('deve formatar números com 2 casas decimais', () => {
    expect(formatNumber(123.456)).toBe('123.46');
    expect(formatNumber(100)).toBe('100.00');
    expect(formatNumber(0.1)).toBe('0.10');
  });

  it('deve formatar strings numéricas', () => {
    expect(formatNumber('123.456')).toBe('123.46');
    expect(formatNumber('100')).toBe('100.00');
  });

  it('deve lidar com undefined e null', () => {
    expect(formatNumber(undefined)).toBe('0.00');
    expect(formatNumber(null as any)).toBe('0.00');
  });

  it('deve lidar com strings inválidas', () => {
    expect(formatNumber('abc')).toBe('0.00');
    expect(formatNumber('')).toBe('0.00');
  });

  it('deve arredondar corretamente', () => {
    expect(formatNumber(1.555)).toBe('1.56'); // arredonda para cima
    expect(formatNumber(1.554)).toBe('1.55'); // arredonda para baixo
  });
});

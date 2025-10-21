import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

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

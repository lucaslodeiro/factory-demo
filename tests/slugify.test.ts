import {describe,it,expect} from 'vitest';
import {slugify} from '../src/lib/slugify';
describe('slugify',()=>{
 it.each([['Hello World','hello-world'],['ÁÉÍ Óú','áéí-óú']])('lowercases %j',(input,expected)=>{const slug=slugify(input);expect(slug).toBe(expected);expect(slug).toBe(slug.toLowerCase());});
 it.each([['a   b','a-b'],['a \t \n b','a-b']])('turns each whitespace run into one hyphen: %j',(input,expected)=>expect(slugify(input)).toBe(expected));
 it('removes disallowed characters, collapses hyphens and trims the edges',()=>expect(slugify('  --Hello, *World!! 42--  ')).toBe('hello-world-42'));
 it('removes the underscore instead of treating it as a separator',()=>expect(slugify('snake_case value')).toBe('snakecase-value'));
 it.each([['Año Nuevo 2026','año-nuevo-2026'],['Configuração Rápida','configuração-rápida']])('keeps unicode letters and digits without transliterating: %j',(input,expected)=>expect(slugify(input)).toBe(expected));
 it.each(['','   ','!!! ???'])('returns an empty string for %j',input=>expect(slugify(input)).toBe(''));
});

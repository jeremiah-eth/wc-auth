import { describe, it, expect } from 'bun:test';
import { OutputFormatter } from './output-formatter.js';

describe('OutputFormatter', () => {
    it('should format data as JSON', () => {
        const data = { name: 'test', value: 123 };
        const result = OutputFormatter.format(data, 'json');
        expect(result).toBe(JSON.stringify(data, null, 2));
    });

    it('should format data as YAML', () => {
        const data = { name: 'test', value: 123 };
        const result = OutputFormatter.format(data, 'yaml');
        expect(result).toContain('name: test');
        expect(result).toContain('value: 123');
    });

    it('should format data as pretty output by default', () => {
        const data = { name: 'test' };
        const result = OutputFormatter.format(data);
        expect(result).toBeTruthy();
    });

    it('should handle null values', () => {
        const result = OutputFormatter.format(null, 'json');
        expect(result).toBe('null');
    });

    it('should handle arrays', () => {
        const data = [1, 2, 3];
        const result = OutputFormatter.format(data, 'json');
        expect(result).toContain('[');
        expect(result).toContain(']');
    });
});

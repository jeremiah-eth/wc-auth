import chalk from 'chalk';

export type ThemeName = 'default' | 'dracula' | 'nord' | 'monokai' | 'solarized';

export interface Theme {
    primary: (text: string) => string;
    secondary: (text: string) => string;
    success: (text: string) => string;
    warning: (text: string) => string;
    error: (text: string) => string;
    info: (text: string) => string;
    muted: (text: string) => string;
    highlight: (text: string) => string;
}

const themes: Record<ThemeName, Theme> = {
    default: {
        primary: chalk.blue,
        secondary: chalk.cyan,
        success: chalk.green,
        warning: chalk.yellow,
        error: chalk.red,
        info: chalk.blue,
        muted: chalk.gray,
        highlight: chalk.magenta,
    },
    dracula: {
        primary: chalk.hex('#bd93f9'), // Purple
        secondary: chalk.hex('#8be9fd'), // Cyan
        success: chalk.hex('#50fa7b'), // Green
        warning: chalk.hex('#f1fa8c'), // Yellow
        error: chalk.hex('#ff5555'), // Red
        info: chalk.hex('#8be9fd'), // Cyan
        muted: chalk.hex('#6272a4'), // Comment
        highlight: chalk.hex('#ff79c6'), // Pink
    },
    nord: {
        primary: chalk.hex('#88c0d0'), // Frost
        secondary: chalk.hex('#81a1c1'), // Frost
        success: chalk.hex('#a3be8c'), // Green
        warning: chalk.hex('#ebcb8b'), // Yellow
        error: chalk.hex('#bf616a'), // Red
        info: chalk.hex('#5e81ac'), // Blue
        muted: chalk.hex('#4c566a'), // Gray
        highlight: chalk.hex('#b48ead'), // Purple
    },
    monokai: {
        primary: chalk.hex('#66d9ef'), // Blue
        secondary: chalk.hex('#a6e22e'), // Green
        success: chalk.hex('#a6e22e'), // Green
        warning: chalk.hex('#e6db74'), // Yellow
        error: chalk.hex('#f92672'), // Pink/Red
        info: chalk.hex('#66d9ef'), // Blue
        muted: chalk.hex('#75715e'), // Comment
        highlight: chalk.hex('#ae81ff'), // Purple
    },
    solarized: {
        primary: chalk.hex('#268bd2'), // Blue
        secondary: chalk.hex('#2aa198'), // Cyan
        success: chalk.hex('#859900'), // Green
        warning: chalk.hex('#b58900'), // Yellow
        error: chalk.hex('#dc322f'), // Red
        info: chalk.hex('#268bd2'), // Blue
        muted: chalk.hex('#586e75'), // Base01
        highlight: chalk.hex('#d33682'), // Magenta
    },
};

let currentTheme: ThemeName = 'default';

export class ThemeManager {
    static setTheme(theme: ThemeName): void {
        currentTheme = theme;
    }

    static getTheme(): Theme {
        return themes[currentTheme];
    }

    static getCurrentThemeName(): ThemeName {
        return currentTheme;
    }

    static listThemes(): ThemeName[] {
        return Object.keys(themes) as ThemeName[];
    }

    // Convenience methods
    static primary(text: string): string {
        return themes[currentTheme].primary(text);
    }

    static secondary(text: string): string {
        return themes[currentTheme].secondary(text);
    }

    static success(text: string): string {
        return themes[currentTheme].success(text);
    }

    static warning(text: string): string {
        return themes[currentTheme].warning(text);
    }

    static error(text: string): string {
        return themes[currentTheme].error(text);
    }

    static info(text: string): string {
        return themes[currentTheme].info(text);
    }

    static muted(text: string): string {
        return themes[currentTheme].muted(text);
    }

    static highlight(text: string): string {
        return themes[currentTheme].highlight(text);
    }
}

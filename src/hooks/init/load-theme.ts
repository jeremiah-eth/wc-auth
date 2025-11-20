import type { Hook } from '@oclif/core';
import { config } from '../../utils/config';
import { ThemeManager } from '../../utils/theme-manager';

const hook: Hook<'init'> = async function () {
    // Load saved theme
    const theme = config.getTheme();
    ThemeManager.setTheme(theme);
};

export default hook;

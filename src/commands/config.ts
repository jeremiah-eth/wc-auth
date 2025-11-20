import { Command, Flags, Args } from '@oclif/core';
import chalk from 'chalk';
import { select } from '@inquirer/prompts';
import { config } from '../utils/config';
import { ThemeManager, type ThemeName } from '../utils/theme-manager';

export default class Config extends Command {
    static override description = 'Manage CLI configuration';

    static override examples = [
        '<%= config.bin %> <%= command.id %> theme',
        '<%= config.bin %> <%= command.id %> theme --set dracula',
        '<%= config.bin %> <%= command.id %> show',
    ];

    static override args = {
        key: Args.string({
            description: 'Configuration key (theme, projectId, show)',
            options: ['theme', 'projectId', 'show'],
        }),
    };

    static override flags = {
        set: Flags.string({
            char: 's',
            description: 'Set configuration value',
        }),
        reset: Flags.boolean({
            char: 'r',
            description: 'Reset configuration to defaults',
        }),
    };

    async run(): Promise<void> {
        const { args, flags } = await this.parse(Config);

        if (flags.reset) {
            config.reset();
            this.log(chalk.green('✓ Configuration reset to defaults'));
            return;
        }

        if (!args.key || args.key === 'show') {
            const allConfig = config.getAll();
            this.log(chalk.blue('\n⚙️  Current Configuration:'));
            this.log(JSON.stringify(allConfig, null, 2));
            return;
        }

        if (args.key === 'theme') {
            if (flags.set) {
                const theme = flags.set as ThemeName;
                if (!ThemeManager.listThemes().includes(theme)) {
                    this.error(`Invalid theme: ${theme}. Available: ${ThemeManager.listThemes().join(', ')}`);
                }
                config.setTheme(theme);
                ThemeManager.setTheme(theme);
                this.log(ThemeManager.success(`✓ Theme set to: ${theme}`));

                // Show preview
                this.log(ThemeManager.muted('\nTheme Preview:'));
                this.log(ThemeManager.primary('  Primary'));
                this.log(ThemeManager.secondary('  Secondary'));
                this.log(ThemeManager.success('  Success'));
                this.log(ThemeManager.warning('  Warning'));
                this.log(ThemeManager.error('  Error'));
                this.log(ThemeManager.info('  Info'));
                this.log(ThemeManager.highlight('  Highlight'));
            } else {
                const currentTheme = config.getTheme();
                const theme = await select({
                    message: 'Select a theme:',
                    choices: ThemeManager.listThemes().map(t => ({
                        name: t,
                        value: t,
                        description: t === currentTheme ? '(current)' : '',
                    })),
                });

                config.setTheme(theme);
                ThemeManager.setTheme(theme);
                this.log(ThemeManager.success(`\n✓ Theme set to: ${theme}`));

                // Show preview
                this.log(ThemeManager.muted('\nTheme Preview:'));
                this.log(ThemeManager.primary('  Primary'));
                this.log(ThemeManager.secondary('  Secondary'));
                this.log(ThemeManager.success('  Success'));
                this.log(ThemeManager.warning('  Warning'));
                this.log(ThemeManager.error('  Error'));
                this.log(ThemeManager.info('  Info'));
                this.log(ThemeManager.highlight('  Highlight'));
            }
        } else if (args.key === 'projectId') {
            if (flags.set) {
                config.setProjectId(flags.set);
                this.log(chalk.green(`✓ Project ID set to: ${flags.set}`));
            } else {
                const currentId = config.getProjectId();
                this.log(chalk.blue(`Current Project ID: ${currentId || 'Not set'}`));
            }
        }
    }
}

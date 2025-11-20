import Conf from 'conf';
import { type ThemeName } from './theme-manager';

interface ConfigSchema {
    theme: ThemeName;
    projectId?: string;
}

class ConfigManager {
    private config: Conf<ConfigSchema>;

    constructor() {
        this.config = new Conf<ConfigSchema>({
            projectName: 'wc-auth',
            defaults: {
                theme: 'default',
            },
        });
    }

    getTheme(): ThemeName {
        return this.config.get('theme');
    }

    setTheme(theme: ThemeName): void {
        this.config.set('theme', theme);
    }

    getProjectId(): string | undefined {
        return this.config.get('projectId');
    }

    setProjectId(projectId: string): void {
        this.config.set('projectId', projectId);
    }

    getAll(): ConfigSchema {
        return this.config.store;
    }

    reset(): void {
        this.config.clear();
    }
}

export const config = new ConfigManager();

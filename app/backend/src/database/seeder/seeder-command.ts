import { NestFactory } from '@nestjs/core';
import { SeederModule, SeederService } from './seeder.module';
import { Logger } from '@nestjs/common';

const logger = new Logger('SeederCommand');

export default async function seederCommand() {
  const args = process.argv.slice(2);
  const command = args[1];

  try {
    logger.log('Initializing seeder application context...');
    const app = await NestFactory.createApplicationContext(SeederModule, {
      logger: ['error', 'warn', 'log'],
    });

    const seederService = app.get(SeederService);

    switch (command) {
      case 'run': {
        const classArg = args.find((arg) => arg.startsWith('--class='));
        if (classArg) {
          const names = classArg.split('=')[1].split(',').map((n) => n.trim());
          await seederService.seedAll(names);
        } else {
          await seederService.seedAll();
        }
        break;
      }
      case 'admin':
        logger.log('Running super admin seeder...');
        await seederService.seedSuperAdmin();
        break;
      default:
        logger.error('Invalid seeder command');
        logger.log('Available commands: run, admin');
        process.exit(1);
    }

    await app.close();
    logger.log('Seeder completed successfully');
  } catch (error) {
    logger.error('Seeder failed:', error);
    process.exit(1);
  }
}

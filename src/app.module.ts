import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { TaksController } from './taks/taks.controller';

@Module({
  imports: [TasksModule],
  controllers: [AppController, TaksController],
  providers: [AppService],
})
export class AppModule {}

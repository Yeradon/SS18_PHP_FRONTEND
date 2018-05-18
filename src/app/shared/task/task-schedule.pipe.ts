import { Pipe, PipeTransform } from '@angular/core';

import { TaskDisplayable } from './task.displayable';
import { isNullOrUndefined } from 'util';

export enum SCHEDULE_STATUS {
  URGENT = 1,
  SCHEDULED,
  UNSCHEDULED
}

@Pipe({ name: 'taskSchedule', pure: false })
export class TaskSchedulePipe implements PipeTransform {
  transform(allTasks: TaskDisplayable[], type: SCHEDULE_STATUS) {
    return allTasks.filter(task => {
      if (
        isNullOrUndefined(task.deadline) &&
        type == SCHEDULE_STATUS.UNSCHEDULED
      ) {
        return true;
      } else if (
        !isNullOrUndefined(task.deadline) &&
        task.deadline < new Date() &&
        type == SCHEDULE_STATUS.URGENT
      ) {
        return true;
      } else if (
        !isNullOrUndefined(task.deadline) &&
        task.deadline > new Date() &&
        type == SCHEDULE_STATUS.SCHEDULED
      ) {
        return true;
      } else {
        return false;
      }
    });
  }
}

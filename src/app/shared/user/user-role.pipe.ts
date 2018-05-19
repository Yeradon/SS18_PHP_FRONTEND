import { Pipe, PipeTransform } from '@angular/core';

import { UserDisplayable } from './user.displayable';

export enum USER_ROLE {
  USER,
  ADMIN
}

@Pipe({ name: 'userRole', pure: false })
export class UserRolePipe implements PipeTransform {
  transform(allUser: UserDisplayable[], role: USER_ROLE) {
    return allUser.filter(user => {
      const roleNum = new Number(user.role);
      if(roleNum == role) {
        return true;
      } else {
        return false;
      }
    });
  }
}

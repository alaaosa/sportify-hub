import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './role.decorater';
import { Authguard } from '../guard/auth.guard';
import { RoleGuard } from '../guard/role.guard';

export function Auth(...roles: string[]) {
  return applyDecorators(Roles(...roles), UseGuards(Authguard, RoleGuard));
}

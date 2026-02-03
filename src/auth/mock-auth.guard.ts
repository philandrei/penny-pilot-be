import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    // Fake logged-in user
    req.user = {
      uuid: '9fe473d1-066a-4ca3-b9a3-eff8f893138e',
      firebaseUid: 'mock-firebase-uid',
      email: 'dev@pennypilot.local',
    };

    return true;
  }
}

export * from './infoController.service';
import { InfoControllerService } from './infoController.service';
export * from './securityController.service';
import { SecurityControllerService } from './securityController.service';
export * from './userController.service';
import { UserControllerService } from './userController.service';
export const APIS = [InfoControllerService, SecurityControllerService, UserControllerService];

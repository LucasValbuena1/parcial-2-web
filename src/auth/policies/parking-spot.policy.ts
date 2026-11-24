
import { User } from "../../users/entities/user.entity.js";
import { Policy, type PolicyBefore } from '@nestjs/authorization';
import { esAdmin, tieneRol } from "./roles.helper.js";


@Policy()
export class ParkingSpotPolicy implements PolicyBefore<User> {

    before(user: User | null) {
            if (esAdmin(user)) return true;
            return undefined;
          }
        
          create(_user: User | null) {
            return false;   
          }
}
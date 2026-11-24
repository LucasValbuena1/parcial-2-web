import { User } from "../../users/entities/user.entity.js";
import { esAdmin, tieneRol } from "./roles.helper.js";
import { Policy, type PolicyBefore } from '@nestjs/authorization';

@Policy()
export class reservationPolicy implements PolicyBefore<User> {
    before(user: User | null) {
        if (esAdmin(user)) return true;
        return undefined;
      }
    
      create(_user: User | null) {
        return tieneRol(_user, 'conductor');   
      }
    

      list(_user: User | null) {
        return tieneRol(_user, 'conductor', 'supervisor');
      }


      patch(_user: User | null) {
        return tieneRol(_user, 'supervisor');
      }
    

      remove(_user: User | null) {
        return tieneRol(_user, 'conductor');
      }
    }





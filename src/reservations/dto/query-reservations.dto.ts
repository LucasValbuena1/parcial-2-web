import { IsUUID } from "class-validator";


//GET / reservations/:id
export class QueryReservationsDto {
  @IsUUID()
  id: string;

 
}   



// DELETE/reservations/:id
import { IsUUID } from 'class-validator';
export class DeleteReservationDto {
  @IsUUID()
  id: string;

  


}
import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto.js';


//PATCH / reservations/:id
export class UpdateReservationDto extends PartialType(CreateReservationDto) {


    
}

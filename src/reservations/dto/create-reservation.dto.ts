export class CreateReservationDto {

    id_user: string;
    id_spot: string;
    date: Date;
    vehicle_plate: string;
    vehicle_max_charge: 'standard' | 'fast' | 'ultra_fast';
}

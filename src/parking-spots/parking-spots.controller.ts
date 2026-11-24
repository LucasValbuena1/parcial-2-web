import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParkingSpotsService } from './parking-spots.service.js';
import { CreateParkingSpotDto } from './dto/create-parking-spot.dto.js';
import { UpdateParkingSpotDto } from './dto/update-parking-spot.dto.js';
import { Can } from '@nestjs/authorization';
import { ParkingSpotPolicy } from '../auth/policies/parking-spot.policy.js';

@Controller('parking-spots')
export class ParkingSpotsController {
  constructor(private readonly parkingSpotsService: ParkingSpotsService) {}

  @Post()
  @Can(ParkingSpotPolicy, 'create')
  create(@Body() createParkingSpotDto: CreateParkingSpotDto) {
    return this.parkingSpotsService.create(createParkingSpotDto);
  }

  @Get()
  @Can.Anyone()
  findAll() {
    return this.parkingSpotsService.findAll();
  }

  
}

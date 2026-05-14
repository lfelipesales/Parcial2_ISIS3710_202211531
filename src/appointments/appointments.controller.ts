import { 
  Controller, Get, Put, Delete, Body, Param, Request, UseGuards, 
  UnauthorizedException, ForbiddenException 
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAppointments(@Request() req) {
    const { id, role } = req.user;

    if (role === 'admin') return this.appointmentsService.findAll();
    if (role === 'doctor') return this.appointmentsService.findByDoctor(id);
    if (role === 'patient') return this.appointmentsService.findByPatient(id);

    throw new UnauthorizedException('NO AUTORIZADO');
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id') appointmentId: string,
    @Body('status') newStatus: 'done' | 'cancelled',
    @Request() req,
  ) {
    const { id: doctorId, role } = req.user;

    if (role !== 'doctor') {
      throw new ForbiddenException('Solo los doctores pueden actualizar el estado');
    }

    if (newStatus !== 'done' && newStatus !== 'cancelled') {
      throw new ForbiddenException('Estado no permitido deebe ser Done o cancelled');
    }

    return this.appointmentsService.updateStatusByDoctor(appointmentId, doctorId, newStatus);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteAppointment(@Param('id') appointmentId: string, @Request() req) {
    const { id: patientId, role } = req.user;

    if (role !== 'patient') {
      throw new ForbiddenException('Solo los pacientes pueden eliminar citas');
    }

    return this.appointmentsService.deleteByPatient(appointmentId, patientId);
  }
}

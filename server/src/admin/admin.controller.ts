import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ClubService } from './admin.service';
import { ClubDTO, EditedClubDTO } from './dto/admin.dto';
import { Auth } from 'src/common/decorators/decorater.composition';
import { UserRole } from 'src/common/enums/index.enum';
// @Auth(UserRole.SUPER_ADMIN)
@Controller('admin')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @Get()
  async getAllClubs() {
    const clubs = await this.clubService.findAllClubs();
    return {
      success: true,
      data: clubs,
    };
  }

  @Post()
  async create(@Body() dto: ClubDTO) {
    const club = await this.clubService.create(dto);

    return {
      success: true,
      message: 'club created successfully',
      data: club,
    };
  }

  @Get(':id')
  async getClub(@Param('id', ParseIntPipe) id: number) {
    const club = await this.clubService.findClub(id);
    return {
      success: true,
      data: club,
    };
  }

  @Put(':id')
  async updateClub(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditedClubDTO,
  ) {
    const club = await this.clubService.updateClub(id, dto);

    return {
      success: true,
      message: 'club edited successfully',
      data: club,
    };
  }

  @Delete(':id')
  async delClub(@Param('id', ParseIntPipe) id: number) {
    const club = await this.clubService.deleteClub(id);
    return {
      success: true,
      message: 'club deleted successfully',
      data: club,
    };
  }
}

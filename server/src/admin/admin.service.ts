import { Injectable } from '@nestjs/common';
import { AdminRepository } from './repo/admin.repo';
import { ClubDTO, EditedClubDTO } from './dto/admin.dto';
import { UserRepository } from 'src/user/repo/user.repo';
import { InjectModel } from '@nestjs/sequelize';
import { ClubStatus } from 'src/common/enums/index.enum';
import { Club } from './entities/club.entity';

@Injectable()
export class ClubService {
  constructor(
    private readonly clubRepository: AdminRepository,
    // private readonly userRepo: UserRepository,
  ) {}

  async create(clubDTO: ClubDTO) {
    const {
      sportsIds = [],
      facilityIds = [],
      sports = [],
      facilities = [],
      ...details
    } = clubDTO;

    const resolvedSportIds: number[] = [...sportsIds];
    const resolvedFacilityIds: number[] = [...facilityIds];

    for (const sportName of sports ?? []) {
      const sport = await this.clubRepository.findOrCreateSport(sportName);
      resolvedSportIds.push(sport.id);
    }

    for (const facilityName of facilities ?? []) {
      const facility =
        await this.clubRepository.findOrCreateFacility(facilityName);
      resolvedFacilityIds.push(facility.id);
    }

    return await this.clubRepository.transaction(async (t) => {
      const club = await this.clubRepository.create(
        {
          ...details,
          webiste: details.website,
          status: details.status ?? ClubStatus.PENDING,
          price: details.price ?? 0,
        },
        t,
      );

      if (resolvedFacilityIds.length > 0) {
        const facilityLinks = resolvedFacilityIds.map((facilityId) => ({
          facilityId,
          clubId: club.id,
        }));
        await this.clubRepository.createFacilityClub(facilityLinks, t);
      }

      if (resolvedSportIds.length > 0) {
        const sportLinks = resolvedSportIds.map((sportId) => ({
          sportId,
          clubId: club.id,
        }));
        await this.clubRepository.createSportClub(sportLinks, t);
      }

      return club;
    });
  }

  async findClub(clubId: number) {
    const club = await this.clubRepository.findClub(clubId);
    return club;
  }

  async findAllClubs() {
    const clubs = await this.clubRepository.findAllClubs();
    return clubs.map((club) => {
      const raw = club.toJSON() as any;
      const sports = Array.isArray(raw.sports)
        ? raw.sports.map((s: any) => s.sport ?? s)
        : [];
      const facilities = Array.isArray(raw.facilities)
        ? raw.facilities.map((f: any) => f.facility ?? f)
        : [];
      const subscriptionType =
        typeof raw.billingType === 'string'
          ? raw.billingType.toLowerCase()
          : 'monthly';

      return {
        id: raw.id,
        name: raw.clubName,
        logo: raw.clubName
          ? raw.clubName
              .split(' ')
              .map((w: string) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
          : 'CL',
        coverImage: raw.coverImage || '',
        description: raw.decription || '',
        city: raw.city || '',
        address: raw.address || '',
        phone: raw.phoneNumber || '',
        email: raw.email || '',
        website: raw.webiste || '',
        sports,
        facilities,
        members: raw.members ?? 0,
        rating: raw.rating ?? 0,
        reviews: raw.reviews ?? 0,
        status:
          typeof raw.status === 'string' ? raw.status.toLowerCase() : 'pending',
        verified: raw.verified ?? false,
        subscriptionType: subscriptionType as 'monthly' | 'yearly',
        subscriptionPlan: raw.subscriptionPlan || 'Basic',
        subscriptionStartDate: raw.startDate
          ? raw.startDate.toISOString().slice(0, 10)
          : '',
        subscriptionEndDate: raw.endDate
          ? raw.endDate.toISOString().slice(0, 10)
          : '',
        subscriptionStatus: raw.subscriptionStatus || 'active',
        priceFrom: raw.price ?? 0,
        workingHours: raw.workingHoures || '',
        capacity: raw.maxMembers ?? 0,
        joinedDate: raw.dateJoined
          ? new Date(raw.dateJoined).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '',
        monthlyRevenue: raw.monthlyRevenue ?? 0,
      };
    });
  }

  async updateClub(clubId: number, data: EditedClubDTO) {
    const { sports, facilities, ...clubData } = data as unknown as Record<
      string,
      unknown
    >;

    const club = await this.clubRepository.updateClub(
      clubId,
      clubData as Partial<Club>,
    );
    return club;
  }

  async deleteClub(clubId: number) {
    const delClub = await this.clubRepository.deleteClub(clubId);
    return delClub;
  }

  // add sports from admin platform to platform
}

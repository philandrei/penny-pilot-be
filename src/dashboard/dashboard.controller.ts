import { Controller, Get, Req } from "@nestjs/common";
import { DashboardService } from "./service/dashboard.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import type { AuthenticatedRequest } from "@auth/auth-request.interface";

@Controller('dashboard')
@ApiBearerAuth()
export class DashboardController {

    constructor(private readonly dashboardService: DashboardService) { }

    @Get()
    getDashboard(@Req() req: AuthenticatedRequest,
    ) {
        return this.dashboardService.getDashboard(req.user.userId);
    }

}
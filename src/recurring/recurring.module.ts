import { Controller, Module } from "@nestjs/common";
import { TransactionModule } from "@transaction/transaction.module";
import { RecurringService } from "./service/recurring.service";
import { RecurringController } from "./recurring.controller";
import { UserModule } from "@user/user.module";
import { RecurringEntity } from "./entity/recurring.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RecurringSchedulerService } from "./service/recurring-scheduler.service";

@Module({
    imports: [TypeOrmModule.forFeature([RecurringEntity]), TransactionModule, UserModule],
    providers: [RecurringService, RecurringSchedulerService],
    exports: [],
    controllers: [RecurringController]
})
export class RecurringModule { }
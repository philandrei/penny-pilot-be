import { plainToInstance } from "class-transformer";
import { RecurringRequest } from "./dto/request/recurring-request.dto";
import { RecurringEntity } from "./entity/recurring.entity";
import { RecurringRecord } from "./dto/response/recurring-record.dto";

export class RecurringMapper {
    static toEntityFromRequest(request: RecurringRequest): RecurringEntity {
        return plainToInstance(RecurringEntity, request, {
            excludeExtraneousValues: true
        })
    }

    static toRecordFromEntity(entity: RecurringEntity): RecurringRecord {
        return {
            ...entity
        }
    }
}
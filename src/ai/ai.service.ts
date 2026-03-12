import { Injectable } from "@nestjs/common";
import { AiClient } from "./ai.client";
import { CategorizerRequest } from "./dto/request/categorizer-request.dto";
import { CategorizerResponse } from "./dto/response/categorizer-response.dto";

@Injectable()
export class AiService {
    constructor(private readonly aiClient: AiClient) { }

    async categorizer(req: CategorizerRequest): Promise<CategorizerResponse> {
        return this.aiClient.categorize(req);
    }
}
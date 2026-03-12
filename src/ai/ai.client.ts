import { ConfigService } from "@nestjs/config";
import { CategorizerRequest } from "./dto/request/categorizer-request.dto";
import { CategorizerResponse } from "./dto/response/categorizer-response.dto";
import axios from "axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AiClient {

    constructor(private readonly configService: ConfigService) { }

    async categorize(req: CategorizerRequest): Promise<CategorizerResponse> {
        const result = await axios.post<CategorizerResponse>(`${this.configService.getOrThrow<string>('AI_URL')}/categorizer`, req);
        return result.data;
    }
}
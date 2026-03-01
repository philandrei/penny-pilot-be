import { Injectable } from "@nestjs/common";
import { BaseRepostory } from "../repository/base.repository";

@Injectable()
export class BaseService {
    constructor(private readonly repo: BaseRepostory) { }
}
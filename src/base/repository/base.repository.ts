import { AbstractRepository } from "@abstracts/abstract-repository";
import { Injectable } from "@nestjs/common";
import { BaseEntity } from "../entity/base.entity";
import { DataSource } from "typeorm";

@Injectable()
export class BaseRepostory extends AbstractRepository<BaseEntity> {
    constructor(dataSource: DataSource) {
        super(BaseEntity, dataSource);
    }
}
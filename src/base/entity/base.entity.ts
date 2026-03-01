import { AbstractEntity } from "@abstracts/abstract-entity";
import { Column, Entity } from "typeorm";

@Entity('entityName')
export class BaseEntity extends AbstractEntity {
    @Column()
    columName: string;
}
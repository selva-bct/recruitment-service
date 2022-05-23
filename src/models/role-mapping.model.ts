import {Entity, model, property} from '@loopback/repository';

@model()
export class RoleMapping extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  roleMappingId?: string;

  constructor(data?: Partial<RoleMapping>) {
    super(data);
  }
}

export interface RoleMappingRelations {
  // describe navigational properties here
}

export type RoleMappingWithRelations = RoleMapping & RoleMappingRelations;

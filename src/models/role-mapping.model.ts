import {Entity, model, property} from '@loopback/repository';

@model()
export class RoleMapping extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  roleMappingId: number;

  @property({
    type: 'string',
  })
  userId: string;

  @property({
    type: 'string',
  })
  roleId: string;

  constructor(data?: Partial<RoleMapping>) {
    super(data);
  }
}

export interface RoleMappingRelations {
  // describe navigational properties here
}

export type RoleMappingWithRelations = RoleMapping & RoleMappingRelations;

import {Entity, model, property} from '@loopback/repository';

@model()
export class Role extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  roleId?: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      transform: ['toLowerCase'],
    },
    index: {
      unique: true,
    },
  })
  name: string;

  @property({
    type: 'string',
  })
  description?: string;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;

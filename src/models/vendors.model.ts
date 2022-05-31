import {Entity, model, property} from '@loopback/repository';

@model()
export class Vendors extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  vendorId?: number;

  @property({
    type: 'string',
    required: true,
  })
  websiteUrl: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  hiringFor?: string[];


  constructor(data?: Partial<Vendors>) {
    super(data);
  }
}

export interface VendorsRelations {
  // describe navigational properties here
}

export type VendorsWithRelations = Vendors & VendorsRelations;

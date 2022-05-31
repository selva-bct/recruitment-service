import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IndulgeDBDataSource} from '../datasources';
import {UserServiceBindings} from '../keys';
import {Vendors, VendorsRelations} from '../models';

export class VendorsRepository extends DefaultCrudRepository<
  Vendors,
  typeof Vendors.prototype.vendorId,
  VendorsRelations
> {
  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`)
    dataSource: IndulgeDBDataSource,
  ) {
    super(Vendors, dataSource);
  }
}

import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IndulgeDBDataSource} from '../datasources';
import {UserServiceBindings} from '../keys';
import {RoleMapping, RoleMappingRelations} from '../models';

export class RoleMappingRepository extends DefaultCrudRepository<
  RoleMapping,
  typeof RoleMapping.prototype.roleMappingId,
  RoleMappingRelations
> {
  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`)
    dataSource: IndulgeDBDataSource,
  ) {
    super(RoleMapping, dataSource);
  }
}

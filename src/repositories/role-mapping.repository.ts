import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IndulgeDBDataSource} from '../datasources';
import {RoleMapping, RoleMappingRelations} from '../models';
import { UserServiceBindings } from '../keys';

export class RoleMappingRepository extends DefaultCrudRepository<
  RoleMapping,
  typeof RoleMapping.prototype.roleMappingId,
  RoleMappingRelations
> {
  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`) dataSource: IndulgeDBDataSource,
  ) {
    super(RoleMapping, dataSource);
  }
}

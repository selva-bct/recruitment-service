import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {IndulgeDBDataSource} from '../datasources';
import {UserServiceBindings} from '../keys';
import {Role, RoleRelations} from '../models';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.roleId,
  RoleRelations
> {
  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`)
    dataSource: IndulgeDBDataSource,
  ) {
    super(Role, dataSource);
  }
}

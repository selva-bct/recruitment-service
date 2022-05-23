import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyThroughRepositoryFactory,
  HasOneRepositoryFactory,
  repository,
} from '@loopback/repository';
import {IndulgeDBDataSource} from '../datasources';
import {UserServiceBindings} from '../keys';
import {
  Role,
  RoleMapping,
  User,
  UserCredentials,
  UserRelations,
  Waitlist,
} from '../models';
import {RoleMappingRepository} from './role-mapping.repository';
import {RoleRepository} from './role.repository';
import {UserCredentialsRepository} from './user-credentials.repository';
import {WaitlistRepository} from './waitlist.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.userId,
  UserRelations
> {
  public readonly userCredentials: HasOneRepositoryFactory<
    UserCredentials,
    typeof User.prototype.userId
  >;

  public readonly waitlist: BelongsToAccessor<
    Waitlist,
    typeof User.prototype.userId
  >;

  public readonly roles: HasManyThroughRepositoryFactory<
    Role,
    typeof Role.prototype.roleId,
    RoleMapping,
    typeof User.prototype.userId
  >;

  constructor(
    @inject(`datasources.${UserServiceBindings.DATASOURCE_NAME}`)
    dataSource: IndulgeDBDataSource,
    @repository.getter('UserCredentialsRepository')
    protected userCredentialsRepositoryGetter: Getter<UserCredentialsRepository>,
    @repository.getter('WaitlistRepository')
    protected waitlistRepositoryGetter: Getter<WaitlistRepository>,
    @repository.getter('RoleMappingRepository')
    protected roleMappingRepositoryGetter: Getter<RoleMappingRepository>,
    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>,
    @repository(RoleRepository)
    public roleRepository: RoleRepository,
  ) {
    super(User, dataSource);
    this.roles = this.createHasManyThroughRepositoryFactoryFor(
      'roles',
      roleRepositoryGetter,
      roleMappingRepositoryGetter,
    );
    this.registerInclusionResolver('roles', this.roles.inclusionResolver);
    this.waitlist = this.createBelongsToAccessorFor(
      'waitlist',
      waitlistRepositoryGetter,
    );
    this.registerInclusionResolver('waitlist', this.waitlist.inclusionResolver);
    this.userCredentials = this.createHasOneRepositoryFactoryFor(
      'userCredentials',
      userCredentialsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userCredentials',
      this.userCredentials.inclusionResolver,
    );
  }

  async findCredentials(
    userId: typeof User.prototype.userId,
  ): Promise<UserCredentials | undefined> {
    try {
      return await this.userCredentials(userId).get();
    } catch (err) {
      if (err.code === 'ENTITY_NOT_FOUND') {
        return undefined;
      }
      throw err;
    }
  }
}

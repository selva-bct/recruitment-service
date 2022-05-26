import {authenticate, TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import {TokenServiceBindings, UserServiceBindings} from '../keys';
import {Role, User, UserDeviceInfo, Waitlist} from '../models';
import {
  UserDeviceInfoRepository,
  UserRepository,
  WaitlistRepository,
} from '../repositories';
import {Credentials, MyUserService} from '../services';

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

@authenticate('jwt')
export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
    @repository(WaitlistRepository)
    protected waitlistRepository: WaitlistRepository,
    @repository(UserDeviceInfoRepository)
    public userDeviceInfoRepository: UserDeviceInfoRepository,
  ) {}

  @authenticate.skip()
  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  @get('/me', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async me(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<UserProfile> {
    return currentUserProfile;
  }

  @post('/users/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: User,
  ): Promise<User> {
    if (!newUserRequest.password) {
      throw new HttpErrors.BadRequest('Missing Password Field.');
    }
    const waitlistUser = await this.waitlistRepository.findOne({
      where: {
        email: newUserRequest.email,
      },
    });
    if (!waitlistUser) {
      throw new HttpErrors.Forbidden(
        'Given Email is not part of The Waitlist.',
      );
    } else if (!waitlistUser.isApproved) {
      throw new HttpErrors.Forbidden(
        'Given Email is not approved from Waitlist.',
      );
    } else {
      newUserRequest.waitlistId = waitlistUser.waitlistId;
    }
    const password = await hash(newUserRequest.password, await genSalt());
    newUserRequest.password = password;
    const savedUser = await this.userRepository.create(newUserRequest);
    await this.userRepository
      .userCredentials(savedUser.userId)
      .create({password});
    return savedUser;
  }

  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  // Rest api for consuming user's waitlist

  @get('/users/{id}/waitlist', {
    responses: {
      '200': {
        description: 'Waitlist belonging to User',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Waitlist)},
          },
        },
      },
    },
  })
  async getWaitlist(
    @param.path.number('id') id: typeof User.prototype.userId,
  ): Promise<Waitlist> {
    return this.userRepository.waitlist(id);
  }

  // Rest api to consume user and role info

  @get('/users/{id}/roles', {
    responses: {
      '200': {
        description: 'Array of User has many Role through RoleMapping',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Role)},
          },
        },
      },
    },
  })
  async findUserRoles(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Role>,
  ): Promise<Role[]> {
    return this.userRepository.roles(id).find(filter);
  }

  @post('/users/{id}/roles', {
    responses: {
      '200': {
        description: 'create a Role model instance',
        content: {'application/json': {schema: getModelSchemaRef(Role)}},
      },
    },
  })
  async createUserRoles(
    @param.path.number('id') id: typeof User.prototype.userId,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {
            title: 'NewRoleInUser',
            exclude: ['roleId'],
          }),
        },
      },
    })
    role: Omit<Role, 'roleId'>,
  ): Promise<Role> {
    return this.userRepository.roles(id).create(role);
  }

  @patch('/users/{id}/roles', {
    responses: {
      '200': {
        description: 'User.Role PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patchUserRoles(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Role, {partial: true}),
        },
      },
    })
    role: Partial<Role>,
    @param.query.object('where', getWhereSchemaFor(Role)) where?: Where<Role>,
  ): Promise<Count> {
    return this.userRepository.roles(id).patch(role, where);
  }

  @del('/users/{id}/roles', {
    responses: {
      '200': {
        description: 'User.Role DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async deleteUserRoles(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Role)) where?: Where<Role>,
  ): Promise<Count> {
    return this.userRepository.roles(id).delete(where);
  }

  // Rest api to consume user device

  @get('/user-device-infos/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to UserDeviceInfo',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.number('id') id: typeof UserDeviceInfo.prototype.userDeviceId,
  ): Promise<User> {
    return this.userDeviceInfoRepository.user(id);
  }
}

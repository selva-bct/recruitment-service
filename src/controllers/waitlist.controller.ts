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
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Waitlist} from '../models';
import {WaitlistRepository} from '../repositories';

export class WaitlistController {
  constructor(
    @repository(WaitlistRepository)
    public waitlistRepository: WaitlistRepository,
  ) {}

  @post('/waitlists')
  @response(200, {
    description: 'Waitlist model instance',
    content: {'application/json': {schema: getModelSchemaRef(Waitlist)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Waitlist, {
            title: 'NewWaitlist',
            exclude: ['waitlistId'],
          }),
        },
      },
    })
    waitlist: Omit<Waitlist, 'waitlistId'>,
  ): Promise<Waitlist> {
    return this.waitlistRepository.create(waitlist);
  }

  @get('/waitlists/count')
  @response(200, {
    description: 'Waitlist model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Waitlist) where?: Where<Waitlist>): Promise<Count> {
    return this.waitlistRepository.count(where);
  }

  @get('/waitlists')
  @response(200, {
    description: 'Array of Waitlist model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Waitlist, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Waitlist) filter?: Filter<Waitlist>,
  ): Promise<Waitlist[]> {
    return this.waitlistRepository.find(filter);
  }

  @patch('/waitlists')
  @response(200, {
    description: 'Waitlist PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Waitlist, {partial: true}),
        },
      },
    })
    waitlist: Waitlist,
    @param.where(Waitlist) where?: Where<Waitlist>,
  ): Promise<Count> {
    return this.waitlistRepository.updateAll(waitlist, where);
  }

  @get('/waitlists/{id}')
  @response(200, {
    description: 'Waitlist model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Waitlist, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Waitlist, {exclude: 'where'})
    filter?: FilterExcludingWhere<Waitlist>,
  ): Promise<Waitlist> {
    return this.waitlistRepository.findById(id, filter);
  }

  @patch('/waitlists/{id}')
  @response(204, {
    description: 'Waitlist PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Waitlist, {partial: true}),
        },
      },
    })
    waitlist: Waitlist,
  ): Promise<void> {
    await this.waitlistRepository.updateById(id, waitlist);
  }

  @put('/waitlists/{id}')
  @response(204, {
    description: 'Waitlist PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() waitlist: Waitlist,
  ): Promise<void> {
    await this.waitlistRepository.replaceById(id, waitlist);
  }

  @del('/waitlists/{id}')
  @response(204, {
    description: 'Waitlist DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.waitlistRepository.deleteById(id);
  }
}

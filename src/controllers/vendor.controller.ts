import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Vendors} from '../models';
import {VendorsRepository} from '../repositories';

export class VendorController {
  constructor(
    @repository(VendorsRepository)
    public vendorsRepository : VendorsRepository,
  ) {}

  @post('/vendors')
  @response(200, {
    description: 'Vendors model instance',
    content: {'application/json': {schema: getModelSchemaRef(Vendors)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vendors, {
            title: 'NewVendors',
            exclude: ['vendorId'],
          }),
        },
      },
    })
    vendors: Omit<Vendors, 'vendorId'>,
  ): Promise<Vendors> {
    return this.vendorsRepository.create(vendors);
  }

  @get('/vendors/count')
  @response(200, {
    description: 'Vendors model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Vendors) where?: Where<Vendors>,
  ): Promise<Count> {
    return this.vendorsRepository.count(where);
  }

  @get('/vendors')
  @response(200, {
    description: 'Array of Vendors model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Vendors, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Vendors) filter?: Filter<Vendors>,
  ): Promise<Vendors[]> {
    return this.vendorsRepository.find(filter);
  }

  @patch('/vendors')
  @response(200, {
    description: 'Vendors PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vendors, {partial: true}),
        },
      },
    })
    vendors: Vendors,
    @param.where(Vendors) where?: Where<Vendors>,
  ): Promise<Count> {
    return this.vendorsRepository.updateAll(vendors, where);
  }

  @get('/vendors/{id}')
  @response(200, {
    description: 'Vendors model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Vendors, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Vendors, {exclude: 'where'}) filter?: FilterExcludingWhere<Vendors>
  ): Promise<Vendors> {
    return this.vendorsRepository.findById(id, filter);
  }

  @patch('/vendors/{id}')
  @response(204, {
    description: 'Vendors PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vendors, {partial: true}),
        },
      },
    })
    vendors: Vendors,
  ): Promise<void> {
    await this.vendorsRepository.updateById(id, vendors);
  }

  @put('/vendors/{id}')
  @response(204, {
    description: 'Vendors PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() vendors: Vendors,
  ): Promise<void> {
    await this.vendorsRepository.replaceById(id, vendors);
  }

  @del('/vendors/{id}')
  @response(204, {
    description: 'Vendors DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.vendorsRepository.deleteById(id);
  }
}

import { OpenAPIObject } from '@nestjs/swagger';

export const swaggerDocument: OpenAPIObject = {
  openapi: '3.0.0',
  info: {
    title: 'ClearFaceAPI',
    description: 'ClearFaceAPI - API para reconhecimento facial e análise de acne',
    version: '1.0',
    contact:{
        name: 'ClearFaceAPI',
        email: 'cibatech@gmail.com',
    },
    license:{
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
    }
  },
  tags:[
    {name:"Auth",description:"Rotas de autenticação"},
    {name:"Consultas",description:"Rotas de consultas"},
    {name:"Imagens",description:"Rotas de imagens"}
  ],
  paths: {
    '/auth/register': {
        post: {
        summary: 'Registro de Usuário',
        tags: ['Auth'],
        description: 'Cria um novo usuário no sistema.',
        requestBody: {
            required: true,
            content: {
            'application/json': {
                schema: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email', description: 'E-mail do usuário' },
                    name: { type: 'string', description: 'Nome do usuário', minLength: 3 },
                    password: { type: 'string', description: 'Senha do usuário', minLength: 6 }
                },
                required: ['email', 'name', 'password']
                }
            }
            }
        },
        responses: {
            '201': {
            description: 'Usuário registrado com sucesso',
            content: {
                'application/json': {
                schema: { $ref: '#/components/schemas/User' }
                }
            }
            },
            '409': {
            description: 'Usuário já existe',
            content: {
                'application/json': {
                example: { message: 'User already exists', description: 'User already exists' }
                }
            }
            },
            '500': {
            description: 'Erro interno no servidor',
            content: {
                'application/json': {
                example: { message: 'Internal server error' }
                }
            }
            }
        }
        }
    },
    '/auth/login': {
        post: {
        summary: 'Login de Usuário',
        tags: ['Auth'],
        description: 'Autentica um usuário e retorna um token JWT.',
        requestBody: {
            required: true,
            content: {
            'application/json': {
                schema: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email', description: 'E-mail do usuário' },
                    password: { type: 'string', description: 'Senha do usuário', minLength: 6 }
                },
                required: ['email', 'password']
                }
            }
            }
        },
        responses: {
            '200': {
            description: 'Login bem-sucedido',
            content: {
                'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                    Description: { type: 'string' },
                    token: { type: 'string', description: 'Token JWT gerado para autenticação' }
                    }
                }
                }
            }
            },
            '401': {
            description: 'Senha inválida',
            content: {
                'application/json': {
                example: { Description: 'Invalid password', message: 'Senha incorreta' }
                }
            }
            },
            '404': {
            description: 'Usuário não encontrado',
            content: {
                'application/json': {
                example: { Description: 'Entity Not Found Error', message: 'Usuário não encontrado' }
                }
            }
            },
            '500': {
            description: 'Erro interno no servidor',
            content: {
                'application/json': {
                example: { message: 'Internal server error' }
                }
            }
            }
        }
        }
    },
    '/auth/profile': {
        get: {
        summary: 'Perfil do Usuário',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        parameters:[
            {in:"header",name:"JWT Token",required:true,description:"Bearer Token With JWT",schema:{type:"string"}}
        ],
        description: 'Retorna as informações do usuário autenticado.',
        responses: {
            '200': {
            description: 'Perfil retornado com sucesso',
            content: {
                'application/json': {
                schema: { $ref: '#/components/schemas/User' }
                }
            }
            },
            '404': {
            description: 'Usuário não encontrado',
            content: {
                'application/json': {
                example: { message: 'Usuário não encontrado' }
                }
            }
            },
            '500': {
            description: 'Erro interno no servidor',
            content: {
                'application/json': {
                example: { message: 'Internal server error' }
                }
            }
            }
        }
        }
    },
    '/auth/password': {
        put: {
        summary: 'Alterar Senha',
        tags: ['Auth'],
        description: 'Atualiza a senha de um usuário com um código de recuperação.',
        requestBody: {
            required: true,
            content: {
            'application/json': {
                schema: {
                type: 'object',
                properties: {
                    recString: { type: 'string', description: 'Código de recuperação' },
                    newPassword: { type: 'string', description: 'Nova senha', minLength: 6 },
                    refCode: { type: 'string', description: 'Código de referência' }
                },
                required: ['recString', 'newPassword', 'refCode']
                }
            }
            }
        },
        responses: {
            '200': {
            description: 'Senha atualizada com sucesso',
            content: {
                'application/json': {
                example: { message: 'Password updated successfully' }
                }
            }
            },
            '400': {
            description: 'Erro de validação ou entidade não encontrada',
            content: {
                'application/json': {
                example: { message: 'Código de recuperação inválido' }
                }
            }
            },
            '500': {
            description: 'Erro interno no servidor',
            content: {
                'application/json': {
                example: { message: 'Internal server error' }
                }
            }
            }
        }
        }
    },
    '/auth/recover': {
    post: {
      summary: 'Recuperação de Senha',
      tags: ['Auth'],
      description: 'Envia um código de recuperação para o e-mail do usuário.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string', format: 'email', description: 'E-mail do usuário' }
              },
              required: ['email']
            }
          }
        }
      },
      responses: {
        '200': {
          description: 'Código de recuperação enviado',
          content: {
            'application/json': {
              example: { recoveryCode: '123456' }
            }
          }
        },
        '404': {
          description: 'Usuário não encontrado',
          content: {
            'application/json': {
              example: { message: 'Usuário não encontrado' }
            }
          }
        },
        '500': {
          description: 'Erro interno no servidor',
          content: {
            'application/json': {
              example: { message: 'Internal server error' }
            }
          }
        }
      }
    }
    },
    '/consultas': {
          post: {
            summary: 'Criar Consulta',
            tags: ['Consultas'],
            security: [{ bearerAuth: [] }], // JWT Authentication
            description: 'Cria uma nova consulta para o usuário autenticado.',
            requestBody:{
              required:true,
              content:{
                "application/json":{
                  example:JSON.parse(`
                      {
    "image_id":"cm8ndt8y20000ilfsohp3jiwx"
}
                      `),
                      schema:{
                        required:["image_id"],
                        properties:{
                          image_id:{
                            type:"string",
                            description:"ID da imagem associada a consulta",
                            format:"cuid"
                          }
                        }
                      }
                },
                
              },

            },
            responses: {
              '201': {
                description: 'Consulta criada com sucesso',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Appointment' }
                  }
                }
              },
              '404': {
                description: 'Usuário não encontrado',
                content: {
                  'application/json': {
                    example: { message: 'Usuário não encontrado' }
                  }
                }
              },
              '500': {
                description: 'Erro interno no servidor',
                content: {
                  'application/json': {
                    example: { message: 'Internal server error' }
                  }
                }
              }
            }
          }
    },
    '/consultas/user': {
          get: {
            summary: 'Obter Consultas do Usuário',
            tags: ['Consultas'],
            security: [{ bearerAuth: [] }],
            parameters:[
                {in:"header",name:"JWT Token",required:true,description:"Bearer Token With JWT",schema:{type:"string"}}
            ],
            description: 'Retorna todas as consultas do usuário autenticado.',
            responses: {
              '200': {
                description: 'Lista de consultas do usuário',
                content: {
                  'application/json': {
                    schema: { type: 'array', items: { $ref: '#/components/schemas/Appointment' } }
                  }
                }
              },
              '404': {
                description: 'Usuário não encontrado',
                content: {
                  'application/json': {
                    example: { message: 'Usuário não encontrado' }
                  }
                }
              },
              '500': {
                description: 'Erro interno no servidor',
                content: {
                  'application/json': {
                    example: { message: 'Internal server error' }
                  }
                }
              }
            }
          }
    },
    '/consultas/{id}': {
          get: {
            summary: 'Obter Consulta por ID',
            tags: ['Consultas'],
            description: 'Busca uma consulta pelo ID.',
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                description: 'UUID da consulta',
                schema: { type: 'string', format: 'uuid' }
              }
            ],
            responses: {
              '200': {
                description: 'Consulta encontrada',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Appointment' }
                  }
                }
              },
              '404': {
                description: 'Consulta não encontrada',
                content: {
                  'application/json': {
                    example: { message: 'Consulta não encontrada' }
                  }
                }
              },
              '500': {
                description: 'Erro interno no servidor',
                content: {
                  'application/json': {
                    example: { message: 'Internal server error' }
                  }
                }
              }
            }
    }},
    '/images': {
        post: {
          summary: 'Upload de Imagem',
          tags: ['Imagens'],
          description: 'Faz upload de uma imagem e a associa a uma consulta.',
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    FaceImage: { 
                      type: 'string', 
                      format: 'binary', 
                      description: 'Arquivo de imagem a ser enviado'
                    }
                  },
                  required: ['FaceImage']
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Upload concluído com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      Description: { type: 'string' },
                      image: { $ref: '#/components/schemas/Image' }
                    }
                  }
                }
              }
            },
            '404': {
              description: 'Consulta não encontrada',
              content: {
                'application/json': {
                  example: { message: 'Consulta não encontrada' }
                }
              }
            },
            '500': {
              description: 'Erro interno no servidor',
              content: {
                'application/json': {
                  example: { message: 'Internal server error' }
                }
              }
            }
          }
        }
      },
    '/images/appointment/{appointment_id}': {
        get: {
          summary: 'Consultar Imagens por Consulta',
          tags: ['Imagens'],
          description: 'Retorna todas as imagens associadas a uma consulta.',
          parameters: [
            {
              name: 'appointment_id',
              in: 'path',
              required: true,
              description: 'ID da consulta',
              schema: { type: 'string', pattern: '^[a-zA-Z0-9]{25,}$' }
            }
          ],
          responses: {
            '200': {
              description: 'Imagens retornadas com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Image' }
                  }
                }
              }
            },
            '404': {
              description: 'Consulta não encontrada',
              content: {
                'application/json': {
                  example: { message: 'Consulta não encontrada' }
                }
              }
            },
            '500': {
              description: 'Erro interno no servidor',
              content: {
                'application/json': {
                  example: { message: 'Internal server error' }
                }
              }
            }
          }
        }
      }
    },
  components: {
    securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        },
      
    schemas: {
      User: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
        }
        },  
      Appointment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          resultado: { type: 'object', additionalProperties: true, nullable: true },
          user_id: { type: 'string', format: 'uuid' },
          image_id:{ type:'string',format:'cuid', description:"Id da imagem associado a consulta"},
          user: { $ref: '#/components/schemas/User' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      Image: {
        title:"Image",
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', description:"ID da imagem" },
            url: { type: 'string', format: 'uri',description:"URL da imagem" },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
        }
        }
    }
  }
};

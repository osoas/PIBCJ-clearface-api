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
        description: 'Atualiza a senha de um usuário com um código de recuperação armazenado em cookie.',
        requestBody: {
            required: true,
            content: {
            'application/json': {
                schema: {
                type: 'object',
                properties: {
                    refCode: { type: 'string', description: 'Código de recuperação' },
                    newPassword: { type: 'string', description: 'Nova senha', minLength: 6 }
                },
                required: ['refCode', 'newPassword']
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
      description: 'Envia um código de recuperação para o e-mail do usuário e armazena referência em cookie.',
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
          description: 'Código de recuperação enviado e armazenado em cookie',
          content: {
            'application/json': {
              example: { Description: 'Successfully sent email' }
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
    }},
    "/consultas": {
      "post": {
        "tags": ["Consultas"],
        "summary": "Cria uma nova consulta médica",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "201": {
            "description": "Consulta criada com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": { "type": "string", "format": "uuid" },
                    "user_id": { "type": "string", "format": "uuid" },
                    "resultado": { "type": "array", "items": {} }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Não autorizado"
          },
          "404": {
            "description": "Usuário não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string" }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Erro interno do servidor",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string" },
                    "err": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/consultas/user": {
      "get": {
        "tags": ["Consultas"],
        "summary": "Retorna todas as consultas do usuário autenticado",
        "security": [
          {
            "bearerAuth": []
          }
        ],
        "responses": {
          "200": {
            "description": "Lista de consultas do usuário",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": { "type": "string", "format": "uuid" },
                      "user_id": { "type": "string", "format": "uuid" },
                      "resultado": { "type": "object" }
                    }
                  }
                }
              }
            }
          },
          "401": {
            "description": "Não autorizado"
          },
          "404": {
            "description": "Usuário não encontrado",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string" }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Erro interno do servidor",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": { "type": "string" }
                  }
                }
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
    "/consultas/{id}/imagem": {
      "get": {
        "tags": ["Consultas"],
        "summary": "Retorna a imagem processada da consulta",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "description": "ID da consulta (formato CUID)",
            "schema": {
              "type": "string",
              "example": "cm9639mnm0002il78162v2ips"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Imagem retornada com sucesso (formato JPG)",
            "content": {
              "image/jpeg": {
                "schema": {
                  "type": "string",
                  "format": "binary"
                }
              }
            }
          },
          "404": {
            "description": "Consulta não encontrada ou imagem ausente",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Consulta não encontrada"
                    },
                    "description": {
                      "type": "string",
                      "example": "Imagem não encontrada"
                    }
                  }
                }
              }
            }
          },
          "500": {
            "description": "Erro interno do servidor",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Internal server error"
                    },
                    "err": {
                      "type": "string",
                      "example": "Descrição do erro"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/images": {
      "post": {
        "tags": ["Imagens"],
        "summary": "Faz upload de uma imagem facial para uma consulta",
        "requestBody": {
          "required": true,
          "content": {
            "multipart/form-data": {
              "schema": {
                "type": "object",
                "properties": {
                  "FaceImage": {
                    "type": "string",
                    "format": "binary",
                    "description": "Arquivo de imagem da face"
                  },
                  "appointment_id": {
                    "type": "string",
                    "description": "ID da consulta associada",
                    "example": "ckxyz123456789abcdef"
                  }
                },
                "required": ["FaceImage", "appointment_id"]
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Imagem enviada e registrada com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "Description": { "type": "string" },
                    "image": {
                      "type": "object",
                      "properties": {
                        "id": { "type": "string" },
                        "url": { "type": "string" },
                        "appointmentId": { "type": "string" }
                      }
                    },
                    "body": { "type": "object" }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Nenhuma imagem enviada"
          },
          "500": {
            "description": "Erro interno ao processar a imagem"
          }
        }
      }
    },
    "/images/appointment/{appointment_id}": {
      "get": {
        "tags": ["Imagens"],
        "summary": "Retorna todas as imagens vinculadas a uma consulta específica",
        "parameters": [
          {
            "name": "appointment_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            },
            "description": "ID da consulta associada"
          }
        ],
        "responses": {
          "200": {
            "description": "Lista de imagens associadas à consulta",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": { "type": "string" },
                      "url": { "type": "string" },
                      "appointmentId": { "type": "string" }
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Consulta não encontrada"
          },
          "500": {
            "description": "Erro interno ao buscar imagens"
          }
        }
      }
    },
    '/consultas/solve': {
      put: {
      summary: 'Executa a detecção facial e atualiza o resultado da consulta',
      description: 'Usa a imagem associada a uma consulta médica para realizar a detecção facial com YOLO e atualiza o campo de resultado da consulta com os dados processados.',
      tags: ['Consultas'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                image_id: {
                  type: 'string',
                  format: 'cuid',
                  example: 'clu23dz1x0000w1q8z8g4u8oi',
                  description: 'ID da imagem associada à consulta a ser processada'
                }
              },
              required: ['image_id']
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Consulta atualizada com o resultado da detecção',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Appointment'
              }
            }
          }
        },
        404: {
          description: 'Consulta ou imagem não encontrada',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        500: {
          description: 'Erro interno ao processar a imagem',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  err: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
    }
    },
    "components": {
    "schemas": {
      "User": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "format": "uuid" },
          "name": { "type": "string" },
          "email": { "type": "string", "format": "email" },
          "password": { "type": "string" },
          "created_at": { "type": "string", "format": "date-time" },
          "updated_at": { "type": "string", "format": "date-time" },
          "appointments": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/Appointment" }
          }
        }
      },
      "Appointment": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "format": "cuid" },
          "resultado": {
            "type": "array",
            "items": { "type": "object" },
            "description": "Array de resultados (dados de detecção)"
          },
          "user_id": { "type": "string", "format": "uuid" },
          "user": { "$ref": "#/components/schemas/User" },
          "image_id": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/Image" }
          },
          "created_at": { "type": "string", "format": "date-time" },
          "updated_at": { "type": "string", "format": "date-time" }
        }
      },
      "Image": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "format": "cuid" },
          "url": { "type": "string" },
          "created_at": { "type": "string", "format": "date-time" },
          "updated_at": { "type": "string", "format": "date-time" },
          "appointmentId": { "type": "string", "format": "cuid" },
          "appointment_ref": { "$ref": "#/components/schemas/Appointment" }
        }
      }
    }
  }
};

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Plant-care-device API',
      version: '1.0.0',
      description: 'API для управления измерениями с датчиков',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Measurement: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            deviceId: { type: 'string', example: 'sensor-001' },
            timestamp: { type: 'string', format: 'date-time', example: '2026-07-26T12:34:56.789Z' },
            temperature: { type: 'number', example: 25.5 },
            humidityAir: { type: 'number', example: 60.0 },
            soilMoisture: { type: 'number', example: 45.0 },
            illuminance: { type: 'number', example: 300.0 },
          },
        },
        MeasurementInput: {
          type: 'object',
          required: ['deviceId', 'temperature', 'humidityAir', 'soilMoisture', 'illuminance'],
          properties: {
            deviceId: { type: 'string', example: 'sensor-001' },
            temperature: { type: 'number', minimum: -50, maximum: 100, example: 25.5 },
            humidityAir: { type: 'number', minimum: 0, maximum: 100, example: 60.0 },
            soilMoisture: { type: 'number', minimum: 0, maximum: 100, example: 45.0 },
            illuminance: { type: 'number', minimum: 0, example: 300.0 },
            timestamp: {
              type: 'integer',
              description: 'Unix timestamp в миллисекундах (опционально)',
              example: 1722000000000,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
        DeleteResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Deleted successfully' },
          },
        },
        SaveResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Measurement saved' },
            id: { type: 'integer', example: 42 },
          },
        },
      },
      parameters: {
        deviceIdQuery: {
          in: 'query',
          name: 'deviceId',
          schema: { type: 'string' },
          description: 'Фильтр по ID устройства',
        },
        fromQuery: {
          in: 'query',
          name: 'from',
          schema: { type: 'string', format: 'date-time' },
          description: 'Начальная дата в ISO формате (например, 2026-07-01T00:00:00Z)',
        },
        toQuery: {
          in: 'query',
          name: 'to',
          schema: { type: 'string', format: 'date-time' },
          description: 'Конечная дата в ISO формате',
        },
        limitQuery: {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', default: 100, minimum: 1, maximum: 1000 },
          description: 'Максимальное количество записей',
        },
        sortQuery: {
          in: 'query',
          name: 'sort',
          schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
          description: 'Порядок сортировки по времени (asc – по возрастанию, desc – по убыванию)',
        },
        idPath: {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer' },
          description: 'ID измерения',
        },
      },
    },
    tags: [
      { name: 'Measurements', description: 'Операции с измерениями' },
    ],
    paths: {
      '/api/measurements': {
        post: {
          summary: 'Сохранить новое измерение',
          tags: ['Measurements'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MeasurementInput' },
              },
            },
          },
          responses: {
            201: {
              description: 'Измерение успешно сохранено',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SaveResponse' },
                },
              },
            },
            400: {
              description: 'Ошибка валидации (неверные данные)',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
            500: {
              description: 'Внутренняя ошибка сервера',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
        get: {
          summary: 'Получить список измерений с фильтрацией',
          tags: ['Measurements'],
          parameters: [
            { $ref: '#/components/parameters/deviceIdQuery' },
            { $ref: '#/components/parameters/fromQuery' },
            { $ref: '#/components/parameters/toQuery' },
            { $ref: '#/components/parameters/limitQuery' },
            { $ref: '#/components/parameters/sortQuery' },
          ],
          responses: {
            200: {
              description: 'Успешный ответ со списком измерений',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Measurement' },
                  },
                },
              },
            },
            500: {
              description: 'Внутренняя ошибка сервера',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/measurements/latest': {
        get: {
          summary: 'Получить самое свежее измерение (опционально для устройства)',
          tags: ['Measurements'],
          parameters: [
            { $ref: '#/components/parameters/deviceIdQuery' },
          ],
          responses: {
            200: {
              description: 'Найдено последнее измерение',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Measurement' },
                },
              },
            },
            404: {
              description: 'Измерения не найдены',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
            500: {
              description: 'Внутренняя ошибка сервера',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/measurements/{id}': {
        delete: {
          summary: 'Удалить измерение по ID',
          tags: ['Measurements'],
          parameters: [
            { $ref: '#/components/parameters/idPath' },
          ],
          responses: {
            200: {
              description: 'Удаление выполнено успешно',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/DeleteResponse' },
                },
              },
            },
            404: {
              description: 'Измерение с указанным ID не найдено',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
            500: {
              description: 'Внутренняя ошибка сервера',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [], 
};

module.exports = swaggerJsdoc(options);
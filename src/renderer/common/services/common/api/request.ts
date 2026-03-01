import axios, {
  Method,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';

interface ConfigType {
  headers?: { [key: string]: string };
  hold?: boolean;
  timeout?: number;
}
interface ResponseDataType {
  code: number;
  message: string;
  data: any;
}

/**
 * Начало запроса
 */
function requestStart(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  return config;
}

/**
 * Запрос успешен, проверка заголовков
 */
function responseSuccess(response: AxiosResponse<ResponseDataType>) {
  return response;
}
/**
 * Проверка данных ответа
 */
function checkRes(data: ResponseDataType) {
  if (data === undefined) {
    return Promise.reject('Ошибка сервера');
  }
  if (data?.code && (data.code < 200 || data.code >= 400)) {
    return Promise.reject(data);
  }
  return data;
}

/**
 * Ошибка ответа
 */
function responseError(err: any) {
  if (!err) {
    return Promise.reject({ message: 'Неизвестная ошибка' });
  }

  // Проверка сетевой ошибки (нет ответа)
  if (err.message === 'Network Error') {
    return Promise.reject({ message: 'Сервис ещё запускается, попробуйте позже' });
  }

  // Проверка ошибки тайм-аута
  if (err.code === 'ECONNABORTED') {
    return Promise.reject({ message: 'Время ожидания запроса истекло, попробуйте позже' });
  }

  // Проверка наличия тела ответа и кода статуса
  if (err.response) {
    // Здесь можно добавить более детальную обработку ошибок по err.response.status
    return Promise.reject(err.response.data);
  }

  // Для других типов ошибок — возвращаем напрямую
  return Promise.reject(err);
}

/* Создание экземпляра запроса */
const instance = axios.create({
  timeout: 60000, // время ожидания
  headers: {
    'content-type': 'application/json',
    'Cache-Control': 'no-cache',
  },
});

/* Перехват запроса */
instance.interceptors.request.use(requestStart, (err) => Promise.reject(err));
/* Перехват ответа */
instance.interceptors.response.use(responseSuccess, (err) =>
  Promise.reject(err),
);

export function request(
  url: string,
  data: any,
  config: ConfigType,
  method: Method,
): any {
  /* Удаление пустых значений */
  Object.keys(data).forEach((key) => {
    if (data[key] === null || data[key] === undefined) {
      delete data[key]; // Если значение свойства null или undefined, удаляем его
    }
  });

  return instance
    .request({
      baseURL: `http://127.0.0.1:${window.electron.getPort()}`,
      url,
      method,
      data: ['POST', 'PUT'].includes(method) ? data : null,
      params: !['POST', 'PUT'].includes(method) ? data : null,
      ...config, // custom config
    })
    .then((res) => checkRes(res.data))
    .catch((err) => responseError(err));
}

/**
 * Методы API-запросов
 * @param {String} url
 * @param {Any} params
 * @param {Object} config
 * @returns
 */
export function GET<T = undefined>(
  url: string,
  params = {},
  config: ConfigType = {},
): Promise<T> {
  return request(url, params, config, 'GET');
}

export function POST<T = undefined>(
  url: string,
  data = {},
  config: ConfigType = {},
): Promise<T> {
  return request(url, data, config, 'POST');
}

export function PUT<T = undefined>(
  url: string,
  data = {},
  config: ConfigType = {},
): Promise<T> {
  return request(url, data, config, 'PUT');
}

export function DELETE<T = undefined>(
  url: string,
  data = {},
  config: ConfigType = {},
): Promise<T> {
  return request(url, data, config, 'DELETE');
}

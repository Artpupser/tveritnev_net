# 📡 TveritnevNet — API Documentation

> Backend API для лендинга Анатолия Тверитнева.
>
> Документ обновлён по фактическому исходному коду (контроллеры, middleware, репозитории, модели).

---

## 🗺️ Эндпоинты

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| `POST` | `/configs/load` | 🔐 Admin | Загрузить конфиг по имени |
| `GET` | `/configs/site` | 🔓 Публичный | Загрузить конфиг главной страницы |
| `POST` | `/configs/default` | 🔐 Admin | Загрузить дефолтный конфиг |
| `POST` | `/configs/save` | 🔐 Admin | Сохранить конфиг |
| `GET` | `/users/me` | 👤 Member | Данные текущего пользователя |
| `GET` | `/users/me/role` | 👤 Member | Роль текущего пользователя |
| `GET` | `/users/me/username` | 👤 Member | Юзернейм текущего пользователя |
| `GET` | `/users/me/id` | 👤 Member | ID текущего пользователя |
| `POST` | `/users/login` | 🔓 Публичный | Авторизация пользователя |
| `POST` | `/users/change_password` | 👤 Member | Смена пароля |
| `POST` | `/users/logout` | 👤 Member | Выход из аккаунта |
| `POST` | `/images/create` | 🔐 Admin | Загрузить изображение |
| `POST` | `/images/delete` | 🔐 Admin | Удалить изображение |

> ⚠️ В оригинальной документации `/configs/load` и `/configs/default` были указаны как `GET`. По факту в коде оба зарегистрированы как `POST` (атрибут `[ControllerHandler("/load", HttpMethodType.POST, ...)]` и `[ControllerHandler("/default", HttpMethodType.POST, ...)]`), несмотря на то, что хендлеры лежат в `#region GET` и названы `GetConfigsLoadHandler` / `GetConfigsDefaultHandler`.

---

## 🔐 Аутентификация и роли

Используется **JWT Bearer Token**.

1. Клиент отправляет `POST /users/login` — в ответ получает `token`.
2. Токен передаётся в заголовке `Authorization: Bearer <token>` для защищённых эндпоинтов.
3. `UserSessionMiddleware` (через наследников `AdminSessionMiddleware` / `MemberSessionMiddleware`) при каждом запросе:
   - извлекает Bearer-токен из заголовка `Authorization`;
   - ищет сессию по токену в таблице `session`;
   - сверяет `user_id` сессии с `id` из claim `ClaimTypes.NameIdentifier` в JWT;
   - проверяет роль пользователя (`Role >= требуемой`);
   - помещает `UserDatabaseModel` и `SessionDatabaseModel` в `FeatureCollection` запроса.

**Срок жизни JWT:** 7 дней.
**Срок жизни сессии в БД:** 10 дней с момента создания (`expired_at = created_at + 10 дней`).

> ⚠️ Поле `expired_at` в middleware **не проверяется** — проверяется только наличие записи сессии по токену. Метод `IsExpired()` на модели существует, но никогда не вызывается.

### Роли

| Роль | Значение enum | Сериализация |
|------|---------------|--------------|
| `Member` | `0` | `"member"` |
| `Admin` | `1` | `"admin"` |

Роль `admin` включает в себя все права `member` (проверка `Role >= требуемой`).

### Общие ошибки авторизации

Возвращаются `AdminSessionMiddleware` / `MemberSessionMiddleware` для любого защищённого эндпоинта **до** выполнения хендлера:

| Сообщение | Причина |
|-----------|---------|
| `User undefined.` | Запрос не аутентифицирован / отсутствует Bearer-токен |
| `Session undefined.` | По токену не найдена запись в таблице `session` |
| `Bad token [id] undefined.` | `id` из claim JWT не совпадает с `user_id` сессии, либо не парсится |
| `Authorization bad, role is lower` | Роль пользователя ниже требуемой для эндпоинта |

---

## ⚙️ Configs Controller

### `POST /configs/load`

Загружает конфиг по имени.

**Доступ:** 🔐 Admin (Bearer JWT)
**Middleware:** `ModifyLoggerMiddleware`, `AdminSessionMiddleware`

**Request body (`ConfigLoadModel`):**

| Поле | Тип | Правила |
|------|-----|---------|
| `name` | `string` | Обязательно, длина 1–32 символа |

```json
{ "name": "site" }
```

**Проверка:** имя не должно содержать слова `admin`, `moderator`, `default` (регистронезависимо).

**Response (`ConfigsDatabaseModel`):**

```json
{
  "id": 1,
  "name": "site",
  "json": "{...}"
}
```

**Ошибки:**

| Причина | Описание |
|---------|----------|
| общие ошибки авторизации | см. раздел выше |
| `400` | Поля не прошли валидацию |
| `!200` `Your query contains prohibited words.` | Имя содержит запрещённые слова |
| `!200` `Error load config from storage.` | Конфиг с таким именем не найден |

---

### `GET /configs/site`

Загружает конфиг структуры сайта (запись с именем `site`). Параметры не принимает.

**Доступ:** 🔓 Публичный
**Middleware:** `ModifyLoggerMiddleware`

**Response (`ConfigsDatabaseModel`):**

```json
{
  "id": 1,
  "name": "site",
  "json": "{...}"
}
```

**Ошибки:**

| Причина | Описание |
|---------|----------|
| `!200` `Error load config from storage.` | Конфиг `site` не найден в БД |

---

### `POST /configs/default`

Загружает дефолтный конфиг (`default_{name}`).

**Доступ:** 🔐 Admin (Bearer JWT)
**Middleware:** `ModifyLoggerMiddleware`, `AdminSessionMiddleware`

**Request body (`ConfigLoadModel`):**

| Поле | Тип | Правила |
|------|-----|---------|
| `name` | `string` | Обязательно, длина 1–32 символа |

```json
{ "name": "site" }
```

> При `name=site` вернёт запись `default_site` из БД. Проверка на запрещённые слова **не выполняется** для этого эндпоинта.

**Response (`ConfigsDatabaseModel`):**

```json
{
  "id": 2,
  "name": "default_site",
  "json": "{...}"
}
```

**Ошибки:**

| Причина | Описание |
|---------|----------|
| общие ошибки авторизации | см. раздел выше |
| `400` | Поля не прошли валидацию |
| `!200` `Error load config from storage.` | Дефолтный конфиг не найден |

---

### `POST /configs/save`

Перезаписывает поле `json` конфига по имени.

**Доступ:** 🔐 Admin (Bearer JWT)
**Middleware:** `ModifyLoggerMiddleware`, `AdminSessionMiddleware`

**Request body (`ConfigSaveModel`):**

| Поле | Тип | Правила |
|------|-----|---------|
| `name` | `string` | Обязательно, длина 1–32 символа |
| `json` | `string` | Обязательно, должен быть валидным JSON |

```json
{
  "name": "site",
  "json": "{\"key\": \"value\"}"
}
```

**Проверка:** имя не должно содержать слова `admin`, `moderator`, `default`.

**Response:**

```
Status: 200 OK
Body: ""
```

**Ошибки:**

| Причина | Описание |
|---------|----------|
| общие ошибки авторизации | см. раздел выше |
| `400` | Поля не прошли валидацию |
| `!200` `Your query contains prohibited words.` | Имя содержит запрещённые слова |
| `!200` `Change config is wrong.` | Ошибка обновления записи в БД (например, конфиг с таким `name` не существует) |

---

## 👤 Users Controller

### `GET /users/me`

**Доступ:** 👤 Member (Bearer JWT)

**Response:**

```json
{
  "username": "anatoly",
  "role": "member",
  "id": 1
}
```

> Пароль в ответ не включается.

---

### `GET /users/me/role`

**Доступ:** 👤 Member (Bearer JWT)

**Response:**

```json
{ "role": "member" }
```

---

### `GET /users/me/username`

**Доступ:** 👤 Member (Bearer JWT)

**Response:**

```json
{ "username": "anatoly" }
```

---

### `GET /users/me/id`

**Доступ:** 👤 Member (Bearer JWT)

**Response:**

```json
{ "id": 1 }
```

---

### `POST /users/login`

Авторизует пользователя, создаёт или обновляет сессию, возвращает JWT-токен.

**Доступ:** 🔓 Публичный

**Request body (`LoginModel`):**

| Поле | Тип | Правила |
|------|-----|---------|
| `username` | `string` | Обязательно, длина 1–128 символов |
| `password` | `string` | Обязательно, длина 1–128 символов |

```json
{
  "username": "anatoly",
  "password": "secret"
}
```

> Пароль передаётся в открытом виде — сравнение с хэшем (SHA-256) происходит на сервере.

**Логика сессии:**
- если у пользователя уже есть запись в `session` — токен обновляется (`Regenerate`);
- иначе создаётся новая запись (`Create`), `expired_at = now + 10 дней`.

**Response:**

```json
{ "token": "<jwt-токен>" }
```

**Ошибки:**

| Причина | Описание |
|---------|----------|
| `400` | Поля не прошли валидацию |
| `!200` `Username or password wrong.` | Неверный логин или пароль |

---

### `POST /users/change_password`

Меняет пароль авторизованного пользователя.

**Доступ:** 👤 Member (Bearer JWT)

**Request body (`ChangePasswordModel`):**

| Поле | Тип | Правила |
|------|-----|---------|
| `current_password` | `string` | Обязательно, длина 1–128 символов |
| `new_password` | `string` | Обязательно, длина 1–128 символов |
| `repeat_password` | `string` | Обязательно, длина 1–128 символов |

```json
{
  "current_password": "old_secret",
  "new_password": "new_secret",
  "repeat_password": "new_secret"
}
```

**Response:**

```
Status: 200 OK
Body: ""
```

**Ошибки:**

| Причина | Описание |
|---------|----------|
| `400` | Поля не прошли валидацию |
| `!200` `Current password is wrong.` | `current_password` не совпадает с хэшем в БД |
| `!200` `New password not equal with repeat password.` | См. примечание ниже |
| `!200` `Wrong change password.` | Ошибка обновления пароля в БД |

> ⚠️ **Несоответствие в коде:** ошибка `New password not equal with repeat password.` фактически возвращается, когда `repeat_password == new_password` (условие `if (changePasswordModel.RepeatPassword == changePasswordModel.NewPassword)`). То есть при совпадающих `new_password`/`repeat_password` (ожидаемо корректный случай) эндпоинт возвращает ошибку, а при различающихся значениях проверка проходит и пароль обновляется. Похоже на инвертированное условие (вероятно, ожидалось `!=`).

---

### `POST /users/logout`

Завершает сессию текущего пользователя (удаляет запись из таблицы `session` по `user_id`).

**Доступ:** 👤 Member (Bearer JWT)

**Request body:** не требуется

**Response:**

```
Status: 200 OK
Body: "success"  (или "" при сбое удаления записи в БД)
```

---

## 🖼️ Images Controller

### `POST /images/create`

Загружает изображение на сервер, сохраняет файл в `public/` и создаёт запись в БД.

**Доступ:** 🔐 Admin (Bearer JWT)

**Request body (`ImageLoadModel`):**

| Поле | Тип | Правила |
|------|-----|---------|
| `name` | `string` | Обязательно, длина 1–32 символа |
| `image` | `byte[]` | Обязательно, должен быть валидным изображением (проверка через ImageSharp, `Image.Identify`) |

```json
{
  "name": "avatar.png",
  "image": "<байты изображения>"
}
```

**Response:**

```
Status: 200 OK
Body: ""
```

**Ошибки:**

| Причина | Описание |
|---------|----------|
| общие ошибки авторизации | см. раздел выше |
| `400` | Поле `image` не является валидным изображением (валидатор `img`, сообщение `This field not image`) |
| `!200` `Image creating wrong.` | Ошибка записи файла на диск или вставки записи в БД |

---

### `POST /images/delete`

Удаляет изображение с диска и (предположительно) из БД.

**Доступ:** 🔐 Admin (Bearer JWT)

**Request body (`ImageDeleteModel`):**

| Поле | Тип | Правила |
|------|-----|---------|
| `name` | `string` | Обязательно, длина 1–32 символа |

```json
{ "name": "avatar.png" }
```

**Response:**

```
Status: 200 OK
Body: ""
```

**Ошибки:**

| Причина | Описание |
|---------|----------|
| общие ошибки авторизации | см. раздел выше |
| `!200` `Image deleting wrong.` | См. примечание ниже |

> ⚠️ **Известная проблема в коде:** SQL-запрос на удаление в `ImageRepository.Delete` сформирован без пробела — `$"DELETE FROM {TableName}WHERE name=@Name RETURNING id"` (получается `...imagesWHERE name=...`). Это приводит к синтаксической ошибке SQL, которая перехватывается `catch` и трактуется как неудача. В результате `/images/delete` **всегда** отвечает `Image deleting wrong.`, при этом файл на диске (`file.DeleteMe()`) физически удаляется до выполнения SQL-запроса, а запись в таблице `images` остаётся.

---

## 📦 Модели данных

### `ConfigsDatabaseModel`

| Поле | Тип |
|------|-----|
| `id` | `int` |
| `name` | `string` |
| `json` | `string` |

### `UserDatabaseModel` (поля, отдаваемые в API)

| Поле | Тип |
|------|-----|
| `id` | `int` |
| `username` | `string` |
| `role` | `"member"` \| `"admin"` |

> Поле `password` (SHA-256 хэш) никогда не включается в ответы API.

### `SessionDatabaseModel`

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | `int` | PK |
| `user_id` | `int` | Владелец сессии |
| `token` | `string` | JWT-токен |
| `created_at` | `DateTimeOffset` | Создание |
| `updated_at` | `DateTimeOffset` | Обновление |
| `expired_at` | `DateTimeOffset` | `created_at + 10 дней`, не проверяется middleware |

---

## ✅ Правила валидации (`ValidRule`)

| Правило | Описание |
|---------|----------|
| `need~` | Поле обязательно |
| `string_range~min max` | Длина строки должна быть в диапазоне `[min, max]` |
| `json~` | Значение должно быть валидной JSON-строкой |
| `img~` | Байты должны представлять собой валидное изображение (`ImageSharp.Image.Identify`) |

---

## 📋 Логирование запросов

`ModifyLoggerMiddleware` на каждый запрос пишет `LogInformation`:

```
REQUEST:
    Token: <Bearer-токен из заголовка Authorization, либо "Token undefined.">
    Path:  <путь запроса>
    IpV4:  <IP-адрес клиента>
```

> ⚠️ В оригинальной документации указывалось, что логируется значение **cookie `Token`**. По факту логируется **Bearer-токен из заголовка `Authorization`** (`request.GetBearerToken().Content`), а не cookie.

При ошибках авторизации в `UserSessionMiddleware` дополнительно пишется `LogInformation`/`LogError` с `id` пользователя и его ролью.
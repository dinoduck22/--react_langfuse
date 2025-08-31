# Settings
Writer [junha2020](https://github.com/junha2020)

## General Page

| API Name            | 프로젝트 불러오기                                              |
| ------------------- | ------------------------------------------------------ |
| **Authentication**  | public Key\:secret Key                                 |
| **Endpoint**        | `/api/public/projects`                                 |
| **Docs**            | -                                                      |
| **Method**          | GET                                                    |
| **Notes**           | `.env` 파일에 저장된 API Key를 사용하여 프로젝트 `id`, `name`을 불러옵니다. |
| **Parameters**      | -                                                      |
| **Project**         | Langfuse                                               |
| **Response Format** | JSON                                                   |
| **Status**          | Active                                                 |
| **Tags**            | Internal                                               |

## API Key

**Organization Key 문제로 인해 개발 중단되었습니다. (디자인은 등록되어있음)**

## LLMConnections

| API Name            | LLMConnection 생성 및 수정                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| **Authentication**  | -                                                                                                  |
| **Endpoint**        | `/api/public/llm-connections`                                                                      |
| **Docs**            | -                                                                                                  |
| **Method**          | PUT                                                                                                |
| **Notes**           | `provider`, `adapter`, `secretKey`는 null 값이 들어오면 안 됩니다.                                            |
| **Parameters**      | `provider`, `adapter`, `secretKey`, `baseURL`, `customModels`, `withDefaultModels`, `extraHeaders` |
| **Project**         | Langfuse                                                                                           |
| **Response Format** | JSON                                                                                               |
| **Status**          | Active                                                                                             |
| **Tags**            | Internal                                                                                           |


| API Name            | LLMConnection 불러오기                                 |
| ------------------- | -------------------------------------------------- |
| **Authentication**  | -                                                  |
| **Endpoint**        | `/api/public/llm-connections?page=null&limit=null` |
| **Docs**            | -                                                  |
| **Method**          | GET                                                |
| **Notes**           | Langfuse 서버에서 만들어진 LLMConnection 리스트를 불러옵니다.       |
| **Parameters**      | `page`, `limit`                                    |
| **Project**         | Langfuse                                           |
| **Response Format** | JSON                                               |
| **Status**          | Active                                             |
| **Tags**            | Internal                                           |



## Models

| API Name            | Model 전체 조회                               |
| ------------------- | ----------------------------------------- |
| **Authentication**  | Webhook Secret                            |
| **Endpoint**        | `/api/public/models?page=null&limit=null` |
| **Docs**            | -                                         |
| **Method**          | GET                                       |
| **Notes**           | 저장된 전체 Model을 불러옵니다.                      |
| **Parameters**      | `page`, `number`                          |
| **Project**         | Langfuse                                  |
| **Response Format** | JSON                                      |
| **Status**          | Active                                    |
| **Tags**            | -                                         |


| API Name            | Model 하나 조회               |
| ------------------- | ------------------------- |
| **Authentication**  | -                         |
| **Endpoint**        | `/api/public/models/{id}` |
| **Docs**            | -                         |
| **Method**          | GET                       |
| **Notes**           | Model 선택 시 상세 정보를 표시합니다.  |
| **Parameters**      | `id`                      |
| **Project**         | Langfuse                  |
| **Response Format** | JSON                      |
| **Status**          | Active                    |
| **Tags**            | -                         |


| API Name            | Model 만들기                                                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Authentication**  | -                                                                                                                             |
| **Endpoint**        | `/api/public/models`                                                                                                          |
| **Docs**            | -                                                                                                                             |
| **Method**          | POST                                                                                                                          |
| **Notes**           | 신규 Model을 작성합니다. <br> `modelName`과 `matchPattern`은 null 값이 올 수 없습니다.                                                          |
| **Parameters**      | `modelName`, `matchPattern`, `startDate`, `unit`, `inputPrice`, `outputPrice`, `totalPrice`, `tokenizerId`, `tokenizerConfig` |
| **Project**         | -                                                                                                                             |
| **Response Format** | -                                                                                                                             |
| **Status**          | Active                                                                                                                        |
| **Tags**            | -                                                                                                                             |


| API Name            | Model 하나 지우기              |
| ------------------- | ------------------------- |
| **Authentication**  | -                         |
| **Endpoint**        | `/api/public/models/{id}` |
| **Docs**            | -                         |
| **Method**          | DELETE                    |
| **Notes**           | 선택한 Model의 저장된 내용을 삭제합니다. |
| **Parameters**      | `id`                      |
| **Project**         | Langfuse                  |
| **Response Format** | -                         |
| **Status**          | Active                    |
| **Tags**            | -                         |


## Score

| API Name            | ScoreConfig 불러오기            |
| ------------------- | --------------------------- |
| **Authentication**  | -                           |
| **Endpoint**        | `/api/public/score-configs` |
| **Docs**            | -                           |
| **Method**          | GET                         |
| **Notes**           | ScoreConfig를 불러옵니다.         |
| **Parameters**      | `page`, `limit`             |
| **Project**         | Langfuse                    |
| **Response Format** | JSON                        |
| **Status**          | Active                      |
| **Tags**            | Internal, Payments          |


| API Name            | ScoreConfig 작성              |
| ------------------- | --------------------------- |
| **Authentication**  | -                           |
| **Endpoint**        | `/api/public/score-configs` |
| **Docs**            | -                           |
| **Method**          | POST                        |
| **Notes**           | ScoreConfig를 작성합니다.         |
| **Parameters**      | -                           |
| **Project**         | Langfuse                    |
| **Response Format** | JSON                        |
| **Status**          | Active                      |
| **Tags**            | -                           |


## Member

**Organization Key 문제로 인해 개발 중단되었습니다. (디자인은 및 더미데이터 등록되어있음)**

## Login

| API Name            | 로그인                              |
| ------------------- | -------------------------------- |
| **Authentication**  | csrf                             |
| **Endpoint**        | `/api/auth/callback/credentials` |
| **Docs**            | -                                |
| **Method**          | POST                             |
| **Notes**           | Login 합니다. (langfuse, local 동시)  |
| **Parameters**      | `email`, `password`, `csrfToken` |
| **Project**         | Langfuse                         |
| **Response Format** | JSON                             |
| **Status**          | Active                           |
| **Tags**            | Internal, Payments               |


## Logout (in Layout.jsx)

| API Name            | Logout                           |
| ------------------- | -------------------------------- |
| **Authentication**  | csrf                             |
| **Endpoint**        | `/api/auth/signout`              |
| **Docs**            | -                                |
| **Method**          | POST                             |
| **Notes**           | Logout 합니다. (langfuse, local 동시) |
| **Parameters**      | `csrfToken`                      |
| **Project**         | Langfuse                         |
| **Response Format** | JSON                             |
| **Status**          | Active                           |
| **Tags**            | -                                |

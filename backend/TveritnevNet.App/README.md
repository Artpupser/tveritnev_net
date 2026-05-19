# Backend

```angular2html
GET -> /configuration/panel
GET -> /configuration/settings
POST -> /configuration/save
POST ->  /moderator/login
```

Configuration controller

```
GET -> /configuration/panel
Response: Json Object panel configuration model \
Type: {} 
```


```
`GET -> /configuration/settings` \
Response: Json Object settings configuration model \
Type: {2fa: false}
```

```
`POST -> /configuration/save`

Request: ConfigurationModel 
ConfigurationModel type: {
    panel: json_string
    settings: json_string
}
Response: 200 | !200

```

Moderator controller

```
`POST -> /moderator/login`

Request: LoginModel
LoginModel type: {
    username: string
    password: string
}
Response: 200 | !200

```


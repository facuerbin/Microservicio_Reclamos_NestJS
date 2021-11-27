# Microservicio de Reclamos

## Description

Proyecto realizado para la cátedra 'Arquitectura de Microservicios' UTN-FRN, consiste en un microservicio de reclamos que trabaja en conjunto con el resto de microservicios brindados por la cátedra del sistema de ecomerce. El sistema fue desarrollado utilizando el framework NestJS, Mongoose, Redis, RabbitMQ y axios. Además se utilizó como lenguaje de programación Typescript.

## Instalación

```bash
$ npm install
```

## Dependencias

Para su correcto funcionamiento, el proyecto requiere que se encuentre ejecutando en el sistema un servidor de MongoDB, Redis y RabbitMQ. Además este microservicio fue diseñado para formar parte del [sistema de ecomerce](https://github.com/nmarsollier/ecommerce) (leer ReadeMe para poner en funcionamiento) por lo que se recomienda que se ponga en funcionamiento en conjunto con estos servicios. Especialmente se requiere que estén funcionando los servicios de Ordenes y Auth. En cuanto al servicio de Ordenes, se realizó una modificación al mismo para que emita un topic cuando se cancele una orden, esto permite al servicio de Reclamos cerrar un reclamo que esté vinculado a una orden cancelada. La versión modificada de este servicio se encuentra [aquí](https://github.com/facuerbin/Microservicio_Ordenes_Java).
Se recomienda utilizar las imagenes docker que se brindan desde el sistema de ecomerce para no tener que instalar cada herramienta, y frenar la imagén prod-orders-java para ejecutar el sistema de ordenes modificado.


## Para ejecutar la aplicación

Configurar variables de entorno desde el archivo /.env

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Utilizando la Api

Una vez puesto en funcionamiento el sistema, se podrá acceder a la documentación de la API desde http://localhost:3005 (o el puerto que haya configurado en .env). Allí mismo se podrán probar los distintos endpoints. Se requerirá autenticación, por lo que primero se debe crear un usuario en el sistema de ecomerce (http://localhost:4200), ingresar a la base de datos (se recomiendo el uso de MongoDB Compass) y modificar los permisos de usuario añadiendo el permiso "admin". Además será útil contar con otro usuario que solo tenga permisos de "user" de modo que se puedan probar todos los endpoints del sistema.

## Licencia

El proyecto está licenciado bajo la licencia MIT [MIT licensed](LICENSE).

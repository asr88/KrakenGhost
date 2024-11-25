# KrakenGhost

Pruebas realizadas sobre ghost con kraken-

## En este repositorio están los 15 escenarios y pruebas creadas con la herramienta kraken para la aplicación bajo pruebas ghost

# Requisitos:

- Node
- Ghost version 5.96 y ghost version 4.5.0
- Tener un usuario registrado en el aplicativo ghost

# Pasos para correr los escenarios de pruebas:

- Debe tener las dos versiones de ghost que se van a utilizar ya instaladas y de ser posible dockerizadas.
- Clonar el repositorio en su equipo local, git clone https://github.com/asr88/KrakenGhost.git
- Ejecutar **npm install kraken-node -g**, esto instalara dos librerias necesarias para correr los escenarios con kraken.
- Ejecutar **npm install kraken-node**
- Ejecutar **npm install -g appium**
- Revisar la version de cucumber que utiliza kraken
  y ejecutar **npm install -g @cucumber/cucumber@7.2.1** y **npm install @cucumber/cucumber@7.2.1**
- Moficar las variables del archivo **properties.json** de acuerdo a su entorno y preferencia, pero como requitos: **USERNAME1**, **PASSWORD1**.
- Para ejecutar cada escenario, se debe llevar uno a uno de la carpeta **/all_features** a la carpeta **/features** y regresarlo a medida que lo haya ejecutado.
- Ejecutar el comando **npx kraken-node run**, esto ejecutar el escenario correspondiente.
- Para cambiar la versión de ghost se debe modificar el archivo properties.json a la URL donde se encuentra la versión de ghost que se desea probar. Es importante que modificar los hooks usados para generar los screenshots de acuerdo a la versión de ghost que se este utilizando, para más adelante poder ejecutar el reporte de comparación de imagenes con mayor facilidad.
- Para facilidad en la ejecución de los escenarios de kraken se crearon dos scripts de powershell que se encuentran en el root del proyecto y se llaman run_features_4_5.ps1 y run_features_5_96.ps1, estos scripts ejecutan todos los escenarios de kraken para las versiones 4.5.0 y 5.96.0 de ghost respectivamente.

# Pasos para ejecutar el reporte de comparación de imagenes:

- Crear una carpeta con el nombre **screenshots** en la carpeta creada igualmente en el proyecto llamada **Resemble**
- Ejecutar el comando **npm install resemblejs**
- En el directorio **Resemble** se debe crear un archivo index.js y un archivo config.json con la configuración necesaria para ejecutar el reporte de comparación de imagenes.
- Es importante definir bien las rutas de las imagenes según se va a comparar.
- En nuestro caso fue necesario usar la dependencia sharp para poder comparar las imagenes, por lo que se debe instalarla con el comando **npm install sharp**
- Por último se debe ejecutar el comando **npm test**

# Pasos para usar faker en el proyecto kraken:

-Primero se debe instalar Faker en el proyecto ejecutando el comando **npm install @faker-js/faker**
-En el archivo llamado DataGenerator.ts ubicado en la carpeta **helpers** se encuentra la implementación de faker para generar datos aleatorios.

# Las 10 funcionalidades de GHOST que se trabajan en esta semana 5 son:

- prueba1 (Crear page)
- prueba2 (Crear page sin datos)
- prueba3 (Crear post)
- prueba4 (Crear post sin datos)
- prueba5 (Crear miembro)
- prueba6 (Crear miembro sin datos)
- prueba7 (Crear tag)
- prueba8 (Crear tag sin datos)
- prueba9 (Editar el titulo y la descripcion del sitio)
- prueba10 (Verificar Edición de titulo y descripcion)
- prueba11 (Editar el idioma del sitio)
- prueba12 (Verificar Edición de idioma)
- prueba13 (Verificar Edición de nombre perfil)
- prueba14 (Editar la información de un post)
- prueba15 (Verificar Edición de información de un post)

# En la semana 6 se trabajó la mejora en las pruuebas realizadas de la semana 5 de kraken y se implementaron pruebas en Cypress y se lograron correr dos de las mismas pruebas con la versión de ghost 4.5.0, las pruebas que se lograron ejecutar son:

- En el repositorio https://github.com/jdanielkc/PruebasCypress se encuentran las pruebas realizadas en Cypress.
- prueba 0 (Hacer login)
- prueba1 (Crear page)

# Entrega semana 7

- Se crean escenarios para pruebas realizadas usando faker y usando data a-priori.
- Para usar la data a-priori se creo en "features" la carpeta "data" con el archivo test_data.json.
- Para usar faker se usaron dos métodos, el primero con un archivo llamado data-generator.js ubicado en la carpeta."helpers" ubicado en "features", el segundo método usado en algunos steps se coloco directamente faker accediendo al tipo de dato que se necesitara (Ej. faker.lorem.sentence(300)).
- Las features a probar se encuentran en la carpeta "5_96" de la carpeta "all_features"; cada feature a probar debe cambiarse a la carpeta "feature" y colocar el comando según sea el caso usando el tag (npx cucumber-js --tags "remplazarElTagAqui")

A continuación se detallan los casos desarrollados:

- A-priori:

  1. prueba1.feature
     Con mi usuario y contraseña de ghost quiero crear un sitio con el titulo vacío
     tag: @empty-data

  2. prueba3.feature
     Con mi usuario de ghost quiero crear un post sin datos
     tag: @empty-data

  3. prueba5.feature
     Con mi usuario de ghost quiero crear un nuevo miembro sin datos a priori
     tag: @empty_data

  4. prueba5.feature
     Con mi usuario de ghost quiero crear un nuevo miembro con email sin arroba a priori
     tag: @email_whitout_arroba

  5. prueba5.feature
     Con mi usuario de ghost quiero crear un nuevo miembro con el email sin punto com a priori
     tag: @email_whitout_dotcom

- Faker:

  1. prueba0.feature
     Login fallido con credenciales aleatorias
     tag: @faker

  2. prueba1.feature
     Con mi usuario y contraseña de ghost quiero crear un sitio exitosamente con datos aleatorios
     tag: @success

  3. prueba1.feature
     Con mi usuario y contraseña de ghost quiero crear un sitio con un titulo muy largo
     tag: @over_max_title

  4. prueba3.feature
     Con mi usuario de ghost quiero crear un post con datos aleatorios
     tag: @success

  5. prueba3.feature
     Con mi usuario de ghost quiero crear un post con datos aleatorios que superen lo permitido
     tag: @over_max_title

  6. prueba5.feature
     Con mi usuario de ghost quiero crear un nuevo miembro con datos aleatorios
     tag: @success

  7. prueba5.feature
     Con mi usuario de ghost quiero crear un nuevo miembro con datos aleatorios y que la nota supere lo permitido
     tag: @over_max_note

  8. prueba7.feature
     Crear tag exitosamene con datos aleatorios
     tag: @success

  9. prueba7.feature
     Crear tag error por mas de 191 caracteres en el nombre
     tag: @over_max_name

  10. prueba7.feature
      Crear tag error con descripción de mas de 500 caracteres
      tag: @over_max_description

  11. prueba9.feature
      Editar el titulo y la descripcion del sitio exitosamente con datos aleatorios
      tag: @success

```

```

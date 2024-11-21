# KrakenGhost

Pruebas realizadas sobre ghost con kraken-

## En este repositorio están los 15 escenarios y pruebas creadas con la herramienta kraken para la aplicación bajo pruebas ghost

# Requisitos:

- Node
- Ghost latest version y ghost version 4.5.0
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

```

```

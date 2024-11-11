# KrakenGhost

Pruebas realizadas sobre ghost con kraken-

## En este repositorio están los 15 escenarios y pruebas creadas con la herramienta kraken para la aplicación bajo pruebas ghost

# Requisitos:

- Node
- Ghost
- Tener un usuario registrado en el aplicativo ghost

# Pasos para correr los escenarios de pruebas:

- Clonar el repositorio en su equipo local, git clone https://github.com/asr88/KrakenGhost.git
- Ejecutar **npm install kraken-node -g**, esto instalara dos librerias necesarias para correr los escenarios con kraken.
- Ejecutar **npm install kraken-node**
- Ejecutar **npm install -g appium**
- Revisar la version de cucumber que utiliza kraken
  y ejecutar **npm install -g @cucumber/cucumber@7.2.1** y **npm install @cucumber/cucumber@7.2.1**
- Moficar las variables del archivo **properties.json** de acuerdo a su entorno y preferencia, pero como requitos: **USERNAME1**, **PASSWORD1**.
- Para ejecutar cada escenario, se debe llevar uno a uno de la carpeta **/all_features** a la carpeta **/features** y regresarlo a medida que lo haya ejecutado.
- Ejecutar el comando **npx kraken-node run**, esto ejecutar el escenario correspondiente.

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

```

```

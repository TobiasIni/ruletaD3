# Docker - Instrucciones de Uso

## Construcción y Ejecución

### Opción 1: Usando Docker directamente

```bash
# Construir la imagen
docker build -t ruleta-d3 .

# Ejecutar el contenedor
docker run -p 3000:3000 ruleta-d3
```

### Opción 2: Usando Docker Compose (Recomendado)

```bash
# Construir y ejecutar
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d --build

# Detener los servicios
docker-compose down
```

## Acceso a la Aplicación

Una vez que el contenedor esté ejecutándose, puedes acceder a la aplicación en:
- http://localhost:3000

## Comandos Útiles

```bash
# Ver logs del contenedor
docker-compose logs -f

# Entrar al contenedor
docker exec -it ruleta-d3 sh

# Reconstruir sin caché
docker-compose build --no-cache

# Limpiar imágenes no utilizadas
docker system prune -a
```

## Solución de Problemas

### Error: "The system cannot find the file specified"
**Causa**: Docker Desktop no está ejecutándose
**Solución**: 
1. Abre Docker Desktop desde el menú de Windows
2. Espera a que aparezca el ícono de Docker en la bandeja del sistema
3. Verifica que esté ejecutándose con: `docker ps`

### Error: "unable to get image"
**Causa**: La imagen no existe o Docker no está funcionando
**Solución**:
1. Asegúrate de que Docker Desktop esté ejecutándose
2. Reconstruye la imagen: `docker-compose build --no-cache`

### Error: "version is obsolete"
**Causa**: El atributo `version` ya no es necesario en docker-compose
**Solución**: Ya corregido en el archivo docker-compose.yml

## Características del Dockerfile

- **Multi-stage build**: Optimiza el tamaño de la imagen final
- **Usuario no-root**: Ejecuta la aplicación con seguridad
- **Modo standalone**: Incluye solo los archivos necesarios para producción
- **Alpine Linux**: Imagen base ligera y segura

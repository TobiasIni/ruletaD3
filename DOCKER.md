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

## Características del Dockerfile

- **Multi-stage build**: Optimiza el tamaño de la imagen final
- **Usuario no-root**: Ejecuta la aplicación con seguridad
- **Modo standalone**: Incluye solo los archivos necesarios para producción
- **Alpine Linux**: Imagen base ligera y segura

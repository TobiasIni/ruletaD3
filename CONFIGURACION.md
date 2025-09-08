# Configuración de Variables de Entorno

## Archivo .env.local

Para configurar la aplicación correctamente, necesitas crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de la Ruleta
RULETA_ID=5

# API Configuration (opcional)
NEXT_PUBLIC_API_BASE_URL=https://api-cmsd3.emanzano.com
```

## Variables Disponibles

### RULETA_ID
- **Descripción**: ID de la ruleta que se usará para todas las llamadas a la API
- **Valor por defecto**: 5
- **Ejemplo**: `RULETA_ID=5`

### NEXT_PUBLIC_API_BASE_URL
- **Descripción**: URL base de la API (opcional, tiene valor por defecto)
- **Valor por defecto**: https://api-cmsd3.emanzano.com
- **Ejemplo**: `NEXT_PUBLIC_API_BASE_URL=https://api-cmsd3.emanzano.com`

## Instrucciones de Configuración

1. Crea el archivo `.env.local` en la raíz del proyecto (al mismo nivel que `package.json`)
2. Añade las variables necesarias según el ejemplo de arriba
3. Reinicia el servidor de desarrollo si está corriendo:
   ```bash
   npm run dev
   ```

## Ejemplo de uso

Con la configuración de `RULETA_ID=5`, todas las llamadas a la API usarán automáticamente la ruleta con ID 5:

- `/ruletas/5/config` - Para obtener la configuración
- `/ruletas/5/spin` - Para girar la ruleta

## Notas Importantes

- El archivo `.env.local` no debe incluirse en el control de versiones (Git)
- Si cambias el `RULETA_ID`, debes reiniciar el servidor de desarrollo
- Las variables que empiezan con `NEXT_PUBLIC_` están disponibles en el cliente (browser)
- Las variables sin `NEXT_PUBLIC_` solo están disponibles en el servidor

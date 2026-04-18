# Documento 6 — Crear los servicios AWS paso a paso

Sigue este documento en orden. Cada servicio depende del anterior.

**Región recomendada:** `us-east-1 (N. Virginia)` — la más barata y con más servicios disponibles.
**Tiempo estimado total:** 45-60 minutos la primera vez.

---

## Orden de creación

```
1. IAM  →  2. Key Pair  →  3. Security Groups  →  4. S3
     →  5. Cognito  →  6. RDS  →  7. EC2  →  8. SNS
```

---

## 1. IAM — Usuarios y permisos

IAM controla quién puede hacer qué en AWS.
Necesitas crear 2 usuarios:

- **github-actions** → para el workflow de start/stop
- **hr-app-backend** → para que el servidor acceda a S3, SNS, etc.

### 1.1 Crear el usuario para GitHub Actions

1. Ve a: **AWS Console → IAM → Users → Create user**
2. **User name:** `github-actions-hr-app`
3. Clic en **Next**
4. En "Set permissions" → **Attach policies directly**
5. Clic en **Create policy** (se abre una nueva pestaña)
   - Clic en **JSON**
   - Borra el contenido y pega esto:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "StartStopEC2",
      "Effect": "Allow",
      "Action": [
        "ec2:StartInstances",
        "ec2:StopInstances",
        "ec2:DescribeInstances",
        "ec2:DescribeInstanceStatus"
      ],
      "Resource": "*"
    },
    {
      "Sid": "StartStopRDS",
      "Effect": "Allow",
      "Action": ["rds:StartDBInstance", "rds:StopDBInstance", "rds:DescribeDBInstances"],
      "Resource": "*"
    }
  ]
}
```

- Clic en **Next**
- **Policy name:** `hr-app-github-actions-policy`
- Clic en **Create policy**

6. Regresar a la pestaña anterior → Buscar `hr-app-github-actions-policy` → Seleccionarla
7. Clic en **Next** → **Create user**

**Crear las credenciales del usuario:**

1. Clic en el usuario `github-actions-hr-app` recién creado
2. **Security credentials** → **Create access key**
3. Seleccionar **"Application running outside AWS"**
4. Clic en **Next** → **Create access key**
5. **GUARDAR** el `Access key ID` y `Secret access key` — solo se muestran una vez
   - Estos van en GitHub Secrets como `AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`

---

### 1.2 Crear el usuario para el backend (servidor EC2)

1. **IAM → Users → Create user**
2. **User name:** `hr-app-backend`
3. **Attach policies directly** → **Create policy** (nueva pestaña)
4. Pegar este JSON:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3Access",
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::hr-app-gallery-dev",
        "arn:aws:s3:::hr-app-gallery-dev/*",
        "arn:aws:s3:::hr-app-gallery-prod",
        "arn:aws:s3:::hr-app-gallery-prod/*"
      ]
    },
    {
      "Sid": "SNSPublish",
      "Effect": "Allow",
      "Action": ["sns:Publish", "sns:CreatePlatformEndpoint", "sns:GetEndpointAttributes"],
      "Resource": "*"
    },
    {
      "Sid": "CognitoAdmin",
      "Effect": "Allow",
      "Action": [
        "cognito-idp:AdminGetUser",
        "cognito-idp:AdminCreateUser",
        "cognito-idp:AdminDeleteUser",
        "cognito-idp:ListUsers"
      ],
      "Resource": "*"
    }
  ]
}
```

5. **Policy name:** `hr-app-backend-policy` → **Create policy**
6. Regresar → Buscar y seleccionar `hr-app-backend-policy`
7. **Create user**
8. Crear access key igual que el anterior (tipo "Application running outside AWS")
9. **Guardar** las credenciales — van en el archivo `.env` del servidor

---

## 2. Key Pair — Acceso SSH al servidor

Necesitas esto para conectarte al servidor EC2 por terminal.

1. **AWS Console → EC2 → Key Pairs** (menú izquierdo, sección Network & Security)
2. Clic en **Create key pair**
3. **Name:** `hr-app-dev-key`
4. **Key pair type:** RSA
5. **Private key file format:** `.pem` (macOS/Linux)
6. Clic en **Create key pair**
7. Se descarga automáticamente el archivo `hr-app-dev-key.pem`

**Guardar el archivo en un lugar seguro:**

```bash
# Moverlo a la carpeta .ssh y protegerlo
mv ~/Downloads/hr-app-dev-key.pem ~/.ssh/
chmod 400 ~/.ssh/hr-app-dev-key.pem
```

> **Importante:** Si pierdes este archivo, no podrás conectarte al servidor. No tiene recuperación.

---

## 3. Security Groups — Reglas de red

Los security groups son el firewall de AWS. Definimos cuáles puertos están abiertos.

### 3.1 Security Group para EC2 (servidor API)

1. **EC2 → Security Groups → Create security group**
2. **Security group name:** `hr-app-api-sg-dev`
3. **Description:** `Servidor de la API — dev`
4. **VPC:** dejar el default

**Inbound rules (tráfico entrante):**

| Tipo       | Protocolo | Puerto | Origen    | Descripción           |
| ---------- | --------- | ------ | --------- | --------------------- |
| HTTP       | TCP       | 80     | 0.0.0.0/0 | Tráfico web           |
| HTTPS      | TCP       | 443    | 0.0.0.0/0 | Tráfico web seguro    |
| Custom TCP | TCP       | 3000   | 0.0.0.0/0 | Puerto de Node.js/API |
| SSH        | TCP       | 22     | My IP     | Solo tu computadora   |

Para la regla SSH:

- En "Source" seleccionar **My IP** (AWS pone tu IP automáticamente)

**Outbound rules:** dejar el default (todo el tráfico saliente permitido)

5. Clic en **Create security group**
6. **Copiar el Security Group ID** (formato: `sg-0abc123...`)

---

### 3.2 Security Group para RDS (base de datos)

1. **EC2 → Security Groups → Create security group**
2. **Name:** `hr-app-rds-sg-dev`
3. **Description:** `Base de datos — solo acepta conexiones del API`

**Inbound rules:**

| Tipo       | Protocolo | Puerto | Origen                                                        |
| ---------- | --------- | ------ | ------------------------------------------------------------- |
| PostgreSQL | TCP       | 5432   | Custom → pegar el ID del security group de EC2 (`sg-0abc...`) |

> La base de datos **solo acepta conexiones del servidor EC2**, no del exterior.

4. Clic en **Create security group**

---

## 4. S3 — Almacenamiento de fotos

S3 guarda las imágenes de tatuajes, piercing, resina, etc.

### 4.1 Crear el bucket de desarrollo

1. **AWS Console → S3 → Create bucket**
2. **Bucket name:** `hr-app-gallery-dev`
   > Los nombres de S3 son únicos globalmente. Si está tomado, agregar un sufijo: `hr-app-gallery-dev-2024`
3. **AWS Region:** `us-east-1`
4. **Block Public Access:** dejar todas las opciones marcadas (más seguro — las imágenes se servirán con URLs firmadas)
5. **Bucket Versioning:** Disable (no es necesario para dev)
6. Clic en **Create bucket**

### 4.2 Configurar CORS para que la app pueda subir fotos

1. Clic en el bucket `hr-app-gallery-dev`
2. **Permissions** → **Cross-origin resource sharing (CORS)**
3. Clic en **Edit** y pegar:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

4. Clic en **Save changes**

### 4.3 Crear el bucket de producción (igual pero con nombre diferente)

Repetir los pasos anteriores con el nombre `hr-app-gallery-prod`

---

## 5. Cognito — Autenticación de usuarios

Cognito maneja el registro, login y tokens de los usuarios de la app.

### 5.1 Crear el User Pool

1. **AWS Console → Cognito → Create user pool**
2. **Step 1 — Configure sign-in experience:**
   - Provider types: **Cognito user pool**
   - Sign-in options: marcar **Email** y **Phone number**
   - Clic en **Next**

3. **Step 2 — Configure security requirements:**
   - Password policy: **Cognito defaults** (mínimo 8 caracteres)
   - MFA: **No MFA** (para simplificar en dev; activar en prod)
   - Clic en **Next**

4. **Step 3 — Configure sign-up experience:**
   - Self-registration: **Enable** (los usuarios pueden registrarse solos)
   - Atributos requeridos: marcar **name** y **email**
   - Clic en **Next**

5. **Step 4 — Configure message delivery:**
   - Email: **Send email with Cognito** (gratis hasta 50 emails/día)
   - Clic en **Next**

6. **Step 5 — Integrate your app:**
   - **User pool name:** `hr-app-users-dev`
   - **App client name:** `hr-app-mobile-client`
   - **Client secret:** **Don't generate** (las apps móviles no deben tener client secret)
   - En "Authentication flows" marcar:
     - ✅ ALLOW_USER_PASSWORD_AUTH
     - ✅ ALLOW_REFRESH_TOKEN_AUTH
   - Clic en **Next**

7. **Step 6 — Review and create:**
   - Revisar y clic en **Create user pool**

### 5.2 Copiar los IDs necesarios

Después de crear el User Pool:

1. En el User Pool → copiar el **User pool ID** (formato: `us-east-1_AbCdEfGhI`)
2. **App clients** → copiar el **Client ID** (formato: `1abc2def3ghi4jkl5mno6pqr7s`)

Estos van en `.env.development`:

```
AWS_USER_POOL_ID=us-east-1_AbCdEfGhI
AWS_USER_POOL_CLIENT_ID=1abc2def3ghi4jkl5mno6pqr7s
```

---

## 6. RDS — Base de datos PostgreSQL

### 6.1 Crear la instancia

1. **AWS Console → RDS → Create database**
2. **Creation method:** Standard create
3. **Engine:** PostgreSQL
4. **Engine Version:** PostgreSQL 16.x (la más reciente)
5. **Templates:** **Free tier** (importante para dev)

6. **Settings:**
   - **DB instance identifier:** `hr-app-db-dev`
   - **Master username:** `hrapp_admin`
   - **Credentials management:** Self managed
   - **Master password:** crear una contraseña segura y guardarla
   - **Confirm password:** repetir

7. **Instance configuration:**
   - **DB instance class:** `db.t3.micro` (free tier)

8. **Storage:**
   - **Storage type:** gp2
   - **Allocated storage:** 20 GB
   - **Enable storage autoscaling:** desmarcar (para evitar costos inesperados en dev)

9. **Connectivity:**
   - **Compute resource:** Don't connect to an EC2 compute resource (lo haremos manualmente)
   - **VPC:** Default VPC
   - **Public access:** **No** (solo accesible desde dentro de AWS)
   - **VPC security group:** Elegir **existing** → seleccionar `hr-app-rds-sg-dev`
   - **Availability Zone:** No preference

10. **Database authentication:**
    - **Password authentication**

11. **Additional configuration:**
    - **Initial database name:** `hrapp`
    - **Enable automated backups:** ✅ marcado
    - **Backup retention period:** 7 days
    - **Enable encryption:** ✅ marcado
    - **Enable Performance Insights:** desmarcar (costo extra)
    - **Enable Enhanced monitoring:** desmarcar (costo extra)
    - **Enable auto minor version upgrade:** ✅ marcado

12. Clic en **Create database**
    > Tarda 5-10 minutos en estar disponible.

### 6.2 Copiar el endpoint

Cuando el estado sea **Available**:

1. Clic en la instancia `hr-app-db-dev`
2. En **Connectivity & security** → copiar el **Endpoint**
   (formato: `hr-app-db-dev.xxxxx.us-east-1.rds.amazonaws.com`)

Este va en la configuración del backend como la URL de la base de datos.

---

## 7. EC2 — Servidor de la API

### 7.1 Lanzar la instancia

1. **AWS Console → EC2 → Launch instance**

2. **Name:** `hr-app-api-dev`

3. **Application and OS Images:**
   - Buscar **Amazon Linux 2023**
   - Seleccionar **Amazon Linux 2023 AMI** (64-bit x86)
   - Es la primera opción y tiene la etiqueta "Free tier eligible"

4. **Instance type:** `t3.micro` (Free tier eligible)

5. **Key pair:** seleccionar `hr-app-dev-key`

6. **Network settings:**
   - Clic en **Edit**
   - **VPC:** Default VPC
   - **Subnet:** cualquiera (ej: `us-east-1a`)
   - **Auto-assign public IP:** Enable
   - **Firewall:** Select existing security group
   - Seleccionar `hr-app-api-sg-dev`

7. **Configure storage:** 20 GB, gp3 (ya viene por default)

8. **Advanced details → User data** (script que corre al iniciar la instancia):
   Pegar esto en el campo User data:

```bash
#!/bin/bash
# Actualizar el sistema
yum update -y

# Instalar Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# Instalar PM2 (para mantener el servidor corriendo)
npm install -g pm2

# Instalar git
yum install -y git

# Instalar PostgreSQL client (para conectarse a RDS)
yum install -y postgresql15

echo "✅ Servidor listo" >> /var/log/user-data.log
```

9. Clic en **Launch instance**

### 7.2 Copiar el Instance ID

1. Clic en **View all instances**
2. Copiar el **Instance ID** (formato: `i-0abc1234567def890`)
3. Este va en GitHub Secrets como `DEV_EC2_INSTANCE_ID`

### 7.3 Crear una Elastic IP (IP fija)

Sin Elastic IP, la IP pública del servidor cambia cada vez que se enciende.

1. **EC2 → Elastic IPs → Allocate Elastic IP address**
2. **Network Border Group:** us-east-1
3. Clic en **Allocate**
4. Seleccionar la IP recién creada → **Actions → Associate Elastic IP address**
5. **Instance:** seleccionar `hr-app-api-dev`
6. **Private IP address:** seleccionar la que aparece
7. Clic en **Associate**

Ahora el servidor siempre tendrá la misma IP pública.

### 7.4 Verificar que el servidor está listo

```bash
# Conectarte al servidor por SSH
ssh -i ~/.ssh/hr-app-dev-key.pem ec2-user@<IP_ELASTICA>

# Verificar que Node.js está instalado
node --version    # debe mostrar v20.x.x
npm --version

# Verificar que PM2 está instalado
pm2 --version

# Salir del servidor
exit
```

---

## 8. SNS — Notificaciones push

SNS envía notificaciones a los usuarios cuando hay promociones nuevas.

### 8.1 Crear el Topic para promociones

1. **AWS Console → SNS → Topics → Create topic**
2. **Type:** Standard
3. **Name:** `hr-app-promos-dev`
4. **Display name:** `HR App`
5. Clic en **Create topic**
6. Copiar el **ARN** (formato: `arn:aws:sns:us-east-1:123456789:hr-app-promos-dev`)

Este ARN va en `.env.development` como `AWS_SNS_TOPIC_ARN`.

> **Nota:** La integración completa con notificaciones push (APNs para iOS y FCM para Android) se configura cuando el backend esté listo, ya que requiere certificados de Apple y Google.

---

## 9. Resumen — Variables de entorno obtenidas

Al terminar todos los pasos anteriores, tendrás estos valores. Llena tu `.env.development`:

```bash
# API
API_URL=http://<IP_ELASTICA_EC2>

# AWS General
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<access_key_del_usuario_hr-app-backend>
AWS_SECRET_ACCESS_KEY=<secret_key_del_usuario_hr-app-backend>

# Cognito
AWS_USER_POOL_ID=us-east-1_XXXXXXXXX
AWS_USER_POOL_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX

# S3
AWS_S3_BUCKET=hr-app-gallery-dev

# SNS
AWS_SNS_TOPIC_ARN=arn:aws:sns:us-east-1:XXXXXXXXXXXX:hr-app-promos-dev

# Base de datos (para el backend, no para la app móvil)
DB_HOST=hr-app-db-dev.XXXXX.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=hrapp
DB_USER=hrapp_admin
DB_PASSWORD=<tu_password>
```

Y en GitHub Secrets (para los workflows):

| Secret                  | Valor                                          |
| ----------------------- | ---------------------------------------------- |
| `AWS_ACCESS_KEY_ID`     | Access key del usuario `github-actions-hr-app` |
| `AWS_SECRET_ACCESS_KEY` | Secret key del usuario `github-actions-hr-app` |
| `AWS_REGION`            | `us-east-1`                                    |
| `DEV_EC2_INSTANCE_ID`   | `i-0abc1234567def890`                          |
| `DEV_RDS_INSTANCE_ID`   | `hr-app-db-dev`                                |

---

## 10. Verificación final

Corre estos comandos para verificar que todo está conectado:

```bash
# 1. Conectarte al servidor
ssh -i ~/.ssh/hr-app-dev-key.pem ec2-user@<IP_ELASTICA>

# 2. Probar conexión a la base de datos desde el servidor
psql -h <DB_ENDPOINT> -U hrapp_admin -d hrapp
# Ingresa la contraseña cuando la pida
# Si ves el prompt "hrapp=#" → todo está bien
# Escribe \q para salir

# 3. Verificar acceso a S3 desde el servidor
aws s3 ls s3://hr-app-gallery-dev --region us-east-1
# Si no muestra error → permisos correctos
```

---

## 11. Activar el scheduler de costos

Una vez que tienes los Instance IDs, activa el scheduler del `docs/05-aws-costos.md`:

1. Agregar los secrets en GitHub (tabla del paso 9 arriba)
2. GitHub → Actions → "Dev Environment" → Run workflow → `status`
3. Verificar que muestra el estado correcto

A partir de aquí el ambiente se apaga automáticamente a las 7pm y se enciende a las 9am.

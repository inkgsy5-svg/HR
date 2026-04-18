# Documento 5 — Control de costos AWS

---

## Estrategia: Apagar/Encender en lugar de Destruir/Recrear

### Por qué NO destruimos los recursos cada día

| Acción          | Tiempo    | Riesgo                      | Datos                       |
| --------------- | --------- | --------------------------- | --------------------------- |
| Destroy + Apply | 15-30 min | Alto (puede fallar a mitad) | Se pierden si no hay backup |
| Stop + Start    | 1-2 min   | Ninguno                     | Se conservan siempre        |

**La solución correcta es apagar (stop) los recursos cuando no se usan**, no eliminarlos.

---

## Qué cuesta y qué no cuando está apagado

| Servicio        | Encendido         | Apagado           | Nota                                  |
| --------------- | ----------------- | ----------------- | ------------------------------------- |
| EC2 t3.micro    | ~$0.0104/hora     | **$0**            | Solo paga el disco (~$0.08/GB/mes)    |
| RDS db.t3.micro | ~$0.018/hora      | **$0**            | Solo paga el storage (~$0.115/GB/mes) |
| S3              | Por GB + requests | Por GB almacenado | Sin costo en idle                     |
| Cognito         | Por MAU activo    | **$0**            | Primeros 50k MAU gratis               |
| API Gateway     | Por request       | **$0**            | 1M requests gratis/mes                |
| SNS             | Por notificación  | **$0**            | 1M gratis/mes                         |

### Estimado de costos mensual en DEV

**Sin horario (24/7):**

- EC2 t3.micro: $0.0104 × 730h = **$7.59/mes**
- RDS db.t3.micro: $0.018 × 730h = **$13.14/mes**
- EBS 20GB: $0.08 × 20 = **$1.60/mes**
- RDS storage 20GB: $0.115 × 20 = **$2.30/mes**
- Total aproximado: **~$25/mes**

**Con horario (9am-7pm, Lun-Vie = 50 horas/semana ≈ 200h/mes):**

- EC2: $0.0104 × 200h = **$2.08/mes**
- RDS: $0.018 × 200h = **$3.60/mes**
- Storage (siempre): **$3.90/mes**
- Total aproximado: **~$10/mes**

**Ahorro: ~$15/mes por ambiente de dev = ~$180/año**

---

## Cómo funciona el sistema automático

El archivo `.github/workflows/dev-env-control.yml` hace lo siguiente:

```
Lunes a Viernes:
  9:00 AM México  →  Encender EC2 + RDS
  7:00 PM México  →  Apagar RDS + EC2

Fin de semana:
  Permanece apagado

Manual (en cualquier momento):
  GitHub → Actions → Dev Environment → Run workflow
  Elegir: start / stop / status
```

---

## Configuración inicial — paso a paso

### Paso 1: Crear un usuario IAM para GitHub Actions

En la consola de AWS:

1. IAM → Users → Create user
2. Nombre: `github-actions-hr-app`
3. Attach policies → Create policy con este JSON:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:StartInstances",
        "ec2:StopInstances",
        "ec2:DescribeInstances",
        "rds:StartDBInstance",
        "rds:StopDBInstance",
        "rds:DescribeDBInstances"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "aws:ResourceTag/Project": "hr-app"
        }
      }
    }
  ]
}
```

4. User → Security credentials → Create access key
5. Guardar el Access Key ID y Secret Access Key

### Paso 2: Crear la infraestructura con Terraform

```bash
# Instalar Terraform
brew install terraform

# Ir al ambiente de dev
cd infrastructure/environments/dev

# Copiar y llenar variables
cp terraform.tfvars.example terraform.tfvars
nano terraform.tfvars    # Llenar con valores reales

# Inicializar (primera vez)
terraform init

# Ver qué va a crear
terraform plan

# Crear infraestructura
terraform apply
# Escribir "yes" para confirmar
```

Después del apply, Terraform muestra los outputs. **Copiar estos valores:**

```
ec2_instance_id = "i-0abc123..."     ← DEV_EC2_INSTANCE_ID
rds_instance_id = "hr-app-db-dev"   ← DEV_RDS_INSTANCE_ID
api_url         = "http://x.x.x.x"  ← API_URL en .env.development
```

### Paso 3: Agregar los secrets en GitHub

Repositorio → Settings → Secrets and variables → Actions → New repository secret:

| Secret                  | Valor                            |
| ----------------------- | -------------------------------- |
| `AWS_ACCESS_KEY_ID`     | Del usuario IAM creado en Paso 1 |
| `AWS_SECRET_ACCESS_KEY` | Del usuario IAM creado en Paso 1 |
| `AWS_REGION`            | `us-east-1` (o tu región)        |
| `DEV_EC2_INSTANCE_ID`   | Output del terraform apply       |
| `DEV_RDS_INSTANCE_ID`   | Output del terraform apply       |

### Paso 4: Probar el workflow manualmente

GitHub → Actions → "Dev Environment — Control de costos AWS" → Run workflow → `start`

Si todo está bien, verás los logs con:

```
✅ EC2 encendida — IP: x.x.x.x
✅ RDS disponible
```

---

## Cómo usar el control manual

Hay 3 situaciones donde querrás controlarlo manualmente:

### "Voy a trabajar un sábado"

GitHub → Actions → Run workflow → `start`

### "Terminé, quiero apagar antes de las 7pm"

GitHub → Actions → Run workflow → `stop`

### "No sé si está encendido o apagado"

GitHub → Actions → Run workflow → `status`

---

## Advertencias importantes

### RDS tiene un límite de 7 días apagada

AWS reinicia automáticamente una RDS que lleva 7 días detenida. Esto pasa los fines de semana largos o vacaciones. **No es un problema** — simplemente volvió a encenderse y generó costo por esas horas.

### Elastic IP tiene costo si está sin instancia

Una Elastic IP que NO está asociada a una instancia encendida cuesta ~$3.60/mes. Con nuestro setup la IP siempre está asociada a la instancia (aunque esté apagada), así que no hay costo extra.

### La primera creación con Terraform sí cuesta

La primera vez que corres `terraform apply`, los recursos quedan encendidos. Corre el workflow de `stop` al terminar el primer día.

---

## Flujo recomendado de trabajo con Terraform

```bash
# 1. Siempre verificar antes de aplicar
terraform plan

# 2. Aplicar solo cuando estés seguro
terraform apply

# 3. Versionar los cambios de infraestructura igual que el código
git add infrastructure/
git commit -m "infra(dev): add S3 bucket for gallery images"
git push origin feature/infra-s3

# 4. Crear PR de infraestructura igual que de código
```

**Regla de oro:** Si tienes dudas sobre qué va a hacer un `terraform apply`, léete el `plan` completo antes. Un `destroy` accidental en producción puede ser catastrófico.

# ─────────────────────────────────────────────────────────────────
# EC2 — Servidor de la API
# ─────────────────────────────────────────────────────────────────

resource "aws_instance" "api_server" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  key_name               = var.key_name
  subnet_id              = var.subnet_id
  vpc_security_group_ids = var.security_group_ids

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  # IMPORTANTE: estos tags son los que usa el workflow de GitHub Actions
  # para identificar qué instancias apagar/encender
  tags = {
    Name        = "hr-app-api-${var.environment}"
    Environment = var.environment
    Project     = "hr-app"
    ManagedBy   = "terraform"
    # Este tag activa el scheduler automático
    # "true"  = se apaga/enciende con el horario
    # "false" = siempre encendido (usar solo en prod)
    AutoSchedule = var.environment == "prod" ? "false" : "true"
  }
}

resource "aws_eip" "api_eip" {
  instance = aws_instance.api_server.id
  domain   = "vpc"

  tags = {
    Name        = "hr-app-eip-${var.environment}"
    Environment = var.environment
    Project     = "hr-app"
    ManagedBy   = "terraform"
  }
}

# ─────────────────────────────────────────────────────────────────
# RDS — Base de datos PostgreSQL
# ─────────────────────────────────────────────────────────────────

resource "aws_db_instance" "postgres" {
  identifier        = "hr-app-db-${var.environment}"
  engine            = "postgres"
  engine_version    = "16"
  instance_class    = var.instance_class
  allocated_storage = var.storage_gb
  storage_type      = "gp3"

  db_name  = "hrapp"
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = var.security_group_ids

  # En dev, no hace falta multi-AZ (ahorra ~$25/mes)
  multi_az = var.environment == "prod" ? true : false

  # Backup automático diario (retención 7 días en dev, 30 en prod)
  backup_retention_period = var.environment == "prod" ? 30 : 7
  backup_window           = "03:00-04:00"   # 3am UTC = 9pm México

  # Mantenimiento los domingos de madrugada
  maintenance_window = "sun:04:00-sun:05:00"

  # En dev, se puede eliminar con terraform destroy sin protección
  deletion_protection = var.environment == "prod" ? true : false
  skip_final_snapshot = var.environment == "prod" ? false : true

  tags = {
    Name        = "hr-app-db-${var.environment}"
    Environment = var.environment
    Project     = "hr-app"
    ManagedBy   = "terraform"
  }
}

resource "aws_db_subnet_group" "main" {
  name       = "hr-app-subnet-group-${var.environment}"
  subnet_ids = var.subnet_ids

  tags = {
    Name        = "hr-app-subnet-group-${var.environment}"
    Environment = var.environment
    Project     = "hr-app"
    ManagedBy   = "terraform"
  }
}

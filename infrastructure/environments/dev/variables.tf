variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "ami_id" {
  description = "Amazon Linux 2023 AMI — verificar en la consola de AWS para tu región"
  type        = string
}

variable "key_name" {
  description = "Nombre del Key Pair de SSH creado en AWS"
  type        = string
}

variable "db_username" {
  type      = string
  sensitive = true
}

variable "db_password" {
  type      = string
  sensitive = true
}

variable "allowed_ssh_cidr" {
  description = "Tu IP pública para acceso SSH. Formato: x.x.x.x/32"
  type        = string
  default     = "0.0.0.0/0"  # Cambiar por tu IP real en producción
}

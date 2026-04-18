variable "environment" {
  type = string
}

variable "instance_class" {
  description = "Tipo de instancia RDS"
  type        = string
  # dev: db.t3.micro (~$13/mes encendido) | prod: db.t3.small o mayor
  default = "db.t3.micro"
}

variable "storage_gb" {
  description = "Almacenamiento en GB"
  type        = number
  default     = 20
}

variable "db_username" {
  description = "Usuario administrador de la base de datos"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Contraseña del administrador"
  type        = string
  sensitive   = true
}

variable "subnet_ids" {
  description = "Lista de subnet IDs (mínimo 2 en distintas AZ)"
  type        = list(string)
}

variable "security_group_ids" {
  description = "Security groups que pueden conectarse a la BD"
  type        = list(string)
}

variable "environment" {
  description = "Ambiente: dev, staging, prod"
  type        = string
}

variable "ami_id" {
  description = "AMI ID (Amazon Linux 2023 recomendado)"
  type        = string
  # Amazon Linux 2023 en us-east-1 — actualizar según región
  default = "ami-0c02fb55956c7d316"
}

variable "instance_type" {
  description = "Tipo de instancia EC2"
  type        = string
  # dev: t3.micro (free tier) | prod: t3.small o mayor
  default = "t3.micro"
}

variable "key_name" {
  description = "Nombre del key pair de SSH en AWS"
  type        = string
}

variable "subnet_id" {
  description = "Subnet ID donde lanzar la instancia"
  type        = string
}

variable "security_group_ids" {
  description = "Lista de security group IDs"
  type        = list(string)
}

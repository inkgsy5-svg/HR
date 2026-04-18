terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Guardar el state en S3 para que ambos devs trabajen con el mismo estado
  backend "s3" {
    bucket = "hr-app-terraform-state"
    key    = "dev/terraform.tfstate"
    region = "us-east-1"
    # Previene que ambos devs hagan apply al mismo tiempo
    dynamodb_table = "hr-app-terraform-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

# ─────────────────────────────────────────────────────────────────
# VPC y Networking (básico para dev)
# ─────────────────────────────────────────────────────────────────
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# ─────────────────────────────────────────────────────────────────
# Security Groups
# ─────────────────────────────────────────────────────────────────
resource "aws_security_group" "api" {
  name        = "hr-app-api-sg-dev"
  description = "Security group para el servidor de la API"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH (solo desde tu IP — cambiar por tu IP real)"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "hr-app-api-sg-dev"
    Environment = "dev"
    Project     = "hr-app"
    ManagedBy   = "terraform"
  }
}

resource "aws_security_group" "rds" {
  name        = "hr-app-rds-sg-dev"
  description = "Security group para RDS — solo acepta conexiones del API server"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "PostgreSQL solo desde EC2"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.api.id]
  }

  tags = {
    Name        = "hr-app-rds-sg-dev"
    Environment = "dev"
    Project     = "hr-app"
    ManagedBy   = "terraform"
  }
}

# ─────────────────────────────────────────────────────────────────
# EC2
# ─────────────────────────────────────────────────────────────────
module "ec2" {
  source      = "../../modules/ec2"
  environment = "dev"

  ami_id             = var.ami_id
  instance_type      = "t3.micro"   # Free tier eligible
  key_name           = var.key_name
  subnet_id          = tolist(data.aws_subnets.default.ids)[0]
  security_group_ids = [aws_security_group.api.id]
}

# ─────────────────────────────────────────────────────────────────
# RDS
# ─────────────────────────────────────────────────────────────────
module "rds" {
  source      = "../../modules/rds"
  environment = "dev"

  instance_class     = "db.t3.micro"   # Free tier eligible
  storage_gb         = 20
  db_username        = var.db_username
  db_password        = var.db_password
  subnet_ids         = tolist(data.aws_subnets.default.ids)
  security_group_ids = [aws_security_group.rds.id]
}

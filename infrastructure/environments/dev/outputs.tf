output "ec2_instance_id" {
  description = "Copiar este valor en GitHub Secrets → DEV_EC2_INSTANCE_ID"
  value       = module.ec2.instance_id
}

output "ec2_public_ip" {
  description = "IP pública del servidor de la API"
  value       = module.ec2.public_ip
}

output "api_url" {
  description = "URL base de la API — copiar en .env.development como API_URL"
  value       = "http://${module.ec2.public_ip}"
}

output "rds_instance_id" {
  description = "Copiar este valor en GitHub Secrets → DEV_RDS_INSTANCE_ID"
  value       = module.rds.db_instance_id
}

output "db_endpoint" {
  description = "Host de la base de datos (para el backend)"
  value       = module.rds.db_endpoint
  sensitive   = true
}

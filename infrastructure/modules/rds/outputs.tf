output "db_instance_id" {
  description = "ID de la instancia RDS — copiar en GitHub Secrets como DEV_RDS_INSTANCE_ID"
  value       = aws_db_instance.postgres.identifier
}

output "db_endpoint" {
  description = "Host de conexión a la base de datos"
  value       = aws_db_instance.postgres.endpoint
  sensitive   = true
}

output "db_name" {
  description = "Nombre de la base de datos"
  value       = aws_db_instance.postgres.db_name
}

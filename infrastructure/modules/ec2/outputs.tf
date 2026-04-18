output "instance_id" {
  description = "ID de la instancia EC2 — copiar en GitHub Secrets como DEV_EC2_INSTANCE_ID"
  value       = aws_instance.api_server.id
}

output "public_ip" {
  description = "IP pública fija (Elastic IP)"
  value       = aws_eip.api_eip.public_ip
}

output "public_dns" {
  description = "DNS público de la instancia"
  value       = aws_eip.api_eip.public_dns
}

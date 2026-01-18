variable "aws_region" {
  description = "AWS Region"
  type        = "string"
  default     = "us-east-1"
}

variable "db_username" {
  description = "Database Master Username"
  type        = "string"
  default     = "admin"
}

variable "db_password" {
  description = "Database Master Password"
  type        = "string"
  sensitive   = true
}

variable "github_repo_url" {
  description = "The GitHub Repository URL (e.g., https://github.com/user/repo)"
  type        = "string"
}

variable "github_connection_arn" {
  description = "The ARN of the AWS App Runner GitHub Connection"
  type        = "string"
}

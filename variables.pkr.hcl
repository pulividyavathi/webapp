
variable "dev_id" {
  type =  string
 
  default = 678835917124
 
  // Sensitive vars are hidden from output as of Packer v1.6.5
  sensitive = true
}

variable "demo_id" {
  type =  string
 
  default = 130290677881
 
  // Sensitive vars are hidden from output as of Packer v1.6.5
  sensitive = true
}
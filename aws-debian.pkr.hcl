packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.2"
      source  = "github.com/hashicorp/amazon"
    }
  }
}


variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "AMI_USERS" {
  type    = list(string)
  default = ["678835917124", "130290677881"]
}
variable "aws_region" {
  type    = string
  default = "us-west-1"
}

source "amazon-ebs" "debian" {
  ami_name      = "webapp-api-debian-aws_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  instance_type = "t2.micro"

  region = "${var.aws_region}"

  ami_users = "${var.AMI_USERS}"




  source_ami_filter {
    filters = {
      name                = "debian-12-amd64-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["amazon"]
  }

  ssh_username = "${var.ssh_username}"
}

build {
  name = "learn-packer"
  sources = [
    "source.amazon-ebs.debian"
  ]

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/tmp/webapp.zip"
  }


  provisioner "shell" {
    inline = [
      "sudo apt-get update -y",
      "sudo apt-get upgrade -y",
      "sudo apt-get install -y unzip",
      "cd /tmp",
      "unzip webapp.zip -d /tmp/cloud",
    ]
  }

  provisioner "shell" {
    inline = [

      "cp /tmp/webapp.zip ~/",
      "unzip ~/webapp.zip -d ~/"

    ]
  }
  //  provisioner "file" {
  //     source      = "./csye.service"
  //     destination = "/tmp/csye.service"
  //   }

  provisioner "shell" {
    inline = [

      "chmod +x /home/admin/SetupScript.sh",
      "/home/admin/SetupScript.sh"

    ]
  }
  post-processor "manifest" {
    output     = "manifest.json"
    strip_path = true
    custom_data = {
      my_custom_data = "example"
    }
  }
  // provisioner "shell" {
  //   inline = [
  //     "sudo groupadd csye6225",
  //     "sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225",
  //     "sudo cp /home/admin/csye6225.service /etc/systemd/system",
  //     "sudo chmod 664 /etc/systemd/system/csye6225.service",
  //     "sudo systemctl daemon-reload",
  //     "sudo systemctl enable csye6225",
  //     "sudo systemctl start csye6225",
  //     "sudo systemctl restart csye6225",

  //   ]
  // }


}

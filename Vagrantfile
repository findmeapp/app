# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

    php_version = "php5-5.6"
    ruby_version="2.2.0"
    locale = "fr_CH.UTF.8"
    # Box
    config.vm.box = "ubuntu/trusty64"

    # Setup
    config.vm.provision :shell, :inline => "touch .hushlogin"
    config.vm.provision :shell, :inline => "apt-get update --fix-missing"
    config.vm.provision :shell, :inline => "apt-get install -q -y g++ make git curl vim"
    config.vm.define "api" do |api|
      hostname = "api"
      config.vm.provision :shell, :inline => "hostnamectl set-hostname #{hostname} && locale-gen #{locale}"
      # Shared folders
      api.vm.synced_folder "./api", "/srv"
      # Php install
      api.vm.provision :shell, :inline => "add-apt-repository ppa:ondrej/#{php_version} && apt-get update"
      api.vm.provision :shell, :inline => "apt-get install -q -y php5-dev php5-cli php5-curl php5-xdebug"
      api.vm.provision :shell, :inline => "curl -s https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer"
      # Ruby install
      api.vm.provision :shell, :privileged => false, :inline => "gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3"
      api.vm.provision :shell, :privileged => false, :inline => "curl -L https://get.rvm.io | bash -s stable"
      api.vm.provision :shell, :privileged => false, :inline => "rvm install #{ruby_version} --autolibs=enabled && rvm --fuzzy alias create default #{ruby_version}"
      #python install
      api.vm.provision :shell, :inline => "apt-get install -q -y python python-pip"
      #nodejs install
      api.vm.provision :shell, :inline => "add-apt-repository ppa:chris-lea/node.js && apt-get update"
      api.vm.provision :shell, :inline => "apt-get install -q -y nodejs"
    end
    config.vm.define "web" do |web|
      hostname = "web"
      config.vm.provision :shell, :inline => "hostnamectl set-hostname #{hostname} && locale-gen #{locale}"

      # Shared folders
      web.vm.synced_folder "./web", "/srv"
      # Php install
      web.vm.provision :shell, :inline => "add-apt-repository ppa:ondrej/#{php_version} && apt-get update"
      web.vm.provision :shell, :inline => "apt-get install -q -y php5-dev php5-cli php5-curl php5-xdebug"
      web.vm.provision :shell, :inline => "curl -s https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer"
      # Ruby install
      web.vm.provision :shell, :privileged => false, :inline => "gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3"
      web.vm.provision :shell, :privileged => false, :inline => "curl -L https://get.rvm.io | bash -s stable"
      web.vm.provision :shell, :privileged => false, :inline => "rvm install #{ruby_version} --autolibs=enabled && rvm --fuzzy alias create default #{ruby_version}"
      #python install
      web.vm.provision :shell, :inline => "apt-get install -q -y python python-pip"
      #nodejs install
      web.vm.provision :shell, :inline => "add-apt-repository ppa:chris-lea/node.js && apt-get update"
      web.vm.provision :shell, :inline => "apt-get install -q -y nodejs"
    end
    config.vm.define "db" do |db|
      hostname = "mysql"
      config.vm.provision :shell, :inline => "hostnamectl set-hostname #{hostname} && locale-gen #{locale}"

      #mysql
      db.vm.provision :shell, :inline => "sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password password root'"
      db.vm.provision :shell, :inline => "sudo debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password root'"
      db.vm.provision :shell, :inline => "sudo apt-get -y install mysql-server"
      db.vm.provision :shell, :inline => "sed -i \"s/^bind-address/#bind-address/\" /etc/mysql/my.cnf"
      db.vm.provision :shell, :inline => "mysql -u root -proot -e \"GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION; FLUSH PRIVILEGES;\""
      db.vm.provision :shell, :inline => "sudo /etc/init.d/mysql restart"
    end

end

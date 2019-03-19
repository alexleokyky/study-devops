sudo yum install -y wget
cd /var/lib/
mkdir psql9.6 && cd psql9.6
wget https://download.postgresql.org/pub/repos/yum/9.6/redhat/rhel-7-x86_64/pgdg-centos96-9.6-3.noarch.rpm
sudo yum update
sudo yum install -y pgdg-centos96-9.6-3.noarch.rpm epel-release
sudo yum install -y postgresql96-server postgresql96-contrib
# sudo yum update
sudo /usr/pgsql-9.6/bin/postgresql96-setup initdb

sudo sed -i "s/#listen_address.*/listen_addresses '*'/" /var/lib/pgsql/9.6/data/postgresql.conf
sudo ls -la /var/lib/pgsql/9.6/data/
echo "-------------------- fixing postgres pg_hba.conf file"
# replace the ipv4 host line with the above line
sudo cat << EOF >> /var/lib/pgsql/9.6/data/pg_hba.conf
# Accept all IPv4 connections - FOR DEVELOPMENT ONLY!!!
host    all         all         0.0.0.0/0             md5
EOF
sudo ls -la /var/lib/pgsql/9.6/data/
sudo systemctl start postgresql-9.6
sudo systemctl enable postgresql-9.6
# Create Role and login
echo "-------------------- creating postgres developer role with password fmp_db"
sudo su - postgres -c `psql -c 'CREATE ROLE developer WITH SUPERUSER LOGIN PASSWORD "repoleved"'`
exit
echo "-------------------- creating FMP database"
# Create FMP database
sudo su - postgres -c `psql -c "createdb -E UTF8 -T template0 --locale=en_US.utf8 -O developer fmp_db"`
systemctl restart postgresql-9.6


sudo yum install -y wget
cd /var/lib/
mkdir psql9.6 && cd psql9.6
wget https://download.postgresql.org/pub/repos/yum/9.6/redhat/rhel-7-x86_64/pgdg-centos96-9.6-3.noarch.rpm
sudo yum update
echo "install pgdg"
sudo yum install -y pgdg-centos96-9.6-3.noarch.rpm epel-release
echo "install contrib"
sudo yum install -y postgresql96-server postgresql96-contrib
# sudo yum update
echo "initdb"
sudo /usr/pgsql-9.6/bin/postgresql96-setup initdb


sudo ls -la /var/lib/pgsql/9.6/data/

# copy configs and assign rights
yes | sudo cp /vagrant/shell/master/* /var/lib/pgsql/9.6/data
sudo chown -R postgres:postgres /var/lib/pgsql/9.6/data 
sudo chmod -R 700 /var/lib/pgsql/9.6/data

# start server
sudo systemctl start postgresql-9.6
sudo systemctl enable postgresql-9.6
# Create Role and login
echo "-------------------- creating postgres developer role with password fmp_db" 
sudo su - postgres bash -c "psql -c \"CREATE ROLE developer WITH SUPERUSER LOGIN PASSWORD 'repoleved';\""
sudo su - postgres bash -c "psql -c \"CREATE ROLE replication WITH REPLICATION LOGIN PASSWORD 'replication';\""
echo "-------------------- creating FMP database"
# Create FMP database
sudo su - postgres psql -c "createdb -E UTF8 -T template0 --locale=en_US.utf8 -O developer fmp_db"
systemctl restart postgresql-9.6


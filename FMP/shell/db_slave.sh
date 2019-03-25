sudo yum install -y wget
cd /var/lib/
mkdir psql9.6 && cd psql9.6
wget https://download.postgresql.org/pub/repos/yum/9.6/redhat/rhel-7-x86_64/pgdg-centos96-9.6-3.noarch.rpm
sudo yum update
sudo yum install -y pgdg-centos96-9.6-3.noarch.rpm epel-release
sudo yum install -y postgresql96-server postgresql96-contrib
# sudo yum update
sudo /usr/pgsql-9.6/bin/postgresql96-setup initdb

sudo rm -rf /var/lib/pgsql/9.6/data/*

replication | sudo su - postgres -c "pg_basebackup -h 192.168.32.51 -D /var/lib/pgsql/9.6/data -R -P -U replication --xlog-method=stream"
sudo cat << EOF >> /var/lib/pgsql/9.6/data/recovery.conf
trigger_file = '/var/lib/pgsql/9.6/data/trigger_file'
EOF
# start server
sudo systemctl start postgresql-9.6
sudo systemctl enable postgresql-9.6



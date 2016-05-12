expect -c "
spawn su - root
expect \"Password:\"
send \"password\r\"
while true
do
    spawn /home/hadoop/hadoop-2.7.2/bin/yarn jar /home/hadoop/hadoop-2.7.2/bin/plim_hadoop-jar-with-dependencies.jar
    spawn sleep 10m
done
interact
"
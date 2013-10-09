#!/bin/bash
# Run this from the pixel directory

# Install Java
#http://burakdede.quora.com/Installing-JDK-+-Solr-on-Amazon-EC2-Ubuntu
cd ~
wget --no-cookies --header "Cookie: gpw_e24=xxx;" http://download.oracle.com/otn-pub/java/jdk/7u11-b21/jdk-7u11-linux-x64.tar.gz
tar -xvf jdk-7u11-linux-x64.tar.gz 
mkdir /usr/lib/jvm
sudo mv ./jdk1.7.0_11 /usr/lib/jvm/jdk1.7.0
sudo update-alternatives --install "/usr/bin/java" "java" "/usr/lib/jvm/jdk1.7.0/bin/java" 1
sudo update-alternatives --install "/usr/bin/javac" "javac" "/usr/lib/jvm/jdk1.7.0/bin/javac" 1
sudo update-alternatives --install "/usr/bin/javaws" "javaws" "/usr/lib/jvm/jdk1.7.0/bin/javaws" 1
sudo update-alternatives --config java

#http://docs.gameclosure.com/guide/install.html
cd ~
git clone https://github.com/gameclosure/devkit
cd devkit
./install.sh
basil update

FROM ubuntu:16.04

RUN apt-get update
RUN apt-get -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" upgrade
RUN apt-get -y install openssh-server socat sudo
RUN mkdir /var/run/sshd
# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd
RUN sed -ri 's/UsePAM yes/#UsePAM yes/g' /etc/ssh/sshd_config
RUN echo "test-user ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

RUN adduser --gecos "test user" test-user
RUN gpasswd -a test-user sudo
RUN gpasswd -a test-user adm
RUN gpasswd -a test-user root
RUN mkdir /home/test-user/.ssh
RUN chmod 700 /home/test-user/.ssh
RUN chown test-user:test-user /home/test-user/.ssh/
RUN echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCkMnteFLrX0xAiID9FFFiFOjrD03cNTkQtePY89I9e64m9g/MMwczla0Kuse77nU7w5EmoLLa1y1tlliS4f+JmpO7YNV5wayvJ0FLJnSTHjWJE2FkIk0Ijh1jRVi8f25ykF+TohrpmX/5GPSvXrTlRKhGKcMQS0hX6FMXSVEjJkyI9SCGuVPFA86+SrhtvuoQCcxD0kPnZJfsSRjrjFap0ebH8tS+LbuCF/S/oZfNEH3V0fEIncCbcXpX2XTZ3tke+s/bUWln2M4w4UPwRyYSjDrE6tvEr5ChOc9KoaKooe+Yc2VqOTtsT3evDI61i8Lbw3TsJLVnh/wzgQry1tf+F test-user@goofy.local" >/home/test-user/.ssh/authorized_keys
RUN chmod 600 /home/test-user/.ssh/authorized_keys
RUN chown test-user:test-user /home/test-user/.ssh/authorized_keys
RUN echo 'test-user:test' | chpasswd
EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]


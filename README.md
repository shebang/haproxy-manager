# HAProxy Manager

**WORK IN PROGRESS - NOT READY OR USABLE YET!**
[![Build Status](https://travis-ci.org/waelse72/haproxy-manager.svg?branch=master)](https://travis-ci.org/waelse72/haproxy-manager)

HAProxy manager is a node module for orchestrating an HAProxy instance.

## Example Usage using SSH Connector

```javascript
const Haproxy = require('haproxy-manager');
const haproxy = new Haproxy({
    host: 'myproxy.example.com',
    connector: 'ssh',
    connectorOptions: {
        port: 3022,
        username: 'test-user',
        privateKey: require('fs').readFileSync('/path/to/ssh-key/test-user')
    }
});
haproxy.showStat()
    .then(doSomthingWithResult)
    .catch((err) => {

        console.log('ERROR', err.toString('utf8'));
    });
```

# Development Notes

## Testing SSH

```
# ssh into container
ssh test-user@localhost -i test/docker/dummy-ssh-keys/test-user -p 3022 -o "UserKnownHostsFile=/dev/null" -o "StrictHostKeyChecking=no"
# query haproxy inside container
sudo sh -c 'echo "help" | socat /var/run/haproxy/haproxy.sock stdio'
```


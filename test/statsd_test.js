assert = require('assert')
StatsD = require('../lib/statsd').StatsD

FakeSocket = function() {
    this.sent = []
}

FakeSocket.prototype.send = function(data, _, len, port, host) {
    this.port = port
    this.host = host
    this.sent.push(data.toString())  
}

socket = new FakeSocket
client = new StatsD(1, 2, socket)

client.timing('timing', 100)
assert.equal(1, socket.host)
assert.equal(2, socket.port)
assert.equal('timing:100|ms', socket.sent.shift())

client.increment('hits')
assert.equal('hits:1|c', socket.sent.shift())

client.decrement('hits')
assert.equal('hits:-1|c', socket.sent.shift())

client.increment(['hits', 'misses'])
assert.equal('hits:1|c', socket.sent.shift())
assert.equal('misses:1|c', socket.sent.shift())

client.decrement(['hits', 'misses'])
assert.equal('hits:-1|c', socket.sent.shift())
assert.equal('misses:-1|c', socket.sent.shift())

assert.deepEqual([], socket.sent)

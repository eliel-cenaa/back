var redis = require('redis')
 ,  {RedisStore} = require("connect-redis")
 , express = require('express')
 ,socketio = require('socket.io')
 ;

 exports.getClient = function() {
    return redis.createClient();
 }
 exports.getExpressStore = function() {
    return RedisStore(express);
 }
 exports.getSocketStore = function() {
    return socketio.redisStore;
 }
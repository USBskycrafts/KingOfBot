package org.kob.backend.consumer;

import com.alibaba.fastjson2.JSONObject;
import org.kob.backend.consumer.utils.GameMap;
import org.kob.backend.consumer.utils.JwtAuthentication;
import org.kob.backend.mapper.RecordMapper;
import org.kob.backend.mapper.UserMapper;
import org.kob.backend.pojo.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
@ServerEndpoint("/websocket/{token}")
public class WebSocketServer {

    private Session session = null;
    private static final Logger logger = LoggerFactory.getLogger(WebSocketServer.class);
    private User user;
    public static final ConcurrentHashMap<Integer, WebSocketServer> users = new ConcurrentHashMap<>();
    /// TODO: Should be Changed to Micro Service
    private static final Set<User> matchingPool = Collections.newSetFromMap(new ConcurrentHashMap<>());
    private static UserMapper userMapper;
    public static RecordMapper recordMapper;
    private GameMap map = null;

    @Autowired
    public void setUserMapper(UserMapper userMapper) {
        WebSocketServer.userMapper = userMapper;
    }

    @Autowired
    public  void setRecordMapper(RecordMapper recordMapper) { WebSocketServer.recordMapper = recordMapper; }

    @OnOpen
    public void onOpen(Session session, @PathParam("token") String token) throws IOException {
        this.session = session;
        Integer userId = JwtAuthentication.getUserId(token);
        this.user = userMapper.selectById(userId);
        if (this.user != null) {
            logger.debug(session.toString() + " connected with user " + user.getUsername());
            users.put(userId, this);
        } else {
            this.session.close();
        }
    }

    @OnClose
    public void onClose() {
        logger.debug(this.session.toString() + " disconnected");
        if (this.user != null) {
            users.remove(this.user.getId());
            matchingPool.remove(this.user);
        }
    }

    private void startMatching() {
        /// TODO: Should be Changed to Micro Service
        logger.debug("start matching on " + this.user.getUsername());
        matchingPool.add(this.user);
        while (matchingPool.size() >= 2) {
            Iterator<User> it = matchingPool.iterator();
            User a = it.next(), b = it.next();
            matchingPool.remove(a);
            matchingPool.remove(b);


            this.map = new GameMap(13, 14, 30, a.getId(), b.getId());
            this.map.createMap();
            Thread.startVirtualThread(this.map);



            JSONObject respGame = new JSONObject();
            respGame.put("a-id", map.getPlayerA().getId());
            respGame.put("a-startX", map.getPlayerA().getStartX());
            respGame.put("a-startY", map.getPlayerA().getStartY());
            respGame.put("b-id", map.getPlayerB().getId());
            respGame.put("b-startX", map.getPlayerB().getStartX());
            respGame.put("b-startY", map.getPlayerB().getStartY());
            respGame.put("map", map.getG());
            users.get(a.getId()).map = map;
            users.get(b.getId()).map = map;

            JSONObject resp = new JSONObject();
            resp.put("event", "start-matching");
            resp.put("competitorName", b.getUsername());
            resp.put("competitorAvatar", b.getAvatar());
            resp.put("map", respGame);
            users.get(a.getId()).sendMessage(resp.toJSONString());

            resp.clear();
            resp.put("event", "start-matching");
            resp.put("competitorName", a.getUsername());
            resp.put("competitorAvatar", a.getAvatar());
            resp.put("map", respGame);
            users.get(b.getId()).sendMessage(resp.toJSONString());
        }
    }

    private void stopMatching() {
        /// TODO: Should be Changed to Micro Service
        logger.debug("stop matching on " + this.user.getUsername());
        matchingPool.remove(this.user);
    }

    private void move(Integer direction) {
        if (map.getPlayerA().getId().equals(user.getId())) {
            map.setNextStepA(direction);
        } else if (map.getPlayerB().getId().equals(user.getId())) {
            map.setNextStepB(direction);
        } else {
            throw new RuntimeException();
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        logger.debug("receive " + message + " from " + session.toString());
        JSONObject data = JSONObject.parseObject(message);
        String event = data.getString("event");
        if ("start-matching".equals(event)) {
            startMatching();
        } else if ("stop-matching".equals(event)) {
            stopMatching();
        } else if("move".equals(event)) {
            move(data.getInteger("direction"));
        }
    }

    @OnError
    public void onError(Session session, Throwable error) {
        logger.error(error.toString());
    }

    public void sendMessage(String msg) {
        synchronized (this) {
            try {
                this.session.getBasicRemote().sendText(msg);
            } catch (IOException e) {
                logger.error(Arrays.toString(e.getStackTrace()));
            }
        }
    }
}
package com.xiaojz.chatroom.Service;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;

import javax.websocket.*;

import org.springframework.stereotype.Component;

import javax.websocket.server.ServerEndpoint;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/test")
@Component
@Slf4j
public class MyWebsocketServer {
    /**
     * 存放所有在线的客户端
     */
    private static Map<String, Session> clients = new ConcurrentHashMap<>();
    private String NowUser;

    @OnOpen
    public void onOpen(Session session) {
        log.info("有新的客户端连接了: {}", session.getId());
        //将新用户存入在线的组
        NowUser = session.getId();
        clients.put(session.getId(), session);
    }

    /**
     * 客户端关闭
     * @param session session
     */
    @OnClose
    public void onClose(Session session) {
        log.info("有用户断开了, id为:{}", session.getId());
        //将掉线的用户移除在线的组里
        clients.remove(session.getId());
    }

    /**
     * 发生错误
     * @param throwable e
     */
    @OnError
    public void onError(Throwable throwable) {
        throwable.printStackTrace();
    }

    /**
     * 收到客户端发来消息
     * @param message  消息对象
     */
    @OnMessage
    public void onMessage(String message) {
        log.info("服务端收到客户端发来的消息: {}", message);
        if(isJSON(message)){
            JSONObject jsonObj = JSON.parseObject(message);
            switch (jsonObj.getString("cmd")){
                case "sendMsg":{
                    String name = jsonObj.getJSONObject("data").getString("name");
                    String msg = jsonObj.getJSONObject("data").getString("msg");
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("cmd","addMsg");
                    JSONObject jsonObject1 = new JSONObject();
                    jsonObject1.put("name",name);
                    jsonObject1.put("msg",msg);
                    jsonObject.put("data",jsonObject1);

                    this.sendAll(jsonObject.toJSONString());
                    break;
                }
                case "creatOneChat":{
                    String name = jsonObj.getJSONObject("data").getString("name");
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("cmd","keepOneChat");
                    JSONObject jsonObject1 = new JSONObject();
                    jsonObject1.put("name",name);
                    jsonObject1.put("id",NowUser);
                    jsonObject.put("data",jsonObject1);
                    this.sendOne(jsonObject.toJSONString(),NowUser);
                    break;
                }
                case "sendOneMsg":{
                    String name = jsonObj.getJSONObject("data").getString("name");
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.put("cmd","addOneMsg");
                    JSONObject jsonObject1 = new JSONObject();
                    jsonObject1.put("name",name);
                    jsonObject1.put("msg",name);
                    jsonObject.put("data",jsonObject1);
                    this.sendOne(jsonObject.toJSONString(),NowUser);
                    /*
                    补充发送给目标客户端
                     */
                    break;
                }
                default:
                    this.sendAll("{ cmd:morengs }");
                    break;
            }
        }
        else
            this.sendAll("格式非法");
    }

    /**
     * 群发消息
     * @param message 消息内容
     */
    private void sendAll(String message) {
        for (Map.Entry<String, Session> sessionEntry : clients.entrySet()) {
            sessionEntry.getValue().getAsyncRemote().sendText(message);
        }
    }

    private void sendOne(String message,String One) {
        for (Map.Entry<String, Session> sessionEntry : clients.entrySet()) {
            if(sessionEntry.getKey().equals( One )){
                sessionEntry.getValue().getAsyncRemote().sendText(message);
            }
        }
    }

    public static boolean isJSON(String str) {
        boolean result;
        try {
            Object obj=JSON.parse(str);
            result = true;
        } catch (Exception e) {
            e.printStackTrace();
            result = false;
        }
        return result;
    }
}

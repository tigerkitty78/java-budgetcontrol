package com.example.employaa.controller.NotifCont;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class SseEmittersManager {
    private final Map<String, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public void addEmitter(String username, SseEmitter emitter) {
        emitters.computeIfAbsent(username, k -> new CopyOnWriteArrayList<>()).add(emitter);
    }

    public void removeEmitter(String username) {
        emitters.remove(username);
    }

    public void sendToUser(String username, Object data) {
        List<SseEmitter> userEmitters = emitters.get(username);
        if (userEmitters != null) {
            for (SseEmitter emitter : userEmitters) {
                try {
                    emitter.send(SseEmitter.event()
                            .name("notification")
                            .data(data));
                } catch (IOException e) {
                    emitter.complete();
                    userEmitters.remove(emitter);
                }
            }
        }
    }
}

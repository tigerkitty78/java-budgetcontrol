package com.example.employaa.configs;

import com.example.employaa.JWT.JWT_util;
import com.example.employaa.service.UserService.UserService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.security.Principal;
import java.util.logging.Logger;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

//import static sun.print.DialogOwnerAccessor.accessor;
//
@Component
public class WebSocketAuthInterceptor implements HandshakeInterceptor {

    private final JWT_util jwtUtil;
    private final UserService userService; // Your JWT utility class
    private final java.util.logging.Logger logger = java.util.logging.Logger.getLogger(WebSocketAuthInterceptor.class.getName());
    public WebSocketAuthInterceptor(JWT_util jwtUtil, UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService=userService;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
       // Logger logger = LoggerFactory.getLogger(getClass());
        String token = null;

        // 1. Check query parameters first
        URI uri = request.getURI();
        String query = uri.getQuery();
        if (query != null) {
            String[] pairs = query.split("&");
            for (String pair : pairs) {
                int idx = pair.indexOf("=");
                if (idx > 0 && "token".equals(pair.substring(0, idx))) {
                    token = URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8);
                    logger.info("✅ Extracted token from query parameter: " + token);
                    break;
                }
            }
        }

        // 2. Fallback to Authorization header if token is not found in query params
        if (token == null) {
            HttpHeaders headers = request.getHeaders();
            List<String> authHeaders = headers.get("Authorization");

            if (authHeaders != null && !authHeaders.isEmpty()) {
                String authHeader = authHeaders.get(0);
                logger.info("🔍 Found Authorization header: " + authHeader);

                if (authHeader.startsWith("Bearer ")) {
                    token = authHeader.substring(7);
                    logger.info("✅ Extracted token from header: " + token);
                } else {
                    logger.warning("⚠️ Malformed Authorization header - missing Bearer prefix");
                }
            } else {
                logger.warning("❌ No Authorization header found");
            }
        }

        // 3. Validate token if it exists
        if (token != null) {
            try {
                if (!jwtUtil.validateToken(token)) {
                    logger.severe("❌ Token validation failed");
                    return false; // Reject connection if token is invalid or expired
                }

                String username = jwtUtil.extractUsername(token);
                logger.info("🔓 Authenticated user: " + username);
                UserDetails userDetails = userService.loadUserByUsername(username); // ✅ your UserService implements UserDetailsService

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);

                attributes.put("username", username);
                attributes.put("user", authentication);
                return true; // Allow the connection

            } catch (Exception e) {
                logger.severe("🚨 Token validation error: " + e.getMessage());
                return false; // Reject connection if there is an error in validation
            }
        }

        logger.severe("❌ Connection rejected - No valid token found");
        return false; // Reject connection if no token is found
    }


    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        // No action needed after handshake
    }
 //In your WebSocket interceptor
//accessor.setUser(() -> username); // After JWT validation





}

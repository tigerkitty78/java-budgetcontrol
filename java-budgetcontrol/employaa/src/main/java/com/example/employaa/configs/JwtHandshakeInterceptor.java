package com.example.employaa.configs;

//import com.example.employaa.JWT.JWT_util;
//import org.springframework.http.server.ServerHttpRequest;
//import org.springframework.http.server.ServerHttpResponse;
//import org.springframework.web.socket.WebSocketHandler;
//import org.springframework.web.socket.server.HandshakeInterceptor;
//import java.util.logging.Logger;
//import java.util.Map;
//import org.springframework.web.socket.server.HandshakeInterceptor;
//import org.springframework.http.server.ServerHttpRequest;
//import org.springframework.http.server.ServerHttpResponse;
//import org.springframework.web.socket.WebSocketHandler;
//import java.util.List;
//import java.util.Map;
//import java.util.logging.Logger;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.server.ServerHttpRequest;
//import org.springframework.http.server.ServerHttpResponse;
//import org.springframework.web.socket.WebSocketHandler;
//import org.springframework.web.socket.server.HandshakeInterceptor;
//import java.net.URI;
//import java.net.URLDecoder;
//import java.nio.charset.StandardCharsets;
//import java.util.List;
//import java.util.Map;
//import java.util.logging.Logger;
//
//public class JwtHandshakeInterceptor implements HandshakeInterceptor {
//    private final JWT_util jwtUtil;
//    private final Logger logger = Logger.getLogger(JwtHandshakeInterceptor.class.getName());
//
//    public JwtHandshakeInterceptor(JWT_util jwtUtil) {
//        this.jwtUtil = jwtUtil;
//    }
//
//    @Override
//    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
//                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
//        String token = null;
//
//        // 1. Check query parameters first
//        URI uri = request.getURI();
//        String query = uri.getQuery();
//        if (query != null) {
//            String[] pairs = query.split("&");
//            for (String pair : pairs) {
//                int idx = pair.indexOf("=");
//                if (idx > 0 && "token".equals(pair.substring(0, idx))) {
//                    token = URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8);
//                    logger.info("✅ Extracted token from query parameter: " + token);
//                    break;
//                }
//            }
//        }
//
//        // 2. Fallback to Authorization header
//        if (token == null) {
//            HttpHeaders headers = request.getHeaders();
//            List<String> authHeaders = headers.get("Authorization");
//
//            if (authHeaders != null && !authHeaders.isEmpty()) {
//                String authHeader = authHeaders.get(0);
//                logger.info("🔍 Found Authorization header: " + authHeader);
//
//                if (authHeader.startsWith("Bearer ")) {
//                    token = authHeader.substring(7);
//                    logger.info("✅ Extracted token from header: " + token);
//                } else {
//                    logger.warning("⚠️ Malformed Authorization header - missing Bearer prefix");
//                }
//            } else {
//                logger.warning("❌ No Authorization header found");
//            }
//        }
//
//        // 3. Validate token
//        if (token != null) {
//            try {
//                if (!jwtUtil.vvalidateToken(token)) {
//                    logger.severe("❌ Token validation failed");
//                    return false;
//                }
//
//                String username = jwtUtil.extractUsername(token);
//                logger.info("🔓 Authenticated user: " + username);
//                attributes.put("username", username);
//                return true;
//
//            } catch (Exception e) {
//                logger.severe("🚨 Token validation error: " + e.getMessage());
//                return false;
//            }
//        }
//
//        logger.severe("❌ Connection rejected - No valid token found");
//        return false;
//    }
//
//    @Override
//    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
//                               WebSocketHandler wsHandler, Exception exception) {}
//}

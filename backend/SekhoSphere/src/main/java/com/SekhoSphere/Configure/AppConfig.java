package com.SekhoSphere.Configure;

import com.SekhoSphere.Implementation.UserDetailsServiceImpl;
import com.SekhoSphere.Services.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class AppConfig {

 private final AuthenticationConfiguration authenticationConfiguration;
    private final CustomUserDetailsService userDetailsService;


    public AppConfig( CustomUserDetailsService userDetailsService, AuthenticationConfiguration authenticationConfiguration) {
        this.userDetailsService = userDetailsService;
        this.authenticationConfiguration = authenticationConfiguration;
    }

    @Bean
    public AuthenticationManager authenticationManager(CustomUserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);

        return new ProviderManager(authProvider);
    }

    @Bean
   public CorsConfigurationSource corsConfigurationSource() {
       CorsConfiguration configuration = new CorsConfiguration();
       configuration.setAllowedOrigins(List.of("http://127.0.0.1:5500", "http://localhost:5500"));
       configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
       configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
       configuration.setExposedHeaders(List.of("Authorization"));
       configuration.setAllowCredentials(true);
       configuration.setMaxAge(3600L);     // Cache the preflight response for 1 hour

       //apply the configuration to all the paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
   }

   @Bean
   public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
       http
               .cors(Customizer.withDefaults())
               .csrf(csrf -> csrf.disable()) //disable csrf
               .authorizeHttpRequests(auth -> auth
                       .requestMatchers("/api/users/register","/api/users/login").permitAll()
                       .requestMatchers("/api/**").permitAll()  //allow access to this end point
                       .anyRequest().authenticated())   //all other endpoints required authentication
               .httpBasic(Customizer.withDefaults());   //enable http basic Authentication

       return http.build();
   }



  // for encoding users password in service class before saving it.
   @Bean
   public PasswordEncoder passwordEncoder(){
       return new BCryptPasswordEncoder();
   }


}

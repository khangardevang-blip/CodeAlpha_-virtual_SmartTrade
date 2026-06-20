package com.smarttrade;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmarttradeBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmarttradeBackendApplication.class, args);
	}

}

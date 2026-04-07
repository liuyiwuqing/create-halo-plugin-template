package run.halo.plugintemplate.config;

import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PluginTemplateConfig {

    @Bean
    public Clock pluginTemplateClock() {
        return Clock.systemDefaultZone();
    }
}

package run.halo.plugintemplate.reconcile;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class PluginTemplateSettingsReconciler {

    private static final Logger log = LoggerFactory.getLogger(PluginTemplateSettingsReconciler.class);

    public Mono<Void> refresh(String reason) {
        log.debug("Template settings reconciler invoked: {}", reason);
        return Mono.empty();
    }
}

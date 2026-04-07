package run.halo.plugintemplate.endpoint;

import lombok.RequiredArgsConstructor;
import org.springdoc.webflux.core.fn.SpringdocRouteBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;
import run.halo.app.core.extension.endpoint.CustomEndpoint;
import run.halo.app.extension.GroupVersion;
import run.halo.plugintemplate.endpoint.routes.PluginTemplateOverviewRoutes;

@Component
@RequiredArgsConstructor
public class PluginTemplateConsoleEndpoint implements CustomEndpoint {

    public static final String CONSOLE_GROUP_VERSION = "console.halo-plugin-template.halo.run/v1alpha1";
    public static final String CONSOLE_TAG = "PluginTemplateConsole";

    private final PluginTemplateOverviewRoutes overviewRoutes;

    @Override
    public RouterFunction<ServerResponse> endpoint() {
        return SpringdocRouteBuilder.route()
            .nest(RequestPredicates.path("template-overview"), overviewRoutes::consoleRoutes)
            .build();
    }

    @Override
    public GroupVersion groupVersion() {
        return GroupVersion.parseAPIVersion(CONSOLE_GROUP_VERSION);
    }
}

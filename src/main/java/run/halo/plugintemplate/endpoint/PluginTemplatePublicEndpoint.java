package run.halo.plugintemplate.endpoint;

import org.springdoc.webflux.core.fn.SpringdocRouteBuilder;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;
import run.halo.app.core.extension.endpoint.CustomEndpoint;
import run.halo.app.extension.GroupVersion;

/**
 * Public endpoint placeholder.
 * Add {@code @Component} and real route definitions when the plugin needs a public API surface.
 */
public class PluginTemplatePublicEndpoint implements CustomEndpoint {

    public static final String PUBLIC_GROUP_VERSION = "public.halo-plugin-template.halo.run/v1alpha1";

    @Override
    public RouterFunction<ServerResponse> endpoint() {
        return SpringdocRouteBuilder.route().build();
    }

    @Override
    public GroupVersion groupVersion() {
        return GroupVersion.parseAPIVersion(PUBLIC_GROUP_VERSION);
    }
}

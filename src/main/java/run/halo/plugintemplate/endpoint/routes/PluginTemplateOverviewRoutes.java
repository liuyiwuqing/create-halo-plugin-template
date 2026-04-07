package run.halo.plugintemplate.endpoint.routes;

import static org.springdoc.core.fn.builders.apiresponse.Builder.responseBuilder;
import static run.halo.plugintemplate.endpoint.PluginTemplateConsoleEndpoint.CONSOLE_TAG;
import static run.halo.plugintemplate.endpoint.PluginTemplateUcEndpoint.UC_TAG;

import lombok.RequiredArgsConstructor;
import org.springdoc.webflux.core.fn.SpringdocRouteBuilder;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import run.halo.plugintemplate.dto.PluginTemplateOverview;
import run.halo.plugintemplate.model.PluginTemplateAudience;
import run.halo.plugintemplate.service.PluginTemplateOverviewService;

@Component
@RequiredArgsConstructor
public class PluginTemplateOverviewRoutes {

    private final PluginTemplateOverviewService overviewService;

    public RouterFunction<ServerResponse> consoleRoutes() {
        return buildRoutes(
            PluginTemplateAudience.CONSOLE,
            CONSOLE_TAG,
            "pluginTemplateOverviewForConsole",
            "获取模板在 Console 中的默认能力概览"
        );
    }

    public RouterFunction<ServerResponse> ucRoutes() {
        return buildRoutes(
            PluginTemplateAudience.UC,
            UC_TAG,
            "pluginTemplateOverviewForUc",
            "获取模板在 UC 中的默认能力概览"
        );
    }

    private RouterFunction<ServerResponse> buildRoutes(
        PluginTemplateAudience audience,
        String tag,
        String operationId,
        String description
    ) {
        return SpringdocRouteBuilder.route()
            .GET("/summary", request -> summary(audience), builder -> builder
                .operationId(operationId)
                .description(description)
                .tag(tag)
                .response(responseBuilder().implementation(PluginTemplateOverview.class)))
            .build();
    }

    private Mono<ServerResponse> summary(PluginTemplateAudience audience) {
        return overviewService.getOverview(audience)
            .flatMap(overview -> ServerResponse.ok().bodyValue(overview));
    }
}

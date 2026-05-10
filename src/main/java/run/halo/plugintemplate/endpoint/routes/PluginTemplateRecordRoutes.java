package run.halo.plugintemplate.endpoint.routes;

import static org.springdoc.core.fn.builders.apiresponse.Builder.responseBuilder;
import static org.springdoc.core.fn.builders.content.Builder.contentBuilder;
import static org.springdoc.core.fn.builders.parameter.Builder.parameterBuilder;
import static org.springdoc.core.fn.builders.requestbody.Builder.requestBodyBuilder;
import static org.springdoc.core.fn.builders.schema.Builder.schemaBuilder;
import static run.halo.plugintemplate.endpoint.PluginTemplateConsoleEndpoint.CONSOLE_TAG;

import io.swagger.v3.oas.annotations.enums.ParameterIn;
import lombok.RequiredArgsConstructor;
import org.springdoc.webflux.core.fn.SpringdocRouteBuilder;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;
import run.halo.app.extension.ListResult;
import run.halo.plugintemplate.query.PluginTemplateRecordQuery;
import run.halo.plugintemplate.scheme.PluginTemplateRecord;
import run.halo.plugintemplate.service.PluginTemplateRecordService;

@Component
@RequiredArgsConstructor
public class PluginTemplateRecordRoutes {

    private final PluginTemplateRecordService recordService;

    public RouterFunction<ServerResponse> consoleRoutes() {
        return SpringdocRouteBuilder.route()
            .GET("", this::list, builder -> {
                builder.operationId("pluginTemplateRecordListForConsole")
                    .description("获取模板记录分页列表")
                    .tag(CONSOLE_TAG)
                    .response(responseBuilder()
                        .implementation(ListResult.generateGenericClass(PluginTemplateRecord.class)));
                PluginTemplateRecordQuery.buildParameters(builder);
            })
            .POST("", this::create, builder -> builder
                .operationId("pluginTemplateRecordCreateForConsole")
                .description("创建模板记录")
                .tag(CONSOLE_TAG)
                .requestBody(requestBodyBuilder().required(true)
                    .content(contentBuilder().mediaType(MediaType.APPLICATION_JSON_VALUE)
                        .schema(schemaBuilder().implementation(PluginTemplateRecord.class))))
                .response(responseBuilder().implementation(PluginTemplateRecord.class)))
            .PUT("/{id}", this::update, builder -> builder
                .operationId("pluginTemplateRecordUpdateForConsole")
                .description("更新模板记录")
                .tag(CONSOLE_TAG)
                .parameter(parameterBuilder().name("id")
                    .in(ParameterIn.PATH)
                    .description("模板记录业务主键")
                    .required(true)
                    .implementation(String.class))
                .requestBody(requestBodyBuilder().required(true)
                    .content(contentBuilder().mediaType(MediaType.APPLICATION_JSON_VALUE)
                        .schema(schemaBuilder().implementation(PluginTemplateRecord.class))))
                .response(responseBuilder().implementation(PluginTemplateRecord.class)))
            .DELETE("/{id}", this::delete, builder -> builder
                .operationId("pluginTemplateRecordDeleteForConsole")
                .description("删除模板记录")
                .tag(CONSOLE_TAG)
                .parameter(parameterBuilder().name("id")
                    .in(ParameterIn.PATH)
                    .description("模板记录业务主键")
                    .required(true)
                    .implementation(String.class))
                .response(responseBuilder().implementation(PluginTemplateRecord.class)))
            .build();
    }

    private Mono<ServerResponse> list(ServerRequest request) {
        return recordService.list(new PluginTemplateRecordQuery(request.exchange()))
            .flatMap(records -> ServerResponse.ok().bodyValue(records));
    }

    private Mono<ServerResponse> create(ServerRequest request) {
        return request.bodyToMono(PluginTemplateRecord.class)
            .flatMap(recordService::create)
            .flatMap(record -> ServerResponse.ok().bodyValue(record));
    }

    private Mono<ServerResponse> update(ServerRequest request) {
        var id = request.pathVariable("id");
        return request.bodyToMono(PluginTemplateRecord.class)
            .flatMap(record -> recordService.update(id, record))
            .flatMap(record -> ServerResponse.ok().bodyValue(record));
    }

    private Mono<ServerResponse> delete(ServerRequest request) {
        return recordService.delete(request.pathVariable("id"))
            .flatMap(record -> ServerResponse.ok().bodyValue(record));
    }
}

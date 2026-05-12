package run.halo.plugintemplate.endpoint.routes;

import io.swagger.v3.oas.annotations.enums.ParameterIn;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.fn.builders.schema.Builder;
import org.springdoc.webflux.core.fn.SpringdocRouteBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import run.halo.app.extension.ListResult;
import run.halo.plugintemplate.dto.PluginTemplateRecordCreateRequest;
import run.halo.plugintemplate.dto.PluginTemplateRecordUpdateRequest;
import run.halo.plugintemplate.query.PluginTemplateRecordQuery;
import run.halo.plugintemplate.scheme.PluginTemplateRecord;
import run.halo.plugintemplate.service.PluginTemplateRecordService;

import static org.springdoc.core.fn.builders.apiresponse.Builder.responseBuilder;
import static org.springdoc.core.fn.builders.content.Builder.contentBuilder;
import static org.springdoc.core.fn.builders.parameter.Builder.parameterBuilder;
import static org.springdoc.core.fn.builders.requestbody.Builder.requestBodyBuilder;
import static run.halo.plugintemplate.endpoint.PluginTemplateConsoleEndpoint.CONSOLE_TAG;

@Component
@RequiredArgsConstructor
public class PluginTemplateRecordRoutes {

    private final PluginTemplateRecordService recordService;

    public RouterFunction<ServerResponse> consoleRoutes() {
        return SpringdocRouteBuilder.route()
            .GET("/list", this::listForConsole, builder -> {
                builder.operationId("listTemplateRecordsForConsole")
                    .description("分页查询示例数据记录")
                    .tag(CONSOLE_TAG)
                    .response(responseBuilder()
                        .implementation(ListResult.generateGenericClass(PluginTemplateRecord.class)));
                PluginTemplateRecordQuery.buildParameters(builder);
            })
            .POST("", this::createForConsole, builder -> builder
                .operationId("createTemplateRecordForConsole")
                .description("创建示例数据记录")
                .tag(CONSOLE_TAG)
                .requestBody(requestBodyBuilder().required(true)
                    .content(contentBuilder().mediaType(MediaType.APPLICATION_JSON_VALUE)
                        .schema(Builder.schemaBuilder().implementation(PluginTemplateRecordCreateRequest.class))))
                .response(responseBuilder().implementation(PluginTemplateRecord.class)))
            .GET("/{recordId}", this::detailForConsole, builder -> builder
                .operationId("templateRecordForConsole")
                .description("获取示例数据记录详情")
                .tag(CONSOLE_TAG)
                .parameter(parameterBuilder().in(ParameterIn.PATH).name("recordId")
                    .description("记录业务主键").implementation(String.class).required(true))
                .response(responseBuilder().implementation(PluginTemplateRecord.class)))
            .PUT("/{recordId}", this::updateForConsole, builder -> builder
                .operationId("updateTemplateRecordForConsole")
                .description("更新示例数据记录")
                .tag(CONSOLE_TAG)
                .parameter(parameterBuilder().in(ParameterIn.PATH).name("recordId")
                    .description("记录业务主键").implementation(String.class).required(true))
                .requestBody(requestBodyBuilder().required(true)
                    .content(contentBuilder().mediaType(MediaType.APPLICATION_JSON_VALUE)
                        .schema(Builder.schemaBuilder().implementation(PluginTemplateRecordUpdateRequest.class))))
                .response(responseBuilder().implementation(PluginTemplateRecord.class)))
            .DELETE("/{recordId}", this::deleteForConsole, builder -> builder
                .operationId("deleteTemplateRecordForConsole")
                .description("删除示例数据记录")
                .tag(CONSOLE_TAG)
                .parameter(parameterBuilder().in(ParameterIn.PATH).name("recordId")
                    .description("记录业务主键").implementation(String.class).required(true))
                .response(responseBuilder().responseCode("204").description("删除成功")))
            .build();
    }

    private Mono<ServerResponse> listForConsole(ServerRequest request) {
        return recordService.list(new PluginTemplateRecordQuery(request.exchange()))
            .flatMap(result -> ServerResponse.ok().bodyValue(result));
    }

    private Mono<ServerResponse> createForConsole(ServerRequest request) {
        return request.bodyToMono(PluginTemplateRecordCreateRequest.class)
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "请求体不能为空")))
            .flatMap(recordService::create)
            .onErrorMap(IllegalArgumentException.class,
                error -> new ResponseStatusException(HttpStatus.BAD_REQUEST, error.getMessage(), error))
            .flatMap(record -> ServerResponse.ok().bodyValue(record));
    }

    private Mono<ServerResponse> detailForConsole(ServerRequest request) {
        return recordService.getByRecordId(request.pathVariable("recordId"))
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "记录不存在")))
            .onErrorMap(IllegalArgumentException.class,
                error -> new ResponseStatusException(HttpStatus.BAD_REQUEST, error.getMessage(), error))
            .flatMap(record -> ServerResponse.ok().bodyValue(record));
    }

    private Mono<ServerResponse> updateForConsole(ServerRequest request) {
        var recordId = request.pathVariable("recordId");
        return request.bodyToMono(PluginTemplateRecordUpdateRequest.class)
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.BAD_REQUEST, "请求体不能为空")))
            .flatMap(payload -> recordService.update(recordId, payload))
            .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "记录不存在")))
            .onErrorMap(IllegalArgumentException.class,
                error -> new ResponseStatusException(HttpStatus.BAD_REQUEST, error.getMessage(), error))
            .flatMap(record -> ServerResponse.ok().bodyValue(record));
    }

    private Mono<ServerResponse> deleteForConsole(ServerRequest request) {
        return recordService.delete(request.pathVariable("recordId"))
            .flatMap(deleted -> {
                if (Boolean.FALSE.equals(deleted)) {
                    return Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND, "记录不存在"));
                }
                return ServerResponse.noContent().build();
            })
            .onErrorMap(IllegalArgumentException.class,
                error -> new ResponseStatusException(HttpStatus.BAD_REQUEST, error.getMessage(), error));
    }
}

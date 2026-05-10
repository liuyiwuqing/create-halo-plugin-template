package run.halo.plugintemplate.query;

import static io.swagger.v3.oas.annotations.enums.ParameterIn.QUERY;
import static org.springdoc.core.fn.builders.parameter.Builder.parameterBuilder;
import static run.halo.app.extension.index.query.Queries.contains;
import static run.halo.app.extension.index.query.Queries.equal;
import static run.halo.app.extension.index.query.Queries.or;
import static run.halo.app.extension.router.QueryParamBuildUtil.sortParameter;
import static run.halo.app.extension.router.selector.SelectorUtil.labelAndFieldSelectorToListOptions;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springdoc.core.fn.builders.operation.Builder;
import org.springframework.data.domain.Sort;
import org.springframework.lang.Nullable;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import run.halo.app.extension.ListOptions;
import run.halo.app.extension.PageRequest;
import run.halo.app.extension.PageRequestImpl;
import run.halo.app.extension.router.IListRequest;
import run.halo.app.extension.router.SortableRequest;

@Getter
public class PluginTemplateRecordQuery extends SortableRequest {

    private final MultiValueMap<String, String> queryParams;

    public PluginTemplateRecordQuery(ServerWebExchange exchange) {
        super(exchange);
        this.queryParams = new LinkedMultiValueMap<>(exchange.getRequest().getQueryParams());
    }

    @Nullable
    @Schema(description = "按关键字筛选，匹配 id、标题或描述。")
    public String getKeyword() {
        return normalizeText(queryParams.getFirst("keyword"));
    }

    @Nullable
    @Schema(description = "按状态筛选。")
    public String getStatus() {
        return normalizeText(queryParams.getFirst("status"));
    }

    @Nullable
    @Schema(description = "按启用状态筛选。")
    public Boolean getEnabled() {
        var enabled = normalizeText(queryParams.getFirst("enabled"));
        if (enabled == null) {
            return null;
        }
        return Boolean.valueOf(enabled);
    }

    @Override
    public ListOptions toListOptions() {
        var listOptions = labelAndFieldSelectorToListOptions(getLabelSelector(), getFieldSelector());
        var query = ListOptions.builder(listOptions);

        if (StringUtils.hasText(getKeyword())) {
            query.andQuery(or(
                contains("id", getKeyword()),
                contains("title", getKeyword()),
                contains("description", getKeyword())
            ));
        }
        if (StringUtils.hasText(getStatus())) {
            query.andQuery(equal("status", getStatus()));
        }
        if (getEnabled() != null) {
            query.andQuery(equal("enabled", getEnabled()));
        }
        return query.build();
    }

    @Override
    public PageRequest toPageRequest() {
        var sort = getSort();
        if (!queryParams.containsKey("sort")) {
            sort = Sort.by(Sort.Order.desc("priority"), Sort.Order.desc("createTime"));
        }
        return PageRequestImpl.of(getPage(), getSize(), sort);
    }

    public static void buildParameters(Builder builder) {
        IListRequest.buildParameters(builder);
        builder.parameter(sortParameter())
            .parameter(parameterBuilder().in(QUERY).name("keyword")
                .description("按关键字筛选，匹配 id、标题或描述。")
                .implementation(String.class)
                .required(false))
            .parameter(parameterBuilder().in(QUERY).name("status")
                .description("按状态筛选。")
                .implementation(String.class)
                .required(false))
            .parameter(parameterBuilder().in(QUERY).name("enabled")
                .description("按启用状态筛选。")
                .implementation(Boolean.class)
                .required(false));
    }

    private static String normalizeText(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}

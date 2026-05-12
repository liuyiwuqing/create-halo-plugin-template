package run.halo.plugintemplate.query;

import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.springdoc.core.fn.builders.operation.Builder;
import org.springframework.data.domain.Sort;
import org.springframework.lang.Nullable;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ServerWebExchange;
import run.halo.app.extension.ListOptions;
import run.halo.app.extension.PageRequest;
import run.halo.app.extension.PageRequestImpl;
import run.halo.app.extension.router.IListRequest;
import run.halo.app.extension.router.SortableRequest;

import static org.springdoc.core.fn.builders.parameter.Builder.parameterBuilder;
import static run.halo.app.extension.index.query.Queries.contains;
import static run.halo.app.extension.index.query.Queries.equal;
import static run.halo.app.extension.index.query.Queries.or;
import static run.halo.app.extension.router.QueryParamBuildUtil.sortParameter;
import static run.halo.app.extension.router.selector.SelectorUtil.labelAndFieldSelectorToListOptions;

@Getter
public class PluginTemplateRecordQuery extends SortableRequest {

    private final MultiValueMap<String, String> queryParams;

    public PluginTemplateRecordQuery(ServerWebExchange exchange) {
        super(exchange);
        this.queryParams = new LinkedMultiValueMap<>(exchange.getRequest().getQueryParams());
    }

    @Nullable
    @Schema(description = "记录状态筛选")
    public String getStatus() {
        return StringUtils.defaultIfBlank(queryParams.getFirst("status"), null);
    }

    @Nullable
    @Schema(description = "关键字筛选，匹配 id、title、description")
    public String getKeyword() {
        return StringUtils.defaultIfBlank(queryParams.getFirst("keyword"), null);
    }

    @Override
    public ListOptions toListOptions() {
        var listOptions = labelAndFieldSelectorToListOptions(getLabelSelector(), getFieldSelector());
        var query = ListOptions.builder(listOptions);

        if (StringUtils.isNotBlank(getStatus())) {
            query.andQuery(equal("status", StringUtils.trim(getStatus())));
        }
        if (StringUtils.isNotBlank(getKeyword())) {
            var keyword = StringUtils.trim(getKeyword());
            query.andQuery(or(
                contains("id", keyword),
                contains("title", keyword),
                contains("description", keyword)
            ));
        }
        return query.build();
    }

    @Override
    public PageRequest toPageRequest() {
        Sort sort;
        var sortParams = queryParams.get("sort");
        if (sortParams == null || sortParams.stream().allMatch(StringUtils::isBlank)) {
            sort = Sort.by("updateTime").descending();
        } else {
            sort = getSort();
        }
        return PageRequestImpl.of(getPage(), getSize(), sort);
    }

    public static void buildParameters(Builder builder) {
        IListRequest.buildParameters(builder);
        builder.parameter(sortParameter())
            .parameter(parameterBuilder().in(ParameterIn.QUERY).name("status")
                .description("状态筛选").implementation(String.class).required(false))
            .parameter(parameterBuilder().in(ParameterIn.QUERY).name("keyword")
                .description("关键字筛选，匹配 id、title、description")
                .implementation(String.class).required(false));
    }
}

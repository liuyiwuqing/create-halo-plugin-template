package run.halo.plugintemplate.query;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Field;
import org.springframework.data.domain.Sort;
import org.junit.jupiter.api.Test;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;

class PluginTemplateRecordQueryTest {

    @Test
    void shouldResolvePageRequestAndDefaultSort() {
        var request = MockServerHttpRequest.get("/records/list")
            .queryParam("page", "2")
            .queryParam("size", "15")
            .build();
        var exchange = MockServerWebExchange.from(request);

        var query = new PluginTemplateRecordQuery(exchange);
        var pageRequest = query.toPageRequest();

        assertThat(query.getPage()).isEqualTo(2);
        assertThat(query.getSize()).isEqualTo(15);
        assertThat(extractSort(pageRequest))
            .isEqualTo(Sort.by("updateTime").descending());
    }

    @Test
    void shouldBuildListOptionsWithFilters() {
        var request = MockServerHttpRequest.get("/records/list")
            .queryParam("keyword", "keyword")
            .queryParam("status", "draft")
            .build();
        var exchange = MockServerWebExchange.from(request);

        var query = new PluginTemplateRecordQuery(exchange);
        var listOptions = query.toListOptions();

        assertThat(listOptions).isNotNull();
        assertThat(query.getKeyword()).isEqualTo("keyword");
        assertThat(query.getStatus()).isEqualTo("draft");
    }

    @Test
    void shouldRespectCustomSortWhenProvided() {
        var request = MockServerHttpRequest.get("/records/list")
            .queryParam("sort", "updateTime,asc")
            .build();
        var exchange = MockServerWebExchange.from(request);

        var query = new PluginTemplateRecordQuery(exchange);
        var pageRequest = query.toPageRequest();
        var sort = extractSort(pageRequest);

        assertThat(sort.getOrderFor("updateTime")).isNotNull();
        assertThat(sort.getOrderFor("updateTime").getDirection())
            .isEqualTo(Sort.Direction.ASC);
    }

    private Sort extractSort(Object pageRequest) {
        for (Field field : pageRequest.getClass().getDeclaredFields()) {
            if (Sort.class.isAssignableFrom(field.getType())) {
                try {
                    field.setAccessible(true);
                    return (Sort) field.get(pageRequest);
                } catch (IllegalAccessException exception) {
                    throw new AssertionError("Failed to access sort field", exception);
                }
            }
        }
        throw new AssertionError("Sort field not found in page request implementation");
    }

}

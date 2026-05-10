package run.halo.plugintemplate.query;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;

class PluginTemplateRecordQueryTest {

    @Test
    void shouldParseFiltersAndPaginationFromExchange() {
        var exchange = MockServerWebExchange.from(MockServerHttpRequest
            .get("/?keyword=alpha&status=PUBLISHED&enabled=true&page=2&size=5"));

        var query = new PluginTemplateRecordQuery(exchange);

        assertThat(query.getKeyword()).isEqualTo("alpha");
        assertThat(query.getStatus()).isEqualTo("PUBLISHED");
        assertThat(query.getEnabled()).isTrue();
        assertThat(query.toPageRequest().getPageNumber()).isEqualTo(2);
        assertThat(query.toPageRequest().getPageSize()).isEqualTo(5);
        assertThat(query.toListOptions().toCondition().toString())
            .contains("alpha")
            .contains("PUBLISHED")
            .contains("true");
    }

    @Test
    void shouldApplyDefaultSortWhenNoSortProvided() {
        var exchange = MockServerWebExchange.from(MockServerHttpRequest.get("/?page=1&size=10"));

        var query = new PluginTemplateRecordQuery(exchange);

        assertThat(query.toPageRequest().getSort().getOrderFor("priority")).isNotNull();
        assertThat(query.toPageRequest().getSort().getOrderFor("createTime")).isNotNull();
        assertThat(query.toPageRequest().getSort().getOrderFor("priority").isDescending()).isTrue();
    }
}

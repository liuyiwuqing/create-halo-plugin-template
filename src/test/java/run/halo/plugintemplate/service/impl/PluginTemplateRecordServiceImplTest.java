package run.halo.plugintemplate.service.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;
import reactor.core.publisher.Mono;
import run.halo.app.extension.ListResult;
import run.halo.app.extension.ReactiveExtensionClient;
import run.halo.plugintemplate.query.PluginTemplateRecordQuery;
import run.halo.plugintemplate.scheme.PluginTemplateRecord;

@ExtendWith(MockitoExtension.class)
class PluginTemplateRecordServiceImplTest {

    private static final Clock FIXED_CLOCK = Clock.fixed(
        Instant.parse("2026-04-07T10:00:00Z"),
        ZoneOffset.UTC
    );

    @Mock
    ReactiveExtensionClient reactiveExtensionClient;

    @Test
    @SuppressWarnings("unchecked")
    void shouldCreateRecordWithDefaults() {
        when(reactiveExtensionClient.create(any(PluginTemplateRecord.class)))
            .thenAnswer(invocation -> Mono.just(invocation.getArgument(0)));

        var service = new PluginTemplateRecordServiceImpl(reactiveExtensionClient, FIXED_CLOCK);
        var record = new PluginTemplateRecord();
        record.setId("client-id");
        record.setTitle("  新记录  ");

        var created = service.create(record).block();

        assertThat(created).isNotNull();
        assertThat(created.getId()).isNotBlank();
        assertThat(created.getId()).isNotEqualTo("client-id");
        assertThat(created.getMetadata().getName()).isEqualTo(
            PluginTemplateRecord.EXTENSION_NAME_PREFIX + created.getId());
        assertThat(created.getTitle()).isEqualTo("新记录");
        assertThat(created.getStatus()).isEqualTo(PluginTemplateRecordServiceImpl.STATUS_DRAFT);
        assertThat(created.getEnabled()).isTrue();
        assertThat(created.getPriority()).isZero();
        assertThat(created.getCreateTime()).isEqualTo("2026-04-07T10:00Z");
        assertThat(created.getUpdateTime()).isEqualTo("2026-04-07T10:00Z");
    }

    @Test
    @SuppressWarnings("unchecked")
    void shouldUpdateOnlyMutableFields() {
        var existing = new PluginTemplateRecord();
        existing.setId("abc");
        existing.setTitle("旧标题");
        existing.setStatus(PluginTemplateRecordServiceImpl.STATUS_DRAFT);
        existing.setCreateTime("2026-01-01T00:00Z");

        when(reactiveExtensionClient.fetch(PluginTemplateRecord.class, "plugin-template-record-abc"))
            .thenReturn(Mono.just(existing));
        when(reactiveExtensionClient.update(any(PluginTemplateRecord.class)))
            .thenAnswer(invocation -> Mono.just(invocation.getArgument(0)));

        var service = new PluginTemplateRecordServiceImpl(reactiveExtensionClient, FIXED_CLOCK);
        var incoming = new PluginTemplateRecord();
        incoming.setId("other");
        incoming.setTitle("新标题");
        incoming.setStatus("published");
        incoming.setEnabled(false);
        incoming.setPriority(9);
        incoming.setDescription("备注");

        var updated = service.update("abc", incoming).block();

        assertThat(updated).isNotNull();
        assertThat(updated.getId()).isEqualTo("abc");
        assertThat(updated.getTitle()).isEqualTo("新标题");
        assertThat(updated.getStatus()).isEqualTo(PluginTemplateRecordServiceImpl.STATUS_PUBLISHED);
        assertThat(updated.getEnabled()).isFalse();
        assertThat(updated.getPriority()).isEqualTo(9);
        assertThat(updated.getDescription()).isEqualTo("备注");
        assertThat(updated.getCreateTime()).isEqualTo("2026-01-01T00:00Z");
        assertThat(updated.getUpdateTime()).isEqualTo("2026-04-07T10:00Z");
    }

    @Test
    void shouldDeleteRecordById() {
        var existing = new PluginTemplateRecord();
        existing.setId("abc");

        when(reactiveExtensionClient.fetch(PluginTemplateRecord.class, "plugin-template-record-abc"))
            .thenReturn(Mono.just(existing));
        when(reactiveExtensionClient.delete(existing)).thenReturn(Mono.just(existing));

        var service = new PluginTemplateRecordServiceImpl(reactiveExtensionClient, FIXED_CLOCK);

        assertThat(service.delete("abc").block()).isSameAs(existing);
        verify(reactiveExtensionClient).delete(existing);
    }

    @Test
    void shouldFailWhenDeletingMissingRecord() {
        when(reactiveExtensionClient.fetch(PluginTemplateRecord.class, "plugin-template-record-missing"))
            .thenReturn(Mono.empty());

        var service = new PluginTemplateRecordServiceImpl(reactiveExtensionClient, FIXED_CLOCK);

        assertThatThrownBy(() -> service.delete("missing").block())
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("not found");
    }

    @Test
    void shouldListRecordsWithQueryOptions() {
        var query = org.mockito.Mockito.mock(PluginTemplateRecordQuery.class);
        var options = run.halo.app.extension.ListOptions.builder().build();
        var pageRequest = run.halo.app.extension.PageRequestImpl.of(1, 10);
        var result = new ListResult<PluginTemplateRecord>(1, 10, 0, java.util.List.of());

        when(query.toListOptions()).thenReturn(options);
        when(query.toPageRequest()).thenReturn(pageRequest);
        when(reactiveExtensionClient.listBy(PluginTemplateRecord.class, options, pageRequest))
            .thenReturn(Mono.just(result));

        var service = new PluginTemplateRecordServiceImpl(reactiveExtensionClient, FIXED_CLOCK);

        assertThat(service.list(query).block()).isSameAs(result);
        verify(reactiveExtensionClient).listBy(PluginTemplateRecord.class, options, pageRequest);
    }

    @Test
    void shouldRejectInvalidStatus() {
        var service = new PluginTemplateRecordServiceImpl(reactiveExtensionClient, FIXED_CLOCK);
        var record = new PluginTemplateRecord();
        record.setTitle("标题");
        record.setStatus("INVALID");

        assertThatThrownBy(() -> service.create(record).block())
            .isInstanceOf(ResponseStatusException.class)
            .hasMessageContaining("Unsupported status");
    }
}
